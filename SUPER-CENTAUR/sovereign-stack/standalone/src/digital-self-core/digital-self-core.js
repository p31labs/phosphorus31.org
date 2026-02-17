/**
 * Digital Self Core - Standalone Wrapper
 * 
 * Adapts the existing digital-self-core components for standalone use
 * Simple, powerful, local-first digital sovereignty
 * 
 * 💜 With neurodivergent love and style.
 */

// Import existing components (using relative paths to existing code)
import { MeshInitiationRitual } from '../../../../sovereign-stack/digital-self-core/grounding-phase/mesh-initiation-ritual.js';
import { FloatingNeutralDetector } from '../../../../sovereign-stack/digital-self-core/grounding-phase/floating-neutral-detector.js';
import { MetabolicBaseline } from '../../../../sovereign-stack/digital-self-core/grounding-phase/metabolic-baseline.js';
import { CognitiveLoadAssessor } from '../../../../sovereign-stack/digital-self-core/grounding-phase/cognitive-load-assessor.js';
import { IntentDeclaration } from '../../../../sovereign-stack/digital-self-core/grounding-phase/intent-declaration.js';

export class DigitalSelfCore {
  constructor() {
    this.meshRitual = null;
    this.floatingNeutralDetector = null;
    this.metabolicBaseline = null;
    this.cognitiveLoadAssessor = null;
    this.intentDeclaration = null;
    this.initialized = false;
    this.state = {
      grounded: false,
      groundingResult: null,
      lastGroundingCheck: null,
      issues: [],
      recommendations: []
    };
  }

  /**
   * Initialize the Digital Self Core
   * Why: We need a simple, powerful foundation for digital sovereignty
   */
  async initialize() {
    console.log('💜 Initializing Digital Self Core Standalone...');
    
    try {
      // Initialize each component
      this.floatingNeutralDetector = new FloatingNeutralDetector();
      this.metabolicBaseline = new MetabolicBaseline();
      this.cognitiveLoadAssessor = new CognitiveLoadAssessor();
      this.intentDeclaration = new IntentDeclaration();
      this.meshRitual = new MeshInitiationRitual();
      
      // Attach components to the ritual
      this.meshRitual.floatingNeutralDetector = this.floatingNeutralDetector;
      this.meshRitual.metabolicBaseline = this.metabolicBaseline;
      this.meshRitual.cognitiveLoadAssessor = this.cognitiveLoadAssessor;
      this.meshRitual.intentDeclaration = this.intentDeclaration;
      
      this.initialized = true;
      console.log('✅ Digital Self Core Standalone Initialized');
      console.log('💜 "Structure determines performance. Grounding determines connection."');
      
      return true;
    } catch (error) {
      console.error('❌ Digital Self Core Initialization Failed:', error);
      throw error;
    }
  }

