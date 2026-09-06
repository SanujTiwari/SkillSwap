import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma.js';

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
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    // Ping database to verify connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      service: 'SkillSwap API Server',
      database: 'connected (Neon PostgreSQL)',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      service: 'SkillSwap API Server',
      database: 'disconnected',
      error: error?.message || 'Database connection error'
    });
  }
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
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
