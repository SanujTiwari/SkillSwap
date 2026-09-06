import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedUserPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUserPayload;
}

const JWT_SECRET = process.env.JWT_SECRET || 'skillswap_super_secret_jwt_token_key_2026_production';

/**
 * Middleware to enforce JWT Authentication
 */
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Access token missing or invalid' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired authentication token' });
  }
}

/**
 * Optional Auth Middleware - populates req.user if token is valid, but does not block unauthenticated users
 */
export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUserPayload;
      req.user = decoded;
    } catch {
      // Ignore invalid token in optional auth
    }
  }
  next();
}

/**
 * Admin Only Authorization Middleware
 */
export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin authorization required' });
  }
  next();
}
