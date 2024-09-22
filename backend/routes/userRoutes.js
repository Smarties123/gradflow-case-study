// userRoutes.js
import express from 'express';
import { signUp, login, forgotPassword, resetPassword, getUserDetails, updateUserDetails, deleteUserAccount } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register the routes
router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', authenticateToken, getUserDetails);  
router.put('/profile', authenticateToken, updateUserDetails); 
router.delete('/profile', authenticateToken, deleteUserAccount);  // Add the DELETE route for deleting the user account

export default router;
