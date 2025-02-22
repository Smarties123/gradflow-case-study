// removeFoldersForAllUsers.js

// import dotenv from 'dotenv';
// dotenv.config();

// import pool from '../config/db.js';
// import { deleteAllObjectsForUser } from '../services/s3Service.js';

// (async function removeFoldersForAllUsers() {
//   try {
//     // 1) Fetch all users from the DB
//     const { rows: users } = await pool.query('SELECT "UserId" FROM "Users"');

//     // 2) For each user, delete all objects under their S3 prefix
//     for (const user of users) {
//       const userId = user.UserId;
//       console.log(`Removing S3 folders/objects for user: ${userId}`);
//       await deleteAllObjectsForUser(userId);
//     }

//     console.log('Done removing folders for all existing users!');
//     process.exit(0);
//   } catch (error) {
//     console.error('Error removing S3 folders:', error);
//     process.exit(1);
//   }
// })();
