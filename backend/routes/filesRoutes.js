import express from 'express';
import {
  getFileTypes,
  getUserFiles,
  createFile,
  updateFile,
  deleteFile,
  getFileById
} from '../controllers/filesController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all file types (CV, Cover Letter, etc.)
router.get('/types', authenticateToken, getFileTypes);

// Get all files for logged-in user
router.get('/', authenticateToken, getUserFiles);

// Get a single file by ID (optional)
router.get('/:id', authenticateToken, getFileById);

// Create (insert) a new file record
router.post('/', authenticateToken, createFile);

// Update an existing file record
router.put('/:id', authenticateToken, updateFile);

// Delete a file record
router.delete('/:id', authenticateToken, deleteFile);

export default router;
