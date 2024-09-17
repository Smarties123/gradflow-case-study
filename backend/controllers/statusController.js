import pool from '../config/db.js';

// Fetch all statuses for a user
export const getStatuses = async (req, res) => {
  const userId = req.user.userId; // Extract user ID from the JWT
  try {
    const result = await pool.query(
      'SELECT * FROM "Status" WHERE "UserId" = $1 ORDER BY "StatusOrder" ASC', 
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching statuses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a specific status name
export const updateStatusName = async (req, res) => {
  const { id } = req.params; // Get StatusId from route params
  const { statusName } = req.body; // New StatusName from request body
  const userId = req.user.userId; // Extract user ID from the JWT

  if (!statusName) {
    return res.status(400).json({ message: 'StatusName is required' });
  }

  try {
    const query = `
      UPDATE "Status" 
      SET "StatusName" = $1 
      WHERE "StatusId" = $2 AND "UserId" = $3 
      RETURNING *;
    `;
    const values = [statusName, id, userId];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Status not found or unauthorized to update' });
    }

    res.status(200).json({ message: 'Status updated successfully', status: result.rows[0] });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new status for the user
export const createStatus = async (req, res) => {
  const { statusName } = req.body;
  const userId = req.user.userId; // Extract user ID from JWT

  if (!statusName) {
    return res.status(400).json({ message: 'StatusName is required' });
  }

  try {
    const query = `
      INSERT INTO "Status" ("StatusName", "StatusOrder", "UserId") 
      VALUES ($1, (SELECT COALESCE(MAX("StatusOrder"), 0) + 1 FROM "Status" WHERE "UserId" = $2), $2)
      RETURNING *;
    `;
    const values = [statusName, userId];
    const result = await pool.query(query, values);

    res.status(201).json({ message: 'Status created successfully', status: result.rows[0] });
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

    // Delete the status if no associated cards
    const deleteQuery = `
      DELETE FROM "Status" WHERE "StatusId" = $1 AND "UserId" = $2 RETURNING *;
    `;
    const deleteValues = [id, userId];
    const deleteResult = await pool.query(deleteQuery, deleteValues);

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ message: 'Status not found or unauthorized to delete' });
    }

    res.status(200).json({ message: 'Status deleted successfully' });
  } catch (error) {
    console.error('Error deleting status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
