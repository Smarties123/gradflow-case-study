import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import pg from 'pg';
import jwt from 'jsonwebtoken'; 



const app = express();
const { Pool } = pg;
import { config } from "dotenv";
config({ path: process.ENV }) // all env vars after this initialization
const SECRET_KEY = process.env.JWT_SECRET;

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

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user; // Attach the decoded user information to the request object
    next();
  });
};

  

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
      res.status(201).send({ userId: result.rows[0].UserId, userName: result.rows[0].Username  });
      console.log("Signed Up Sucessfully");
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error.');
    }
  });
  

  
  app.post('/login', async (req, res) => {
      const { email, password } = req.body;
      if (!email || !password) {
          return res.status(400).json({ message: 'Email and password are required.' });
      }
  
      try {
          const query = 'SELECT * FROM "Users" WHERE "Email" = $1';
          const values = [email];
  
          const { rows } = await pool.query(query, values);
          if (rows.length === 0) {
              return res.status(404).json({ message: 'User not found.' });
          }
  
          const user = rows[0];
          const match = await bcrypt.compare(password, user.Password);
          if (match) {
              // Generate a JWT token
              const token = jwt.sign(
                  { userId: user.UserId, email: user.Email }, 
                  SECRET_KEY, 
                  // { expiresIn: '1h' } // The token will expire in 1 hour
              );
  
              // Return user data and the token
              res.status(200).json({
                  message: 'Login successful!',
                  token: token,
                  user: {
                      id: user.UserId,
                      email: user.Email,
                      username: user.Username,
                  }
              });
              console.log('Logged in');
          } else {
              res.status(401).json({ message: 'Password is incorrect.' });
          }
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error.' });
      }
  });
  


//Will need improvements to handle nulls in future
app.post('/addjob', authenticateToken, async (req, res) => {
  const { company, position, deadline, location, url, date_applied, card_color } = req.body;
  console.log(deadline);
  console.log(date_applied);

  if (!company || !position) {
    return res.status(400).json({ message: 'Company and position are required' });
  }

  try {

    const query = `
      INSERT INTO "Application" ("CompanyName", "JobName", "Deadline", "Location", "CompanyURL", "DateApplied", "Color", "UserId")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [company, position, deadline, location, url, date_applied, card_color, req.user.userId];

    const result = await pool.query(query, values);
    const addedJob = result.rows[0];

    res.status(201).json({ message: 'Job added successfully', job: addedJob });
  } catch (error) {
    console.error('Error adding job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Endpoint to fetch user's applications
app.get('/applications', authenticateToken, async (req, res) => {
  const userId = req.user.userId; // Assuming the user ID is stored in the JWT

  try {
    const query = `
      SELECT * FROM "Application" WHERE "UserId" = $1 ORDER BY "Deadline" DESC;
    `;
    const values = [userId];
    const { rows: jobs } = await pool.query(query, values);
    res.status(200).json(jobs);

  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


  