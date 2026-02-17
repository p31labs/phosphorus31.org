/**
 * Quantum SOP Generator
 * 
 * Generates Standard Operating Procedures using quantum brain principles.
 * Built with love and light, as above so below.
 * 
 * The SOP generator uses quantum coherence principles to create optimal
 * procedures that balance efficiency, safety, and adaptability.
 */

import { Logger } from '../utils/logger';
import { QuantumBrainBridge } from './index';

export interface SOPContext {
  domain: string; // e.g., 'legal', 'medical', 'technical', 'operational'
  objective: string; // What the SOP should accomplish
  constraints?: string[]; // Any constraints or requirements
  priority?: 'low' | 'normal' | 'high' | 'critical';
  audience?: string; // Who will use this SOP
}

export interface SOPStep {
  id: string;
  order: number;
  action: string;
  description: string;
  verification?: string; // How to verify this step
  dependencies?: string[]; // Step IDs this depends on
  quantumWeight?: number; // Quantum coherence weight (0-1)
}

export interface GeneratedSOP {
  id: string;
  title: string;
  domain: string;
  objective: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  steps: SOPStep[];
  quantumMetrics: {
    coherence: number; // Quantum coherence score (0-1)
    efficiency: number; // Efficiency score (0-1)
    adaptability: number; // Adaptability score (0-1)
    stability: number; // Stability score (0-1)
  };
  metadata: {
    estimatedDuration: number; // Minutes
    complexity: 'simple' | 'moderate' | 'complex' | 'critical';
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    requiresApproval: boolean;
  };
}

export class QuantumSOPGenerator {
  private logger: Logger;
  private quantumBrain: QuantumBrainBridge;
  private sopCache: Map<string, GeneratedSOP> = new Map();

  constructor(quantumBrain: QuantumBrainBridge) {
    this.logger = new Logger('QuantumSOPGenerator');
    this.quantumBrain = quantumBrain;
    this.logger.info('Quantum SOP Generator initialized');
  }

  /**
   * Generate a new SOP using quantum brain principles
   */
  async generateSOP(context: SOPContext): Promise<GeneratedSOP> {
    this.logger.info(`Generating SOP for domain: ${context.domain}, objective: ${context.objective}`);

    // Get quantum brain decision for SOP structure
    const quantumDecision = await this.quantumBrain.makeDecision({
      type: 'sop_generation',
      data: context,
    });

    // Generate SOP structure using quantum coherence principles
    const steps = await this.generateSteps(context, quantumDecision);
    
    // Calculate quantum metrics
    const quantumMetrics = this.calculateQuantumMetrics(steps, context);
    
    // Generate metadata
    const metadata = this.generateMetadata(steps, context);

    const sop: GeneratedSOP = {
      id: this.generateSOPId(context),
      title: this.generateTitle(context),
      domain: context.domain,
      objective: context.objective,
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      steps,
      quantumMetrics,
      metadata,
    };

    // Cache the SOP
    this.sopCache.set(sop.id, sop);

    this.logger.info(`SOP generated: ${sop.id} with ${steps.length} steps`);
    return sop;
  }

  /**
   * Generate SOP steps using quantum coherence principles
   */
  private async generateSteps(
    context: SOPContext,
    quantumDecision: any
  ): Promise<SOPStep[]> {
    const steps: SOPStep[] = [];
    
    // Use quantum decision to determine optimal step structure
    const stepCount = this.determineOptimalStepCount(context, quantumDecision);
    
    // Generate steps with quantum coherence
    for (let i = 0; i < stepCount; i++) {
      const step: SOPStep = {
        id: `step-${i + 1}`,
        order: i + 1,
        action: await this.generateStepAction(context, i, stepCount),
        description: await this.generateStepDescription(context, i, stepCount),
        verification: this.generateVerification(context, i),
        dependencies: i > 0 ? [`step-${i}`] : [],
        quantumWeight: this.calculateQuantumWeight(i, stepCount),
      };
      steps.push(step);
    }

    return steps;
  }

  /**
   * Determine optimal number of steps using quantum principles
   */
  private determineOptimalStepCount(context: SOPContext, quantumDecision: any): number {
    // Base count on complexity and quantum coherence
    const baseCount = context.priority === 'critical' ? 8 : 
                     context.priority === 'high' ? 6 :
                     context.priority === 'normal' ? 4 : 3;
    
    // Adjust based on quantum decision confidence
    const quantumAdjustment = Math.round(quantumDecision.confidence * 2);
    
    return Math.min(baseCount + quantumAdjustment, 12);
  }

  /**
   * Generate step action using quantum brain
   */
  private async generateStepAction(
    context: SOPContext,
    stepIndex: number,
    totalSteps: number
  ): Promise<string> {
    // Use quantum brain to generate optimal action
    const actionDecision = await this.quantumBrain.makeDecision({
      type: 'sop_step_action',
      data: {
        domain: context.domain,
        stepIndex,
        totalSteps,
        objective: context.objective,
      },
    });

    // Generate action based on domain and step position
    const actionTemplates = this.getActionTemplates(context.domain);
    const template = actionTemplates[stepIndex % actionTemplates.length];
    
    return `${template} (quantum coherence: ${actionDecision.confidence.toFixed(2)})`;
  }

