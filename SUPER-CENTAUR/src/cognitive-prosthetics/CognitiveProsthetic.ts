/**
 * Cognitive Prosthetic
 * Assistive technology for neurodivergent cognitive support
 * 
 * Built with love and light. As above, so below. 💜
 * The Mesh Holds. 🔺
 * 
 * @license
 * Copyright 2026 P31 Labs
 * Licensed under the AGPLv3 License
 */

import { Logger } from '../utils/logger';

export interface CognitiveState {
  attention: number; // 0-100
  executiveFunction: number; // 0-100
  workingMemory: number; // 0-100
  emotionalRegulation: number; // 0-100
  sensoryProcessing: number; // 0-100
  timestamp: number;
}

export interface ProstheticConfig {
  enableAttentionSupport: boolean;
  enableExecutiveFunctionSupport: boolean;
  enableWorkingMemorySupport: boolean;
  enableEmotionalRegulation: boolean;
  enableSensorySupport: boolean;
  attentionThreshold: number; // Alert when below this
  executiveFunctionThreshold: number;
  workingMemoryThreshold: number;
  emotionalRegulationThreshold: number;
  sensoryProcessingThreshold: number;
}

export interface ProstheticIntervention {
  type: 'attention' | 'executive' | 'memory' | 'emotional' | 'sensory' | 'combined';
  severity: 'low' | 'medium' | 'high';
  message: string;
  actions: string[];
  timestamp: number;
}

export class CognitiveProsthetic {
  private logger: Logger;
  private config: ProstheticConfig;
  private currentState: CognitiveState | null = null;
  private interventionHistory: ProstheticIntervention[] = [];
  private stateHistory: CognitiveState[] = [];
  private maxHistorySize: number = 100;

  constructor(config?: Partial<ProstheticConfig>) {
    this.logger = new Logger('CognitiveProsthetic');
    this.config = {
      enableAttentionSupport: true,
      enableExecutiveFunctionSupport: true,
      enableWorkingMemorySupport: true,
      enableEmotionalRegulation: true,
      enableSensorySupport: true,
      attentionThreshold: 30,
      executiveFunctionThreshold: 30,
      workingMemoryThreshold: 30,
      emotionalRegulationThreshold: 30,
      sensoryProcessingThreshold: 30,
      ...config,
    };
  }

  /**
   * Update cognitive state
   */
  public updateState(state: Partial<CognitiveState>): void {
    const newState: CognitiveState = {
      attention: state.attention ?? this.currentState?.attention ?? 50,
      executiveFunction: state.executiveFunction ?? this.currentState?.executiveFunction ?? 50,
      workingMemory: state.workingMemory ?? this.currentState?.workingMemory ?? 50,
      emotionalRegulation: state.emotionalRegulation ?? this.currentState?.emotionalRegulation ?? 50,
      sensoryProcessing: state.sensoryProcessing ?? this.currentState?.sensoryProcessing ?? 50,
      timestamp: Date.now(),
    };

    this.currentState = newState;
    this.stateHistory.push(newState);
    
    // Keep history size manageable
    if (this.stateHistory.length > this.maxHistorySize) {
      this.stateHistory.shift();
    }

    // Check for interventions
    this.checkInterventions();
  }

  /**
   * Check if interventions are needed
   */
  private checkInterventions(): void {
    if (!this.currentState) return;

    const interventions: ProstheticIntervention[] = [];

    // Attention support
    if (this.config.enableAttentionSupport && 
        this.currentState.attention < this.config.attentionThreshold) {
      interventions.push(this.createAttentionIntervention());
    }

    // Executive function support
    if (this.config.enableExecutiveFunctionSupport && 
        this.currentState.executiveFunction < this.config.executiveFunctionThreshold) {
      interventions.push(this.createExecutiveFunctionIntervention());
    }

    // Working memory support
    if (this.config.enableWorkingMemorySupport && 
        this.currentState.workingMemory < this.config.workingMemoryThreshold) {
      interventions.push(this.createWorkingMemoryIntervention());
    }

    // Emotional regulation support
    if (this.config.enableEmotionalRegulation && 
        this.currentState.emotionalRegulation < this.config.emotionalRegulationThreshold) {
      interventions.push(this.createEmotionalRegulationIntervention());
    }

    // Sensory processing support
    if (this.config.enableSensorySupport && 
        this.currentState.sensoryProcessing < this.config.sensoryProcessingThreshold) {
      interventions.push(this.createSensoryProcessingIntervention());
    }

    // Record interventions
    interventions.forEach(intervention => {
      this.interventionHistory.push(intervention);
      this.logger.info(`Intervention: ${intervention.type} - ${intervention.message}`);
    });
  }

