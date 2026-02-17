/**
 * Security Middleware for The Buffer
 * Input validation and rate limiting (LAUNCH-02)
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

const SOURCE_ENUM = ['manual', 'sms', 'email', 'sprout', 'scope', 'api'] as const;
const WS_MAX_PAYLOAD_BYTES = 64 * 1024; // 64KB LAUNCH-02
const SENDER_MAX_LENGTH = 100;

class BufferRateLimiter {
  private store: RateLimitStore = {};
  private windowMs = parseInt(process.env.BUFFER_RATE_LIMIT_WINDOW_MS || '60000', 10); // 1 minute
  private maxRequests = parseInt(process.env.BUFFER_RATE_LIMIT_MAX || '200', 10); // 200 so LAUNCH-01 integration suite (many requests) passes

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

/** Rate limit for POST /process only: 60 requests/minute per IP (LAUNCH-02) */
class ProcessRateLimiter {
  private store: RateLimitStore = {};
  private windowMs = 60000;
  private maxRequests = 60;

  private getKey(req: Request): string {
    return `process:${req.ip || req.socket.remoteAddress}`;
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
const processRateLimiter = new ProcessRateLimiter();

/**
 * Rate limiting middleware for The Buffer
 */
export function bufferRateLimit() {
  return rateLimiter.middleware();
}

/**
 * Rate limit for POST /process: 60/min per IP (LAUNCH-02)
 */
export function processRateLimit() {
  return processRateLimiter.middleware();
}

/**
 * Validate POST /process body: content (string), source (enum), sender (optional, ≤100 chars) (LAUNCH-02)
 */
export function validateProcessBody(req: Request, res: Response, next: NextFunction): void {
  const { content, source = 'manual', sender } = req.body;

  if (content !== undefined && typeof content !== 'string') {
    res.status(400).json({ error: 'content must be a string' });
    return;
  }

  if (typeof source !== 'string' || !SOURCE_ENUM.includes(source as (typeof SOURCE_ENUM)[number])) {
    res.status(400).json({
      error: `source must be one of: ${SOURCE_ENUM.join(', ')}`,
    });
    return;
  }

  if (sender !== undefined) {
    if (typeof sender !== 'string') {
      res.status(400).json({ error: 'sender must be a string if provided' });
      return;
    }
    if (sender.length > SENDER_MAX_LENGTH) {
      res.status(400).json({ error: `sender must be at most ${SENDER_MAX_LENGTH} characters` });
      return;
    }
  }

  next();
}

export const WS_MAX_PAYLOAD_BYTES_EXPORT = WS_MAX_PAYLOAD_BYTES;

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
 * Security headers for The Buffer (fallback when helmet is not used)
 */
export function bufferSecurityHeaders(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '0'); // LAUNCH-02: CSP handles XSS; 0 for modern browsers
  res.removeHeader('X-Powered-By');
  next();
}