  /**
   * Generate step description
   */
  private async generateStepDescription(
    context: SOPContext,
    stepIndex: number,
    totalSteps: number
  ): Promise<string> {
    const phase = stepIndex < totalSteps / 3 ? 'initialization' :
                  stepIndex < (totalSteps * 2) / 3 ? 'execution' : 'completion';
    
    return `Step ${stepIndex + 1} of ${totalSteps}: ${phase} phase for ${context.objective}`;
  }

  /**
   * Generate verification method
   */
  private generateVerification(context: SOPContext, stepIndex: number): string {
    const verifications = [
      'Verify output matches expected result',
      'Check all dependencies are satisfied',
      'Confirm state transition completed',
      'Validate data integrity',
      'Test system response',
    ];
    
    return verifications[stepIndex % verifications.length];
  }

  /**
   * Calculate quantum weight for step
   */
  private calculateQuantumWeight(stepIndex: number, totalSteps: number): number {
    // Quantum coherence is highest in the middle steps
    const normalizedPosition = stepIndex / totalSteps;
    const coherence = 1 - Math.abs(normalizedPosition - 0.5) * 2;
    return Math.max(0.3, coherence);
  }

  /**
   * Calculate quantum metrics for the SOP
   */
  private calculateQuantumMetrics(steps: SOPStep[], context: SOPContext) {
    const avgQuantumWeight = steps.reduce((sum, step) => 
      sum + (step.quantumWeight || 0), 0) / steps.length;
    
    return {
      coherence: avgQuantumWeight,
      efficiency: this.calculateEfficiency(steps),
      adaptability: this.calculateAdaptability(steps, context),
      stability: this.calculateStability(steps),
    };
  }

  private calculateEfficiency(steps: SOPStep[]): number {
    // Efficiency based on step count and dependencies
    const avgDependencies = steps.reduce((sum, step) => 
      sum + (step.dependencies?.length || 0), 0) / steps.length;
    return Math.max(0.5, 1 - (avgDependencies / steps.length));
  }

  private calculateAdaptability(steps: SOPStep[], context: SOPContext): number {
    // Adaptability based on verification steps and flexibility
    const verificationCount = steps.filter(s => s.verification).length;
    return Math.min(1, 0.5 + (verificationCount / steps.length) * 0.5);
  }

  private calculateStability(steps: SOPStep[]): number {
    // Stability based on dependency structure
    const hasCircularDeps = this.hasCircularDependencies(steps);
    return hasCircularDeps ? 0.6 : 0.9;
  }

  private hasCircularDependencies(steps: SOPStep[]): boolean {
    // Simple check for circular dependencies
    const visited = new Set<string>();
    const recStack = new Set<string>();
    
    for (const step of steps) {
      if (this.hasCycle(step, steps, visited, recStack)) {
        return true;
      }
    }
    return false;
  }

  private hasCycle(
    step: SOPStep,
    allSteps: SOPStep[],
    visited: Set<string>,
    recStack: Set<string>
  ): boolean {
    if (recStack.has(step.id)) return true;
    if (visited.has(step.id)) return false;
    
    visited.add(step.id);
    recStack.add(step.id);
    
    for (const depId of step.dependencies || []) {
      const depStep = allSteps.find(s => s.id === depId);
      if (depStep && this.hasCycle(depStep, allSteps, visited, recStack)) {
        return true;
      }
    }
    
    recStack.delete(step.id);
    return false;
  }

  /**
   * Generate metadata for the SOP
   */
  private generateMetadata(steps: SOPStep[], context: SOPContext) {
    const estimatedDuration = steps.length * 5; // 5 minutes per step average
    const complexity = steps.length <= 4 ? 'simple' :
                      steps.length <= 6 ? 'moderate' :
                      steps.length <= 8 ? 'complex' : 'critical';
    const riskLevel = context.priority === 'critical' ? 'critical' :
                     context.priority === 'high' ? 'high' :
                     context.priority === 'normal' ? 'medium' : 'low';

    return {
      estimatedDuration,
      complexity,
      riskLevel,
      requiresApproval: riskLevel === 'high' || riskLevel === 'critical',
    };
  }

  /**
   * Get action templates by domain
   */
  private getActionTemplates(domain: string): string[] {
    const templates: Record<string, string[]> = {
      legal: [
        'Review legal requirements',
        'Gather necessary documents',
        'Prepare filing',
        'Submit to appropriate authority',
        'Monitor status',
        'Follow up as needed',
      ],
      medical: [
        'Assess patient condition',
        'Review medical history',
        'Perform examination',
        'Document findings',
        'Prescribe treatment',
        'Schedule follow-up',
      ],
      technical: [
        'Analyze requirements',
        'Design solution',
        'Implement changes',
        'Test implementation',
        'Deploy to production',
        'Monitor results',
      ],
      operational: [
        'Define objective',
        'Gather resources',
        'Execute plan',
        'Monitor progress',
        'Adjust as needed',
        'Complete and document',
      ],
    };

    return templates[domain] || templates.operational;
  }