  /**
   * Execute Grounding Phase
   * Why: Sovereignty requires proper grounding before connection
   */
  async groundingPhase() {
    if (!this.initialized) {
      await this.initialize();
    }
    
    console.log('⚡ Executing Digital Self Core Grounding Phase...');
    
    try {
      const result = await this.meshRitual.executeGroundingPhase();
      
      // Simplify result for standalone use
      const simplifiedResult = {
        grounded: result.status === 'GROUNDING_COMPLETE',
        status: result.status,
        message: result.message,
        timestamp: new Date().toISOString(),
        components: {
          floatingNeutralDetector: await this.floatingNeutralDetector.check(),
          metabolicBaseline: await this.metabolicBaseline.assess(),
          cognitiveLoadAssessor: await this.cognitiveLoadAssessor.measure(),
          intentDeclaration: await this.intentDeclaration.validate()
        }
      };
      
      // Update internal state
      this.state.grounded = simplifiedResult.grounded;
      this.state.groundingResult = simplifiedResult;
      this.state.lastGroundingCheck = simplifiedResult.timestamp;
      
      // Extract issues and recommendations
      this.state.issues = this.extractIssues(simplifiedResult);
      this.state.recommendations = this.extractRecommendations(simplifiedResult);
      
      if (simplifiedResult.grounded) {
        console.log('✅ Digital Self Core Grounded Successfully');
      } else {
        console.log('⚠️ Digital Self Core Grounding Failed');
        console.log('Issues:', this.state.issues);
      }
      
      return simplifiedResult;
    } catch (error) {
      console.error('❌ Grounding Phase Failed:', error);
      
      return {
        grounded: false,
        status: 'ERROR',
        message: `Grounding phase failed: ${error.message}`,
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }

  /**
   * Quick Grounding Check
   * Why: Fast check without full ritual execution
   */
  async quickGroundingCheck() {
    if (!this.initialized) {
      await this.initialize();
    }
    
    console.log('🔍 Quick Grounding Check...');
    
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
      
      const allPassed = 
        neutralResult.passed &&
        metabolicResult.passed &&
        cognitiveResult.passed &&
        intentResult.passed;
      
      const result = {
        grounded: allPassed,
        status: allPassed ? 'GROUNDING_STABLE' : 'GROUNDING_UNSTABLE',
        message: allPassed ? 'All grounding components stable' : 'Grounding components unstable',
        timestamp: new Date().toISOString(),
        components: {
          floatingNeutralDetector: neutralResult,
          metabolicBaseline: metabolicResult,
          cognitiveLoadAssessor: cognitiveResult,
          intentDeclaration: intentResult
        }
      };
      
      return result;
    } catch (error) {
      console.error('❌ Quick Grounding Check Failed:', error);
      
      return {
        grounded: false,
        status: 'ERROR',
        message: `Quick check failed: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get Digital Self Core Status
   * Why: Quick status check without full grounding
   */
  async getStatus() {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const quickCheck = await this.quickGroundingCheck();
    
    return {
      grounded: this.state.grounded,
      lastGroundingCheck: this.state.lastGroundingCheck,
      quickCheck: quickCheck,
      issues: this.state.issues,
      recommendations: this.state.recommendations,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Extract issues from grounding result
   * Why: We need clear, actionable issues
   */
  extractIssues(groundingResult) {
    const issues = [];
    
    if (groundingResult.status !== 'GROUNDING_COMPLETE') {
      issues.push(`Grounding status: ${groundingResult.status}`);
    }
    
    // Check each component for issues
    const components = groundingResult.components || {};
    
    Object.entries(components).forEach(([componentName, componentResult]) => {
      if (!componentResult.passed) {
        issues.push(`${componentName}: ${componentResult.details || 'Check failed'}`);
      }
    });
    
    return issues;
  }

  /**
   * Extract recommendations from grounding result
   * Why: We need actionable steps to improve grounding
   */
  extractRecommendations(groundingResult) {
    const recommendations = [];
    
    if (!groundingResult.grounded) {
      recommendations.push('Execute full grounding phase');
    }
    
    // Extract recommendations from component results
    const components = groundingResult.components || {};
    
    Object.entries(components).forEach(([componentName, componentResult]) => {
      if (componentResult.recommendations && componentResult.recommendations.length > 0) {
        recommendations.push(...componentResult.recommendations.map(rec => 
          `${componentName}: ${typeof rec === 'object' ? rec.action || rec : rec}`
        ));
      }
    });
    
    // Add general recommendations
    if (recommendations.length === 0 && groundingResult.grounded) {
      recommendations.push('Maintain current grounding practices');
      recommendations.push('Monitor grounding status regularly');
    }
    
    return recommendations.slice(0, 5); // Limit to 5 most important
  }

  /**
   * Export Digital Self Core State
   * Why: For backup, migration, or analysis
   */
  exportState() {
    return {
      state: this.state,
      initialized: this.initialized,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Reset Digital Self Core
   * Why: Fresh start when needed
   */
  async reset() {
    console.log('🔄 Resetting Digital Self Core...');
    
    // Reset each component if it has a reset method
    if (this.floatingNeutralDetector?.reset) await this.floatingNeutralDetector.reset();
    if (this.metabolicBaseline?.reset) await this.metabolicBaseline.reset();
    if (this.cognitiveLoadAssessor?.reset) await this.cognitiveLoadAssessor.reset();
    if (this.intentDeclaration?.reset) await this.intentDeclaration.reset();
    
    // Reset internal state
    this.state = {
      grounded: false,
      groundingResult: null,
      lastGroundingCheck: null,
      issues: [],
      recommendations: []
    };
    
    console.log('✅ Digital Self Core Reset');
  }

  /**
   * Simple Health Check
   * Why: Quick check if Digital Self Core is operational
   */
  async healthCheck() {
    return {
      healthy: this.initialized,
      components: {
        floatingNeutralDetector: !!this.floatingNeutralDetector,
        metabolicBaseline: !!this.metabolicBaseline,
        cognitiveLoadAssessor: !!this.cognitiveLoadAssessor,
        intentDeclaration: !!this.intentDeclaration,
        meshRitual: !!this.meshRitual
      },
      grounded: this.state.grounded,
      timestamp: new Date().toISOString()
    };
  }
}

// Default export for convenience
export default DigitalSelfCore;