/**
 * Buffer Integration for Cognitive Prosthetics
 * Connects cognitive prosthetics to The Buffer's metabolism system
 * 
 * Built with love and light. As above, so below. 💜
 * The Mesh Holds. 🔺
 */

import { Logger } from '../utils/logger';
import { CognitiveProsthetic, CognitiveState } from './CognitiveProsthetic';
import { BufferClient } from '../buffer/buffer-client';

export class BufferIntegration {
  private logger: Logger;
  private prosthetic: CognitiveProsthetic;
  private bufferClient: BufferClient | null = null;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(prosthetic: CognitiveProsthetic, bufferClient?: BufferClient) {
    this.logger = new Logger('BufferIntegration');
    this.prosthetic = prosthetic;
    this.bufferClient = bufferClient || null;
  }

  /**
   * Initialize integration with The Buffer
   */
  public async init(bufferClient: BufferClient): Promise<void> {
    this.bufferClient = bufferClient;
    this.startPeriodicUpdate();
    this.logger.info('Buffer integration initialized');
  }

  /**
   * Update cognitive state from Buffer metabolism
   */
  public updateFromMetabolism(spoons: number, maxSpoons: number, stressLevel: number): void {
    // Map metabolism to cognitive state
    const spoonRatio = spoons / maxSpoons;
    
    // Cognitive state derived from metabolism
    const cognitiveState: Partial<CognitiveState> = {
      attention: Math.max(0, Math.min(100, spoonRatio * 100)),
      executiveFunction: Math.max(0, Math.min(100, (spoonRatio - 0.2) * 125)),
      workingMemory: Math.max(0, Math.min(100, spoonRatio * 90)),
      emotionalRegulation: Math.max(0, Math.min(100, (1 - stressLevel) * 100)),
      sensoryProcessing: Math.max(0, Math.min(100, spoonRatio * 80)),
    };

    this.prosthetic.updateState(cognitiveState);
    this.logger.debug('Cognitive state updated from metabolism', cognitiveState);
  }

  /**
   * Get cognitive health recommendations based on metabolism
   */
  public getMetabolismBasedRecommendations(spoons: number, maxSpoons: number): string[] {
    const recommendations: string[] = [];
    const spoonRatio = spoons / maxSpoons;

    if (spoonRatio < 0.3) {
      recommendations.push('Consider taking an extended break');
      recommendations.push('Reduce task complexity');
      recommendations.push('Use assistive tools available');
    } else if (spoonRatio < 0.5) {
      recommendations.push('Take regular breaks');
      recommendations.push('Prioritize essential tasks');
      recommendations.push('Use cognitive prosthetics features');
    } else {
      recommendations.push('Maintain current pace');
      recommendations.push('Continue using support tools');
    }

    return recommendations;
  }

  /**
   * Check if user should pause based on cognitive state
   */
  public shouldPause(): boolean {
    const state = this.prosthetic.getCurrentState();
    if (!state) return false;

    const healthScore = this.prosthetic.getCognitiveHealthScore();
    return healthScore < 30;
  }

  /**
   * Get recommended activity level based on cognitive state
   */
  public getRecommendedActivityLevel(): 'low' | 'medium' | 'high' {
    const state = this.prosthetic.getCurrentState();
    if (!state) return 'medium';

    const healthScore = this.prosthetic.getCognitiveHealthScore();
    
    if (healthScore < 40) return 'low';
    if (healthScore < 70) return 'medium';
    return 'high';
  }

  /**
   * Start periodic updates from Buffer
   */
  private startPeriodicUpdate(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // Update every 30 seconds
    this.updateInterval = setInterval(() => {
      this.updateFromBuffer();
    }, 30000);
  }

  /**
   * Update cognitive state from Buffer
   */
  private async updateFromBuffer(): Promise<void> {
    if (!this.bufferClient) return;

    try {
      // Get metabolism state from Buffer
      // This would need to be implemented in BufferClient
      // For now, we'll use a placeholder
      const metabolismState = await this.getMetabolismState();
      
      if (metabolismState) {
        this.updateFromMetabolism(
          metabolismState.spoons,
          metabolismState.maxSpoons,
          metabolismState.stressLevel || 0
        );
      }
    } catch (error) {
      this.logger.error('Error updating from Buffer:', error);
    }
  }

  /**
   * Get metabolism state (placeholder - needs BufferClient implementation)
   */
  private async getMetabolismState(): Promise<{ spoons: number; maxSpoons: number; stressLevel?: number } | null> {
    // This would call BufferClient.getMetabolismState() when implemented
    // For now, return null
    return null;
  }

  /**
   * Stop periodic updates
   */
  public stop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Dispose and cleanup
   */
  public dispose(): void {
    this.stop();
    this.bufferClient = null;
    this.logger.info('Buffer integration disposed');
  }
}