  /**
   * Generate SOP ID
   */
  private generateSOPId(context: SOPContext): string {
    const domainPrefix = context.domain.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString(36);
    return `SOP-${domainPrefix}-${timestamp}`;
  }

  /**
   * Generate SOP title
   */
  private generateTitle(context: SOPContext): string {
    return `Standard Operating Procedure: ${context.objective}`;
  }

  /**
   * Get cached SOP
   */
  getSOP(id: string): GeneratedSOP | undefined {
    return this.sopCache.get(id);
  }

  /**
   * List all generated SOPs
   */
  listSOPs(domain?: string): GeneratedSOP[] {
    const sops = Array.from(this.sopCache.values());
    return domain ? sops.filter(sop => sop.domain === domain) : sops;
  }

  /**
   * Update existing SOP
   */
  async updateSOP(id: string, updates: Partial<SOPContext>): Promise<GeneratedSOP> {
    const existing = this.sopCache.get(id);
    if (!existing) {
      throw new Error(`SOP ${id} not found`);
    }

    const updatedContext: SOPContext = {
      domain: updates.domain || existing.domain,
      objective: updates.objective || existing.objective,
      constraints: updates.constraints || [],
      priority: updates.priority || 'normal',
      audience: updates.audience,
    };

    const updated = await this.generateSOP(updatedContext);
    updated.id = id; // Keep original ID
    updated.version = this.incrementVersion(existing.version);
    updated.createdAt = existing.createdAt; // Keep original creation date
    
    this.sopCache.set(id, updated);
    return updated;
  }

  private incrementVersion(version: string): string {
    const [major, minor, patch] = version.split('.').map(Number);
    return `${major}.${minor}.${patch + 1}`;
  }

  /**
   * Export SOP to various formats
   */
  exportSOP(id: string, format: 'json' | 'markdown' | 'pdf' = 'json'): string {
    const sop = this.sopCache.get(id);
    if (!sop) {
      throw new Error(`SOP ${id} not found`);
    }

    switch (format) {
      case 'json':
        return JSON.stringify(sop, null, 2);
      case 'markdown':
        return this.exportToMarkdown(sop);
      case 'pdf':
        // PDF export would require additional library
        return this.exportToMarkdown(sop); // Fallback to markdown
      default:
        return JSON.stringify(sop, null, 2);
    }
  }

  private exportToMarkdown(sop: GeneratedSOP): string {
    let md = `# ${sop.title}\n\n`;
    md += `**Domain:** ${sop.domain}\n`;
    md += `**Objective:** ${sop.objective}\n`;
    md += `**Version:** ${sop.version}\n`;
    md += `**Created:** ${sop.createdAt}\n`;
    md += `**Updated:** ${sop.updatedAt}\n\n`;
    
    md += `## Quantum Metrics\n\n`;
    md += `- **Coherence:** ${(sop.quantumMetrics.coherence * 100).toFixed(1)}%\n`;
    md += `- **Efficiency:** ${(sop.quantumMetrics.efficiency * 100).toFixed(1)}%\n`;
    md += `- **Adaptability:** ${(sop.quantumMetrics.adaptability * 100).toFixed(1)}%\n`;
    md += `- **Stability:** ${(sop.quantumMetrics.stability * 100).toFixed(1)}%\n\n`;
    
    md += `## Metadata\n\n`;
    md += `- **Estimated Duration:** ${sop.metadata.estimatedDuration} minutes\n`;
    md += `- **Complexity:** ${sop.metadata.complexity}\n`;
    md += `- **Risk Level:** ${sop.metadata.riskLevel}\n`;
    md += `- **Requires Approval:** ${sop.metadata.requiresApproval ? 'Yes' : 'No'}\n\n`;
    
    md += `## Steps\n\n`;
    for (const step of sop.steps) {
      md += `### Step ${step.order}: ${step.action}\n\n`;
      md += `${step.description}\n\n`;
      if (step.verification) {
        md += `**Verification:** ${step.verification}\n\n`;
      }
      if (step.dependencies && step.dependencies.length > 0) {
        md += `**Depends on:** ${step.dependencies.join(', ')}\n\n`;
      }
      if (step.quantumWeight) {
        md += `**Quantum Weight:** ${(step.quantumWeight * 100).toFixed(1)}%\n\n`;
      }
    }
    
    md += `---\n\n`;
    md += `*Generated by P31 Quantum SOP Generator*\n`;
    md += `*The Mesh Holds. 🔺*\n`;
    md += `*💜 With love and light. As above, so below. 💜*\n`;
    
    return md;
  }
}

export default QuantumSOPGenerator;
