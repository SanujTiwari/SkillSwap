import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users - Search and filter peers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, category, skill, isMentor, role } = req.query;
    const currentUserId = req.user?.id;

    let whereClause = {};

    if (currentUserId) {
      whereClause.id = { not: currentUserId };
    }

    if (isMentor === 'true') {
      whereClause.profile = { isMentor: true };
    }

    if (search) {
      whereClause.OR = [
        { profile: { fullName: { contains: search, mode: 'insensitive' } } },
        { profile: { headline: { contains: search, mode: 'insensitive' } } },
        { profile: { bio: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        profile: true,
        skills: {
          include: {
            skill: {
              include: { category: true }
            }
          }
        },
        reviewsReceived: {
          include: { reviewer: { include: { profile: true } } },
          take: 3
        },
        badges: {
          include: { badge: true }
        }
      },
      take: 20
    });

    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/leaderboard - Gamification leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await prisma.user.findMany({
      include: {
        profile: true,
        badges: { include: { badge: true } }
      },
      orderBy: {
        profile: { totalXp: 'desc' }
      },
      take: 10
    });

    res.json({ leaderboard: topUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/:username - Public profile detail
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await prisma.user.findFirst({
      where: { profile: { username } },
      include: {
        profile: true,
        skills: { include: { skill: { include: { category: true } } } },
        badges: { include: { badge: true } },
        reviewsReceived: {
          include: { reviewer: { include: { profile: true } } },
          orderBy: { createdAt: 'desc' }
        },
        mentorOfferings: { include: { skill: true } }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/users/profile - Update current user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    
    const { fullName, headline, bio, location, timezone, hourlyRate, isMentor } = req.body;

    const updatedProfile = await prisma.profile.update({
      where: { userId: req.user.id },
      data: {
        fullName,
        headline,
        bio,
        location,
        timezone,
        hourlyRate: parseFloat(hourlyRate || 0),
        isMentor: Boolean(isMentor)
      }
    });

    res.json({ profile: updatedProfile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
