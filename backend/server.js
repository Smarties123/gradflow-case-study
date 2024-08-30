import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import pg from 'pg';

const app = express();
const { Pool } = pg;
import { config } from "dotenv";
config({ path: process.ENV })


// Configuration for your database
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
  });



app.use(express.json());
app.use(cors());
const port = 3001;

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send('Username, email, and password are required.');
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = 'INSERT INTO "Users" ("Username", "Email", "Password") VALUES ($1, $2, $3) RETURNING "UserId"';
      const values = [username, email, hashedPassword];
  
      const result = await pool.query(query, values);
      res.status(201).send({ userId: result.rows[0].UserId });
      console.log("Signed Up Sucessfully");
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error.');
    }
  });
  

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const query = 'SELECT * FROM "Users" WHERE "Email" = $1';
        const values = [username];

        const { rows } = await pool.query(query, values);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.Password);
        if (match) {
            res.status(200).json({ message: 'Login successful!' });
            console.log('Logged in');
        } else {
            res.status(401).json({ message: 'Password is incorrect.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

  