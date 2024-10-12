// UserController.js
import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendResetPasswordEmail } from '../services/emailService.js';

const SECRET_KEY = process.env.JWT_SECRET;
const TOKEN_EXPIRATION_MINUTES = 15;
const SALT_ROUNDS = 10; // Adjust this value as necessary



// Check if email or username already exists
export const checkUserExists = async (req, res) => {
  const { email, username } = req.body;

  try {
    const emailCheckQuery = 'SELECT * FROM "Users" WHERE "Email" = $1';
    const usernameCheckQuery = 'SELECT * FROM "Users" WHERE "Username" = $1';

    const emailResult = await pool.query(emailCheckQuery, [email]);
    const usernameResult = await pool.query(usernameCheckQuery, [username]);

    const emailExists = emailResult.rows.length > 0;
    const usernameExists = usernameResult.rows.length > 0;

    return res.status(200).json({ emailExists, usernameExists });
  } catch (error) {
    console.error('Error checking user existence:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};



// Sign up
// In your signUp function, check for email existence
export const signUp = async (req, res) => {
  const { username, email, password, promotionalEmails } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required.' });
  }

  try {
    // Check if email or username already exists
    const emailExists = await pool.query('SELECT * FROM "Users" WHERE "Email" = $1', [email]);
    if (emailExists.rows.length > 0) {
      return res.status(409).json({ message: 'Email already exists.' });
    }

    const usernameExists = await pool.query('SELECT * FROM "Users" WHERE "Username" = $1', [username]);
    if (usernameExists.rows.length > 0) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    // Proceed with user creation
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const userQuery = 'INSERT INTO "Users" ("Username", "Email", "Password") VALUES ($1, $2, $3) RETURNING "UserId"';
    const values = [username, email, hashedPassword];

    const result = await pool.query(userQuery, values);
    const userId = result.rows[0].UserId;

    // Insert default statuses (as per your previous logic)
    const defaultStatusNames = ['TO DO', 'APPLIED', 'INTERVIEW', 'OFFERED', 'REJECTED'];
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

      await pool.query(`
        INSERT INTO "Status" ("StatusNameId", "StatusOrder", "UserId")
        VALUES ($1, $2, $3);
      `, [statusNameId, index + 1, userId]);
    }

    res.status(201).json({ userId, message: 'User created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};



// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  
  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Check if the user exists
    const query = 'SELECT * FROM "Users" WHERE "Email" = $1';
    const values = [email];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      // User does not exist
      return res.status(404).json({ message: 'No account associated with this email.' });
    }

    const user = rows[0];

    // Check if the password is correct
    const match = await bcrypt.compare(password, user.Password);
    if (!match) {
      // Incorrect password
      return res.status(401).json({ message: 'Incorrect password. Please try again.' });
    }

    // If the credentials are correct, generate a JWT token
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
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
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


// In userController.js
export const getUserDetails = async (req, res) => {
  const userId = req.user.userId;

  try {
      const query = 'SELECT "Username", "Email", "PromotionalEmail", "ApplicationEmail" FROM "Users" WHERE "UserId" = $1';
      const { rows } = await pool.query(query, [userId]);

      if (rows.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
          Username: rows[0].Username,
          Email: rows[0].Email,
          PromotionalEmail: rows[0].PromotionalEmail,  
          ApplicationEmail: rows[0].ApplicationEmail  // Ensure it's included
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};




// In userController.js
export const updateUserDetails = async (req, res) => {
  const userId = req.user.userId;
  const { name, email, promotionalEmails, applicationUpdates } = req.body;

  try {
      const query = 'UPDATE "Users" SET "Username" = $1, "Email" = $2, "PromotionalEmail" = $3, "ApplicationEmail" = $4 WHERE "UserId" = $5';
      await pool.query(query, [name, email, promotionalEmails, applicationUpdates, userId]);

      res.status(200).json({ message: 'User details updated successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};



export const deleteUserAccount = async (req, res) => {
  const userId = req.user.userId;

  try {
      await pool.query('DELETE FROM "Application" WHERE "UserId" = $1', [userId]);

      await pool.query('DELETE FROM "Status" WHERE "UserId" = $1', [userId]);

      const result = await pool.query('DELETE FROM "Users" WHERE "UserId" = $1', [userId]);

      if (result.rowCount > 0) {
          res.status(200).json({ message: 'User account deleted successfully' });
      } else {
          res.status(404).json({ message: 'User not found' });
      }
  } catch (error) {
      console.error('Error deleting user account:', error);
      res.status(500).json({ message: 'Server error' });
  }
};



export const getAllUsers = async () => {
  try {
    const result = await pool.query('SELECT "UserId", "Email" FROM "Users"');
    return result.rows;
  } 
  catch (error) {
    
    console.error('Error fetching users:', error);
    throw new Error('Database error');
  }
};
