// UserController.js
import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendResetPasswordEmail } from '../services/emailService.js';

const SECRET_KEY = process.env.JWT_SECRET;
const TOKEN_EXPIRATION_MINUTES = 15;
const SALT_ROUNDS = 10; // Adjust this value as necessary


// Middleware to authenticate token (in case you need it)
export const authenticateToken = (req, res, next) => {
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

// Sign up
export const signUp = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userQuery = 'INSERT INTO "Users" ("Username", "Email", "Password") VALUES ($1, $2, $3) RETURNING "UserId"';
    const values = [username, email, hashedPassword];

    const result = await pool.query(userQuery, values);
    const userId = result.rows[0].UserId;

    // Predefined StatusNameIds for default statuses (1-5) in uppercase
    const defaultStatusNames = ['TO DO', 'APPLIED', 'INTERVIEW', 'OFFERED', 'REJECTED'];

    // Insert or fetch StatusNameIds for each default status
    for (const [index, status] of defaultStatusNames.entries()) {
      let statusNameId;

      const statusNameResult = await pool.query(`
        INSERT INTO "StatusName" ("StatusName")
        VALUES ($1)
        ON CONFLICT ("StatusName") DO NOTHING
        RETURNING "StatusNameId";
      `, [status]);

      if (statusNameResult.rows.length > 0) {
        statusNameId = statusNameResult.rows[0].StatusNameId;
      } else {
        const existingStatusResult = await pool.query('SELECT "StatusNameId" FROM "StatusName" WHERE "StatusName" = $1', [status]);
        statusNameId = existingStatusResult.rows[0].StatusNameId;
      }

      // Insert into Status with the retrieved StatusNameId
      await pool.query(`
        INSERT INTO "Status" ("StatusNameId", "StatusOrder", "UserId")
        VALUES ($1, $2, $3);
      `, [statusNameId, index + 1, userId]);
    }

    res.status(201).json({ userId, message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};




// Login
export const login = async (req, res) => {
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
      const token = jwt.sign({ userId: user.UserId, email: user.Email }, SECRET_KEY);
      res.status(200).json({
        message: 'Login successful!',
        token: token,
        user: {
          id: user.UserId,
          email: user.Email,
          username: user.Username,
        }
      });
    } else {
      res.status(401).json({ message: 'Password is incorrect.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const query = 'SELECT * FROM "Users" WHERE "Email" = $1';
    const values = [email];
    const { rows } = await pool.query(query, values);

    if (rows.length === 1) {
      const verificationToken = crypto.randomBytes(64).toString('hex');
      const hashedToken = await bcrypt.hash(verificationToken, 10);

      const expirationTime = new Date();
      expirationTime.setMinutes(expirationTime.getMinutes() + TOKEN_EXPIRATION_MINUTES);

      const updateQuery = `
        UPDATE "Users"
        SET "PWD_RESET_TOKEN" = $1, "RESET_TKN_TIME" = $2
        WHERE "Email" = $3
      `;
      await pool.query(updateQuery, [hashedToken, expirationTime, email]);

      // Send the token (unhashed) to the user's email
      const frontendUrl = process.env.FRONTEND_URL;
      await sendResetPasswordEmail(email, verificationToken, frontendUrl);

      res.status(200).json({ message: 'Password reset token sent to your email.' });
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};


// Reset password
export const resetPassword = async (req, res) => {
  const { email, token, password } = req.body;
  const query = 'SELECT "PWD_RESET_TOKEN", "RESET_TKN_TIME" FROM "Users" WHERE "Email" = $1';
  const values = [email];

  try {
    const { rows } = await pool.query(query, values);

    if (rows.length === 1) {
      const { PWD_RESET_TOKEN, RESET_TKN_TIME } = rows[0];

      // Validate token and check if it has expired
      const isMatch = await bcrypt.compare(token, PWD_RESET_TOKEN);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid token.' });
      }

      // (Optional) Check if the token has expired
      if (new Date() > new Date(RESET_TKN_TIME)) {
        return res.status(400).json({ message: 'Token has expired.' });
      }

      // Hash the new password before saving it
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Update the user's password and clear the token fields
      const updateQuery = `
        UPDATE "Users"
        SET "Password" = $1, "PWD_RESET_TOKEN" = NULL, "RESET_TKN_TIME" = NULL
        WHERE "Email" = $2
      `;
      await pool.query(updateQuery, [hashedPassword, email]);

      res.status(200).json({ message: 'Password has been reset successfully.' });
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
};