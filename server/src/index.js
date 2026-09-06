import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma.js';

import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import skillsRoutes from './routes/skills.routes.js';
import connectionsRoutes from './routes/connections.routes.js';
import sessionsRoutes from './routes/sessions.routes.js';
import roadmapsRoutes from './routes/roadmaps.routes.js';
import messagesRoutes from './routes/messages.routes.js';
import communityRoutes from './routes/community.routes.js';
import aiRoutes from './routes/ai.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Health Check Route
app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      service: 'SkillSwap API Server',
      database: 'connected (Neon PostgreSQL)',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      service: 'SkillSwap API Server',
      database: 'disconnected',
      error: error?.message || 'Database connection error'
    });
  }
});

// API Routes Mount
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/connections', connectionsRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/roadmaps', roadmapsRoutes);
app.use('/api', messagesRoutes);
app.use('/api/posts', communityRoutes);
app.use('/api/ai', aiRoutes);

// Global Error Handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    details: err.errors || undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SkillSwap Server running on http://localhost:${PORT}`);
});

export default app;
