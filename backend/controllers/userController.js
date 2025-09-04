// UserController.js
import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendResetPasswordEmail, sendVerificationTokenEmail } from '../services/emailService.js';
// userController.js


import { createUserFoldersInS3, deleteAllObjectsForUser } from '../services/s3Service.js';

const BUCKET_NAME = 'gradflow-user-files';
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
  const { username, email, password, promotionalEmails, createdAt } = req.body;
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
    const userQuery = 'INSERT INTO "Users" ("Username", "Email", "Password", "CreatedAt"  ) VALUES ($1, $2, $3, $4) RETURNING "UserId"';
    const values = [username.toLowerCase(), email, hashedPassword, createdAt];

    const result = await pool.query(userQuery, values);
    const userId = result.rows[0].UserId;
        // Add JWT sign and return it after successful user creation

    await createUserFoldersInS3(userId);

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

    await generateVerificationToken(userId, email);

    res.status(201).json( {message : 'User created successfully'} );
  } catch (error) {
    console.error('Error during signup:', error);

        // Improved error response
    let errorMessage = 'Server error.';
    if (error.code === '23505') { // PostgreSQL unique constraint violation
      errorMessage = 'This email or username is already registered.';
    }
    
    return res.status(500).json({ message: 'Server error.' });
  }
};