  /**
   * Create attention intervention
   */
  private createAttentionIntervention(): ProstheticIntervention {
    const severity = this.getSeverity(this.currentState!.attention);
    return {
      type: 'attention',
      severity,
      message: 'Attention support needed. Consider taking a break or using focus techniques.',
      actions: [
        'Take a 5-minute break',
        'Use focus timer (Pomodoro)',
        'Reduce environmental distractions',
        'Try deep breathing exercise',
      ],
      timestamp: Date.now(),
    };
  }

  /**
   * Create executive function intervention
   */
  private createExecutiveFunctionIntervention(): ProstheticIntervention {
    const severity = this.getSeverity(this.currentState!.executiveFunction);
    return {
      type: 'executive',
      severity,
      message: 'Executive function support needed. Break tasks into smaller steps.',
      actions: [
        'Break task into smaller steps',
        'Use task list or checklist',
        'Set reminders for important tasks',
        'Ask for help or clarification',
      ],
      timestamp: Date.now(),
    };
  }

  /**
   * Create working memory intervention
   */
  private createWorkingMemoryIntervention(): ProstheticIntervention {
    const severity = this.getSeverity(this.currentState!.workingMemory);
    return {
      type: 'memory',
      severity,
      message: 'Working memory support needed. Use external memory aids.',
      actions: [
        'Write down important information',
        'Use notes or reminders',
        'Repeat information back to confirm',
        'Use visual aids or diagrams',
      ],
      timestamp: Date.now(),
    };
  }

  /**
   * Create emotional regulation intervention
   */
  private createEmotionalRegulationIntervention(): ProstheticIntervention {
    const severity = this.getSeverity(this.currentState!.emotionalRegulation);
    return {
      type: 'emotional',
      severity,
      message: 'Emotional regulation support needed. Use calming strategies.',
      actions: [
        'Take deep breaths',
        'Use grounding techniques (5-4-3-2-1)',
        'Take a break in a quiet space',
        'Use sensory tools if available',
      ],
      timestamp: Date.now(),
    };
  }

  /**
   * Create sensory processing intervention
   */
  private createSensoryProcessingIntervention(): ProstheticIntervention {
    const severity = this.getSeverity(this.currentState!.sensoryProcessing);
    return {
      type: 'sensory',
      severity,
      message: 'Sensory processing support needed. Adjust sensory environment.',
      actions: [
        'Reduce noise or use headphones',
        'Adjust lighting (dim or brighten)',
        'Take sensory break',
        'Use weighted blanket or compression',
      ],
      timestamp: Date.now(),
    };
  }

  /**
   * Get severity level
   */
  private getSeverity(value: number): 'low' | 'medium' | 'high' {
    if (value < 20) return 'high';
    if (value < 40) return 'medium';
    return 'low';
  }

  /**
   * Get current cognitive state
   */
  public getCurrentState(): CognitiveState | null {
    return this.currentState;
  }

  /**
   * Get recent interventions
   */
  public getRecentInterventions(limit: number = 10): ProstheticIntervention[] {
    return this.interventionHistory.slice(-limit);
  }

  /**
   * Get state history
   */
  public getStateHistory(limit: number = 50): CognitiveState[] {
    return this.stateHistory.slice(-limit);
  }

  /**
   * Get cognitive health score (0-100)
   */
  public getCognitiveHealthScore(): number {
    if (!this.currentState) return 50;

    const scores = [
      this.currentState.attention,
      this.currentState.executiveFunction,
      this.currentState.workingMemory,
      this.currentState.emotionalRegulation,
      this.currentState.sensoryProcessing,
    ];

    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  /**
   * Get recommendations based on current state
   */
  public getRecommendations(): string[] {
    if (!this.currentState) return [];

    const recommendations: string[] = [];
    const healthScore = this.getCognitiveHealthScore();

    if (healthScore < 40) {
      recommendations.push('Consider taking an extended break');
      recommendations.push('Review and adjust your environment');
      recommendations.push('Consider reducing task complexity');
    } else if (healthScore < 60) {
      recommendations.push('Take regular breaks');
      recommendations.push('Use assistive tools available');
      recommendations.push('Break tasks into smaller chunks');
    } else {
      recommendations.push('Maintain current strategies');
      recommendations.push('Continue monitoring cognitive state');
    }

    return recommendations;
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<ProstheticConfig>): void {
    this.config = { ...this.config, ...config };
    this.logger.info('Configuration updated');
  }

  /**
   * Get configuration
   */
  public getConfig(): ProstheticConfig {
    return { ...this.config };
  }

  /**
   * Clear history
   */
  public clearHistory(): void {
    this.interventionHistory = [];
    this.stateHistory = [];
    this.logger.info('History cleared');
  }

  /**
   * Dispose and cleanup
   */
  public dispose(): void {
    this.clearHistory();
    this.currentState = null;
    this.logger.info('Cognitive Prosthetic disposed');
  }
}
