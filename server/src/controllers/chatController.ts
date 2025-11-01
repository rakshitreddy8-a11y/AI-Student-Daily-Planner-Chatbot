import { Response } from 'express';
import Chat from '../models/Chat';
import { getChatResponse } from '../services/chatgptService';
import { AuthRequest } from '../middleware/authMiddleware';
import { CreateChatRequest, SendMessageRequest } from '../types';

export const createChat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { message }: CreateChatRequest = req.body;

    const aiResponse = await getChatResponse([
      { role: 'user', content: message },
    ]);

    const chat = new Chat({
      userId,
      title: message.substring(0, 50) + '...',
      messages: [
        { role: 'user', content: message, timestamp: new Date() },
        { role: 'assistant', content: aiResponse, timestamp: new Date() },
      ],
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ message: 'Failed to create chat' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { chatId, message }: SendMessageRequest = req.body;
    const userId = req.userId;

    const chat = await Chat.findOne({ _id: chatId, userId });

    if (!chat) {
      res.status(404).json({ message: 'Chat not found' });
      return;
    }

    chat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    const conversationHistory = chat.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const aiResponse = await getChatResponse(conversationHistory);

    chat.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
    });

    chat.updatedAt = new Date();
    await chat.save();

    res.json(chat);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

export const getUserChats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    console.error('Get user chats error:', error);
    res.status(500).json({ message: 'Failed to get chats' });
  }
};

export const getChatById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const chat = await Chat.findOne({ _id: id, userId });

    if (!chat) {
      res.status(404).json({ message: 'Chat not found' });
      return;
    }

    res.json(chat);
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ message: 'Failed to get chat' });
  }
};

export const deleteChat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const chat = await Chat.findOneAndDelete({ _id: id, userId });

    if (!chat) {
      res.status(404).json({ message: 'Chat not found' });
      return;
    }

    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ message: 'Failed to delete chat' });
  }
};