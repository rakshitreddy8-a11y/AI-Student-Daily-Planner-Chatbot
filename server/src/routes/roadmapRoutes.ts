import express from 'express';
import {
  createRoadmap,
  getUserRoadmaps,
  getRoadmapById,
  updateTopicProgress,
  deleteRoadmap,
} from '../controllers/roadmapController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// All roadmap routes require authentication
router.use(authMiddleware);

router.post('/create', createRoadmap);
router.get('/', getUserRoadmaps);
router.get('/:id', getRoadmapById);
router.put('/:id/progress', updateTopicProgress);
router.delete('/:id', deleteRoadmap);

export default router;