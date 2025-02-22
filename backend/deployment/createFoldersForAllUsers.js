// createFoldersForAllUsers.js

// Run to create folders for existing users in S3
// Usage: `node deployment/createFoldersForAllUsers.js`

// // 1) Load env vars BEFORE importing `pool`
// import dotenv from 'dotenv';
// dotenv.config();

// // 2) Now import pool
// import pool from '../config/db.js';
// import { createUserFoldersInS3 } from '../services/s3Service.js';

// (async function createFoldersForAllUsers() {
//   try {
//     // 1) Get all existing users
//     const { rows: users } = await pool.query('SELECT "UserId" FROM "Users"');

//     // 2) Loop and create folders for each
//     for (const user of users) {
//       const userId = user.UserId;
//       console.log(`Creating S3 folders for user: ${userId}`);
//       await createUserFoldersInS3(userId);
//     }

//     console.log('Done creating folders for all existing users!');
//     process.exit(0);
//   } catch (error) {
//     console.error('Error creating S3 folders:', error);
//     process.exit(1);
//   }
// })();
