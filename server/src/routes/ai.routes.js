import express from 'express';
import { aiService } from '../services/ai/ai.service.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/ai/profiler - AI Skill Profiler Analysis
router.post('/profiler', async (req, res) => {
  try {
    const { prompt } = req.body;
    const profileAnalysis = await aiService.generateSkillProfile(prompt || 'Full-Stack Web Development');
    res.json({ profileAnalysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/coach - Chat with AI Learning Coach
router.post('/coach', authenticateToken, async (req, res) => {
  try {
    const { prompt } = req.body;
    const coachResponse = await aiService.chatWithCoach(req.user, prompt);
    res.json({ coachResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
