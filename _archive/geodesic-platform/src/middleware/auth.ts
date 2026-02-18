import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { Kysely } from 'kysely';
import type { Database } from '../db/index.js';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; username: string };
    }
  }
}

export function createAuthMiddleware(db: Kysely<Database>) {
  return async function authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ error: 'Server misconfiguration' });
      return;
    }
    try {
      const decoded = jwt.verify(token, secret) as { userId: string };
      const user = await db
        .selectFrom('users')
        .select(['id', 'email', 'username'])
        .where('id', '=', decoded.userId)
        .executeTakeFirst();
      if (!user) {
        res.status(401).json({ error: 'User not found' });
        return;
      }
      req.user = user;
      next();
    } catch {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
}