export const resendVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const userResult = await pool.query(`
      SELECT "UserId", "IsVerified" FROM "Users" WHERE "Email" = $1
    `, [email]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = userResult.rows[0];
    if (user.IsVerified) {
      return res.status(400).json({ message: 'User is already verified.' });
    }

    await generateVerificationToken(user.UserId, email);

    return res.status(200).json({ message: 'Verification email resent.' });

  } catch (err) {
    console.error('Error resending verification email:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};



export const googleSignUp = async (req, res) => {
  const { username, email, firebaseUid, profilePicture } = req.body;

  if (!username || !email || !firebaseUid) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if user already exists by Firebase UID or Email
    const userExistsQuery = 'SELECT * FROM "Users" WHERE "FirebaseUid" = $1 OR "Email" = $2';
    const userExistsResult = await pool.query(userExistsQuery, [firebaseUid, email]);

    if (userExistsResult.rows.length > 0) {
      return res.status(409).json({ message: 'User already exists. Please sign in with Google.' });
    }

    // Continue with Google signup if no user exists
    let uniqueUsername = username;
    let usernameExists = true;
    let counter = 1;

    while (usernameExists) {
      const usernameCheckQuery = 'SELECT * FROM "Users" WHERE "Username" = $1';
      const usernameCheckResult = await pool.query(usernameCheckQuery, [uniqueUsername]);

      if (usernameCheckResult.rows.length === 0) {
        usernameExists = false;
      } else {
        uniqueUsername = `${username}${counter}`;
        counter++;
      }
    }

    // Insert new user into the database
    const insertUserQuery = `
      INSERT INTO "Users" ("Username", "Email", "FirebaseUid", "ProfilePicture")
      VALUES ($1, $2, $3, $4)
      RETURNING "UserId"
    `;
    const values = [uniqueUsername.toLowerCase(), email, firebaseUid, profilePicture];
    const result = await pool.query(insertUserQuery, values);
    const userId = result.rows[0].UserId;

    await createUserFoldersInS3(userId);

    // Insert default statuses for the new user
    const defaultStatusNames = ['TO DO', 'APPLIED', 'INTERVIEW', 'OFFERED', 'REJECTED'];
    for (const [index, status] of defaultStatusNames.entries()) {
      let statusNameId;

      // Check if the status already exists in the StatusName table
      const statusNameResult = await pool.query(`
        INSERT INTO "StatusName" ("StatusName")
        VALUES ($1)
        ON CONFLICT ("StatusName") DO NOTHING
        RETURNING "StatusNameId";
      `, [status]);

      if (statusNameResult.rows.length > 0) {
        statusNameId = statusNameResult.rows[0].StatusNameId;
      } else {
        // If the status already exists, fetch its ID
        const existingStatusResult = await pool.query('SELECT "StatusNameId" FROM "StatusName" WHERE "StatusName" = $1', [status]);
        statusNameId = existingStatusResult.rows[0].StatusNameId;
      }

      // Insert the status for the user
      await pool.query(`
        INSERT INTO "Status" ("StatusNameId", "StatusOrder", "UserId")
        VALUES ($1, $2, $3);
      `, [statusNameId, index + 1, userId]);
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ userId, email }, SECRET_KEY, { expiresIn: '1h' });

    // Return the token and userId in the response
    res.status(201).json({ userId, token, message: 'User signed up with Google successfully and default statuses initialized' });
  } catch (error) {
    console.error('Error during Google sign-up:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};








// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    
    const query = 'SELECT * FROM "Users" WHERE LOWER("Email") = LOWER($1)';
    const { rows } = await pool.query(query, [email]);


    if (rows.length === 0) {
      return res.status(404).json({ message: 'No account associated with this email.' });
    }

    const user = rows[0];

    // If the user has a FirebaseUid, redirect them to Google sign-in
    if (user.FirebaseUid) {
      return res.status(400).json({ message: 'This email is associated with a Google account. Please sign in with Google.' });
    }

    if (!user.IsVerified) {
      return res.status(401).json({ message: 'User Not Verified' });
    }


    const match = await bcrypt.compare(password, user.Password);
    if (!match) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.' });
    }

    const token = jwt.sign({ userId: user.UserId, email: user.Email.toLowerCase() }, SECRET_KEY);
    return res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user.UserId,
        email: user.Email,
        username: user.Username,
        IsMember: user.isMember,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};



// Google Login
export const googleLogin = async (req, res) => {
  const { firebaseUid, email } = req.body;

  if (!firebaseUid || !email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if user exists by Firebase UID
    const userExistsQuery = 'SELECT * FROM "Users" WHERE "FirebaseUid" = $1';
    const userExistsResult = await pool.query(userExistsQuery, [firebaseUid]);

    if (userExistsResult.rows.length > 0) {
      const user = userExistsResult.rows[0];
      const token = jwt.sign({ userId: user.UserId, email: user.Email }, SECRET_KEY);
      return res.status(200).json({
        token: token,
        user: {
          email: user.Email,
          username: user.Username,

        },
      });
    }

    return res.status(404).json({ message: 'User not found. Please sign up with Google first.' });
  } catch (error) {
    console.error('Error during Google login:', error);
    return res.status(500).json({ message: 'Server error' });
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
    const query = 'SELECT "Username", "Email", "PromotionalEmail", "ApplicationEmail", "FeedbackTrigger", "ColumnOrder", "IsMember" FROM "Users" WHERE "UserId" = $1';
    const { rows } = await pool.query(query, [userId]);

      if (rows.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }
    
      res.status(200).json({
        Username: rows[0].Username,
        Email: rows[0].Email,
        PromotionalEmail: rows[0].PromotionalEmail,  
        ApplicationEmail: rows[0].ApplicationEmail,
        FeedbackTrigger: rows[0].FeedbackTrigger,  // Include FeedbackTrigger in the response
        ColumnOrder: rows[0].ColumnOrder,
        IsMember: rows[0].IsMember
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
    // 1) Remove all files from S3 for this user (bulk folder deletion)
    await deleteAllObjectsForUser(userId);

    // 2) Remove bridging table references (FileApplications)
    await pool.query(`
      DELETE FROM "FileApplications"
      WHERE "fileId" IN (
        SELECT "fileId" FROM "Files" WHERE "userId" = $1
      )
    `, [userId]);

    // 3) Delete from "Files"
    await pool.query(`
      DELETE FROM "Files"
      WHERE "userId" = $1
    `, [userId]);

    // 4) Delete from "Application"
    await pool.query(`
      DELETE FROM "Application"
      WHERE "UserId" = $1
    `, [userId]);

    // 5) Delete from "Status"
    await pool.query(`
      DELETE FROM "Status"
      WHERE "UserId" = $1
    `, [userId]);

    // 6) Finally, delete the user record
    const result = await pool.query(`
      DELETE FROM "Users"
      WHERE "UserId" = $1
    `, [userId]);

    if (result.rowCount > 0) {
      return res.status(200).json({ message: 'User account and all files deleted successfully' });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user account:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};



export const getAllUsers = async () => {
  try {
    const result = await pool.query('SELECT "UserId", "Email", "ApplicationEmail" FROM "Users"');
    return result.rows;
  } 
  catch (error) {
    
    console.error('Error fetching users:', error);
    throw new Error('Database error');
  }
};



export const disableFeedbackTrigger = async (req, res) => {
  const { userId } = req.user;

  try {
    await pool.query('UPDATE "Users" SET "FeedbackTrigger" = FALSE WHERE "UserId" = $1', [userId]);
    res.status(200).json({ message: 'Feedback trigger disabled' });
  } catch (error) {
    console.error('Error updating feedback trigger:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Save/update column order
export const saveColumnOrder = async (req, res) => {
  const userId = req.user.userId;
  const { columnOrder } = req.body; 
  console.log(columnOrder);
  if (!Array.isArray(columnOrder)) {
    return res.status(400).json({ message: 'columnOrder must be an array' });
  }

  try {
    await pool.query(
      'UPDATE "Users" SET "ColumnOrder" = $1 WHERE "UserId" = $2',
      [columnOrder, userId]
    );

    res.status(200).json({ message: 'Column order saved successfully' });
  } catch (error) {
    console.error('Error saving column order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Gets the column Order
export const getColumnOrder = async (req, res) => {
  const userId = req.user.userId;

  try {
    const query = 'SELECT "ColumnOrder" FROM "Users" WHERE "UserId" = $1';
    const { rows } = await pool.query(query, [userId]);

      if (rows.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }
    
    console.log(rows);

      res.status(200).json({
        ColumnOrder: rows[0].ColumnOrder
    });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};



export const generateVerificationToken = async (userId, email) => {
  const verificationToken = crypto.randomBytes(64).toString('hex');
  const hashedToken = await bcrypt.hash(verificationToken, 10);
  const expirationTime = new Date(Date.now() + TOKEN_EXPIRATION_MINUTES * 60 * 1000);

  // Update user with token & expiry
  await pool.query(`
    UPDATE "Users"
    SET "VERIFICATION_TOKEN" = $1, "VERIFICATION_TKN_TIME" = $2
    WHERE "UserId" = $3
  `, [hashedToken, expirationTime, userId]);

  const frontendUrl = process.env.FRONTEND_URL;

  await sendVerificationTokenEmail(email, verificationToken ,frontendUrl);
};




// verify user
export const verifyUser = async (req, res) => {
  const { email, token } = req.body;
  const query = 'SELECT "VERIFICATION_TOKEN", "VERIFICATION_TKN_TIME" FROM "Users" WHERE "Email" = $1';
  const values = [email];

  try {
    const { rows } = await pool.query(query, values);

    if (rows.length === 1) {
      const { VERIFICATION_TOKEN,  VERIFICATION_TKN_TIME } = rows[0];

      // Validate token and check if it has expired
      const isMatch = await bcrypt.compare(token, VERIFICATION_TOKEN);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid token.' });
      }

      // (Optional) Check if the token has expired
      if (new Date() > new Date(VERIFICATION_TKN_TIME)) {
        return res.status(400).json({ message: 'Token has expired.' });
      }

      // Update the user's verification status
      const updateQuery = `
        UPDATE "Users"
        SET "IsVerified" = $1, "VERIFICATION_TOKEN" = NULL, "VERIFICATION_TKN_TIME" = NULL
        WHERE "Email" = $2
      `;
      await pool.query(updateQuery, [true, email]);

      res.status(200).json({ message: 'Account has been verified' });
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
};