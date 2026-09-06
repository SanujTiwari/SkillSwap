import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/posts - Get community feed posts
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let whereClause = {};

    if (category && category !== 'ALL') {
      whereClause.category = category;
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        author: { include: { profile: true, badges: { include: { badge: true } } } },
        comments: {
          include: { author: { include: { profile: true } } },
          orderBy: { createdAt: 'asc' }
        },
        likes: true
      },
      orderBy: { createdAt: 'desc' },
      take: 25
    });

    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/posts - Create post
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { title, content, category } = req.body;

    const post = await prisma.post.create({
      data: {
        authorId: req.user.id,
        title,
        content,
        category: category || 'GENERAL'
      },
      include: {
        author: { include: { profile: true } },
        comments: true,
        likes: true
      }
    });

    res.json({ post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/posts/:id/like - Toggle post like
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: req.params.id,
          userId: req.user.id
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      await prisma.post.update({
        where: { id: req.params.id },
        data: { likesCount: { decrement: 1 } }
      });
      return res.json({ liked: false });
    } else {
      await prisma.like.create({
        data: {
          postId: req.params.id,
          userId: req.user.id
        }
      });
      await prisma.post.update({
        where: { id: req.params.id },
        data: { likesCount: { increment: 1 } }
      });
      return res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/posts/:id/comments - Add comment
router.post('/:id/comments', authenticateToken, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { content } = req.body;

    const comment = await prisma.comment.create({
      data: {
        postId: req.params.id,
        authorId: req.user.id,
        content
      },
      include: {
        author: { include: { profile: true } }
      }
    });

    await prisma.post.update({
      where: { id: req.params.id },
      data: { commentsCount: { increment: 1 } }
    });

    res.json({ comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
