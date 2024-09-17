// applicationController.js
import pool from '../config/db.js';

// Add a new job application
export const addJob = async (req, res) => {
  const { company, position, deadline, location, url, date_applied, card_color, companyLogo, statusId } = req.body;

  if (!company || !position || !statusId) {
    return res.status(400).json({ message: 'Company, position, and status are required' });
  }

  try {
    const result = await pool.query(`
      INSERT INTO "Application" ("CompanyName", "JobName", "Deadline", "Location", "CompanyURL", "DateApplied", "Color", "UserId", "CompanyLogo", "StatusId")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;
    `, [company, position, deadline, location, url, date_applied, card_color, req.user.userId, companyLogo, statusId]);

    res.status(201).json({ message: 'Job added successfully', job: result.rows[0] });
  } catch (error) {
    console.error('Error adding job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch all applications for the logged-in user
export const getApplications = async (req, res) => {
  const userId = req.user.userId; // Assuming the user ID is stored in the JWT

  try {
    const query = `
      SELECT a.*, s."StatusName"
      FROM "Application" a
      JOIN "Status" s ON a."StatusId" = s."StatusId"
      WHERE a."UserId" = $1
      ORDER BY a."Deadline" DESC;
    `;
    const values = [userId];
    const { rows: jobs } = await pool.query(query, values);
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update application status (when moving cards)
export const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { statusId } = req.body;
  const userId = req.user.userId;

  if (!statusId) {
    return res.status(400).json({ message: 'StatusId is required' });
  }

  try {
    const query = `
      UPDATE "Application"
      SET "StatusId" = $1
      WHERE "UserId" = $2 AND "ApplicationId" = $3
      RETURNING *;
    `;
    const values = [statusId, userId, id];
    const { rows } = await pool.query(query, values);

    if (rows.length > 0) {
      res.status(200).json({ message: 'Application status updated', application: rows[0] });
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark or unmark an application as favorite
export const updateFavoriteStatus = async (req, res) => {
  const { id } = req.params;
  const { isFavorited } = req.body;
  const userId = req.user.userId;

  if (typeof isFavorited !== 'boolean') {
    return res.status(400).json({ message: 'Invalid favorite status' });
  }

  try {
    const query = `
      UPDATE "Application"
      SET "Favourite" = $1
      WHERE "UserId" = $2 AND "ApplicationId" = $3
      RETURNING *;
    `;
    const values = [isFavorited, userId, id];
    const { rows } = await pool.query(query, values);

    if (rows.length > 0) {
      res.status(200).json({ message: 'Favorite status updated', application: rows[0] });
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    console.error('Error updating favorite status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an application
export const deleteApplication = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const query = `
      DELETE FROM "Application"
      WHERE "ApplicationId" = $1 AND "UserId" = $2
      RETURNING *;
    `;
    const values = [id, userId];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Application not found or not authorized to delete' });
    }

    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
