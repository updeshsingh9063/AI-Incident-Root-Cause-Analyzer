import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Skip auth in development/demo mode if configured
  if (process.env.SKIP_AUTH === 'true') {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-in-prod');
    (req as any).user = decoded;
    next();
  } catch (err) {
    logger.warn('Invalid JWT token', { ip: req.ip });
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
