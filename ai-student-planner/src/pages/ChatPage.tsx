import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createChat, getAllChats, getChat, sendMessage } from '../services/api';
import { isAuthenticated } from '../services/auth';
import type { Chat } from '../types';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import Navbar from '../components/Navbar';

const ChatPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
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
    } catch (error) {
      console.error('Failed to load chats:', error);
    }
  };

  const handleCreateChat = async () => {
    const title = prompt('Enter chat title:');
    if (!title) return;

    setLoading(true);
    try {
      const newChat = await createChat(title);
      setChats([newChat, ...chats]);
      setSelectedChat(newChat);
    } catch (error) {
      alert('Failed to create chat');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = async (chatId: string) => {
    setLoading(true);
    try {
      const chat = await getChat(chatId);
      setSelectedChat(chat);
    } catch (error) {
      alert('Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedChat) return;

    setSending(true);
    try {
      await sendMessage(selectedChat._id, message);
      const updatedChat = await getChat(selectedChat._id);
      setSelectedChat(updatedChat);
    } catch (error) {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.sidebar}>
          <button onClick={handleCreateChat} disabled={loading} style={styles.newChatBtn}>
            ➕ New Chat
          </button>
          <div style={styles.chatList}>
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => handleSelectChat(chat._id)}
                style={{
                  ...styles.chatItem,
                  ...(selectedChat?._id === chat._id ? styles.chatItemActive : {}),
                }}
              >
                <div style={styles.chatTitle}>{chat.title}</div>
                <div style={styles.chatDate}>
                  {new Date(chat.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.chatArea}>
          {selectedChat ? (
            <>
              <div style={styles.chatHeader}>
                <h2>{selectedChat.title}</h2>
              </div>
              <MessageList messages={selectedChat.messages} />
              <MessageInput onSend={handleSendMessage} disabled={sending} />
            </>
          ) : (
            <div style={styles.emptyState}>
              <h2>💬 Welcome to AI Student Planner</h2>
              <p>Create a new chat or select an existing one to start</p>
            </div>
          )}
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
  },
  content: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#f8f9fa',
    borderRight: '1px solid #ddd',
    display: 'flex',
    flexDirection: 'column',
  },
  newChatBtn: {
    margin: '1rem',
    padding: '0.75rem',
    backgroundColor: '#3742fa',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  chatList: {
    flex: 1,
    overflowY: 'auto',
  },
  chatItem: {
    padding: '1rem',
    borderBottom: '1px solid #e1e8ed',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  chatItemActive: {
    backgroundColor: '#e3f2fd',
  },
  chatTitle: {
    fontWeight: 500,
    marginBottom: '0.25rem',
  },
  chatDate: {
    fontSize: '0.85rem',
    color: '#666',
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  chatHeader: {
    padding: '1rem',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#fff',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#666',
  },
};

export default ChatPage;