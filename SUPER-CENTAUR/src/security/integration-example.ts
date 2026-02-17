/**
 * Security Integration Example
 * Example of how to integrate security modules into The Centaur server
 * 
 * Built with love and light. As above, so below. 💜
 */

import express from 'express';
import { Logger } from '../utils/logger';
import {
  applySecurityMiddleware,
  validateSecurityConfiguration,
  getSecurityConfig,
  validateString,
  validatePassword,
  validateEmail,
  getSecurityAuditor,
  SecurityEventType,
  createAuthRateLimiter,
} from './index';

/**
 * Example: Secure server setup
 */
export function setupSecureServer(app: express.Express, logger: Logger): void {
  // 1. Validate security configuration on startup
  validateSecurityConfiguration();

  // 2. Apply all security middleware
  applySecurityMiddleware(app, logger);

  // 3. Example: Secure authentication endpoint
  const config = getSecurityConfig();
  const auditor = getSecurityAuditor(logger);

  app.post(
    '/api/auth/register',
    createAuthRateLimiter(config.rateLimit), // Stricter rate limiting
    async (req, res) => {
      try {
        // Validate inputs
        const username = validateString(req.body.username, {
          minLength: 3,
          maxLength: 30,
          fieldName: 'username',
        });

        const email = validateEmail(req.body.email);

        validatePassword(req.body.password, config.password);

        // Register user (implementation omitted)
        // const user = await registerUser(username, email, password);

        // Log security event
        auditor.logEvent({
          type: SecurityEventType.AUTH_SUCCESS,
          timestamp: new Date(),
          ip: req.ip,
          details: { action: 'register', username },
          severity: 'low',
        }, req);

        res.json({ success: true });
      } catch (error: any) {
        // Log security event
        auditor.logEvent({
          type: SecurityEventType.INVALID_INPUT,
          timestamp: new Date(),
          ip: req.ip,
          details: { error: error.message },
          severity: 'medium',
        }, req);

        res.status(400).json({ error: error.message });
      }
    }
  );

  // 4. Example: Secure API endpoint with input validation
  app.post(
    '/api/secure-endpoint',
    async (req, res) => {
      try {
        // Validate all inputs
        const input1 = validateString(req.body.input1, {
          minLength: 1,
          maxLength: 100,
          fieldName: 'input1',
        });

        const input2 = validateInteger(req.body.input2, {
          min: 0,
          max: 1000,
          fieldName: 'input2',
        });

        // Process request...
        res.json({ success: true, data: { input1, input2 } });
      } catch (error: any) {
        auditor.logEvent({
          type: SecurityEventType.INVALID_INPUT,
          timestamp: new Date(),
          ip: req.ip,
          details: { error: error.message },
          severity: 'medium',
        }, req);

        res.status(400).json({ error: error.message });
      }
    }
  );
}
