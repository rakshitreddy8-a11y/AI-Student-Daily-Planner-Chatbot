import axios from 'axios';
import type { Chat, Roadmap, Message } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createChat = async (title: string): Promise<Chat> => {
  const response = await api.post('/chat/create', { title });
  return response.data;
};

export const getAllChats = async (): Promise<Chat[]> => {
  const response = await api.get('/chat');
  return response.data;
};

export const getChat = async (chatId: string): Promise<Chat> => {
  const response = await api.get(`/chat/${chatId}`);
  return response.data;
};

export const sendMessage = async (
  chatId: string,
  message: string
): Promise<Message> => {
  const response = await api.post(`/chat/${chatId}/message`, { message });
  return response.data;
};

export const generateRoadmap = async (
  type: 'exam' | 'placement',
  subject?: string
): Promise<Roadmap> => {
  const response = await api.post('/roadmap/generate', { type, subject });
  return response.data;
};

export const getAllRoadmaps = async (): Promise<Roadmap[]> => {
  const response = await api.get('/roadmap');
  return response.data;
};

export const updateRoadmapProgress = async (
  roadmapId: string,
  topicIndex: number,
  subTopicIndex: number,
  completed: boolean
): Promise<Roadmap> => {
  const response = await api.put(`/roadmap/${roadmapId}/progress`, {
    topicIndex,
    subTopicIndex,
    completed,
  });
  return response.data;
};

export default api;