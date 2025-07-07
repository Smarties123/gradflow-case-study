import express from 'express';
import { getStatuses, updateStatusName, createStatus, deleteStatus, moveStatus } from '../controllers/statusController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
// import { deleteCard } from '../controllers/deleteCard.js';

const router = express.Router();

// Fetch all statuses for the authenticated user
router.get('/', authenticateToken, getStatuses);

// Update a status (column) name
router.put('//:id', authenticateToken, updateStatusName);

// Create a new status (column)
router.post('/', authenticateToken, createStatus);

// Delete a status (column)
router.delete('/:id', authenticateToken, deleteStatus);

// Route to move a status (change its order)
router.put('/:id/move', authenticateToken, moveStatus);

// router.post('/delete', deleteCard);



export default router;
