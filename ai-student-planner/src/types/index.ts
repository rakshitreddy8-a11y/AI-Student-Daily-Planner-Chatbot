export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Message {
  _id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface Chat {
  _id: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SubTopic {
  name: string;
  completed: boolean;
}

export interface Topic {
  name: string;
  subTopics: SubTopic[];
  completed: boolean;
}

export interface Roadmap {
  _id: string;
  userId: string;
  type: 'exam' | 'placement';
  subject?: string;
  topics: Topic[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}