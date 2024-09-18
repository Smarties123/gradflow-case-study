import express from 'express';
import { getStatuses, updateStatusName, createStatus, deleteStatus, moveStatus } from '../controllers/statusController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Fetch all statuses for the authenticated user
router.get('/status', authenticateToken, getStatuses);

// Update a status (column) name
router.put('/status/:id', authenticateToken, updateStatusName);

// Create a new status (column)
router.post('/status', authenticateToken, createStatus);

// Delete a status (column)
router.delete('/status/:id', authenticateToken, deleteStatus);

// Route to move a status (change its order)
router.put('/status/:id/move', authenticateToken, moveStatus);

export default router;
