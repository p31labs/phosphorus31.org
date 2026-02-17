/**
 * Secure Middleware
 * Combined security middleware for easy integration
 * 
 * Built with love and light. As above, so below. 💜
 */

import { Express } from 'express';
import { Logger } from '../utils/logger';
import {
  getSecurityConfig,
  validateSecurityConfig,
  securityHeaders,
  secureCORS,
  createRateLimiter,
  getSecurityAuditor,
  securityEventLogger,
} from './index';

/**
 * Apply all security middleware to Express app
 */
export function applySecurityMiddleware(app: Express, logger: Logger): void {
  const config = getSecurityConfig();

  // Validate configuration
  try {
    validateSecurityConfig(config);
  } catch (error: any) {
    logger.error('Security configuration validation failed:', error);
    throw error;
  }

  // Security headers
  app.use(securityHeaders(config));

  // CORS
  app.use(secureCORS(config));

  // Rate limiting
  app.use(createRateLimiter(config.rateLimit));

  // Security event logging
  app.use(securityEventLogger);

  // Trust proxy (for rate limiting behind reverse proxy)
  app.set('trust proxy', 1);

  logger.info('Security middleware applied successfully');
}

/**
 * Validate security configuration on startup
 */
export function validateSecurityConfiguration(): void {
  try {
    const config = getSecurityConfig();
    validateSecurityConfig(config);
  } catch (error: any) {
    console.error('CRITICAL: Security configuration invalid:', error.message);
    process.exit(1);
  }
}
