/**
 * Cognitive Prosthetics Manager
 * Central manager for all cognitive prosthetic systems
 * 
 * Built with love and light. As above, so below. 💜
 * The Mesh Holds. 🔺
 */

import { Logger } from '../utils/logger';
import { CognitiveProsthetic } from './CognitiveProsthetic';
import { AttentionSupport } from './AttentionSupport';
import { ExecutiveFunctionSupport } from './ExecutiveFunctionSupport';
import { WorkingMemorySupport } from './WorkingMemorySupport';
import { BufferIntegration } from './BufferIntegration';
import { BufferClient } from '../buffer/buffer-client';

export class CognitiveProstheticsManager {
  private logger: Logger;
  private prosthetic: CognitiveProsthetic;
  private attention: AttentionSupport;
  private executive: ExecutiveFunctionSupport;
  private memory: WorkingMemorySupport;
  private bufferIntegration: BufferIntegration | null = null;

  constructor(bufferClient?: BufferClient) {
    this.logger = new Logger('CognitiveProstheticsManager');
    
    this.prosthetic = new CognitiveProsthetic();
    this.attention = new AttentionSupport();
    this.executive = new ExecutiveFunctionSupport();
    this.memory = new WorkingMemorySupport();
    
    if (bufferClient) {
      this.bufferIntegration = new BufferIntegration(this.prosthetic, bufferClient);
    }
  }

  /**
   * Initialize all systems
   */
  public async init(bufferClient?: BufferClient): Promise<void> {
    if (bufferClient && !this.bufferIntegration) {
      this.bufferIntegration = new BufferIntegration(this.prosthetic, bufferClient);
      await this.bufferIntegration.init(bufferClient);
    } else if (this.bufferIntegration && bufferClient) {
      await this.bufferIntegration.init(bufferClient);
    }

    this.logger.info('Cognitive Prosthetics Manager initialized');
  }

  /**
   * Get cognitive prosthetic
   */
  public getProsthetic(): CognitiveProsthetic {
    return this.prosthetic;
  }

  /**
   * Get attention support
   */
  public getAttentionSupport(): AttentionSupport {
    return this.attention;
  }

  /**
   * Get executive function support
   */
  public getExecutiveFunctionSupport(): ExecutiveFunctionSupport {
    return this.executive;
  }

  /**
   * Get working memory support
   */
  public getWorkingMemorySupport(): WorkingMemorySupport {
    return this.memory;
  }

  /**
   * Get buffer integration
   */
  public getBufferIntegration(): BufferIntegration | null {
    return this.bufferIntegration;
  }

  /**
   * Update cognitive state from external source
   */
  public updateCognitiveState(state: Partial<import('./CognitiveProsthetic').CognitiveState>): void {
    this.prosthetic.updateState(state);
  }

  /**
   * Get comprehensive cognitive support status
   */
  public getStatus(): {
    cognitive: {
      state: import('./CognitiveProsthetic').CognitiveState | null;
      healthScore: number;
      interventions: import('./CognitiveProsthetic').ProstheticIntervention[];
      recommendations: string[];
    };
    attention: {
      session: import('./AttentionSupport').FocusSession | null;
      isOnBreak: boolean;
      averageScore: number;
    };
    executive: {
      taskCount: number;
      pendingTasks: number;
      nextTask: import('./ExecutiveFunctionSupport').Task | null;
    };
    memory: {
      noteCount: number;
      dueReminders: number;
    };
    buffer: {
      connected: boolean;
      recommendedActivity: 'low' | 'medium' | 'high' | null;
    };
  } {
    return {
      cognitive: {
        state: this.prosthetic.getCurrentState(),
        healthScore: this.prosthetic.getCognitiveHealthScore(),
        interventions: this.prosthetic.getRecentInterventions(5),
        recommendations: this.prosthetic.getRecommendations(),
      },
      attention: {
        session: this.attention.getCurrentSession(),
        isOnBreak: this.attention.isOnBreakTime(),
        averageScore: this.attention.getAverageFocusScore(),
      },
      executive: {
        taskCount: this.executive.getAllTasks().length,
        pendingTasks: this.executive.getTasksByStatus('pending').length,
        nextTask: this.executive.getNextRecommendedTask(),
      },
      memory: {
        noteCount: Array.from(this.memory['notes'].values()).length,
        dueReminders: this.memory.getDueReminders().length,
      },
      buffer: {
        connected: this.bufferIntegration !== null,
        recommendedActivity: this.bufferIntegration 
          ? this.bufferIntegration.getRecommendedActivityLevel()
          : null,
      },
    };
  }

  /**
   * Dispose and cleanup
   */
  public dispose(): void {
    if (this.bufferIntegration) {
      this.bufferIntegration.dispose();
    }
    this.attention.dispose();
    this.executive.dispose();
    this.memory.dispose();
    this.prosthetic.dispose();
    this.logger.info('Cognitive Prosthetics Manager disposed');
  }
}
