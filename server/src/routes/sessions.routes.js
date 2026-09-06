import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';
import { aiService } from '../services/ai/ai.service.js';

const router = express.Router();

// GET /api/sessions - List current user's sessions (as host or learner)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const sessions = await prisma.session.findMany({
      where: {
        OR: [
          { hostId: req.user.id },
          { learnerId: req.user.id }
        ]
      },
      include: {
        host: { include: { profile: true } },
        learner: { include: { profile: true } },
        skill: true,
        reviews: true
      },
      orderBy: { startTime: 'desc' }
    });

    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/sessions/book - Book a 1:1 Skill Swap or Mentorship session
router.post('/book', authenticateToken, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { hostId, skillId, sessionType, startTime, durationMins, price, notes } = req.body;

    const startDate = new Date(startTime || Date.now() + 86400000);
    const endDate = new Date(startDate.getTime() + (durationMins || 60) * 60000);

    const targetSkill = await prisma.skill.findUnique({ where: { id: skillId } });

    // Generate AI Prep Agenda automatically
    const aiPrep = await aiService.prepareSession(sessionType || 'SKILL_SWAP', targetSkill?.name || 'Skill');

    const session = await prisma.session.create({
      data: {
        hostId,
        learnerId: req.user.id,
        skillId,
        sessionType: sessionType || 'SKILL_SWAP',
        status: 'REQUESTED',
        startTime: startDate,
        endTime: endDate,
        durationMins: durationMins || 60,
        price: parseFloat(price || 0),
        meetingUrl: `https://meet.jit.si/skillswap-room-${req.user.profile?.username || 'user'}-${Date.now().toString(36)}`,
        notes,
        aiAgendaJson: JSON.stringify(aiPrep.agenda)
      },
      include: {
        host: { include: { profile: true } },
        learner: { include: { profile: true } },
        skill: true
      }
    });

    // Auto-create/ensure conversation thread exists between host and learner
    const existingConv = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { id: hostId } } },
          { participants: { some: { id: req.user.id } } }
        ]
      }
    });

    if (!existingConv) {
      await prisma.conversation.create({
        data: {
          participants: {
            connect: [{ id: hostId }, { id: req.user.id }]
          },
          lastMessageAt: new Date()
        }
      });
    }

    res.json({ session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/sessions/:id/status - Update session status (ACCEPTED, COMPLETED, CANCELLED)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;

    const updatedSession = await prisma.session.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        host: { include: { profile: true } },
        learner: { include: { profile: true } },
        skill: true
      }
    });

    // If completed, award XP to both host and learner!
    if (status === 'COMPLETED') {
      await prisma.profile.update({
        where: { userId: updatedSession.hostId },
        data: {
          totalXp: { increment: 150 },
          completedSessions: { increment: 1 }
        }
      });
      await prisma.profile.update({
        where: { userId: updatedSession.learnerId },
        data: {
          totalXp: { increment: 100 },
          completedSessions: { increment: 1 }
        }
      });
    }

    res.json({ session: updatedSession });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/sessions/:id/ai-summary - Generate AI summary for completed session
router.post('/:id/ai-summary', authenticateToken, async (req, res) => {
  try {
    const session = await prisma.session.findUnique({
      where: { id: req.params.id },
      include: { skill: true }
    });

    if (!session) return res.status(404).json({ error: 'Session not found' });

    const aiSummary = await aiService.summarizeSession(session.notes || `Covered key techniques in ${session.skill.name}`);

    const updatedSession = await prisma.session.update({
      where: { id: session.id },
      data: {
        aiSummaryJson: JSON.stringify(aiSummary)
      }
    });

    res.json({ session: updatedSession, aiSummary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/sessions/:id/review - Leave a review for session partner
router.post('/:id/review', authenticateToken, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { revieweeId, rating, comment, reviewType } = req.body;

    const review = await prisma.review.create({
      data: {
        sessionId: req.params.id,
        reviewerId: req.user.id,
        revieweeId,
        rating: parseInt(rating),
        comment,
        reviewType: reviewType || 'TEACHER'
      }
    });

    // Recalculate reviewee average rating
    const allReviews = await prisma.review.findMany({ where: { revieweeId } });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.profile.update({
      where: { userId: revieweeId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: allReviews.length
      }
    });

    res.json({ review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
