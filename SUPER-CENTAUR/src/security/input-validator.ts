/**
 * Input Validation and Sanitization
 * Secure input handling for all user inputs
 * 
 * Built with love and light. As above, so below. 💜
 */

import { SecurityConfig } from './security-config';

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validate and sanitize string input
 */
export function validateString(
  input: any,
  options: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    required?: boolean;
    fieldName?: string;
  } = {}
): string {
  const {
    minLength = 1,
    maxLength = 10000,
    pattern,
    required = true,
    fieldName = 'input',
  } = options;

  if (input === undefined || input === null) {
    if (required) {
      throw new ValidationError(`${fieldName} is required`, fieldName);
    }
    return '';
  }

  if (typeof input !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`, fieldName);
  }

  const trimmed = input.trim();

  if (required && trimmed.length === 0) {
    throw new ValidationError(`${fieldName} cannot be empty`, fieldName);
  }

  if (trimmed.length < minLength) {
    throw new ValidationError(
      `${fieldName} must be at least ${minLength} characters`,
      fieldName
    );
  }

  if (trimmed.length > maxLength) {
    throw new ValidationError(
      `${fieldName} must be no more than ${maxLength} characters`,
      fieldName
    );
  }

  if (pattern && !pattern.test(trimmed)) {
    throw new ValidationError(`${fieldName} format is invalid`, fieldName);
  }

  return sanitizeString(trimmed);
}

/**
 * Sanitize string to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate password strength
 */
export function validatePassword(
  password: string,
  config: SecurityConfig['password']
): void {
  if (password.length < config.minLength) {
    throw new ValidationError(
      `Password must be at least ${config.minLength} characters`,
      'password'
    );
  }

  if (config.requireUppercase && !/[A-Z]/.test(password)) {
    throw new ValidationError(
      'Password must contain at least one uppercase letter',
      'password'
    );
  }

  if (config.requireLowercase && !/[a-z]/.test(password)) {
    throw new ValidationError(
      'Password must contain at least one lowercase letter',
      'password'
    );
  }

  if (config.requireNumbers && !/\d/.test(password)) {
    throw new ValidationError(
      'Password must contain at least one number',
      'password'
    );
  }

  if (config.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw new ValidationError(
      'Password must contain at least one special character',
      'password'
    );
  }

  // Check for common weak passwords
  const commonPasswords = [
    'password',
    '12345678',
    'qwerty',
    'abc123',
    'password123',
  ];
  if (commonPasswords.some(weak => password.toLowerCase().includes(weak))) {
    throw new ValidationError(
      'Password is too common. Please choose a stronger password',
      'password'
    );
  }
}

/**
 * Validate email address
 */
export function validateEmail(email: string): string {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return validateString(email, {
    minLength: 5,
    maxLength: 254,
    pattern: emailPattern,
    fieldName: 'email',
  });
}

/**
 * Validate username
 */
export function validateUsername(username: string): string {
  // Username: alphanumeric, underscore, hyphen, 3-30 chars
  const usernamePattern = /^[a-zA-Z0-9_-]{3,30}$/;
  return validateString(username, {
    minLength: 3,
    maxLength: 30,
    pattern: usernamePattern,
    fieldName: 'username',
  });
}

/**
 * Validate URL
 */
export function validateURL(url: string): string {
  try {
    const parsed = new URL(url);
    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new ValidationError('URL must use http or https protocol', 'url');
    }
    return url;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError('Invalid URL format', 'url');
  }
}

/**
 * Validate integer
 */
export function validateInteger(
  input: any,
  options: {
    min?: number;
    max?: number;
    required?: boolean;
    fieldName?: string;
  } = {}
): number {
  const {
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER,
    required = true,
    fieldName = 'input',
  } = options;

  if (input === undefined || input === null) {
    if (required) {
      throw new ValidationError(`${fieldName} is required`, fieldName);
    }
    return 0;
  }

  const num = typeof input === 'string' ? parseInt(input, 10) : Number(input);

  if (isNaN(num) || !Number.isInteger(num)) {
    throw new ValidationError(`${fieldName} must be an integer`, fieldName);
  }

  if (num < min) {
    throw new ValidationError(
      `${fieldName} must be at least ${min}`,
      fieldName
    );
  }

  if (num > max) {
    throw new ValidationError(
      `${fieldName} must be no more than ${max}`,
      fieldName
    );
  }

  return num;
}

/**
 * Validate JSON input
 */
export function validateJSON(input: string, maxSize: number = 1000000): any {
  if (input.length > maxSize) {
    throw new ValidationError('JSON input is too large');
  }

  try {
    return JSON.parse(input);
  } catch (error) {
    throw new ValidationError('Invalid JSON format', 'json');
  }
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T;

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeString(value) as T[keyof T];
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key as keyof T] = sanitizeObject(value) as T[keyof T];
    } else if (Array.isArray(value)) {
      sanitized[key as keyof T] = value.map((item) =>
        typeof item === 'string' ? sanitizeString(item) : item
      ) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value;
    }
  }

  return sanitized;
}
