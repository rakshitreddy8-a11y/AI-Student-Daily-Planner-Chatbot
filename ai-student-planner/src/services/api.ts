import axios from 'axios';
import type { Roadmap, Chat } from '../types';

const API_URL = 'http://localhost:5000/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

// ============================================
// AUTH APIS
// ============================================

export const register = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    name,
    email,
    password,
  });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  return response.data;
};

// ============================================
// CHAT APIS
// ============================================

export const createChat = async (message: string): Promise<Chat> => {
  const response = await axios.post(
    `${API_URL}/chat`,
    { message },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const getAllChats = async (): Promise<Chat[]> => {
  const response = await axios.get(`${API_URL}/chat`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const sendMessage = async (chatId: string, message: string): Promise<Chat> => {
  const response = await axios.post(
    `${API_URL}/chat/message`,
    { chatId, message },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const deleteChat = async (chatId: string): Promise<void> => {
  await axios.delete(`${API_URL}/chat/${chatId}`, {
    headers: getAuthHeaders(),
  });
};

// ============================================
// ROADMAP APIS
// ============================================

export const generateRoadmap = async (
  type: 'exam' | 'placement',
  subject: string,
  title?: string
): Promise<Roadmap> => {
  const response = await axios.post(
    `${API_URL}/roadmap/generate`,
    { type, subject, title },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const getAllRoadmaps = async (): Promise<Roadmap[]> => {
  const response = await axios.get(`${API_URL}/roadmap`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getRoadmapById = async (id: string): Promise<Roadmap> => {
  const response = await axios.get(`${API_URL}/roadmap/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateRoadmapProgress = async (
  roadmapId: string,
  week: number,
  subtopic: string
): Promise<Roadmap> => {
  const response = await axios.put(
    `${API_URL}/roadmap/${roadmapId}/progress`,
    { week, subtopic },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const deleteRoadmap = async (roadmapId: string): Promise<void> => {
  await axios.delete(`${API_URL}/roadmap/${roadmapId}`, {
    headers: getAuthHeaders(),
  });
};