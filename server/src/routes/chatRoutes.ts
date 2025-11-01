import express from 'express';
import {
  createChat,
  sendMessage,
  getUserChats,
  getChatById,
  deleteChat,
} from '../controllers/chatController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// All chat routes require authentication
router.use(authMiddleware);

router.post('/create', createChat);
router.post('/message', sendMessage);
router.get('/', getUserChats);
router.get('/:id', getChatById);
router.delete('/:id', deleteChat);

export default router;