/**
 * Security Audit and Monitoring
 * Logs security events and monitors for threats
 * 
 * Built with love and light. As above, so below. 💜
 */

import { Request, Response } from 'express';
import { Logger } from '../utils/logger';

export enum SecurityEventType {
  AUTH_SUCCESS = 'auth_success',
  AUTH_FAILURE = 'auth_failure',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  INVALID_INPUT = 'invalid_input',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  PASSWORD_CHANGE = 'password_change',
  MFA_ENABLED = 'mfa_enabled',
  MFA_DISABLED = 'mfa_disabled',
  TOKEN_REFRESH = 'token_refresh',
  TOKEN_EXPIRED = 'token_expired',
}

export interface SecurityEvent {
  type: SecurityEventType;
  timestamp: Date;
  userId?: string;
  ip?: string;
  userAgent?: string;
  details?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class SecurityAuditor {
  private logger: Logger;
  private events: SecurityEvent[] = [];
  private maxEvents = 10000;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * Log a security event
   */
  logEvent(event: SecurityEvent, req?: Request): void {
    // Add request context
    if (req) {
      event.ip = req.ip || req.socket.remoteAddress || 'unknown';
      event.userAgent = req.headers['user-agent'];
    }

    // Store event
    this.events.push(event);
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Log based on severity
    const message = `[SECURITY] ${event.type}: ${JSON.stringify(event.details || {})}`;
    
    switch (event.severity) {
      case 'critical':
        this.logger.error(message, { event });
        break;
      case 'high':
        this.logger.warn(message, { event });
        break;
      case 'medium':
        this.logger.info(message, { event });
        break;
      case 'low':
        this.logger.debug(message, { event });
        break;
    }

    // Alert on critical events
    if (event.severity === 'critical') {
      this.alertCritical(event);
    }
  }

  /**
   * Alert on critical security events
   */
  private alertCritical(event: SecurityEvent): void {
    // In production, this would send alerts (email, SMS, etc.)
    this.logger.error(`[CRITICAL SECURITY ALERT] ${event.type}`, { event });
  }

  /**
   * Get recent security events
   */
  getRecentEvents(limit: number = 100): SecurityEvent[] {
    return this.events.slice(-limit);
  }

  /**
   * Get events by type
   */
  getEventsByType(type: SecurityEventType): SecurityEvent[] {
    return this.events.filter(e => e.type === type);
  }

  /**
   * Check for suspicious patterns
   */
  detectSuspiciousActivity(userId?: string, ip?: string): boolean {
    const recentEvents = this.events.filter(
      e => Date.now() - e.timestamp.getTime() < 3600000 // Last hour
    );

    // Multiple auth failures
    const authFailures = recentEvents.filter(
      e => e.type === SecurityEventType.AUTH_FAILURE
    );
    if (authFailures.length > 5) {
      this.logEvent({
        type: SecurityEventType.SUSPICIOUS_ACTIVITY,
        timestamp: new Date(),
        userId,
        ip,
        details: { reason: 'multiple_auth_failures', count: authFailures.length },
        severity: 'high',
      });
      return true;
    }

    // Multiple rate limit violations
    const rateLimitViolations = recentEvents.filter(
      e => e.type === SecurityEventType.RATE_LIMIT_EXCEEDED
    );
    if (rateLimitViolations.length > 10) {
      this.logEvent({
        type: SecurityEventType.SUSPICIOUS_ACTIVITY,
        timestamp: new Date(),
        userId,
        ip,
        details: { reason: 'excessive_rate_limits', count: rateLimitViolations.length },
        severity: 'high',
      });
      return true;
    }

    return false;
  }
}

let auditorInstance: SecurityAuditor | null = null;

/**
 * Get security auditor instance
 */
export function getSecurityAuditor(logger?: Logger): SecurityAuditor {
  if (!auditorInstance) {
    if (!logger) {
      throw new Error('Logger required for security auditor');
    }
    auditorInstance = new SecurityAuditor(logger);
  }
  return auditorInstance;
}

/**
 * Security event logging middleware
 */
export function securityEventLogger(req: Request, res: Response, next: Function) {
  const originalSend = res.send;
  
  res.send = function (body: any) {
    // Log security-relevant responses
    if (res.statusCode === 401 || res.statusCode === 403) {
      getSecurityAuditor().logEvent({
        type: SecurityEventType.UNAUTHORIZED_ACCESS,
        timestamp: new Date(),
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        details: { statusCode: res.statusCode, path: req.path },
        severity: 'medium',
      }, req);
    }

    return originalSend.call(this, body);
  };

  next();
}
