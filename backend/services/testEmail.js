// This is a test email file for testing templates etc
// run with the following command node testEmail.js testuser@example.com

import dotenv from 'dotenv';
import { sendApplicationStatusEmail } from './emailService.js';
dotenv.config();


import pool from '../config/db.js'; // Adjust the path based on your folder structure

// Function to get user by email
async function getUserByEmail(email) {
  try {
    const res = await pool.query('SELECT * FROM Users WHERE Email = $1', [email]);
    if (res.rows.length === 0) {
      throw new Error(`No user found with email ${email}`);
    }
    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

// Get email from command line arguments
const args = process.argv.slice(2);
const email = args[0];

if (!email) {
  console.error('Usage: node services/testEmail.js <email>');
  process.exit(1);
}

getUserByEmail(email)
  .then((user) => {
    const userId = user.UserId || user.userid; // Adjust based on your DB schema
    return sendApplicationStatusEmail(email, userId);
  })
  .then(() => {
    console.log('Test email sent successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
