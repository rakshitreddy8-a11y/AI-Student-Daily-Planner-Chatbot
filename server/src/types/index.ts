export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CreateChatRequest {
  message: string;
}

export interface SendMessageRequest {
  chatId: string;
  message: string;
}

export interface CreateRoadmapRequest {
  type: 'exam' | 'placement';
  title: string;
  subject?: string;
}

export interface UpdateTopicRequest {
  topicIndex: number;
  subTopicIndex: number;
  completed: boolean;
}