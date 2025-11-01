import mongoose, { Document, Schema } from 'mongoose';

export interface ISubTopic {
  name: string;
  completed: boolean;
}

export interface ITopic {
  name: string;
  subTopics: ISubTopic[];
  completed: boolean;
}

export interface IRoadmap extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'exam' | 'placement';
  title: string;
  topics: ITopic[];
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

const subTopicSchema = new Schema<ISubTopic>({
  name: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const topicSchema = new Schema<ITopic>({
  name: {
    type: String,
    required: true,
  },
  subTopics: [subTopicSchema],
  completed: {
    type: Boolean,
    default: false,
  },
});

const roadmapSchema = new Schema<IRoadmap>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['exam', 'placement'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  topics: [topicSchema],
  progress: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IRoadmap>('Roadmap', roadmapSchema);