/**
 * Rate Limiting
 * Prevents abuse and DoS attacks
 * 
 * Built with love and light. As above, so below. 💜
 */

import { Request, Response, NextFunction } from 'express';
import { SecurityConfig } from './security-config';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private config: SecurityConfig['rateLimit'];

  constructor(config: SecurityConfig['rateLimit']) {
    this.config = config;
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  private getKey(req: Request): string {
    // Use IP address or user ID if authenticated
    const userId = (req as any).user?.id;
    return userId ? `user:${userId}` : `ip:${req.ip || req.socket.remoteAddress}`;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const key in this.store) {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    }
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const key = this.getKey(req);
      const now = Date.now();
      const windowStart = now - this.config.windowMs;

      // Get or create entry
      let entry = this.store[key];
      if (!entry || entry.resetTime < now) {
        entry = {
          count: 0,
          resetTime: now + this.config.windowMs,
        };
        this.store[key] = entry;
      }

      // Increment count
      entry.count++;

      // Check limit
      if (entry.count > this.config.maxRequests) {
        res.status(429).json({
          error: 'Too many requests',
          retryAfter: Math.ceil((entry.resetTime - now) / 1000),
        });
        return;
      }

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', String(this.config.maxRequests));
      res.setHeader('X-RateLimit-Remaining', String(Math.max(0, this.config.maxRequests - entry.count)));
      res.setHeader('X-RateLimit-Reset', String(Math.ceil(entry.resetTime / 1000)));

      next();
    };
  }
}

/**
 * Create rate limiter middleware
 */
export function createRateLimiter(config: SecurityConfig['rateLimit']) {
  const limiter = new RateLimiter(config);
  return limiter.middleware();
}

/**
 * Stricter rate limiter for authentication endpoints
 */
export function createAuthRateLimiter(config: SecurityConfig['rateLimit']) {
  const strictConfig = {
    ...config,
    maxRequests: Math.floor(config.maxRequests / 5), // 5x stricter
    windowMs: config.windowMs * 2, // 2x longer window
  };
  return createRateLimiter(strictConfig);
}
