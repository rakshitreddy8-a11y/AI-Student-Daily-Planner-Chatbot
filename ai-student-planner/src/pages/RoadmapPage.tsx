import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateRoadmap, getAllRoadmaps, updateRoadmapProgress } from '../services/api';
import { isAuthenticated } from '../services/auth';
import type { Roadmap } from '../types';
import RoadmapView from '../components/RoadmapView';
import Navbar from '../components/Navbar';

const RoadmapPage: React.FC = () => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(false);
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

  const handleGenerateRoadmap = async () => {
    const type = prompt('Enter type (exam/placement):') as 'exam' | 'placement';
    if (!type || (type !== 'exam' && type !== 'placement')) {
      alert('Please enter either "exam" or "placement"');
      return;
    }

    const subject = prompt('Enter subject (optional):');

    setLoading(true);
    try {
      const newRoadmap = await generateRoadmap(type, subject || undefined);
      setRoadmaps([newRoadmap, ...roadmaps]);
      setSelectedRoadmap(newRoadmap);
      alert('Roadmap generated successfully!');
    } catch (error) {
      alert('Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProgress = async (
    topicIndex: number,
    subTopicIndex: number,
    completed: boolean
  ) => {
    if (!selectedRoadmap) return;

    try {
      const updated = await updateRoadmapProgress(
        selectedRoadmap._id,
        topicIndex,
        subTopicIndex,
        completed
      );
      setSelectedRoadmap(updated);
      setRoadmaps(roadmaps.map(r => r._id === updated._id ? updated : r));
    } catch (error) {
      alert('Failed to update progress');
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.sidebar}>
          <button onClick={handleGenerateRoadmap} disabled={loading} style={styles.generateBtn}>
            ✨ Generate Roadmap
          </button>
          <div style={styles.roadmapList}>
            {roadmaps.map((roadmap) => (
              <div
                key={roadmap._id}
                onClick={() => setSelectedRoadmap(roadmap)}
                style={{
                  ...styles.roadmapItem,
                  ...(selectedRoadmap?._id === roadmap._id ? styles.roadmapItemActive : {}),
                }}
              >
                <div style={styles.roadmapType}>
                  {roadmap.type === 'exam' ? '📝' : '💼'} {roadmap.type.toUpperCase()}
                </div>
                {roadmap.subject && (
                  <div style={styles.roadmapSubject}>{roadmap.subject}</div>
                )}
                <div style={styles.roadmapDate}>
                  {new Date(roadmap.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.roadmapArea}>
          {selectedRoadmap ? (
            <RoadmapView roadmap={selectedRoadmap} onToggleProgress={handleToggleProgress} />
          ) : (
            <div style={styles.emptyState}>
              <h2>🗺️ Study Roadmap Generator</h2>
              <p>Generate a personalized study roadmap for exam or placement preparation</p>
              <button onClick={handleGenerateRoadmap} style={styles.emptyStateBtn}>
                Generate Your First Roadmap
              </button>
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
  generateBtn: {
    margin: '1rem',
    padding: '0.75rem',
    backgroundColor: '#2ecc71',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  roadmapList: {
    flex: 1,
    overflowY: 'auto',
  },
  roadmapItem: {
    padding: '1rem',
    borderBottom: '1px solid #e1e8ed',
    cursor: 'pointer',
  },
  roadmapItemActive: {
    backgroundColor: '#e8f5e9',
  },
  roadmapType: {
    fontWeight: 500,
    marginBottom: '0.25rem',
  },
  roadmapSubject: {
    fontSize: '0.9rem',
    color: '#555',
    marginBottom: '0.25rem',
  },
  roadmapDate: {
    fontSize: '0.85rem',
    color: '#666',
  },
  roadmapArea: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: '#fff',
  },
  emptyState: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#666',
    textAlign: 'center',
  },
  emptyStateBtn: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#2ecc71',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

export default RoadmapPage;