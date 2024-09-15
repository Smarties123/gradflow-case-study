import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import pg from 'pg';
import jwt from 'jsonwebtoken'; 

import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

import admin from 'firebase-admin';




const app = express();
const { Pool } = pg;
import { config } from "dotenv";
config({ path: process.ENV }) // all env vars after this initialization
const SECRET_KEY = process.env.JWT_SECRET;
const TOKEN_EXPIRATION_MINUTES = 15;
const SALT_ROUNDS = 10;


const frontendUrl = 'http://localhost:3100'; //needs to be adjusted based on env


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

admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL
  }),
});


// Create reusable transporter object using the default SMTP transport (replace with real credentials)
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or use a different email service like 'SendGrid', 'Mailgun', etc.
  auth: {
    user: process.env.SMTP_EMAIL, // your email address
    pass: process.env.SMTP_PASSWORD, // your email password or app password
  },
});





app.use(express.json());
app.use(cors());
const port = 3001;
app.use(cors({
  origin: 'http://localhost:3100',  // Adjust this to your frontend's URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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
    req.user = user;
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


  app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const query = 'SELECT * FROM "Users" WHERE "Email" = $1';
    const values = [email];
  
    try {
      const { rows } = await pool.query(query, values);
      
      if (rows.length === 1) {
        // Generate a secure random token
        const verificationToken = crypto.randomBytes(64).toString('hex');
        const hashedToken = await bcrypt.hash(verificationToken, SALT_ROUNDS);
  
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + TOKEN_EXPIRATION_MINUTES);
  
        const updateQuery = `
          UPDATE "Users"
          SET "PWD_RESET_TOKEN" = $1, "RESET_TKN_TIME" = $2
          WHERE "Email" = $3
        `;
        const updateValues = [hashedToken, expirationTime, email];
        await pool.query(updateQuery, updateValues);
  
        // Send the token (unhashed) to the user's email
        let mailOptions = {
          from: process.env.SMTP_EMAIL,
          to: email, 
          subject: 'Password Reset Verification Code',
          // text: `Your password reset token is: ${verificationToken}. It will expire in 15 minutes.`, // plain text body
          // Optionally send HTML content
          html: `
         <p>It will expire in 15 minutes.</p>
         <p>You can reset your password by clicking the following link:</p>
         <a href="${frontendUrl}/reset-password/${verificationToken}">${frontendUrl}/reset-password/${verificationToken}</a>`,  // HTML version with clickable link
        };
  
        await transporter.sendMail(mailOptions);
  
      } 
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
    // Respond back with success
    res.status(200).json({ message: 'Password reset token sent to your email.' });
  });
  
  
  app.post('/reset-password', async (req, res) => {
    const { email, token, password } = req.body;
    console.log(password);
  
    const query = 'SELECT "PWD_RESET_TOKEN", "RESET_TKN_TIME" FROM "Users" WHERE "Email" = $1';
    const values = [email];
  
    try {
      const { rows } = await pool.query(query, values);
      
      if (rows.length === 1) {
        const { PWD_RESET_TOKEN, RESET_TKN_TIME } = rows[0];
        console.log(PWD_RESET_TOKEN);
  
        // Check if the token has expired
        // if (new Date() > new Date(RESET_TKN_TIME)) {
        //   return res.status(400).json({ message: 'Token has expired.' });
        // }
  
        // Compare the provided token with the hashed token in the database
        const isMatch = await bcrypt.compare(token, PWD_RESET_TOKEN);  // Compare the plain token with the hashed token
        if (!isMatch) {
          console.log("Token Mismatch");
          return res.status(400).json({ message: 'Invalid token.' });
        }

        console.log(SALT_ROUNDS);
  
        // Hash the new password before saving it
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  
        // Update the user's password and clear the token fields
        const updateQuery = `
          UPDATE "Users"
          SET "Password" = $1, "PWD_RESET_TOKEN" = NULL, "RESET_TKN_TIME" = NULL
          WHERE "Email" = $2
        `;
        const updateValues = [hashedPassword, email];
        await pool.query(updateQuery, updateValues);
  
        // Respond with success
        console.log("Reset Works?");
        res.status(200).json({ message: 'Password has been reset successfully.' });
      } else {
        console.log("UNF Error");
        res.status(404).json({ message: 'User not found.' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
  });
  
  



  app.post('/google-login', async (req, res) => {
    const { token } = req.body;  // Firebase token sent from frontend
    
    // Log the received token
    console.log("Received token:", token);
  
    try {
      // Verify Firebase token using Firebase Admin SDK
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      // Log the decoded token
      console.log("Decoded token:", decodedToken);
  
      const { uid, email, name } = decodedToken;
  
      // Now, search or create the user in your PostgreSQL database
      const query = 'SELECT * FROM "Users" WHERE "Email" = $1';
      const values = [email];
      const { rows } = await pool.query(query, values);
  
      let user;
      if (rows.length === 0) {
        // If user does not exist, create a new user
        const insertQuery = 'INSERT INTO "Users" ("Username", "Email", "EXTERNAL_ID", "AuthProvider") VALUES ($1, $2, $3, $4) RETURNING *';
        const insertValues = [name || email, email, uid,"Google"];
        const result = await pool.query(insertQuery, insertValues);
        user = result.rows[0];
      } else {
        user = rows[0];  // User exists
      }
  
      // Create a JWT token for your app (backend authentication)
      const jwtToken = jwt.sign({ userId: user.UserId, email: user.Email }, process.env.JWT_SECRET);
  
      // Respond with user data and token
      res.status(200).json({
        message: 'Google login successful!',
        token: jwtToken,
        user: {
          id: user.UserId,
          email: user.Email,
          username: user.Username,
        },
      });
    } catch (error) {
      // Log the error for debugging
      console.error('Error during Google login:', error);
      res.status(401).json({ message: 'Google login failed' });
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








  