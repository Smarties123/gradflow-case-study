// userRoutes.js
import express from 'express';
import { signUp, googleSignUp, login, googleLogin, forgotPassword, resetPassword, getUserDetails, updateUserDetails, deleteUserAccount, checkUserExists,verifyUser} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/signup', signUp);
router.post('/google-signup', googleSignUp);  
router.post('/login', login);
router.post('/google-login', googleLogin); 
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', authenticateToken, getUserDetails);  
router.put('/profile', authenticateToken, updateUserDetails); 
router.delete('/profile', authenticateToken, deleteUserAccount);  
router.post('/check-exists', checkUserExists);  
router.get('/confirm-signup/:token', verifyUser);


export default router;
