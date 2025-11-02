import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateRoadmap, getAllRoadmaps } from '../services/api';
import { isAuthenticated } from '../services/auth';
import type { Roadmap } from '../types';
import RoadmapView from '../components/RoadmapView';
import Navbar from '../components/Navbar';

const RoadmapPage: React.FC = () => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'exam' as 'exam' | 'placement',
    subject: '',
    title: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadRoadmaps();
  }, [navigate]);

  const loadRoadmaps = async () => {
    try {
      const data = await getAllRoadmaps();
      setRoadmaps(data);
      if (data.length > 0) {
        setSelectedRoadmap(data[0]);
      }
    } catch (error) {
      console.error('Failed to load roadmaps:', error);
    }
  };

  const handleGenerateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim()) {
      alert('Please enter a subject');
      return;
    }

    setLoading(true);
    try {
      const newRoadmap = await generateRoadmap(
        formData.type,
        formData.subject,
        formData.title || undefined
      );
      setRoadmaps([newRoadmap, ...roadmaps]);
      setSelectedRoadmap(newRoadmap);
      setShowForm(false);
      setFormData({ type: 'exam', subject: '', title: '' });
      alert('Roadmap generated successfully!');
    } catch (error: any) {
      console.error('Failed to generate roadmap:', error);
      alert(error.response?.data?.message || 'Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX #1: Updated to match RoadmapView's expected signature
  const handleToggleProgress = async (week: number, subtopic: string) => {
    if (!selectedRoadmap) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/roadmap/${selectedRoadmap._id}/progress`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ week, subtopic }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      const updated = await response.json();
      setSelectedRoadmap(updated);
      setRoadmaps(roadmaps.map((r) => (r._id === updated._id ? updated : r)));
    } catch (error) {
      console.error('Failed to update progress:', error);
      alert('Failed to update progress');
    }
  };

  const handleDeleteRoadmap = async (roadmapId: string) => {
    if (!window.confirm('Are you sure you want to delete this roadmap?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/roadmap/${roadmapId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedRoadmaps = roadmaps.filter((r) => r._id !== roadmapId);
      setRoadmaps(updatedRoadmaps);

      if (selectedRoadmap?._id === roadmapId) {
        setSelectedRoadmap(updatedRoadmaps[0] || null);
      }

      alert('Roadmap deleted successfully');
    } catch (error) {
      console.error('Failed to delete roadmap:', error);
      alert('Failed to delete roadmap');
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <button
            onClick={() => setShowForm(!showForm)}
            disabled={loading}
            style={styles.generateBtn}
          >
            {showForm ? '❌ Cancel' : '✨ Generate Roadmap'}
          </button>

          {/* ✅ FIX #2: Proper form for roadmap generation */}
          {showForm && (
            <form onSubmit={handleGenerateRoadmap} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Type:</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as 'exam' | 'placement' })
                  }
                  style={styles.select}
                >
                  <option value="exam">📝 Exam Preparation</option>
                  <option value="placement">💼 Placement Preparation</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Subject/Company: *</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., CCNA, Google, Python"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Custom Title (optional):</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., My Google Interview Prep"
                  style={styles.input}
                />
              </div>

              <button type="submit" disabled={loading} style={styles.submitBtn}>
                {loading ? '⏳ Generating...' : '🚀 Generate'}
              </button>
            </form>
          )}

          <div style={styles.roadmapList}>
            {roadmaps.length === 0 ? (
              <div style={styles.emptyList}>
                <p>No roadmaps yet</p>
                <p style={styles.emptyListSub}>Generate your first roadmap!</p>
              </div>
            ) : (
              roadmaps.map((roadmap) => (
                <div
                  key={roadmap._id}
                  onClick={() => setSelectedRoadmap(roadmap)}
                  style={{
                    ...styles.roadmapItem,
                    ...(selectedRoadmap?._id === roadmap._id ? styles.roadmapItemActive : {}),
                  }}
                >
                  <div style={styles.roadmapItemHeader}>
                    <div style={styles.roadmapType}>
                      {roadmap.type === 'exam' ? '📝' : '💼'} {roadmap.type.toUpperCase()}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRoadmap(roadmap._id);
                      }}
                      style={styles.deleteBtn}
                      title="Delete roadmap"
                    >
                      🗑️
                    </button>
                  </div>
                  <div style={styles.roadmapTitle}>{roadmap.title}</div>
                  {roadmap.subject && (
                    <div style={styles.roadmapSubject}>{roadmap.subject}</div>
                  )}
                  <div style={styles.roadmapProgress}>
                    Progress: {roadmap.progress || 0}%
                  </div>
                  <div style={styles.roadmapDate}>
                    {new Date(roadmap.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Area */}
        <div style={styles.roadmapArea}>
          {selectedRoadmap ? (
            <RoadmapView roadmap={selectedRoadmap} onToggleProgress={handleToggleProgress} />
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🗺️</div>
              <h2 style={styles.emptyTitle}>Study Roadmap Generator</h2>
              <p style={styles.emptyText}>
                Generate a personalized study roadmap for exam or placement preparation
              </p>
              <button
                onClick={() => setShowForm(true)}
                style={styles.emptyStateBtn}
              >
                Generate Your First Roadmap
              </button>
              <div style={styles.examplesBox}>
                <p style={styles.examplesTitle}>💡 Try these subjects:</p>
                <div style={styles.exampleTags}>
                  <span style={styles.exampleTag}>CCNA</span>
                  <span style={styles.exampleTag}>Google Interview</span>
                  <span style={styles.exampleTag}>Python Programming</span>
                  <span style={styles.exampleTag}>AWS Certification</span>
                  <span style={styles.exampleTag}>TCS Placement</span>
                </div>
              </div>
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
    backgroundColor: '#f5f5f5',
  },
  content: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  sidebar: {
    width: '320px',
    backgroundColor: '#ffffff',
    borderRight: '2px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
  },
  generateBtn: {
    margin: '1rem',
    padding: '0.875rem',
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },
  form: {
    padding: '0 1rem 1rem 1rem',
    borderBottom: '2px solid #e5e7eb',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
  },
  select: {
    width: '100%',
    padding: '0.625rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    backgroundColor: '#fff',
  },
  input: {
    width: '100%',
    padding: '0.625rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },
  roadmapList: {
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
  roadmapItem: {
    padding: '1rem',
    margin: '0.5rem',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: '#f9fafb',
  },
  roadmapItemActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)',
  },
  roadmapItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  roadmapType: {
    fontWeight: '600',
    fontSize: '0.75rem',
    color: '#374151',
    textTransform: 'uppercase',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    opacity: 0.6,
    transition: 'opacity 0.2s',
  },
  roadmapTitle: {
    fontWeight: '600',
    fontSize: '0.9rem',
    color: '#111827',
    marginBottom: '0.375rem',
  },
  roadmapSubject: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '0.375rem',
  },
  roadmapProgress: {
    fontSize: '0.75rem',
    color: '#10b981',
    fontWeight: '600',
    marginBottom: '0.375rem',
  },
  roadmapDate: {
    fontSize: '0.75rem',
    color: '#9ca3af',
  },
  roadmapArea: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: '#ffffff',
  },
  emptyState: {
    height: '100%',
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
  emptyStateBtn: {
    padding: '1rem 2rem',
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },
  examplesBox: {
    marginTop: '3rem',
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
    flexWrap: 'wrap',
    gap: '0.5rem',
    justifyContent: 'center',
  },
  exampleTag: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '20px',
    fontSize: '0.875rem',
    color: '#374151',
  },
};

export default RoadmapPage;