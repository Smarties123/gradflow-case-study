// applicationRoutes.js
import express from 'express';
import { 
  addJob, 
  getApplications, 
  updateApplication, // Import the new updateApplication function
  updateApplicationStatus, 
  updateFavoriteStatus, 
  deleteApplication,
  searchApplications 
} from '../controllers/applicationController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to add a job application
router.post('/addjob', authenticateToken, addJob);

// Route to fetch all job applications
router.get('/applications', authenticateToken, getApplications);

// // Route to update other application details
// router.put('/applications/:id', authenticateToken, updateApplication); // New route for updating general application details

// Route to update the status of an application (e.g., moving cards)
router.put('/applications/:id/status', authenticateToken, updateApplicationStatus);

// Route to mark/unmark an application as favorite
router.put('/applications/:id/favorite', authenticateToken, updateFavoriteStatus);

// Route to update other application details
router.put('/applications/:id', authenticateToken, updateApplication);

// Route to delete an application
router.delete('/applications/:id', authenticateToken, deleteApplication);


router.get('/applications/search', authenticateToken, searchApplications);


export default router;
