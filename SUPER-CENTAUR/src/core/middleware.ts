import { Request, Response, NextFunction } from 'express';
import { AuthManager } from '../auth/auth-manager';

let authManager: AuthManager | null = null;
function getAuthManager(): AuthManager {
  if (!authManager) authManager = new AuthManager();
  return authManager;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Public routes
  if (req.path.startsWith('/api/auth') || req.path === '/health') {
    return next();
  }

  // In development, allow unauthenticated access (no login UI yet)
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const user = getAuthManager().verifyToken(token);

  if (!user) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  (req as any).user = user;
  next();
};
