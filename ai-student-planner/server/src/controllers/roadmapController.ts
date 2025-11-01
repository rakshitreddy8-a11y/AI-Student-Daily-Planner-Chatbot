import { Response } from 'express';
import Roadmap from '../models/Roadmap';
import { generateRoadmap } from '../services/chatgptService';
import { AuthRequest } from '../middleware/authMiddleware';
import { CreateRoadmapRequest, UpdateTopicRequest } from '../types';

export const createRoadmap = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { type, title, subject }: CreateRoadmapRequest = req.body;

    const generatedRoadmap = await generateRoadmap(type, subject);

    const roadmap = new Roadmap({
      userId,
      type,
      title,
      topics: generatedRoadmap.topics || [],
      progress: 0,
    });

    await roadmap.save();
    res.status(201).json(roadmap);
  } catch (error) {
    console.error('Create roadmap error:', error);
    res.status(500).json({ message: 'Failed to create roadmap' });
  }
};

export const getUserRoadmaps = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const roadmaps = await Roadmap.find({ userId }).sort({ createdAt: -1 });
    res.json(roadmaps);
  } catch (error) {
    console.error('Get roadmaps error:', error);
    res.status(500).json({ message: 'Failed to get roadmaps' });
  }
};

export const getRoadmapById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const roadmap = await Roadmap.findOne({ _id: id, userId });

    if (!roadmap) {
      res.status(404).json({ message: 'Roadmap not found' });
      return;
    }

    res.json(roadmap);
  } catch (error) {
    console.error('Get roadmap error:', error);
    res.status(500).json({ message: 'Failed to get roadmap' });
  }
};

export const updateTopicProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { topicIndex, subTopicIndex, completed }: UpdateTopicRequest = req.body;

    const roadmap = await Roadmap.findOne({ _id: id, userId });

    if (!roadmap) {
      res.status(404).json({ message: 'Roadmap not found' });
      return;
    }

    if (roadmap.topics[topicIndex]?.subTopics[subTopicIndex]) {
      roadmap.topics[topicIndex].subTopics[subTopicIndex].completed = completed;

      const allSubTopicsCompleted = roadmap.topics[topicIndex].subTopics.every(
        (st) => st.completed
      );
      roadmap.topics[topicIndex].completed = allSubTopicsCompleted;

      let totalSubTopics = 0;
      let completedSubTopics = 0;

      roadmap.topics.forEach((topic) => {
        totalSubTopics += topic.subTopics.length;
        completedSubTopics += topic.subTopics.filter((st) => st.completed).length;
      });

      roadmap.progress = totalSubTopics > 0
        ? Math.round((completedSubTopics / totalSubTopics) * 100)
        : 0;

      roadmap.updatedAt = new Date();
      await roadmap.save();

      res.json(roadmap);
    } else {
      res.status(400).json({ message: 'Invalid topic or subtopic index' });
    }
  } catch (error) {
    console.error('Update topic progress error:', error);
    res.status(500).json({ message: 'Failed to update progress' });
  }
};

export const deleteRoadmap = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const roadmap = await Roadmap.findOneAndDelete({ _id: id, userId });

    if (!roadmap) {
      res.status(404).json({ message: 'Roadmap not found' });
      return;
    }

    res.json({ message: 'Roadmap deleted successfully' });
  } catch (error) {
    console.error('Delete roadmap error:', error);
    res.status(500).json({ message: 'Failed to delete roadmap' });
  }
};