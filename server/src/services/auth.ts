import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import type { Request, Response, NextFunction } from 'express';

dotenv.config();

export interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

const secretKey = process.env.JWT_SECRET_KEY || '';

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export const getUserFromToken = (req: Request): JwtPayload | null => {
  const authHeader = req.headers.authorization || '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const user = jwt.verify(token, secretKey) as JwtPayload;
      return user;
    } catch (err) {
      console.error('JWT verification failed:', err);
      return null;
    }
  }

  return null;
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const user = getUserFromToken(req);
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  req.user = user;
  next();
};