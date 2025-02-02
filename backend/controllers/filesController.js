import pool from '../config/db.js';

/**
 * Get all file types from the "FileTypes" table.
 */
export const getFileTypes = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM "FileTypes" ORDER BY "typeId";`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching file types:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all files belonging to the logged-in user.
 */
export const getUserFiles = async (req, res) => {
  const userId = req.user.userId; // from authMiddleware
  try {
    const result = await pool.query(
      `SELECT
        f.*,
        ft."type" AS "fileType",
        COALESCE(
          JSON_AGG(fa."ApplicationId") FILTER (WHERE fa."ApplicationId" IS NOT NULL),
          '[]'
        ) AS "ApplicationIds"
      FROM "Files" f
      JOIN "FileTypes" ft ON f."typeId" = ft."typeId"
      LEFT JOIN "FileApplications" fa ON fa."fileId" = f."fileId"
      WHERE f."userId" = $1
      GROUP BY f."fileId", ft."type"
      ORDER BY f."fileId" DESC;
      `,
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching user files:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create (insert) a new file entry in the database.
 * Assumes the client has already uploaded the file to S3
 * and is sending us the S3 URL + metadata in req.body.
 */
export const createFile = async (req, res) => {
  const userId = req.user.userId;
  const { typeId, applicationsId, fileUrl, fileName, extens, description, applicationsIds = [],} = req.body;
  
  if (!typeId || !fileUrl || !fileName) {
    return res.status(400).json({
      message: 'typeId, fileUrl, and fileName are required',
    });
  }

  try {
    // 1) Insert the file row
    const fileInsertQuery = `
      INSERT INTO "Files"
      ("userId", "typeId", "fileUrl", "fileName", "extens", "description")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const fileValues = [userId, typeId, fileUrl, fileName, extens, description];
    const { rows } = await pool.query(fileInsertQuery, fileValues);
    const newFile = rows[0];

    // 2) Insert many rows in "FileApplications"
    if (applicationsIds.length > 0) {
      const insertValues = [];
      const placeholders = [];

      applicationsIds.forEach((appId, idx) => {
        // For uniqueness or "only one CV per app," you can do checks here
        const paramIndex1 = 1 + insertValues.length; // next param
        const paramIndex2 = 1 + insertValues.length + 1;
        placeholders.push(`($${paramIndex1}, $${paramIndex2})`);
        insertValues.push(newFile.fileId, appId);
      });

      const faQuery = `
        INSERT INTO "FileApplications" ("fileId","ApplicationId")
        VALUES ${placeholders.join(', ')}
      `;
      await pool.query(faQuery, insertValues);
    }

    // 3) Return the newly created file
    res.status(201).json({ message: 'File created successfully', file: newFile });
  } catch (error) {
    console.error('Error creating file record:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update file metadata (e.g., link it to a different application, change description, etc.)
 */
export const updateFile = async (req, res) => {
  const { id } = req.params; // fileId
  const userId = req.user.userId;
  const { typeId, applicationsIds = [], fileName, extens, description } = req.body;

  // Build the SET clause dynamically
  const fields = [];
  const values = [];
  let idx = 1;

  if (typeId !== undefined) {
    fields.push(`"typeId" = $${idx}`);
    values.push(typeId);
    idx++;
  }
  if (fileName !== undefined) {
    fields.push(`"fileName" = $${idx}`);
    values.push(fileName);
    idx++;
  }
  if (extens !== undefined) {
    fields.push(`"extens" = $${idx}`);
    values.push(extens);
    idx++;
  }
  if (description !== undefined) {
    fields.push(`"description" = $${idx}`);
    values.push(description);
    idx++;
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: 'No valid fields provided for update' });
  }

  values.push(id);
  values.push(userId);

  try {
    // 1) Update "Files" table
    const updateWithJoin = `
      WITH updated AS (
        UPDATE "Files"
        SET ${fields.join(', ')}
        WHERE "fileId" = $${idx} AND "userId" = $${idx + 1}
        RETURNING *
      )
      SELECT u.*, ft."type" as "fileType"
      FROM updated u
      JOIN "FileTypes" ft ON ft."typeId" = u."typeId";
    `;

    const { rows: joinedRows } = await pool.query(updateWithJoin, values);

    if (joinedRows.length === 0) {
      return res.status(404).json({ message: 'File not found or not authorized' });
    }

    // 2) Rebuild the "FileApplications" bridging table
    await pool.query(`
      DELETE FROM "FileApplications"
      WHERE "fileId" = $1
    `, [id]);

    if (applicationsIds.length > 0) {
      const insertValues = [];
      const placeholders = [];
      applicationsIds.forEach((appId, idx) => {
        placeholders.push(`($${1 + insertValues.length}, $${2 + insertValues.length})`);
        insertValues.push(id, appId);
      });
      await pool.query(`
        INSERT INTO "FileApplications" ("fileId", "ApplicationId")
        VALUES ${placeholders.join(', ')}
      `, insertValues);
    }

    // 3) Return updated file details
    return res.status(200).json({
      message: 'File updated successfully',
      file: joinedRows[0],
    });
  } catch (error) {
    console.error('Error updating file record:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete a file record. 
 * You may also want to delete the actual file from S3 here.
 */
export const deleteFile = async (req, res) => {
  const { id } = req.params; // fileId
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `DELETE FROM "Files"
       WHERE "fileId" = $1 AND "userId" = $2
       RETURNING *;`,
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'File not found or not authorized to delete' });
    }

    // If you need to remove from S3, do it here

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * (Optional) Fetch a single file by ID (useful to check details if needed).
 */
export const getFileById = async (req, res) => {
  const { id } = req.params; // fileId
  const userId = req.user.userId;
  try {
    const result = await pool.query(
      `SELECT f.*, ft."type" AS "fileType"
       FROM "Files" f
       JOIN "FileTypes" ft ON f."typeId" = ft."typeId"
       WHERE f."fileId" = $1 AND f."userId" = $2;`,
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching file details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
