import pool from '../config/db.js';

import { v4 as uuidv4 } from 'uuid';
import s3 from '../services/s3Service.js';

const BUCKET_NAME = 'gradflow-user-files';

/**
 * Provide a presigned URL so the client can upload directly to S3.
 */
export const getPresignedUploadUrl = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const { fileName, fileMime, docType } = req.body;

    if (!fileName || !fileMime || !docType) {
      return res.status(400).json({
        message: 'fileName, fileMime, and docType (cv|cl) are required.'
      });
    }

    // Decide which subfolder: "cv" or "cl"
    const subfolder = docType.toLowerCase() === 'cv' ? 'cv' : 'cl';

    // Build the S3 object key, e.g. "123/cv/<uuid>-myResume.pdf"
    const objectKey = `${userId}/${subfolder}/${uuidv4()}-${fileName}`;

    // Create presigned PUT URL so client can directly upload
    // CHANGED: Add ACL: 'public-read' so the file can be viewed via a direct URL
    const params = {
      Bucket: BUCKET_NAME,
      Key: objectKey,
      ContentType: fileMime,
      Expires: 60, // URL expires in 60 seconds
      // ACL: 'public-read'
    };

    const uploadUrl = s3.getSignedUrl('putObject', params);

    // Return both the presigned URL and the S3 key
    return res.status(200).json({ uploadUrl, objectKey });
  } catch (error) {
    console.error('Error generating presigned upload URL:', error);
    return res.status(500).json({ message: 'Error generating presigned URL' });
  }
};





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
  const { 
    typeId,
    fileUrl, 
    fileName, 
    extens, 
    description, 
    applicationsIds = [],  // Keep this
  } = req.body;
  
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
        placeholders.push(`($${insertValues.length + 1}, $${insertValues.length + 2})`);
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
    // 1) Fetch the file row to see if it exists and to get its S3 URL
    const fileResult = await pool.query(
      `SELECT * FROM "Files" 
       WHERE "fileId" = $1 AND "userId" = $2
       LIMIT 1`,
      [id, userId]
    );
    if (fileResult.rowCount === 0) {
      return res
        .status(404)
        .json({ message: 'File not found or not authorized to delete' });
    }

    const fileRow = fileResult.rows[0];
    const { fileUrl } = fileRow;

    // 2) (Optional) remove the file from S3 as well
    if (fileUrl) {
      // For example, "https://gradflow-user-files.s3.<region>.amazonaws.com/123/cv/someKey"
      const key = fileUrl.split('.com/')[1]; // everything after "s3.amazonaws.com/"
      if (key) {
        await s3
          .deleteObject({
            Bucket: BUCKET_NAME,
            Key: key
          })
          .promise();
      }
    }

    // 3) Remove from "FileApplications" bridging table, if you want
    await pool.query(
      `DELETE FROM "FileApplications"
       WHERE "fileId" = $1`,
      [id]
    );

    // 4) Remove from "Files" table
    await pool.query(
      `DELETE FROM "Files"
       WHERE "fileId" = $1 AND "userId" = $2`,
      [id, userId]
    );

    return res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(500).json({ message: 'Server error' });
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
