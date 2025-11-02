import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { createChat, getAllChats, sendMessage, deleteChat } from '../services/api';
import { isAuthenticated } from '../services/auth';
import type { Chat } from '../types';
import Navbar from '../components/Navbar';

const ChatPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadChats();
  }, [navigate]);

  const loadChats = async () => {
    try {
      const data = await getAllChats();
      setChats(data);
      if (data.length > 0) {
        setCurrentChat(data[0]);
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
    }
  };

  const handleNewChat = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      const newChat = await createChat(message);
      setChats([newChat, ...chats]);
      setCurrentChat(newChat);
      setMessage('');
    } catch (error) {
      console.error('Failed to create chat:', error);
      alert('Failed to create chat');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !currentChat) return;

    setIsLoading(true);
    try {
      const updatedChat = await sendMessage(currentChat._id, message);
      setCurrentChat(updatedChat);
      setChats(chats.map((c) => (c._id === updatedChat._id ? updatedChat : c)));
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    if (!window.confirm('Are you sure you want to delete this chat?')) {
      return;
    }

    try {
      await deleteChat(chatId);
      const updatedChats = chats.filter((c) => c._id !== chatId);
      setChats(updatedChats);

      if (currentChat?._id === chatId) {
        setCurrentChat(updatedChats[0] || null);
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
      alert('Failed to delete chat');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentChat) {
        handleSendMessage();
      } else {
        handleNewChat();
      }
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      
      <div style={styles.content}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <button
            onClick={() => {
              setCurrentChat(null);
              setMessage('');
            }}
            style={styles.newChatBtn}
          >
            + New Chat
          </button>

          <div style={styles.chatList}>
            {chats.length === 0 ? (
              <div style={styles.emptyList}>
                <p>No chats yet</p>
                <p style={styles.emptyListSub}>Start a new conversation!</p>
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => setCurrentChat(chat)}
                  style={{
                    ...styles.chatItem,
                    ...(currentChat?._id === chat._id ? styles.chatItemActive : {}),
                  }}
                >
                  <div style={styles.chatItemHeader}>
                    <div style={styles.chatTitle}>{chat.title}</div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(chat._id);
                      }}
                      style={styles.deleteBtn}
                      title="Delete chat"
                    >
                      🗑️
                    </button>
                  </div>
                  <div style={styles.chatPreview}>
                    {chat.messages.length} messages
                  </div>
                  <div style={styles.chatDate}>
                    {new Date(chat.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div style={styles.chatArea}>
          {currentChat ? (
            <>
              <div style={styles.chatHeader}>
                <h2 style={styles.chatHeaderTitle}>{currentChat.title}</h2>
                <span style={styles.messageCount}>
                  {currentChat.messages.length} messages
                </span>
              </div>

              <div style={styles.messages}>
                {currentChat.messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.message,
                      ...(msg.role === 'user' ? styles.userMessage : styles.assistantMessage),
                    }}
                  >
                    <div style={styles.messageContent}>
                      {msg.role === 'assistant' ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>
                    <div style={styles.messageTime}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div style={{ ...styles.message, ...styles.assistantMessage }}>
                    <div style={styles.messageContent}>
                      <p>🤔 Thinking...</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>💬</div>
              <h2 style={styles.emptyTitle}>AI Study Assistant</h2>
              <p style={styles.emptyText}>
                Ask me anything about study roadmaps, exam preparation, or placement guidance!
              </p>
              <div style={styles.examplesBox}>
                <p style={styles.examplesTitle}>💡 Try asking:</p>
                <div style={styles.exampleTags}>
                  <span style={styles.exampleTag}>"Google interview preparation roadmap"</span>
                  <span style={styles.exampleTag}>"CCNA certification study plan"</span>
                  <span style={styles.exampleTag}>"Python learning roadmap"</span>
                </div>
              </div>
            </div>
          )}

          <div style={styles.inputArea}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              style={styles.input}
            />
            <button
              onClick={currentChat ? handleSendMessage : handleNewChat}
              disabled={isLoading || !message.trim()}
              style={styles.sendBtn}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
  },
  content: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  sidebar: {
    width: '300px',
    backgroundColor: '#ffffff',
    borderRight: '2px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
  },
  newChatBtn: {
    margin: '1rem',
    padding: '0.875rem',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },
  chatList: {
    flex: 1,
    overflowY: 'auto',
    padding: '0.5rem',
  },
  emptyList: {
    padding: '2rem 1rem',
    textAlign: 'center',
    color: '#9ca3af',
  },
  emptyListSub: {
    fontSize: '0.875rem',
    marginTop: '0.5rem',
  },
  chatItem: {
    padding: '1rem',
    margin: '0.5rem',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: '#f9fafb',
  },
  chatItemActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)',
  },
  chatItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  chatTitle: {
    fontWeight: '600',
    fontSize: '0.9rem',
    color: '#111827',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    opacity: 0.6,
    transition: 'opacity 0.2s',
  },
  chatPreview: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginBottom: '0.25rem',
  },
  chatDate: {
    fontSize: '0.75rem',
    color: '#9ca3af',
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
  },
  chatHeader: {
    padding: '1rem 1.5rem',
    borderBottom: '2px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  chatHeaderTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  messageCount: {
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  message: {
    maxWidth: '70%',
    padding: '1rem',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3b82f6',
    color: '#fff',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3f4f6',
    color: '#111827',
  },
  messageContent: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
  },
  messageTime: {
    fontSize: '0.75rem',
    marginTop: '0.5rem',
    opacity: 0.7,
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  emptyTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '0.5rem',
  },
  emptyText: {
    fontSize: '1.125rem',
    color: '#6b7280',
    marginBottom: '2rem',
    maxWidth: '500px',
    lineHeight: '1.6',
  },
  examplesBox: {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    maxWidth: '600px',
  },
  examplesTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '1rem',
  },
  exampleTags: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  exampleTag: {
    padding: '0.75rem',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '0.875rem',
    color: '#374151',
  },
  inputArea: {
    padding: '1rem 1.5rem',
    borderTop: '2px solid #e5e7eb',
    display: 'flex',
    gap: '1rem',
    backgroundColor: '#f9fafb',
  },
  input: {
    flex: 1,
    padding: '0.875rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
  },
  sendBtn: {
    padding: '0.875rem 2rem',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },
};

export default ChatPage;