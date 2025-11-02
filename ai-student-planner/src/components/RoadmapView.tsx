import React from 'react';
import type { Roadmap } from '../types';  // ✅ Import shared type

// ❌ DELETE these local interfaces:
// interface SubTopicItem { ... }
// interface TopicItem { ... }
// interface RoadmapData { ... }

// ✅ Use the shared Roadmap type
interface RoadmapViewProps {
  roadmap: Roadmap;  // ✅ Changed from RoadmapData to Roadmap
  onToggleProgress: (week: number, subtopic: string) => void;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ roadmap, onToggleProgress }) => {
  // ✅ Calculate progress
  const totalSubtopics = roadmap.topics.reduce(
    (sum, topic) => sum + topic.subtopics.length,
    0
  );
  
  const completedCount = roadmap.topics.reduce(
    (sum, topic) => sum + (topic.completedSubtopics?.length || 0),
    0
  );

  const progressPercentage = totalSubtopics > 0 
    ? Math.round((completedCount / totalSubtopics) * 100) 
    : 0;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          {roadmap.type === 'exam' ? '📝' : '💼'} {roadmap.title}
        </h1>
        {roadmap.subject && <h2 style={styles.subject}>{roadmap.subject}</h2>}
        
        {/* ✅ Progress Bar */}
        <div style={styles.progressContainer}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>Overall Progress</span>
            <span style={styles.progressPercentage}>{progressPercentage}%</span>
          </div>
          <div style={styles.progressBarBg}>
            <div 
              style={{
                ...styles.progressBarFill,
                width: `${progressPercentage}%`,
              }}
            />
          </div>
          <p style={styles.progressStats}>
            {completedCount} of {totalSubtopics} topics completed
          </p>
        </div>

        <p style={styles.createdDate}>
          Created: {new Date(roadmap.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Topics */}
      <div style={styles.topics}>
        {roadmap.topics.map((topic, topicIndex) => {
          const topicCompleted = topic.subtopics.length > 0 && 
            topic.subtopics.every(sub => topic.completedSubtopics?.includes(sub));
          
          const topicProgress = topic.subtopics.length > 0
            ? Math.round(((topic.completedSubtopics?.length || 0) / topic.subtopics.length) * 100)
            : 0;

          return (
            <div key={topicIndex} style={styles.topic}>
              {/* ✅ Week Badge + Title */}
              <div style={styles.topicHeader}>
                <div style={styles.weekBadge}>Week {topic.week}</div>
                <h3 style={styles.topicName}>
                  {topic.title}
                  {topicCompleted && (
                    <span style={styles.completedBadge}>✓ Completed</span>
                  )}
                </h3>
              </div>

              {/* ✅ Topic Progress */}
              <div style={styles.topicProgressBar}>
                <div 
                  style={{
                    ...styles.topicProgressFill,
                    width: `${topicProgress}%`,
                  }}
                />
              </div>
              <p style={styles.topicProgressText}>
                {topic.completedSubtopics?.length || 0} / {topic.subtopics.length} completed
              </p>

              {/* Subtopics */}
              <div style={styles.subTopics}>
                {topic.subtopics.map((subtopic, subIndex) => {
                  const isCompleted = topic.completedSubtopics?.includes(subtopic);
                  
                  return (
                    <div key={subIndex} style={styles.subTopic}>
                      <label style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={isCompleted || false}
                          onChange={() => onToggleProgress(topic.week, subtopic)}
                          style={styles.checkbox}
                        />
                        <span
                          style={{
                            ...styles.subTopicText,
                            ...(isCompleted ? styles.subTopicCompleted : {}),
                          }}
                        >
                          {subtopic}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '2rem',
    borderBottom: '2px solid #2ecc71',
    paddingBottom: '1rem',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
    color: '#2c3e50',
    fontWeight: '700',
  },
  subject: {
    fontSize: '1.5rem',
    color: '#555',
    marginTop: '0.5rem',
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: '1.5rem',
    marginBottom: '1rem',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  progressLabel: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
  },
  progressPercentage: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2ecc71',
  },
  progressBarBg: {
    width: '100%',
    height: '20px',
    backgroundColor: '#e5e7eb',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2ecc71',
    transition: 'width 0.3s ease',
  },
  progressStats: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '0.5rem',
  },
  createdDate: {
    fontSize: '0.9rem',
    color: '#777',
    marginTop: '0.5rem',
  },
  topics: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  topic: {
    backgroundColor: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
  },
  topicHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  weekBadge: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '0.375rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  topicName: {
    flex: 1,
    fontSize: '1.25rem',
    margin: 0,
    color: '#1f2937',
    fontWeight: '600',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completedBadge: {
    fontSize: '0.875rem',
    backgroundColor: '#10b981',
    color: '#fff',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontWeight: '500',
  },
  topicProgressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '0.5rem',
  },
  topicProgressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    transition: 'width 0.3s ease',
  },
  topicProgressText: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '1rem',
  },
  subTopics: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  subTopic: {
    backgroundColor: '#fff',
    padding: '0.875rem',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    transition: 'all 0.2s',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none' as const,
  },
  checkbox: {
    marginRight: '0.75rem',
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    accentColor: '#10b981',
  },
  subTopicText: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#374151',
  },
  subTopicCompleted: {
    textDecoration: 'line-through',
    color: '#9ca3af',
  },
};

export default RoadmapView;