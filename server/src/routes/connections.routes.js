import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';
import { aiService } from '../services/ai/ai.service.js';

const router = express.Router();

// GET /api/connections - List active and pending connections
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const connections = await prisma.connection.findMany({
      where: {
        OR: [
          { requesterId: req.user.id },
          { receiverId: req.user.id }
        ]
      },
      include: {
        requester: { include: { profile: true, skills: { include: { skill: true } } } },
        receiver: { include: { profile: true, skills: { include: { skill: true } } } }
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json({ connections });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/connections/request - Send connection request
router.post('/request', authenticateToken, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { receiverId } = req.body;

    const connection = await prisma.connection.create({
      data: {
        requesterId: req.user.id,
        receiverId,
        status: 'PENDING'
      },
      include: {
        receiver: { include: { profile: true } }
      }
    });

    res.json({ connection });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/connections/:id/respond - Accept or reject connection
router.post('/:id/respond', authenticateToken, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { status } = req.body; // 'ACCEPTED' or 'REJECTED'

    const connection = await prisma.connection.update({
      where: { id: req.params.id },
      data: { status }
    });

    // If accepted, auto-create conversation thread
    if (status === 'ACCEPTED') {
      await prisma.conversation.create({
        data: {
          participants: {
            connect: [
              { id: connection.requesterId },
              { id: connection.receiverId }
            ]
          }
        }
      });
    }

    res.json({ connection });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/connections/match-explain - AI Match Explainer
router.post('/match-explain', authenticateToken, async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUserId = req.user?.id;

    const userA = await prisma.user.findUnique({
      where: { id: currentUserId },
      include: { profile: true, skills: { include: { skill: true } } }
    });

    const userB = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: { profile: true, skills: { include: { skill: true } } }
    });

    if (!userA || !userB) {
      return res.status(404).json({ error: 'Users not found for match analysis' });
    }

    const explanation = await aiService.explainMatch(userA, userB);
    res.json({ explanation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
