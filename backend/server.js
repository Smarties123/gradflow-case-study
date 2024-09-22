import dotenv from 'dotenv';
dotenv.config();  // Load environment variables

import express from 'express';
import cors from 'cors';
import pool from './config/db.js';  // Database import after dotenv
import userRoutes from './routes/userRoutes.js';  // Import user routes
import applicationRoutes from './routes/applicationRoutes.js';
import statusRoutes from './routes/statusRoutes.js';
import logoDevProxy from './services/logoDevProxy.js';  // Import logoDevProxy

const app = express();

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({ time: result.rows[0].now });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection error', error: error.message });
  }
});

app.use(cors());
app.use(express.json());

// Proxy route for logo service
app.use(logoDevProxy);

// User-related routes
app.use('/api/users', userRoutes);  // '/forgot-password' will be accessible as '/api/users/forgot-password'
app.use(applicationRoutes);
app.use(statusRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
