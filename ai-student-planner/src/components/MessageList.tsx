import React from 'react';
import type { Message } from '../types';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div style={styles.container}>
      {messages.map((msg, index) => (
        <div
          key={msg._id || index}
          style={{
            ...styles.message,
            ...(msg.role === 'user' ? styles.userMessage : styles.assistantMessage),
          }}
        >
          <div style={styles.role}>
            {msg.role === 'user' ? '👤 You' : '🤖 AI Assistant'}
          </div>
          <div style={styles.content}>{msg.content}</div>
          {msg.timestamp && (
            <div style={styles.timestamp}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1rem',
    overflowY: 'auto',
    flex: 1,
  },
  message: {
    padding: '1rem',
    borderRadius: '8px',
    maxWidth: '70%',
  },
  userMessage: {
    backgroundColor: '#3742fa',
    color: '#fff',
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  assistantMessage: {
    backgroundColor: '#f1f2f6',
    color: '#2f3542',
    alignSelf: 'flex-start',
  },
  role: {
    fontSize: '0.85rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  content: {
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
  },
  timestamp: {
    fontSize: '0.75rem',
    opacity: 0.7,
    marginTop: '0.5rem',
  },
};

export default MessageList;