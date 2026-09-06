import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'skillswap_super_secret_jwt_token_key_2026_production';

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: true,
        skills: { include: { skill: true } },
        badges: { include: { badge: true } },
        subscription: { include: { plan: true } }
      }
    });

    res.json({ user: fullUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, username, headline } = req.body;

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { profile: { username } }] }
    });

    if (existing) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        profile: {
          create: {
            fullName: fullName || username,
            username: username || email.split('@')[0],
            headline: headline || 'SkillSwap Member',
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
          }
        }
      },
      include: { profile: true }
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
