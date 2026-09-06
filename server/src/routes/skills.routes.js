import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/skills/categories - Fetch all categories with nested skills
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.skillCategory.findMany({
      include: {
        skills: {
          orderBy: { popularity: 'desc' }
        }
      }
    });

    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/skills/user - Add skill to user's profile (TEACH or LEARN)
router.post('/user', authenticateToken, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { skillId, type, proficiency, yearsExperience, description } = req.body;

    const userSkill = await prisma.userSkill.upsert({
      where: {
        userId_skillId_type: {
          userId: req.user.id,
          skillId,
          type
        }
      },
      update: {
        proficiency: proficiency || 'INTERMEDIATE',
        yearsExperience: parseFloat(yearsExperience || 1),
        description
      },
      create: {
        userId: req.user.id,
        skillId,
        type,
        proficiency: proficiency || 'INTERMEDIATE',
        yearsExperience: parseFloat(yearsExperience || 1),
        description
      },
      include: { skill: true }
    });

    res.json({ userSkill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/skills/user/:userSkillId - Remove user skill
router.delete('/user/:userSkillId', authenticateToken, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    await prisma.userSkill.delete({
      where: { id: req.params.userSkillId }
    });

    res.json({ success: true, message: 'Skill removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
