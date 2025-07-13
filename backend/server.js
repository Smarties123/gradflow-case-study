import dotenv from 'dotenv';
import { sendEmailsToAllUsers } from './services/emailService.js';
// import { sendApplicationStatusEmail } from './services/emailService.js';

import cron from 'node-cron';
dotenv.config(); 

import express from 'express';
import cors from 'cors';
import pool from './config/db.js';  // Database import
import userRoutes from './routes/userRoutes.js';  
import applicationRoutes from './routes/applicationRoutes.js';
import filesRoutes from './routes/filesRoutes.js';
import statusRoutes from './routes/statusRoutes.js';
import logoDevProxy from './services/logoDevProxy.js'; 
// import sitemapRoutes from './routes/sitemapRoutes.js';  // Import the sitemap route
import logDeleteRoute from './services/logDeleteService.js';  // Import the log delete service





// Schedule the task to run every wednesday at 9:00 AM 
//for more info: https://www.npmjs.com/package/node-cron
cron.schedule('0 9 * * 3', async () => {
  console.log('Sending application status emails to all users...');
  await sendEmailsToAllUsers();
  console.log('Finished sending emails.');
});

import stripe from 'stripe';

const app = express();


// 1) CORS — allow only your front end (override in .env per environment)
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
}));
// 2) JSON parser — must come BEFORE any routes that read req.body
app.use(express.json());
app.use(logDeleteRoute);

// console.log('BUCKET_NAME:', process.env.BUCKET_NAME);
// Test email route
// TO RUN IT: 
/*
Uncomment the function below 
run node server.js 
in the terminal run 
curl http://localhost:3001/test-email/youremail@example.com

*/
// app.get('/test-email/:email', async (req, res) => {
//   const email = req.params.email;

//   try {
//     // Fetch user by email from "Users" table
//     const userResult = await pool.query('SELECT * FROM "Users" WHERE "Email" = $1', [email]);

//     if (userResult.rows.length === 0) {
//       return res.status(404).json({ error: `No user found with email ${email}` });
//     }

//     const user = userResult.rows[0];
//     const userId = user.UserId; // Adjust based on your database schema

//     // Send the application status email
//     await sendApplicationStatusEmail(email, userId);
//     res.status(200).json({ message: `Test email sent successfully to ${email}` });
//   } catch (error) {
//     console.error('Error sending test email:', error);
//     res.status(500).json({ error: 'Failed to send test email', details: error.message });
//   }
// });


app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({ time: result.rows[0].now });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection error', error: error.message });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


// CORS test route
app.get('/test-cors', (req, res) => {
  res.status(200).json({ message: 'CORS is working!' });
});


app.use(cors());
app.use(express.json());

// app.use('/', sitemapRoutes);


// Proxy route for logo service
app.use(logoDevProxy);

// User-related routes
app.use('/api/users', userRoutes);  // '/forgot-password' will be accessible as '/api/users/forgot-password'
app.use(applicationRoutes);
app.use('/status', statusRoutes);
app.use('/files', filesRoutes);


const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});




