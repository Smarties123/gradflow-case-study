// userRoutes.js
import express from 'express';
import { signUp, googleSignUp, login, googleLogin, forgotPassword, resetPassword, getUserDetails, updateUserDetails, deleteUserAccount, checkUserExists, disableFeedbackTrigger} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register the routes
router.post('/signup', signUp);
router.post('/google-signup', googleSignUp);  // Add the new Google sign-up route
router.post('/login', login);
router.post('/google-login', googleLogin);  // New route for Google login
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', authenticateToken, getUserDetails);  
router.put('/profile', authenticateToken, updateUserDetails); 
router.delete('/profile', authenticateToken, deleteUserAccount);  // Add the DELETE route for deleting the user account
router.post('/disable-feedback', authenticateToken, disableFeedbackTrigger);
router.post('/check-exists', checkUserExists);  // New route to check if email or username already exists



export default router;
