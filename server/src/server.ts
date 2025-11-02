import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import roadmapRoutes from './routes/roadmapRoutes';

// Initialize express app
const app: Application = express();

// Middleware - MUST be before routes
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware - Log all incoming requests
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`📥 ${new Date().toLocaleTimeString()} - ${req.method} ${req.path}`);
  next();
});

// Connect to MongoDB
connectDB();

// Health check route - BEFORE other routes
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'AI Student Daily Planner API is running',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      auth: '/api/auth',
      chat: '/api/chat',
      roadmap: '/api/roadmap'
    }
  });
});

// API Routes - Order matters!
console.log('📝 Registering routes...');
app.use('/api/auth', authRoutes);
console.log('✅ Auth routes registered at /api/auth');

app.use('/api/chat', chatRoutes);
console.log('✅ Chat routes registered at /api/chat');

app.use('/api/roadmap', roadmapRoutes);
console.log('✅ Roadmap routes registered at /api/roadmap');

// 404 handler - MUST be AFTER all routes
app.use((req: Request, res: Response) => {
  console.log(`❌ 404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    availableRoutes: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/chat',
      'GET  /api/chat',
      'GET  /api/chat/:id',
      'POST /api/chat/message',
      'DELETE /api/chat/:id',
      'POST /api/roadmap/generate',
      'GET  /api/roadmap',
    ]
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Server Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log('\n🚀 ================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log('🗄️  MongoDB status: Connecting...');
  console.log('================================\n');
  console.log('📝 Available Routes:');
  console.log('   Auth:');
  console.log('     POST /api/auth/register');
  console.log('     POST /api/auth/login');
  console.log('   Chat:');
  console.log('     POST /api/chat');
  console.log('     GET  /api/chat');
  console.log('     POST /api/chat/message');
  console.log('   Roadmap:');
  console.log('     POST /api/roadmap/generate');
  console.log('     GET  /api/roadmap');
  console.log('\n================================\n');
});

// Handle server errors
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', error);
    throw error;
  }
});

export default app;