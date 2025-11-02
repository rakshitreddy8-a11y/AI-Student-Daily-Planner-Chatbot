import express from 'express';
import { signup, login, getProfile } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', signup);   // ✅ Changed from /signup to /register
router.post('/login', login);

// Protected route
router.get('/profile', authMiddleware, getProfile);

export default router;