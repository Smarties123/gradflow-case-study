// applicationRoutes.js
import express from 'express';
import { 
  addJob, 
  getApplications, 
  updateApplicationStatus, 
  updateFavoriteStatus, 
  deleteApplication 
} from '../controllers/applicationController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to add a job application
router.post('/addjob', authenticateToken, addJob);

// Route to fetch all job applications
router.get('/applications', authenticateToken, getApplications);

// Route to update the status of an application (e.g., moving cards)
router.put('/applications/:id', authenticateToken, updateApplicationStatus);

// Route to mark/unmark an application as favorite
router.put('/applications/:id/favorite', authenticateToken, updateFavoriteStatus);

// Route to delete an application
router.delete('/applications/:id', authenticateToken, deleteApplication);

export default router;
