// userRoutes.js
import express from 'express';
import { signUp, login, forgotPassword, resetPassword} from '../controllers/userController.js';

const router = express.Router();

// Register the routes
router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
