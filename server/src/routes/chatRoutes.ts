import express, { Router } from 'express';
import {
  createChat,
  sendMessage,
  getUserChats,
  getChatById,
  deleteChat,
} from '../controllers/chatController';
import { authMiddleware } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Apply authentication middleware to ALL routes
router.use(authMiddleware);

// Chat routes
// POST /api/chat - Create new chat with first message
router.post('/', createChat);

// POST /api/chat/message - Send message to existing chat
router.post('/message', sendMessage);

// GET /api/chat - Get all chats for logged-in user
router.get('/', getUserChats);

// GET /api/chat/:id - Get specific chat by ID
router.get('/:id', getChatById);

// DELETE /api/chat/:id - Delete a chat
router.delete('/:id', deleteChat);

export default router;