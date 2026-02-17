/**
 * Security Headers Middleware
 * Implements security best practices via HTTP headers
 * 
 * Built with love and light. As above, so below. 💜
 */

import { Request, Response, NextFunction } from 'express';
import { SecurityConfig } from './security-config';

/**
 * Set security headers on all responses
 */
export function securityHeaders(config: SecurityConfig) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Content Security Policy
    res.setHeader('Content-Security-Policy', config.headers.contentSecurityPolicy);

    // Prevent clickjacking
    res.setHeader('X-Frame-Options', config.headers.xFrameOptions);

    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', config.headers.xContentTypeOptions);

    // XSS Protection (legacy but still useful)
    res.setHeader('X-XSS-Protection', config.headers.xXSSProtection);

    // HSTS (only in production)
    if (config.headers.strictTransportSecurity) {
      res.setHeader(
        'Strict-Transport-Security',
        config.headers.strictTransportSecurity
      );
    }

    // Referrer Policy
    res.setHeader('Referrer-Policy', config.headers.referrerPolicy);

    // Permissions Policy (formerly Feature Policy)
    res.setHeader(
      'Permissions-Policy',
      'geolocation=(), microphone=(), camera=()'
    );

    // Remove X-Powered-By header
    res.removeHeader('X-Powered-By');

    next();
  };
}

/**
 * CORS middleware with security
 */
export function secureCORS(config: SecurityConfig) {
  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;

    if (origin && config.cors.origin.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (Array.isArray(config.cors.origin) && config.cors.origin.length === 0) {
      // No CORS in production if not configured
      if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'CORS not allowed' });
      }
    }

    res.setHeader('Access-Control-Allow-Credentials', String(config.cors.credentials));
    res.setHeader(
      'Access-Control-Allow-Methods',
      config.cors.methods.join(', ')
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      config.cors.allowedHeaders.join(', ')
    );

    // Handle preflight
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    next();
  };
}
