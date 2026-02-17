/**
 * Sovereignty Validator — Binary decision engine for sovereignty checks (1s and 0s)
 * 
 * ENTITY PROTOCOL:
 * - Purpose: Validate data and actions for sovereignty compliance
 * - Job: Run binary checks, provide YES/NO decisions with clear reasoning
 * - Interface: REST-like API with standardized response format
 * - Self-healing: Automatic rule validation and fallback mechanisms
 */

import { Logger } from '../utils/logger';
import { DataStore, StoreRecord } from '../database/store';

export interface BinaryDecision {
  id: string;
  question: string;
  criteria: string[]; // Must all be true for YES (1)
  dependencies: string[]; // Other decision IDs that must be YES first
  consequenceYes: string; // What happens if YES
  consequenceNo: string; // What happens if NO
  priority: number; // 1-10, higher = more critical
}

export interface DecisionAudit extends StoreRecord {
  decisionId: string;
  timestamp: string;
  input: any;
  result: boolean; // true = YES (1), false = NO (0)
  reasoning: string[];
  metadata?: Record<string, any>;
}

export interface ValidationRequest {
  dataType: string;
  source: string;
  content?: any;
  metadata: Record<string, any>;
  userId?: string;
}

export interface ValidationResult {
  sovereigntyApproved: boolean; // YES/NO (1/0)
  decisionId: string;
  reasoning: string[];
  recommendations: string[];
  auditId: string;
  timestamp: string;
}

export class SovereigntyValidator {
  private logger: Logger;
  private store: DataStore;
  
  // Core sovereignty decisions (binary checks)
  private readonly coreDecisions: BinaryDecision[] = [
    {
      id: 'DATA_TYPE_VALIDATION',
      question: 'Is this data type acceptable for sovereignty?',
      criteria: [
        'Data is not biometric (no facial recognition, fingerprint, etc.)',
        'Data is not behavioral tracking or analytics',
        'Data format is open or convertible to open format',
        'Data size is manageable for local storage (<1GB)'
      ],
      dependencies: [],
      consequenceYes: 'Data type approved for sovereignty processing',
      consequenceNo: 'Data type rejected - incompatible with sovereignty',
      priority: 10
    },
    {
      id: 'SOURCE_VALIDATION',
      question: 'Is this source trusted for sovereignty ingestion?',
      criteria: [
        'Source is user-created content',
        'Source is verified family member or trusted contact',
        'Source has explicit data ownership agreement',
        'Source does not contain third-party tracking'
      ],
      dependencies: ['DATA_TYPE_VALIDATION'],
      consequenceYes: 'Source approved for sovereignty ingestion',
      consequenceNo: 'Source rejected - untrusted or unclear ownership',
      priority: 9
    },
    {
      id: 'ENCRYPTION_VALIDATION',
      question: 'Is this data encrypted end-to-end?',
      criteria: [
        'Data is encrypted client-side before any external transmission',
        'Encryption keys are user-controlled only',
        'No plaintext storage on third-party servers',
        'Encryption algorithm is post-quantum resistant'
      ],
      dependencies: ['DATA_TYPE_VALIDATION', 'SOURCE_VALIDATION'],
      consequenceYes: 'Encryption approved for sovereignty',
      consequenceNo: 'Encryption insufficient - requires client-side encryption',
      priority: 8
    },
    {
      id: 'LEGAL_COMPLIANCE',
      question: 'Does this data comply with Wyoming DUNA sovereignty framework?',
      criteria: [
        'Data is personal or family documentation',
        'Medical records are properly redacted',
        'No copyrighted material without license',
        'No illegal or restricted content'
      ],
      dependencies: ['DATA_TYPE_VALIDATION', 'SOURCE_VALIDATION'],
      consequenceYes: 'Legal compliance approved',
      consequenceNo: 'Legal issues detected - review required',
      priority: 7
    },
    {
      id: 'LOCAL_STORAGE_CAPABILITY',
      question: 'Can this be stored locally with CRDT sync?',
      criteria: [
        'Data size < 1GB (adjustable based on local storage)',
        'Data structure is compatible with CRDT algorithms',
        'Sync conflicts are resolvable automatically',
        'Offline access is possible'
      ],
      dependencies: ['DATA_TYPE_VALIDATION'],
      consequenceYes: 'Local storage capability confirmed',
      consequenceNo: 'Local storage not feasible - requires alternative approach',
      priority: 6
    }
  ];

