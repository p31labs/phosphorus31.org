/**
 * Digital Self Core Wrapper
 * 
 * TypeScript wrapper for JavaScript Digital Self Core modules.
 * Provides type-safe integration with the sovereign-stack/digital-self-core.
 */

// Dynamic imports resolved at initialization time (ESM-compatible)
const GROUNDING_BASE = '../../sovereign-stack/digital-self-core/grounding-phase';

async function loadGroundingModules() {
  const [meshMod, neutralMod, metabolicMod, cognitiveMod, intentMod] = await Promise.all([
    import(`${GROUNDING_BASE}/mesh-initiation-ritual.js`),
    import(`${GROUNDING_BASE}/floating-neutral-detector.js`),
    import(`${GROUNDING_BASE}/metabolic-baseline.js`),
    import(`${GROUNDING_BASE}/cognitive-load-assessor.js`),
    import(`${GROUNDING_BASE}/intent-declaration.js`),
  ]);
  return {
    MeshInitiationRitual: meshMod.MeshInitiationRitual,
    FloatingNeutralDetector: neutralMod.FloatingNeutralDetector,
    MetabolicBaseline: metabolicMod.MetabolicBaseline,
    CognitiveLoadAssessor: cognitiveMod.CognitiveLoadAssessor,
    IntentDeclaration: intentMod.IntentDeclaration,
  };
}

// Type definitions for Grounding Phase components
export interface GroundingCheckResult {
  passed: boolean;
  details: string;
  timestamp: string;
  stabilityScore?: number;
  loadScore?: number;
  validationScore?: number;
  issues?: Array<{
    type: string;
    factor: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    value: number;
    threshold: number;
  }>;
  recommendations?: string[];
}

export interface GroundingPhaseResult {
  status: 'GROUNDING_COMPLETE' | 'GROUNDING_REQUIRED' | 'METABOLIC_INSTABILITY' | 
          'COGNITIVE_OVERLOAD' | 'INTENT_AMBIGUITY' | 'ERROR';
  message: string;
  state: {
    phase: string;
    status: string;
    progress: number;
    completedChecks: Array<{
      name: string;
      passed: boolean;
      details: string;
      timestamp: string;
    }>;
    errors: any[];
    warnings: any[];
  };
  nextPhase?: string;
  error?: string;
}

export interface SovereignOperatorStatus {
  grounded: boolean;
  metabolicStability: number;
  cognitiveLoad: number;
  intentClarity: number;
  floatingNeutralDetected: boolean;
  lastGroundingCheck: string;
  issues: string[];
}

export class DigitalSelfCoreManager {
  private meshRitual: any;
  private floatingNeutralDetector: any;
  private metabolicBaseline: any;
  private cognitiveLoadAssessor: any;
  private intentDeclaration: any;
  private initialized: boolean = false;

  constructor() {
    // Initialize components lazily
    this.meshRitual = null;
    this.floatingNeutralDetector = null;
    this.metabolicBaseline = null;
    this.cognitiveLoadAssessor = null;
    this.intentDeclaration = null;
  }

  /**
   * Initialize the Digital Self Core components
   */
  async initialize(): Promise<boolean> {
    try {
      console.log('💜 Initializing Digital Self Core...');

      // Load and initialize each component
      const modules = await loadGroundingModules();
      this.floatingNeutralDetector = new modules.FloatingNeutralDetector();
      this.metabolicBaseline = new modules.MetabolicBaseline();
      this.cognitiveLoadAssessor = new modules.CognitiveLoadAssessor();
      this.intentDeclaration = new modules.IntentDeclaration();
      this.meshRitual = new modules.MeshInitiationRitual();
      
      // Attach components to the ritual
      this.meshRitual.floatingNeutralDetector = this.floatingNeutralDetector;
      this.meshRitual.metabolicBaseline = this.metabolicBaseline;
      this.meshRitual.cognitiveLoadAssessor = this.cognitiveLoadAssessor;
      this.meshRitual.intentDeclaration = this.intentDeclaration;
      
      this.initialized = true;
      console.log('✅ Digital Self Core initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Digital Self Core:', error);
      return false;
    }
  }

