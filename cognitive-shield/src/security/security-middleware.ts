/**
 * Security Middleware for The Buffer
 * Input validation and rate limiting
 * 
 * Built with love and light. As above, so below. 💜
 */

import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class BufferRateLimiter {
  private store: RateLimitStore = {};
  private windowMs = parseInt(process.env.BUFFER_RATE_LIMIT_WINDOW_MS || '60000'); // 1 minute
  private maxRequests = parseInt(process.env.BUFFER_RATE_LIMIT_MAX || '100');

  private getKey(req: Request): string {
    return `ip:${req.ip || req.socket.remoteAddress}`;
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const key = this.getKey(req);
      const now = Date.now();

      let entry = this.store[key];
      if (!entry || entry.resetTime < now) {
        entry = {
          count: 0,
          resetTime: now + this.windowMs,
        };
        this.store[key] = entry;
      }

      entry.count++;

      if (entry.count > this.maxRequests) {
        res.status(429).json({
          error: 'Too many requests',
          retryAfter: Math.ceil((entry.resetTime - now) / 1000),
        });
        return;
      }

      next();
    };
  }
}

const rateLimiter = new BufferRateLimiter();

/**
 * Rate limiting middleware for The Buffer
 */
export function bufferRateLimit() {
  return rateLimiter.middleware();
}

/**
 * Validate message input
 */
export function validateMessage(req: Request, res: Response, next: NextFunction): void {
  const { message, priority } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message is required and must be a string' });
    return;
  }

  if (message.length === 0) {
    res.status(400).json({ error: 'Message cannot be empty' });
    return;
  }

  if (message.length > 10000) {
    res.status(400).json({ error: 'Message is too long (max 10000 characters)' });
    return;
  }

  const validPriorities = ['low', 'normal', 'high', 'urgent'];
  if (priority && !validPriorities.includes(priority)) {
    res.status(400).json({ error: `Priority must be one of: ${validPriorities.join(', ')}` });
    return;
  }

  // Sanitize message
  req.body.message = message
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();

  next();
}

/**
 * Security headers for The Buffer
 */
export function bufferSecurityHeaders(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.removeHeader('X-Powered-By');
  next();
}
