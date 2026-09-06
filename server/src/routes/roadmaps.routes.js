import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';
import { aiService } from '../services/ai/ai.service.js';

const router = express.Router();

// GET /api/roadmaps - Get current user's learning roadmaps
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const roadmaps = await prisma.learningRoadmap.findMany({
      where: { userId: req.user.id },
      include: {
        stages: {
          orderBy: { orderIndex: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ roadmaps });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/roadmaps/generate - Generate new AI learning roadmap
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { targetRole, currentSkills } = req.body;

    const generated = await aiService.generateRoadmap(targetRole || 'Full-Stack Engineer', currentSkills || []);

    const roadmap = await prisma.learningRoadmap.create({
      data: {
        userId: req.user.id,
        title: generated.title,
        targetRole: generated.targetRole,
        description: `Personalized AI roadmap generated for ${req.user.profile?.fullName || 'User'}`,
        progressPercent: 0,
        stages: {
          create: generated.stages.map(stg => ({
            orderIndex: stg.orderIndex,
            title: stg.title,
            objective: stg.objective,
            skillsJson: JSON.stringify(stg.skills),
            estimatedHours: stg.estimatedHours,
            resourcesJson: JSON.stringify(stg.resources),
            projectsJson: JSON.stringify(stg.projects),
            status: stg.status || 'NOT_STARTED'
          }))
        }
      },
      include: {
        stages: { orderBy: { orderIndex: 'asc' } }
      }
    });

    res.json({ roadmap });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/roadmaps/stage/:stageId - Update stage completion status
router.put('/stage/:stageId', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body; // 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'

    const updatedStage = await prisma.roadmapStage.update({
      where: { id: req.params.stageId },
      data: { status }
    });

    // Recalculate overall roadmap progress %
    const allStages = await prisma.roadmapStage.findMany({
      where: { roadmapId: updatedStage.roadmapId }
    });

    const completedCount = allStages.filter(s => s.status === 'COMPLETED').length;
    const progressPercent = Math.round((completedCount / allStages.length) * 100);

    const updatedRoadmap = await prisma.learningRoadmap.update({
      where: { id: updatedStage.roadmapId },
      data: { progressPercent },
      include: { stages: { orderBy: { orderIndex: 'asc' } } }
    });

    res.json({ roadmap: updatedRoadmap, stage: updatedStage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
