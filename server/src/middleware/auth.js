import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const demoUserId = req.headers['x-demo-user-id'];

    if (token) {
      const secret = process.env.JWT_SECRET || 'skillswap_super_secret_jwt_token_key_2026_production';
      const decoded = jwt.verify(token, secret);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { profile: true }
      });

      if (user) {
        req.user = user;
        return next();
      }
    }

    // Support instant Demo Switcher via header
    if (demoUserId) {
      const user = await prisma.user.findUnique({
        where: { id: demoUserId },
        include: { profile: true }
      });
      if (user) {
        req.user = user;
        return next();
      }
    }

    // Fallback to first user in database if unauthenticated in dev
    const firstUser = await prisma.user.findFirst({
      include: { profile: true }
    });
    
    req.user = firstUser || null;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    // Allow request to proceed with fallback user if error
    const firstUser = await prisma.user.findFirst({ include: { profile: true } });
    req.user = firstUser;
    next();
  }
};
