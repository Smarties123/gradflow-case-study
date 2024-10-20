import pool from '../config/db.js';

// Fetch all statuses for a user
export const getStatuses = async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await pool.query(`
      SELECT s."StatusId", sn."StatusName", s."StatusOrder"
      FROM "Status" s
      JOIN "StatusName" sn ON s."StatusNameId" = sn."StatusNameId"
      WHERE s."UserId" = $1
      ORDER BY s."StatusOrder" ASC;
    `, [userId]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error Fetching Statuses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a specific status name
export const updateStatusName = async (req, res) => {
  const { id } = req.params;
  let { statusName } = req.body;
  const userId = req.user.userId;

  if (!statusName) {
    return res.status(400).json({ message: 'StatusName Is Required' });
  }

  statusName = statusName.toUpperCase();  // Capitalize the status name

  try {
    // Check if StatusName exists, if not, insert into StatusName
    const statusNameResult = await pool.query(`
      INSERT INTO "StatusName" ("StatusName")
      VALUES ($1)
      ON CONFLICT ("StatusName") DO NOTHING
      RETURNING "StatusNameId";
    `, [statusName]);

    const statusNameId = statusNameResult.rows.length > 0 
      ? statusNameResult.rows[0].StatusNameId 
      : (await pool.query('SELECT "StatusNameId" FROM "StatusName" WHERE "StatusName" = $1', [statusName])).rows[0].StatusNameId;

    // Update the Status entry
    const updateQuery = `
      UPDATE "Status"
      SET "StatusNameId" = $1
      WHERE "StatusId" = $2 AND "UserId" = $3
      RETURNING *;
    `;
    const result = await pool.query(updateQuery, [statusNameId, id, userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Status not found or unauthorized to update' });
    }

    res.status(200).json({ message: 'Status updated successfully', status: result.rows[0] });
  } catch (error) {
    console.error('Error Updating status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Create a new status for the user
export const createStatus = async (req, res) => {
  let { statusName } = req.body;
  const userId = req.user.userId;

  if (!statusName) {
    return res.status(400).json({ message: 'StatusName is required' });
  }

  statusName = statusName.toUpperCase();  // Capitalize the status name

  try {
    // Check if StatusName already exists, if not, create it
    const statusNameResult = await pool.query(`
      INSERT INTO "StatusName" ("StatusName")
      VALUES ($1)
      ON CONFLICT ("StatusName") DO NOTHING
      RETURNING "StatusNameId";
    `, [statusName]);

    const statusNameId = statusNameResult.rows.length > 0 
      ? statusNameResult.rows[0].StatusNameId 
      : (await pool.query('SELECT "StatusNameId" FROM "StatusName" WHERE "StatusName" = $1', [statusName])).rows[0].StatusNameId;

    // Insert into Status
    const statusQuery = `
      INSERT INTO "Status" ("StatusNameId", "StatusOrder", "UserId")
      VALUES ($1, (SELECT COALESCE(MAX("StatusOrder"), 0) + 1 FROM "Status" WHERE "UserId" = $2), $2)
      RETURNING "StatusId", "StatusOrder";
    `;
    const values = [statusNameId, userId];
    const result = await pool.query(statusQuery, values);

    // Fetch the actual StatusName to return
    const statusNameQuery = await pool.query(`
      SELECT "StatusName" FROM "StatusName" WHERE "StatusNameId" = $1;
    `, [statusNameId]);

    const statusNameText = statusNameQuery.rows[0].StatusName;

    res.status(201).json({
      message: 'Status created successfully',
      status: {
        StatusId: result.rows[0].StatusId,
        StatusName: statusNameText,
        StatusOrder: result.rows[0].StatusOrder,
      }
    });
  } catch (error) {
    console.error('Error creating status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Delete a status if it has no associated cards
export const deleteStatus = async (req, res) => {
  const { id } = req.params; // StatusId from route params
  const userId = req.user.userId; // Extract user ID from JWT

  try {
    // Check if the status has any associated cards
    const checkQuery = `
      SELECT COUNT(*) AS count FROM "Application" WHERE "StatusId" = $1 AND "UserId" = $2;
    `;
    const checkValues = [id, userId];
    const checkResult = await pool.query(checkQuery, checkValues);

    const cardCount = parseInt(checkResult.rows[0].count, 10);
    if (cardCount > 0) {
      return res.status(400).json({ message: 'Cannot delete status with associated cards' });
    }

    // Get the current StatusNameId before deleting the status
    const statusResult = await pool.query(`
      SELECT "StatusNameId" FROM "Status" WHERE "StatusId" = $1 AND "UserId" = $2;
    `, [id, userId]);

    if (statusResult.rows.length === 0) {
      return res.status(404).json({ message: 'Status not found or Unauthorized to delete' });
    }

    const statusNameId = statusResult.rows[0].StatusNameId;

    // Delete the status
    const deleteQuery = `
      DELETE FROM "Status" WHERE "StatusId" = $1 AND "UserId" = $2 RETURNING *;
    `;
    const deleteValues = [id, userId];
    const deleteResult = await pool.query(deleteQuery, deleteValues);

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ message: 'Status not found or unauthorized to delete' });
    }

    // Check if the StatusNameId is still used by any other statuses
    const countQuery = `
      SELECT COUNT(*) AS count FROM "Status" WHERE "StatusNameId" = $1;
    `;
    const countResult = await pool.query(countQuery, [statusNameId]);

    if (parseInt(countResult.rows[0].count, 10) === 0) {
      // If no other statuses are using this StatusNameId, delete it
      await pool.query('DELETE FROM "StatusName" WHERE "StatusNameId" = $1', [statusNameId]);
    }

    res.status(200).json({ message: 'Status deleted successfully' });
  } catch (error) {
    console.error('Error deleting status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Move a status to a different position
export const moveStatus = async (req, res) => {
  const { id } = req.params; // StatusId from route params
  const { newPosition } = req.body; // newPosition should be provided in the request body
  const userId = req.user.userId; // Extract user ID from JWT

  try {
    // Get the current status order
    const currentStatusResult = await pool.query(`
      SELECT "StatusOrder" FROM "Status" WHERE "StatusId" = $1 AND "UserId" = $2;
    `, [id, userId]);

    if (currentStatusResult.rows.length === 0) {
      return res.status(404).json({ message: 'Status not found or unauthorized to move' });
    }

    const currentPosition = currentStatusResult.rows[0].StatusOrder;

    // Update the orders of the other statuses
    if (newPosition < currentPosition) {
      await pool.query(`
        UPDATE "Status"
        SET "StatusOrder" = "StatusOrder" + 1
        WHERE "StatusOrder" >= $1 AND "StatusOrder" < $2 AND "UserId" = $3;
      `, [newPosition, currentPosition, userId]);
    } else if (newPosition > currentPosition) {
      await pool.query(`
        UPDATE "Status"
        SET "StatusOrder" = "StatusOrder" - 1
        WHERE "StatusOrder" <= $1 AND "StatusOrder" > $2 AND "UserId" = $3;
      `, [newPosition, currentPosition, userId]);
    }

    // Update the status to the new position
    await pool.query(`
      UPDATE "Status"
      SET "StatusOrder" = $1
      WHERE "StatusId" = $2 AND "UserId" = $3;
    `, [newPosition, id, userId]);

    res.status(200).json({ message: 'Status moved successfully' });
  } catch (error) {
    console.error('Error moving status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
