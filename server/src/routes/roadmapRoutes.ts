import express, { Router } from 'express';
import {
  createRoadmap,
  getUserRoadmaps,
  getRoadmapById,
  updateTopicProgress,
  deleteRoadmap,
} from '../controllers/roadmapController';
import { authMiddleware } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Roadmap routes
// POST /api/roadmap/generate - Create new roadmap
router.post('/generate', createRoadmap);

// GET /api/roadmap - Get all roadmaps for user
router.get('/', getUserRoadmaps);

// GET /api/roadmap/:id - Get specific roadmap
router.get('/:id', getRoadmapById);

// PUT /api/roadmap/:id/progress - Update topic progress
router.put('/:id/progress', updateTopicProgress);

// DELETE /api/roadmap/:id - Delete roadmap
router.delete('/:id', deleteRoadmap);

export default router;