  private static readonly COLLECTION = 'sovereignty-decisions';
  private static readonly AUDIT_COLLECTION = 'sovereignty-audit';

  constructor() {
    this.logger = new Logger('SovereigntyValidator');
    this.store = DataStore.getInstance();
    
    // Initialize decision rules in store if not present
    this.initializeDecisions();
  }

  async start(): Promise<void> {
    this.logger.info('Sovereignty Validator started');
  }

  async stop(): Promise<void> {
    this.logger.info('Sovereignty Validator stopped');
  }

  /**
   * Main validation method - runs all binary checks
   * Returns YES/NO with clear reasoning
   */
  async validate(request: ValidationRequest): Promise<ValidationResult> {
    const auditId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const reasoning: string[] = [];
    const recommendations: string[] = [];
    
    this.logger.info(`Starting sovereignty validation: ${request.dataType} from ${request.source}`);

    // Run all core decisions in dependency order
    const results = new Map<string, boolean>();
    
    // Sort by priority (highest first) and respect dependencies
    const sortedDecisions = this.sortDecisionsByDependency(this.coreDecisions);
    
    let allPassed = true;
    
    for (const decision of sortedDecisions) {
      try {
        const result = await this.evaluateDecision(decision, request, results);
        results.set(decision.id, result);
        
        if (!result) {
          allPassed = false;
          reasoning.push(`FAILED: ${decision.question}`);
          reasoning.push(...decision.criteria.map(c => `  - ${c}`));
          recommendations.push(decision.consequenceNo);
        } else {
          reasoning.push(`PASSED: ${decision.question}`);
        }
      } catch (error) {
        this.logger.error(`Error evaluating decision ${decision.id}:`, error);
        results.set(decision.id, false);
        allPassed = false;
        reasoning.push(`ERROR: ${decision.question} - Evaluation failed`);
      }
    }

    // Log audit trail (store.insert will add id, createdAt, updatedAt)
    const auditData = {
      decisionId: 'FULL_VALIDATION',
      timestamp: new Date().toISOString(),
      input: {
        dataType: request.dataType,
        source: request.source,
        metadata: request.metadata
      },
      result: allPassed,
      reasoning: [...reasoning],
      metadata: {
        userId: request.userId,
        auditId
      }
    };
    
    const audit = this.store.insert(SovereigntyValidator.AUDIT_COLLECTION, auditData);

    return {
      sovereigntyApproved: allPassed,
      decisionId: 'FULL_VALIDATION',
      reasoning,
      recommendations,
      auditId,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Quick validation - runs only critical checks (priority >= 8)
   */
  async quickValidate(request: ValidationRequest): Promise<ValidationResult> {
    const criticalDecisions = this.coreDecisions.filter(d => d.priority >= 8);
    const reasoning: string[] = [];
    const recommendations: string[] = [];
    
    let allPassed = true;
    const results = new Map<string, boolean>();
    
    for (const decision of criticalDecisions) {
      try {
        const result = await this.evaluateDecision(decision, request, results);
        results.set(decision.id, result);
        
        if (!result) {
          allPassed = false;
          reasoning.push(`FAILED: ${decision.question}`);
          recommendations.push(decision.consequenceNo);
        } else {
          reasoning.push(`PASSED: ${decision.question}`);
        }
      } catch (error) {
        this.logger.error(`Error in quick validation ${decision.id}:`, error);
        allPassed = false;
        reasoning.push(`ERROR: ${decision.question}`);
      }
    }

    const auditId = `quick_audit_${Date.now()}`;
    
    return {
      sovereigntyApproved: allPassed,
      decisionId: 'QUICK_VALIDATION',
      reasoning,
      recommendations,
      auditId,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get validation history for a user or data type
   */
  getValidationHistory(userId?: string, limit = 50): DecisionAudit[] {
    // Get recent audits and filter by userId if provided
    const recentAudits = this.store.recent<DecisionAudit>(SovereigntyValidator.AUDIT_COLLECTION, 1000); // Get larger set for filtering
    
    let filtered = recentAudits;
    if (userId) {
      filtered = recentAudits.filter(audit => 
        audit.metadata?.userId === userId
      );
    }
    
    // Return limited results
    return filtered.slice(0, limit);
  }

  /**
   * Get sovereignty status (GREEN/YELLOW/RED)
   */
  getSovereigntyStatus(): { status: 'GREEN' | 'YELLOW' | 'RED'; message: string; lastCheck: string } {
    const recentAudits = this.getValidationHistory(undefined, 10);
    
    if (recentAudits.length === 0) {
      return {
        status: 'GREEN',
        message: 'No validation history - system ready',
        lastCheck: new Date().toISOString()
      };
    }
    
    const failedCount = recentAudits.filter(a => !a.result).length;
    const totalCount = recentAudits.length;
    const failureRate = failedCount / totalCount;
    
    if (failureRate >= 0.5) {
      return {
        status: 'RED',
        message: `High failure rate: ${failedCount}/${totalCount} validations failed`,
        lastCheck: recentAudits[0].timestamp
      };
    } else if (failureRate >= 0.2) {
      return {
        status: 'YELLOW',
        message: `Moderate failure rate: ${failedCount}/${totalCount} validations failed`,
        lastCheck: recentAudits[0].timestamp
      };
    } else {
      return {
        status: 'GREEN',
        message: `Low failure rate: ${failedCount}/${totalCount} validations failed`,
        lastCheck: recentAudits[0].timestamp
      };
    }
  }

  /**
   * Add custom decision rule
   */
  addDecision(decision: BinaryDecision): void {
    const existing = this.coreDecisions.find(d => d.id === decision.id);
    if (existing) {
      this.logger.warn(`Decision ${decision.id} already exists, updating`);
      const index = this.coreDecisions.indexOf(existing);
      this.coreDecisions[index] = decision;
    } else {
      this.coreDecisions.push(decision);
    }
    
    // Update store
    this.store.update(SovereigntyValidator.COLLECTION, 'core-decisions', { decisions: this.coreDecisions });
  }

  // ── Private helpers ─────────────────────────────────────────────

  private initializeDecisions(): void {
    const existing = this.store.get(SovereigntyValidator.COLLECTION, 'core-decisions');
    if (!existing) {
      this.store.insert(SovereigntyValidator.COLLECTION, {
        id: 'core-decisions',
        decisions: this.coreDecisions,
        version: '1.0.0',
        createdAt: new Date().toISOString()
      });
      this.logger.info('Initialized core sovereignty decisions');
    } else {
      // Could merge or update decisions here
      this.logger.info('Core decisions already initialized');
    }
  }

  private sortDecisionsByDependency(decisions: BinaryDecision[]): BinaryDecision[] {
    const sorted: BinaryDecision[] = [];
    const visited = new Set<string>();
    
    const visit = (decision: BinaryDecision) => {
      if (visited.has(decision.id)) return;
      
      visited.add(decision.id);
      
      // Visit dependencies first
      for (const depId of decision.dependencies) {
        const dep = decisions.find(d => d.id === depId);
        if (dep) {
          visit(dep);
        }
      }
      
      sorted.push(decision);
    };
    
    // Start with highest priority decisions
    const priorityOrder = [...decisions].sort((a, b) => b.priority - a.priority);
    
    for (const decision of priorityOrder) {
      if (!visited.has(decision.id)) {
        visit(decision);
      }
    }
    
    return sorted;
  }

  private async evaluateDecision(
    decision: BinaryDecision, 
    request: ValidationRequest,
    previousResults: Map<string, boolean>
  ): Promise<boolean> {
    // Check dependencies first
    for (const depId of decision.dependencies) {
      const depResult = previousResults.get(depId);
      if (depResult === undefined) {
        throw new Error(`Dependency ${depId} not evaluated before ${decision.id}`);
      }
      if (!depResult) {
        this.logger.debug(`Decision ${decision.id} failed due to dependency ${depId}`);
        return false;
      }
    }
    
    // Evaluate criteria based on decision type
    switch (decision.id) {
      case 'DATA_TYPE_VALIDATION':
        return this.evaluateDataType(request);
        
      case 'SOURCE_VALIDATION':
        return this.evaluateSource(request);
        
      case 'ENCRYPTION_VALIDATION':
        return this.evaluateEncryption(request);
        
      case 'LEGAL_COMPLIANCE':
        return this.evaluateLegalCompliance(request);
        
      case 'LOCAL_STORAGE_CAPABILITY':
        return this.evaluateLocalStorage(request);
        
      default:
        // For custom decisions, use generic evaluation
        return this.evaluateGenericCriteria(decision, request);
    }
  }

  private evaluateDataType(request: ValidationRequest): boolean {
    const rejectedTypes = [
      'biometric',
      'facial',
      'fingerprint',
      'iris',
      'behavioral',
      'tracking',
      'analytics',
      'surveillance'
    ];
    
    const dataTypeLower = request.dataType.toLowerCase();
    
    // Check for rejected types
    for (const rejected of rejectedTypes) {
      if (dataTypeLower.includes(rejected)) {
        return false;
      }
    }
    
    // Check size if provided
    if (request.metadata.size && request.metadata.size > 1000000000) { // 1GB
      return false;
    }
    
    return true;
  }

  private evaluateSource(request: ValidationRequest): boolean {
    const trustedSources = [
      'user-created',
      'family',
      'trusted-contact',
      'self',
      'sovereign-entity'
    ];
    
    const sourceLower = request.source.toLowerCase();
    
    // Check for trusted sources
    for (const trusted of trustedSources) {
      if (sourceLower.includes(trusted)) {
        return true;
      }
    }
    
    // Check for untrusted sources
    const untrustedSources = [
      'third-party',
      'advertising',
      'tracking',
      'analytics',
      'social-media'
    ];
    
    for (const untrusted of untrustedSources) {
      if (sourceLower.includes(untrusted)) {
        return false;
      }
    }
    
    // Default to false for unknown sources
    return false;
  }

  private evaluateEncryption(request: ValidationRequest): boolean {
    // Check if encryption metadata is present
    const encryption = request.metadata.encryption;
    
    if (!encryption) {
      return false;
    }
    
    // Check for client-side encryption
    if (encryption.location !== 'client-side') {
      return false;
    }
    
    // Check for user-controlled keys
    if (!encryption.userControlledKeys) {
      return false;
    }
    
    // Check algorithm (basic check for post-quantum)
    const acceptableAlgorithms = ['kyber', 'dilithium', 'falcon', 'sphincs+', 'aes-256'];
    if (!acceptableAlgorithms.some(algo => encryption.algorithm?.toLowerCase().includes(algo))) {
      return false;
    }
    
    return true;
  }

  private evaluateLegalCompliance(request: ValidationRequest): boolean {
    // Basic legal compliance check
    const restrictedContent = [
      'copyright-violation',
      'illegal',
      'restricted',
      'classified',
      'proprietary'
    ];
    
    const contentType = request.metadata.contentType || '';
    const contentTypeLower = contentType.toLowerCase();
    
    for (const restricted of restrictedContent) {
      if (contentTypeLower.includes(restricted)) {
        return false;
      }
    }
    
    // Check for personal/family documentation (generally acceptable)
    const acceptableContent = [
      'personal',
      'family',
      'medical',
      'legal',
      'financial'
    ];
    
    for (const acceptable of acceptableContent) {
      if (contentTypeLower.includes(acceptable)) {
        return true;
      }
    }
    
    // Default to true for unknown content (user responsibility)
    return true;
  }

  private evaluateLocalStorage(request: ValidationRequest): boolean {
    // Check size
    const size = request.metadata.size || 0;
    if (size > 1000000000) { // 1GB
      return false;
    }
    
    // Check format compatibility
    const compatibleFormats = [
      'text/plain',
      'application/json',
      'text/csv',
      'application/pdf',
      'image/png',
      'image/jpeg',
      'application/octet-stream'
    ];
    
    const mimeType = request.metadata.mimeType || '';
    if (mimeType && !compatibleFormats.includes(mimeType)) {
      // Check if it's convertible
      const convertibleFormats = [
        'application/vnd.google-apps.document',
        'application/vnd.google-apps.spreadsheet',
        'application/vnd.google-apps.presentation'
      ];
      
      if (!convertibleFormats.includes(mimeType)) {
        return false;
      }
    }
    
    return true;
  }

  private evaluateGenericCriteria(decision: BinaryDecision, request: ValidationRequest): boolean {
    // For custom decisions, evaluate based on request metadata
    // This is a simple implementation - could be enhanced with rule engine
    this.logger.debug(`Evaluating generic criteria for decision: ${decision.id}`);
    return true; // Default to true for custom decisions (user-defined logic)
  }
}