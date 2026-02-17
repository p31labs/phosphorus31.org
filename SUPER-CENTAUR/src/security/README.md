# Security Module

Complete security implementation for The Centaur.

## Modules

### security-config.ts
Centralized security configuration from environment variables.

**Usage:**
```typescript
import { getSecurityConfig } from './security/security-config';

const config = getSecurityConfig();
// Use config.jwt, config.password, etc.
```

### input-validator.ts
Input validation and sanitization for all user inputs.

**Usage:**
```typescript
import { validateString, validatePassword, validateEmail } from './security/input-validator';

const username = validateString(req.body.username, {
  minLength: 3,
  maxLength: 30,
  fieldName: 'username',
});

validatePassword(req.body.password, config.password);
const email = validateEmail(req.body.email);
```

### security-headers.ts
HTTP security headers middleware.

**Usage:**
```typescript
import { securityHeaders, secureCORS } from './security/security-headers';

app.use(securityHeaders(config));
app.use(secureCORS(config));
```

### rate-limiter.ts
Rate limiting to prevent abuse.

**Usage:**
```typescript
import { createRateLimiter, createAuthRateLimiter } from './security/rate-limiter';

// General rate limiting
app.use(createRateLimiter(config.rateLimit));

// Stricter for auth endpoints
app.post('/api/auth/login', createAuthRateLimiter(config.rateLimit), handler);
```

### security-audit.ts
Security event logging and monitoring.

**Usage:**
```typescript
import { getSecurityAuditor, SecurityEventType } from './security/security-audit';

const auditor = getSecurityAuditor(logger);

auditor.logEvent({
  type: SecurityEventType.AUTH_FAILURE,
  timestamp: new Date(),
  userId: user?.id,
  ip: req.ip,
  details: { reason: 'invalid_password' },
  severity: 'medium',
}, req);
```

### encryption-utils.ts
Encryption utilities for sensitive data.

**Usage:**
```typescript
import { encrypt, decrypt, hash, generateSecureToken } from './security/encryption-utils';

const encrypted = encrypt(sensitiveData);
const decrypted = decrypt(encrypted);
const hashed = hash(data);
const token = generateSecureToken(32);
```

### secure-middleware.ts
Combined security middleware for easy integration.

**Usage:**
```typescript
import { applySecurityMiddleware } from './security/secure-middleware';

applySecurityMiddleware(app, logger);
```

## Quick Start

```typescript
import express from 'express';
import { Logger } from '../utils/logger';
import { applySecurityMiddleware } from './security/secure-middleware';

const app = express();
const logger = new Logger('Server');

// Apply all security middleware
applySecurityMiddleware(app, logger);

// Your routes...
```

## Configuration

Set these environment variables:

```bash
JWT_SECRET=your-very-long-secret-at-least-32-characters
SESSION_SECRET=your-very-long-secret-at-least-32-characters
ENCRYPTION_KEY=your-encryption-key-at-least-32-characters
PASSWORD_MIN_LENGTH=12
BCRYPT_ROUNDS=12
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
CORS_ORIGIN=https://yourdomain.com
```

## The Mesh Holds 🔺

Security is built into every layer. The mesh holds.

💜 With love and light. As above, so below. 💜
