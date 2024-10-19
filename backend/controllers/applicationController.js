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
      SELECT a.*, sn."StatusName"
      FROM "Application" a
      JOIN "Status" s ON a."StatusId" = s."StatusId"
      JOIN "StatusName" sn ON s."StatusNameId" = sn."StatusNameId"
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

// Update general application details
// Update general application details
export const updateApplication = async (req, res) => {
  // console.log('updateApplication called');

  const { id } = req.params;
  const { company, position, salary, notes, deadline, location, url, card_color, date_applied, interview_stage, statusId } = req.body; 

  const userId = req.user.userId;

  // // Log each field for debugging
  // console.log('Updating application with the following details:');
  // console.log(`Company: ${company}`);
  // console.log(`Position: ${position}`);
  // console.log(`Salary: ${salary}`);
  // console.log(`Notes: ${notes}`);
  // console.log(`Deadline: ${deadline}`);
  // console.log(`Location: ${location}`);
  // console.log(`URL: ${url}`);
  // console.log(`Card Color: ${card_color}`);
  // console.log(`Date Applied: ${date_applied}`);
  // console.log(`Interview Stage: ${interview_stage}`);
  // console.log(`Status ID: ${statusId}`);
  // console.log(`User ID: ${userId}`);
  // console.log(`Application ID: ${id}`);

  try {
    const query = `
    UPDATE "Application"
    SET "CompanyName" = COALESCE($1, "CompanyName"), 
        "JobName" = COALESCE($2, "JobName"), 
        "Salary" = COALESCE($3, "Salary"), 
        "Notes" = COALESCE($4, "Notes"), 
        "Deadline" = COALESCE($5, "Deadline"), 
        "Location" = COALESCE($6, "Location"), 
        "CompanyURL" = COALESCE($7, "CompanyURL"), 
        "Color" = COALESCE($8, "Color"), 
        "DateApplied" = COALESCE($9, "DateApplied"), 
        "Interview" = COALESCE($10, "Interview"), 
        "StatusId" = COALESCE($11, "StatusId")
    WHERE "ApplicationId" = $12 AND "UserId" = $13
    RETURNING *;
  `;
    const values = [
      company || null,
      position || null,
      salary !== undefined ? salary : null,
      notes || null,
      deadline || null,
      location || null,
      url || null,
      card_color || null,
      date_applied || null,
      interview_stage || null,
      statusId || null,
      id,
      userId
    ];

    // Log the full values array before executing the query
    // console.log('Values being passed to the query:', values);

    const { rows } = await pool.query(query, values);

    if (rows.length > 0) {
      // console.log('Updated application:', rows[0]); // Log the result from the DB
      res.status(200).json({ message: 'Application updated successfully', application: rows[0] });
    } else {
      // console.log('Application not found for update');
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ message: 'Server error' });
  }
};







export const updateApplicationStatus = async (req, res) => {
  // console.log('updateApplicationStatus called');

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


export const getApplicationsStatus = async (userId) => {
  try {
    const query = `
      SELECT * ,
        CASE
          WHEN "Deadline" < CURRENT_DATE THEN 'Past Due'
          WHEN "Deadline" BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '1 week' THEN 'Due in 1 week'
          WHEN "Deadline" BETWEEN CURRENT_DATE + INTERVAL '1 week' AND CURRENT_DATE + INTERVAL '2 weeks' THEN 'Due in 2 weeks'
        END AS deadline_status
      FROM "Application"
      WHERE "UserId" = $1
      AND (
        "Deadline" < CURRENT_DATE
        OR "Deadline" BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '2 weeks'
      )
      ORDER BY "Deadline" ASC;
    `;

    const values = [userId];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return { pastDue: [], dueIn1Week: [], dueIn2Weeks: [] };
    }


    const formatDeadline = (date) => {
      // const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
      const options = { year: 'numeric', month: '2-digit', day: '2-digit'};
      return new Date(date).toLocaleString('en-US', options); 
    };

    const pastDue = result.rows.filter(app => app.deadline_status === 'Past Due').map(app => ({
      ...app,
      Deadline: formatDeadline(app.Deadline) 
    }));

    const dueIn1Week = result.rows.filter(app => app.deadline_status === 'Due in 1 week').map(app => ({
      ...app,
      Deadline: formatDeadline(app.Deadline) 
    }));

    const dueIn2Weeks = result.rows.filter(app => app.deadline_status === 'Due in 2 weeks').map(app => ({
      ...app,
      Deadline: formatDeadline(app.Deadline)
    }));

    return { pastDue, dueIn1Week, dueIn2Weeks };
  } catch (error) {
    console.error('Error fetching applications by deadline:', error);
    throw new Error('Database error');
  }
};





// Search for applications by job name, company name, or location
export const searchApplications = async (req, res) => {
  const { query } = req.query;
  const userId = req.user.userId;


  if (!query) {
    return res.status(400).json({ message: 'Search query missing' });
  }

  try {
    const searchQuery = `%${query}%`;
    const searchResults = await pool.query(
      `
      SELECT a.*, sn."StatusName"
      FROM "Application" a
      JOIN "Status" s ON a."StatusId" = s."StatusId"
      JOIN "StatusName" sn ON s."StatusNameId" = sn."StatusNameId"
      WHERE a."UserId" = $1
      AND (
        a."JobName" ILIKE $2
        OR a."CompanyName" ILIKE $2
        OR a."Location" ILIKE $2
      )
      ORDER BY a."Deadline" DESC;
      `,
      [userId, searchQuery]
    );

    res.status(200).json(searchResults.rows);
  } catch (error) {
    console.error('Error searching applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


