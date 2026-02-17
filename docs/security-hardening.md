# Security Hardening Guide

Complete security hardening guide for the P31 ecosystem.

## Overview

P31 implements defense-in-depth security with multiple layers of protection:

1. **Input Validation** - All user inputs validated and sanitized
2. **Authentication** - JWT with MFA support
3. **Authorization** - Role-based access control
4. **Rate Limiting** - Prevents abuse and DoS
5. **Security Headers** - HTTP security headers
6. **Encryption** - End-to-end encryption for sensitive data
7. **Audit Logging** - Security event monitoring
8. **Secure Configuration** - Environment-based security settings

## Security Configuration

### Environment Variables

**CRITICAL**: These must be set in production:

```bash
# JWT Secret (REQUIRED - minimum 32 characters)
JWT_SECRET=your-very-long-random-secret-key-at-least-32-characters

# Session Secret (REQUIRED - minimum 32 characters)
SESSION_SECRET=your-very-long-random-session-secret-at-least-32-characters

# Password Requirements
PASSWORD_MIN_LENGTH=12
PASSWORD_REQUIRE_UPPERCASE=true
PASSWORD_REQUIRE_LOWERCASE=true
PASSWORD_REQUIRE_NUMBERS=true
PASSWORD_REQUIRE_SPECIAL=true
BCRYPT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX=100           # Max requests per window
RATE_LIMIT_SKIP_SUCCESS=false

# CORS (Production)
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Security Headers
CSP="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
```

### Generate Secure Secrets

```bash
# Generate JWT secret (64 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate session secret (64 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Implementation

### 1. Input Validation

All user inputs must be validated:

```typescript
import { validateString, validatePassword, validateEmail } from './security/input-validator';
import { getSecurityConfig } from './security/security-config';

// Validate string input
const username = validateString(req.body.username, {
  minLength: 3,
  maxLength: 30,
  fieldName: 'username',
});

// Validate password
validatePassword(req.body.password, getSecurityConfig().password);

// Validate email
const email = validateEmail(req.body.email);
```

### 2. Security Headers

Security headers are automatically applied:

```typescript
import { securityHeaders, secureCORS } from './security/security-headers';
import { getSecurityConfig } from './security/security-config';

const config = getSecurityConfig();
app.use(securityHeaders(config));
app.use(secureCORS(config));
```

### 3. Rate Limiting

Apply rate limiting to all endpoints:

```typescript
import { createRateLimiter, createAuthRateLimiter } from './security/rate-limiter';
import { getSecurityConfig } from './security/security-config';

const config = getSecurityConfig();

// General rate limiting
app.use(createRateLimiter(config.rateLimit));

// Stricter rate limiting for auth endpoints
app.post('/api/auth/login', createAuthRateLimiter(config.rateLimit), loginHandler);
```

### 4. Security Audit Logging

Log all security events:

```typescript
import { getSecurityAuditor, SecurityEventType } from './security/security-audit';

const auditor = getSecurityAuditor(logger);

// Log authentication failure
auditor.logEvent({
  type: SecurityEventType.AUTH_FAILURE,
  timestamp: new Date(),
  userId: user?.id,
  ip: req.ip,
  details: { reason: 'invalid_password' },
  severity: 'medium',
}, req);
```

## Security Checklist

### Pre-Deployment

- [ ] All environment variables set
- [ ] JWT_SECRET is at least 32 characters
- [ ] SESSION_SECRET is at least 32 characters
- [ ] HTTPS enabled in production
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Input validation on all endpoints
- [ ] Password requirements enforced
- [ ] MFA enabled for admin accounts
- [ ] Security audit logging enabled
- [ ] Database credentials secured
- [ ] API keys rotated
- [ ] Dependencies updated (no known vulnerabilities)
- [ ] Error messages don't leak sensitive info

### Runtime Monitoring

- [ ] Monitor security audit logs
- [ ] Alert on critical security events
- [ ] Monitor rate limit violations
- [ ] Track authentication failures
- [ ] Monitor suspicious activity patterns
- [ ] Regular security scans
- [ ] Backup encryption verified

## Security Best Practices

### Password Security

1. **Minimum Length**: 12 characters
2. **Complexity**: Uppercase, lowercase, numbers, special chars
3. **Hashing**: BCrypt with at least 12 rounds
4. **No Common Passwords**: Reject common passwords
5. **Password History**: Prevent password reuse

### Authentication

1. **JWT Tokens**: Secure, signed tokens
2. **Token Expiration**: 24 hours default
3. **MFA**: Required for sensitive operations
4. **Session Management**: Secure, httpOnly cookies
5. **Password Reset**: Secure token-based reset

### API Security

1. **HTTPS Only**: In production
2. **CORS**: Restrictive origin policy
3. **Rate Limiting**: Prevent abuse
4. **Input Validation**: All inputs validated
5. **Output Sanitization**: Prevent XSS
6. **Error Handling**: No sensitive info in errors

### Data Security

1. **Encryption**: EncryptedBlob for sensitive data
2. **Database**: Encrypted connections
3. **Backups**: Encrypted backups
4. **Logs**: No sensitive data in logs
5. **Secrets**: Never commit secrets

## Threat Mitigation

### SQL Injection

- ✅ Parameterized queries
- ✅ Input validation
- ✅ ORM with built-in protection

### XSS (Cross-Site Scripting)

- ✅ Input sanitization
- ✅ Output encoding
- ✅ Content Security Policy
- ✅ X-XSS-Protection header

### CSRF (Cross-Site Request Forgery)

- ✅ SameSite cookies
- ✅ CSRF tokens
- ✅ Origin validation

### Authentication Attacks

- ✅ Rate limiting on auth endpoints
- ✅ Strong password requirements
- ✅ MFA support
- ✅ Account lockout after failures
- ✅ Secure password reset

### DoS/DDoS

- ✅ Rate limiting
- ✅ Request size limits
- ✅ Timeout configuration
- ✅ Resource limits

## Security Monitoring

### Events to Monitor

1. **Authentication Failures**: Multiple failures from same IP
2. **Rate Limit Violations**: Excessive requests
3. **Unauthorized Access**: 401/403 responses
4. **Suspicious Activity**: Unusual patterns
5. **Password Changes**: Track all password changes
6. **MFA Changes**: Track MFA enable/disable

### Alert Thresholds

- **Critical**: Immediate response required
- **High**: Response within 1 hour
- **Medium**: Response within 24 hours
- **Low**: Logged for review

## Incident Response

### Security Incident Procedure

1. **Identify**: Detect and confirm security incident
2. **Contain**: Isolate affected systems
3. **Eradicate**: Remove threat
4. **Recover**: Restore normal operations
5. **Document**: Record incident details
6. **Review**: Post-incident review

### Contact

For security issues: `security@p31.io`

## The Mesh Holds 🔺

Security is built into every layer. The mesh holds.

💜 With love and light. As above, so below. 💜
