import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const { Pool } = pg;


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,  // Hardcoded password for testing
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false },
});


export default pool;
