import mongoose, { Document, Schema } from 'mongoose';

export interface ITopic {
  week: number;
  title: string;
  subtopics: string[];
  completedSubtopics?: string[];
}

export interface IRoadmap extends Document {
  userId: string;
  type: 'exam' | 'placement';
  title: string;
  subject: string;
  topics: ITopic[];
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

const topicSchema = new Schema<ITopic>({
  week: { type: Number, required: true },
  title: { type: String, required: true },
  subtopics: [{ type: String, required: true }],
  completedSubtopics: [{ type: String }],
});

const roadmapSchema = new Schema<IRoadmap>(
  {
    userId: { type: String, required: true },
    type: { type: String, enum: ['exam', 'placement'], required: true },
    title: { type: String, required: true },
    subject: { type: String, required: true },
    topics: [topicSchema],
    progress: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRoadmap>('Roadmap', roadmapSchema);