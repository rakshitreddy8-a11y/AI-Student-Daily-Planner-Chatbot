import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, isAuthenticated } from '../services/auth';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // Get user from localStorage if authenticated
    if (isAuthenticated()) {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>
          📚 AI Student Planner
        </Link>
        
        <div style={styles.menu}>
          {user ? (
            <>
              <Link to="/chat" style={styles.link}>💬 Chat</Link>
              <Link to="/roadmap" style={styles.link}>🗺️ Roadmap</Link>
              <span style={styles.username}>👤 {user.name}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.link}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    backgroundColor: '#2c3e50',
    padding: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  menu: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  link: {
    color: '#ecf0f1',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  username: {
    color: '#ecf0f1',
    fontWeight: '600',
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontWeight: '600',
  },
};

export default Navbar;