  /**
   * Execute the Grounding Phase
   */
  async executeGroundingPhase(): Promise<GroundingPhaseResult> {
    if (!this.initialized) {
      const initialized = await this.initialize();
      if (!initialized) {
        return {
          status: 'ERROR',
          message: 'Digital Self Core failed to initialize',
          state: {
            phase: 'GROUNDING',
            status: 'ERROR',
            progress: 0,
            completedChecks: [],
            errors: [{ error: 'Initialization failed', timestamp: new Date().toISOString() }],
            warnings: []
          }
        };
      }
    }

    try {
      const result = await this.meshRitual.executeGroundingPhase();
      return result as GroundingPhaseResult;
    } catch (error) {
      return {
        status: 'ERROR',
        message: 'Grounding Phase execution failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        state: {
          phase: 'GROUNDING',
          status: 'ERROR',
          progress: 0,
          completedChecks: [],
          errors: [{ error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date().toISOString() }],
          warnings: []
        }
      };
    }
  }

  /**
   * Get individual component status
   */
  async getComponentStatus(): Promise<{
    floatingNeutralDetector: GroundingCheckResult;
    metabolicBaseline: GroundingCheckResult;
    cognitiveLoadAssessor: GroundingCheckResult;
    intentDeclaration: GroundingCheckResult;
  }> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const [
        neutralResult,
        metabolicResult,
        cognitiveResult,
        intentResult
      ] = await Promise.all([
        this.floatingNeutralDetector.check(),
        this.metabolicBaseline.assess(),
        this.cognitiveLoadAssessor.measure(),
        this.intentDeclaration.validate()
      ]);

      return {
        floatingNeutralDetector: neutralResult as GroundingCheckResult,
        metabolicBaseline: metabolicResult as GroundingCheckResult,
        cognitiveLoadAssessor: cognitiveResult as GroundingCheckResult,
        intentDeclaration: intentResult as GroundingCheckResult
      };
    } catch (error) {
      const errorResult: GroundingCheckResult = {
        passed: false,
        details: 'Component check failed',
        timestamp: new Date().toISOString(),
        issues: [{
          type: 'SYSTEM',
          factor: 'Component Check',
          severity: 'CRITICAL',
          value: 0,
          threshold: 1
        }]
      };

      return {
        floatingNeutralDetector: errorResult,
        metabolicBaseline: errorResult,
        cognitiveLoadAssessor: errorResult,
        intentDeclaration: errorResult
      };
    }
  }

  /**
   * Get overall sovereign operator status
   */
  async getSovereignOperatorStatus(): Promise<SovereignOperatorStatus> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const componentStatus = await this.getComponentStatus();
      const groundingResult = await this.executeGroundingPhase();
      
      const allPassed = 
        componentStatus.floatingNeutralDetector.passed &&
        componentStatus.metabolicBaseline.passed &&
        componentStatus.cognitiveLoadAssessor.passed &&
        componentStatus.intentDeclaration.passed;
      
      const issues: string[] = [];
      if (!componentStatus.floatingNeutralDetector.passed) {
        issues.push('Lost Ground detected');
      }
      if (!componentStatus.metabolicBaseline.passed) {
        issues.push('Metabolic instability');
      }
      if (!componentStatus.cognitiveLoadAssessor.passed) {
        issues.push('Cognitive overload');
      }
      if (!componentStatus.intentDeclaration.passed) {
        issues.push('Intent ambiguity');
      }

      return {
        grounded: groundingResult.status === 'GROUNDING_COMPLETE',
        metabolicStability: componentStatus.metabolicBaseline.stabilityScore || 0,
        cognitiveLoad: componentStatus.cognitiveLoadAssessor.loadScore || 0,
        intentClarity: componentStatus.intentDeclaration.validationScore || 0,
        floatingNeutralDetected: !componentStatus.floatingNeutralDetector.passed,
        lastGroundingCheck: new Date().toISOString(),
        issues
      };
    } catch (error) {
      return {
        grounded: false,
        metabolicStability: 0,
        cognitiveLoad: 0,
        intentClarity: 0,
        floatingNeutralDetected: true,
        lastGroundingCheck: new Date().toISOString(),
        issues: ['System error during status check']
      };
    }
  }

  /**
   * Check if sovereignty is grounded
   */
  async isSovereigntyGrounded(): Promise<boolean> {
    try {
      const status = await this.getSovereignOperatorStatus();
      return status.grounded;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get detailed issues if sovereignty is not grounded
   */
  async getSovereigntyIssues(): Promise<{
    issues: string[];
    recommendations: string[];
  }> {
    try {
      const componentStatus = await this.getComponentStatus();
      const issues: string[] = [];
      const recommendations: string[] = [];

      // Check each component for issues
      if (!componentStatus.floatingNeutralDetector.passed) {
        issues.push('Lost Ground - sovereignty grounding required');
        if (componentStatus.floatingNeutralDetector.recommendations) {
          recommendations.push(...componentStatus.floatingNeutralDetector.recommendations);
        }
      }

      if (!componentStatus.metabolicBaseline.passed) {
        issues.push('Metabolic instability - biological stability required');
        if (componentStatus.metabolicBaseline.recommendations) {
          recommendations.push(...componentStatus.metabolicBaseline.recommendations);
        }
      }

      if (!componentStatus.cognitiveLoadAssessor.passed) {
        issues.push('Cognitive overload - load balancing required');
        if (componentStatus.cognitiveLoadAssessor.recommendations) {
          recommendations.push(...componentStatus.cognitiveLoadAssessor.recommendations);
        }
      }

      if (!componentStatus.intentDeclaration.passed) {
        issues.push('Intent ambiguity - clarification required');
        if (componentStatus.intentDeclaration.recommendations) {
          recommendations.push(...componentStatus.intentDeclaration.recommendations);
        }
      }

      return { issues, recommendations };
    } catch (error) {
      return {
        issues: ['Unable to check sovereignty status'],
        recommendations: ['Check system initialization']
      };
    }
  }

  /**
   * Run a quick health check of Digital Self Core
   */
  async healthCheck(): Promise<{
    healthy: boolean;
    components: {
      floatingNeutralDetector: boolean;
      metabolicBaseline: boolean;
      cognitiveLoadAssessor: boolean;
      intentDeclaration: boolean;
      meshRitual: boolean;
    };
    message: string;
  }> {
    try {
      if (!this.initialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          return {
            healthy: false,
            components: {
              floatingNeutralDetector: false,
              metabolicBaseline: false,
              cognitiveLoadAssessor: false,
              intentDeclaration: false,
              meshRitual: false
            },
            message: 'Digital Self Core failed to initialize'
          };
        }
      }

      // Test each component
      const components = {
        floatingNeutralDetector: !!this.floatingNeutralDetector,
        metabolicBaseline: !!this.metabolicBaseline,
        cognitiveLoadAssessor: !!this.cognitiveLoadAssessor,
        intentDeclaration: !!this.intentDeclaration,
        meshRitual: !!this.meshRitual
      };

      const allHealthy = Object.values(components).every(comp => comp);

      return {
        healthy: allHealthy,
        components,
        message: allHealthy ? 'All components healthy' : 'Some components failed'
      };
    } catch (error) {
      return {
        healthy: false,
        components: {
          floatingNeutralDetector: false,
          metabolicBaseline: false,
          cognitiveLoadAssessor: false,
          intentDeclaration: false,
          meshRitual: false
        },
        message: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

// Export singleton instance
export const digitalSelfCoreManager = new DigitalSelfCoreManager();
