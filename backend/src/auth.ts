import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface JwtPayloadCustom {
  userId: number;
  role: string;
}

export function generateToken(payload: JwtPayloadCustom) {
  const secret = process.env.JWT_SECRET || 'change_this_secret';
  return jwt.sign(payload, secret, { expiresIn: '8h' });
}

export function authMiddleware(req: Request & { user?: any }, res: Response, next: NextFunction) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'No token' });
  const token = header.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'change_this_secret';
    const payload = jwt.verify(token, secret) as JwtPayloadCustom;
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(role: string) {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'No user' });
    if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}
