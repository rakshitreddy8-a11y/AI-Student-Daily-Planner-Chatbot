import React from 'react';
import type { Roadmap } from '../types';

interface RoadmapViewProps {
  roadmap: Roadmap;
  onToggleProgress: (topicIndex: number, subTopicIndex: number, completed: boolean) => void;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ roadmap, onToggleProgress }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          {roadmap.type === 'exam' ? '📝' : '💼'} {roadmap.type.toUpperCase()} Roadmap
        </h1>
        {roadmap.subject && <h2 style={styles.subject}>{roadmap.subject}</h2>}
      </div>

      <div style={styles.topics}>
        {roadmap.topics.map((topic, topicIndex) => (
          <div key={topicIndex} style={styles.topic}>
            <h3 style={styles.topicName}>
              {topic.name}
              {topic.completed && <span style={styles.completedBadge}>✓ Completed</span>}
            </h3>
            
            <div style={styles.subTopics}>
              {topic.subTopics.map((subTopic, subTopicIndex) => (
                <div key={subTopicIndex} style={styles.subTopic}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={subTopic.completed}
                      onChange={(e) => onToggleProgress(topicIndex, subTopicIndex, e.target.checked)}
                      style={styles.checkbox}
                    />
                    <span style={{
                      ...styles.subTopicText,
                      ...(subTopic.completed ? styles.subTopicCompleted : {}),
                    }}>
                      {subTopic.name}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '2rem',
  },
  header: {
    marginBottom: '2rem',
    borderBottom: '2px solid #2ecc71',
    paddingBottom: '1rem',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  subject: {
    fontSize: '1.5rem',
    color: '#555',
  },
  topics: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  topic: {
    backgroundColor: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  topicName: {
    fontSize: '1.3rem',
    marginBottom: '1rem',
    color: '#2c3e50',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completedBadge: {
    fontSize: '0.9rem',
    backgroundColor: '#2ecc71',
    color: '#fff',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
  },
  subTopics: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  subTopic: {
    backgroundColor: '#fff',
    padding: '0.75rem',
    borderRadius: '4px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  checkbox: {
    marginRight: '0.75rem',
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  subTopicText: {
    fontSize: '1rem',
  },
  subTopicCompleted: {
    textDecoration: 'line-through',
    color: '#999',
  },
};

export default RoadmapView;