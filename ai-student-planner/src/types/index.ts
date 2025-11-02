export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Chat {
  _id: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapTopic {
  week: number;
  title: string;
  subtopics: string[];
  completedSubtopics?: string[];
}

export interface Roadmap {
  _id: string;
  userId: string;
  type: 'exam' | 'placement';
  title: string;
  subject?: string;
  topics: RoadmapTopic[];
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}