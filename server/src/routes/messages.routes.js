import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/conversations - List current user conversations
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { id: req.user.id }
        }
      },
      include: {
        participants: {
          include: { profile: true }
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { lastMessageAt: 'desc' }
    });

// POST /api/conversations - Find or create conversation with targetUserId
router.post('/conversations', authenticateToken, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { targetUserId } = req.body;
    if (!targetUserId) return res.status(400).json({ error: 'targetUserId is required' });

    // Check if conversation already exists between req.user.id and targetUserId
    let conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { id: req.user.id } } },
          { participants: { some: { id: targetUserId } } }
        ]
      },
      include: {
        participants: { include: { profile: true } },
        messages: { take: 1, orderBy: { createdAt: 'desc' } }
      }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            connect: [{ id: req.user.id }, { id: targetUserId }]
          },
          lastMessageAt: new Date()
        },
        include: {
          participants: { include: { profile: true } },
          messages: { take: 1, orderBy: { createdAt: 'desc' } }
        }
      });
    }

    res.json({ conversation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/conversations/:id/messages - Get messages in conversation thread
router.get('/conversations/:id/messages', authenticateToken, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId: req.params.id },
      include: {
        sender: { include: { profile: true } }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/conversations/:id/messages - Send message
router.post('/conversations/:id/messages', authenticateToken, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { content, attachmentUrl } = req.body;

    const message = await prisma.message.create({
      data: {
        conversationId: req.params.id,
        senderId: req.user.id,
        content,
        attachmentUrl
      },
      include: {
        sender: { include: { profile: true } }
      }
    });

    await prisma.conversation.update({
      where: { id: req.params.id },
      data: { lastMessageAt: new Date() }
    });

    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
