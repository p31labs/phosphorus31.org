import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import { Logger } from '../utils/logger';

// Extend Request interface for file uploads
declare global {
  namespace Express {
    interface Request {
      files?: any;
    }
  }
}

export class ValidationMiddleware {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('ValidationMiddleware');
  }

  /**
   * Comprehensive input validation for authentication endpoints
   */
  public static authValidation(): ValidationChain[] {
    return [
      body('username')
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
      
      body('password')
        .isLength({ min: 12 })
        .withMessage('Password must be at least 12 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain uppercase, lowercase, number, and special character'),
      
      body('email')
        .optional()
        .isEmail()
        .withMessage('Must be a valid email address')
    ];
  }

  /**
   * Input validation for legal document generation
   */
  public static legalValidation(): ValidationChain[] {
    return [
      body('type')
        .isIn(['emergency-motion', 'legal-response', 'compliance-check', 'motion-to-vacate', 'motion-for-forensic-accounting'])
        .withMessage('Invalid document type'),
      
      body('context')
        .isLength({ min: 10, max: 10000 })
        .withMessage('Context must be between 10 and 10,000 characters')
        .custom((value: string) => {
          // Prevent SQL injection patterns
          const sqlPatterns = [
            /(\bselect\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b|\bunion\b)/i,
            /(\bor\b|\band\b)\s+\d+\s*=\s*\d+/i,
            /'.*('|\\')/i
          ];
          
          for (const pattern of sqlPatterns) {
            if (pattern.test(value)) {
              throw new Error('Invalid characters detected in context');
            }
          }
          return true;
        }),
      
      body('urgency')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Urgency must be low, medium, high, or critical')
    ];
  }

  /**
   * Input validation for medical documentation
   */
  public static medicalValidation(): ValidationChain[] {
    return [
      body('patientId')
        .isLength({ min: 1, max: 100 })
        .withMessage('Patient ID is required'),
      
      body('condition')
        .isLength({ min: 2, max: 100 })
        .withMessage('Condition name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s\-']+$/)
        .withMessage('Condition can only contain letters, spaces, hyphens, and apostrophes'),
      
      body('symptoms')
        .isArray({ min: 1 })
        .withMessage('Symptoms must be a non-empty array'),
      
      body('symptoms.*')
        .isLength({ min: 1, max: 200 })
        .withMessage('Each symptom must be between 1 and 200 characters'),
      
      body('severity')
        .isIn(['mild', 'moderate', 'severe', 'critical'])
        .withMessage('Severity must be mild, moderate, severe, or critical')
    ];
  }

  /**
   * Input validation for blockchain operations
   */
  public static blockchainValidation(): ValidationChain[] {
    return [
      body('contractType')
        .isIn(['legal-framework', 'identity', 'governance', 'token'])
        .withMessage('Invalid contract type'),
      
      body('parameters')
        .isObject()
        .withMessage('Parameters must be an object'),
      
      body('parameters.name')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Contract name must be between 2 and 50 characters'),
      
      body('parameters.description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters')
    ];
  }

  /**
   * Input validation for family support operations
   */
  public static familyValidation(): ValidationChain[] {
    return [
      body('name')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s\-']+$/)
        .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
      
      body('relationship')
        .isIn(['spouse', 'child', 'support', 'legal'])
        .withMessage('Invalid relationship type'),
      
      body('accessLevel')
        .isIn(['view', 'limited', 'full'])
        .withMessage('Access level must be view, limited, or full'),
      
      body('contactInfo.email')
        .optional()
        .isEmail()
        .withMessage('Must be a valid email address'),
      
      body('contactInfo.phone')
        .optional()
        .isMobilePhone()
        .withMessage('Must be a valid phone number')
    ];
  }

  /**
   * Input validation for support requests
   */
  public static supportValidation(): ValidationChain[] {
    return [
      body('type')
        .isIn(['emotional', 'legal', 'financial', 'practical', 'emergency'])
        .withMessage('Invalid support type'),
      
      body('priority')
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Priority must be low, medium, high, or critical'),
      
      body('description')
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters')
        .custom((value: string) => {
          // Prevent XSS attempts
          const xssPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi
          ];
          
          for (const pattern of xssPatterns) {
            if (pattern.test(value)) {
              throw new Error('Invalid characters detected in description');
            }
          }
          return true;
        }),
      
      body('requestedBy')
        .isLength({ min: 1 })
        .withMessage('Requester ID is required')
    ];
  }

  /**
   * Input validation for emergency protocols
   */
  public static emergencyValidation(): ValidationChain[] {
    return [
      body('protocolId')
        .isLength({ min: 1 })
        .withMessage('Protocol ID is required'),
      
      body('details')
        .isObject()
        .withMessage('Details must be an object'),
      
      body('details.trigger')
        .isLength({ min: 5, max: 200 })
        .withMessage('Trigger description must be between 5 and 200 characters'),
      
      body('details.urgency')
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Urgency must be low, medium, high, or critical')
    ];
  }

  /**
   * Generic sanitization middleware
   */
  public sanitizeInput(req: Request, res: Response, next: NextFunction): void {
    try {
      // Remove null bytes and control characters
      const sanitizeObject = (obj: any): any => {
        if (typeof obj === 'string') {
          return obj.replace(/\0/g, '').replace(/[\x00-\x1F\x7F]/g, '');
        }
        if (Array.isArray(obj)) {
          return obj.map(sanitizeObject);
        }
        if (obj && typeof obj === 'object') {
          const sanitized: any = {};
          for (const [key, value] of Object.entries(obj)) {
            sanitized[key] = sanitizeObject(value);
          }
          return sanitized;
        }
        return obj;
      };

      req.body = sanitizeObject(req.body);
      req.query = sanitizeObject(req.query);
      req.params = sanitizeObject(req.params);

      next();
    } catch (error) {
      this.logger.error('Sanitization error:', error);
      res.status(400).json({ error: 'Invalid input format' });
    }
  }

  /**
   * Rate limiting validation
   */
  public validateRateLimit(req: Request, res: Response, next: NextFunction): void {
    // This would integrate with your rate limiting middleware
    // For now, we'll add basic request size validation
    const contentLength = parseInt(req.get('content-length') || '0');
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (contentLength > maxSize) {
      this.logger.warn(`Request too large: ${contentLength} bytes from ${req.ip}`);
      return res.status(413).json({ error: 'Request too large' });
    }

    next();
  }

  /**
   * File upload validation
   */
  public validateFileUpload(req: Request, res: Response, next: NextFunction): void {
    if (req.files) {
      const files = Array.isArray(req.files) ? req.files : [req.files];
      
      for (const file of files) {
        // Check file size
        if (file.size > 10 * 1024 * 1024) { // 10MB
          return res.status(413).json({ error: 'File too large' });
        }
        
        // Check file type
        const allowedTypes = [
          'application/pdf',
          'text/plain',
          'image/jpeg',
          'image/png',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (!allowedTypes.includes(file.mimetype)) {
          return res.status(400).json({ error: 'Invalid file type' });
        }
        
        // Check filename for malicious characters
        const filename = file.originalname;
        if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
          return res.status(400).json({ error: 'Invalid filename' });
        }
      }
    }
    
    next();
  }

  /**
   * Error handling middleware for validation
   */
  public static handleValidationErrors(req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error: any) => ({
        field: error.param,
        message: error.msg,
        value: error.value
      }));

      res.status(400).json({
        error: 'Validation failed',
        details: errorMessages
      });
      return;
    }

    next();
  }
}

export default ValidationMiddleware;