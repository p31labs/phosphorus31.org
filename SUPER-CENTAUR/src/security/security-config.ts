/**
 * Security Configuration
 * Centralized security settings and constants
 * 
 * Built with love and light. As above, so below. 💜
 */

export interface SecurityConfig {
  jwt: {
    secret: string;
    expiresIn: string;
    algorithm: string;
  };
  password: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    bcryptRounds: number;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
    skipSuccessfulRequests: boolean;
  };
  cors: {
    origin: string | string[];
    credentials: boolean;
    methods: string[];
    allowedHeaders: string[];
  };
  headers: {
    contentSecurityPolicy: string;
    xFrameOptions: string;
    xContentTypeOptions: string;
    xXSSProtection: string;
    strictTransportSecurity: string;
    referrerPolicy: string;
  };
  encryption: {
    algorithm: string;
    keyLength: number;
    ivLength: number;
  };
  session: {
    secret: string;
    maxAge: number;
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
  };
}

/**
 * Get security configuration from environment variables
 * with secure defaults
 */
export function getSecurityConfig(): SecurityConfig {
  // CRITICAL: JWT secret must be set
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error(
      'JWT_SECRET must be set and at least 32 characters long for security'
    );
  }

  const sessionSecret = process.env.SESSION_SECRET || jwtSecret;
  if (sessionSecret.length < 32) {
    throw new Error(
      'SESSION_SECRET must be at least 32 characters long for security'
    );
  }

  return {
    jwt: {
      secret: jwtSecret,
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
      algorithm: 'HS256',
    },
    password: {
      minLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '12'),
      requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE !== 'false',
      requireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE !== 'false',
      requireNumbers: process.env.PASSWORD_REQUIRE_NUMBERS !== 'false',
      requireSpecialChars: process.env.PASSWORD_REQUIRE_SPECIAL !== 'false',
      bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
    },
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100'),
      skipSuccessfulRequests: process.env.RATE_LIMIT_SKIP_SUCCESS !== 'false',
    },
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || 
        (process.env.NODE_ENV === 'production' ? [] : ['http://localhost:5173']),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    },
    headers: {
      contentSecurityPolicy: process.env.CSP || 
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
      xFrameOptions: 'DENY',
      xContentTypeOptions: 'nosniff',
      xXSSProtection: '1; mode=block',
      strictTransportSecurity: process.env.NODE_ENV === 'production' 
        ? 'max-age=31536000; includeSubDomains; preload'
        : '',
      referrerPolicy: 'strict-origin-when-cross-origin',
    },
    encryption: {
      algorithm: 'aes-256-gcm',
      keyLength: 32,
      ivLength: 16,
    },
    session: {
      secret: sessionSecret,
      maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000'), // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: (process.env.SESSION_SAME_SITE as any) || 'strict',
    },
  };
}

/**
 * Validate security configuration
 */
export function validateSecurityConfig(config: SecurityConfig): void {
  const errors: string[] = [];

  if (config.jwt.secret.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters');
  }

  if (config.password.minLength < 12) {
    errors.push('Password minimum length must be at least 12 characters');
  }

  if (config.password.bcryptRounds < 10) {
    errors.push('BCrypt rounds must be at least 10');
  }

  if (config.rateLimit.maxRequests < 10) {
    errors.push('Rate limit max requests must be at least 10');
  }

  if (errors.length > 0) {
    throw new Error(`Security configuration errors:\n${errors.join('\n')}`);
  }
}

export default getSecurityConfig;
