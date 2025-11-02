import { Response } from 'express';
import Roadmap from '../models/Roadmap';
import { generateRoadmap } from '../services/roadmapService';
import { AuthRequest } from '../middleware/authMiddleware';
import { CreateRoadmapRequest, UpdateTopicRequest } from '../types';

export const createRoadmap = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { type, title, subject }: CreateRoadmapRequest = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!type || !subject) {
      res.status(400).json({ message: 'Type and subject are required' });
      return;
    }

    console.log('✅ Creating roadmap:', { type, title, subject });

    const generatedRoadmap = await generateRoadmap(type, subject);

    const roadmap = new Roadmap({
      userId,
      type,
      title: title || generatedRoadmap.title,
      subject,
      topics: generatedRoadmap.topics || [],
      progress: 0,
    });

    await roadmap.save();
    console.log('✅ Roadmap created:', roadmap._id);
    res.status(201).json(roadmap);
  } catch (error: any) {
    console.error('❌ Create roadmap error:', error);
    res.status(500).json({ message: 'Failed to create roadmap', error: error.message });
  }
};

export const getUserRoadmaps = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const roadmaps = await Roadmap.find({ userId }).sort({ createdAt: -1 });
    console.log(`✅ Retrieved ${roadmaps.length} roadmaps`);
    res.json(roadmaps);
  } catch (error: any) {
    console.error('❌ Get roadmaps error:', error);
    res.status(500).json({ message: 'Failed to get roadmaps' });
  }
};

export const getRoadmapById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const roadmap = await Roadmap.findOne({ _id: id, userId });

    if (!roadmap) {
      res.status(404).json({ message: 'Roadmap not found' });
      return;
    }

    console.log('✅ Retrieved roadmap:', id);
    res.json(roadmap);
  } catch (error: any) {
    console.error('❌ Get roadmap error:', error);
    res.status(500).json({ message: 'Failed to get roadmap' });
  }
};

export const updateTopicProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { week, subtopic }: UpdateTopicRequest = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!week || !subtopic) {
      res.status(400).json({ message: 'Week and subtopic required' });
      return;
    }

    const roadmap = await Roadmap.findOne({ _id: id, userId });

    if (!roadmap) {
      res.status(404).json({ message: 'Roadmap not found' });
      return;
    }

    const weekTopic = roadmap.topics.find((t: any) => t.week === week);
    
    if (!weekTopic) {
      res.status(404).json({ message: 'Week not found' });
      return;
    }

    if (!weekTopic.completedSubtopics) {
      weekTopic.completedSubtopics = [];
    }

    const index = weekTopic.completedSubtopics.indexOf(subtopic);
    if (index > -1) {
      weekTopic.completedSubtopics.splice(index, 1);
    } else {
      weekTopic.completedSubtopics.push(subtopic);
    }

    const totalSubtopics = roadmap.topics.reduce(
      (sum: number, topic: any) => sum + (topic.subtopics?.length || 0),
      0
    );
    
    const completedSubtopics = roadmap.topics.reduce(
      (sum: number, topic: any) => sum + (topic.completedSubtopics?.length || 0),
      0
    );

    roadmap.progress = totalSubtopics > 0 
      ? Math.round((completedSubtopics / totalSubtopics) * 100)
      : 0;

    await roadmap.save();
    console.log('✅ Progress updated:', roadmap.progress);
    res.json(roadmap);
  } catch (error: any) {
    console.error('❌ Update progress error:', error);
    res.status(500).json({ message: 'Failed to update progress' });
  }
};

export const deleteRoadmap = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const roadmap = await Roadmap.findOneAndDelete({ _id: id, userId });

    if (!roadmap) {
      res.status(404).json({ message: 'Roadmap not found' });
      return;
    }

    console.log('✅ Roadmap deleted:', id);
    res.json({ message: 'Roadmap deleted successfully' });
  } catch (error: any) {
    console.error('❌ Delete roadmap error:', error);
    res.status(500).json({ message: 'Failed to delete roadmap' });
  }
};