/**
 * Proof of Care Manager
 * Implements the Proof of Care formula for L.O.V.E. economy
 * 
 * Formula: Care_Score = Σ(T_prox × Q_res) + Tasks_verified
 * 
 * Where:
 * - T_prox = Time proximity via BLE/UWB (0-1, recent interaction = higher)
 * - Q_res = Quality resonance (HRV sync at 0.1 Hz, deeper engagement = higher)
 * - Tasks_verified = Discrete care actions confirmed by child's device
 * 
 * @license
 * Copyright 2026 P31 Labs
 * Licensed under the AGPLv3 License
 * 
 * 💜 With love and light. As above, so below. 💜
 */

import { Logger } from '../../utils/logger';
import { DataStore } from '../../database/store';

export interface CareMetrics {
  timeProximity: number;      // T_prox: 0-1, recent interaction = higher
  qualityResonance: number;   // Q_res: 0-1, deeper engagement = higher
  tasksVerified: number;      // Tasks_verified: Count of verified care actions
  timestamp: Date;
  memberId: string;
  interactionId: string;
}

export interface InteractionData {
  interactionTime: Date;
  hrvSync: number;            // HRV sync at 0.1 Hz (0-1)
  interactionDuration: number; // Minutes
  engagementDepth: number;     // 0-1, subjective measure
  tasksVerified: number;      // Count of verified care actions
  memberId: string;
  interactionId: string;
}

export interface CareScore {
  totalScore: number;
  interactionScores: number[];
  tasksScore: number;
  timestamp: Date;
}

export class ProofOfCareManager {
  private logger: Logger;
  private store: DataStore;
  private careMetrics: Map<string, CareMetrics[]> = new Map(); // memberId -> metrics[]

  constructor() {
    this.logger = new Logger('ProofOfCareManager');
    this.store = DataStore.getInstance();
  }

  /**
   * Calculate time proximity (T_prox)
   * Recent interaction = higher value (0-1)
   * Decay function: Half-life of 24 hours
   */
  public calculateTimeProximity(interactionTime: Date, currentTime: Date = new Date()): number {
    const timeDiff = currentTime.getTime() - interactionTime.getTime();
    const hoursAgo = timeDiff / (1000 * 60 * 60);
    
    // Decay function: more recent = higher value
    // Half-life of 24 hours
    const halfLife = 24;
    const proximity = Math.exp(-hoursAgo / halfLife);
    
    return Math.max(0, Math.min(1, proximity));
  }

  /**
   * Calculate quality resonance (Q_res)
   * Deeper engagement = higher value (0-1)
   * 
   * Components:
   * - HRV sync (50%): Heart rate variability sync at 0.1 Hz
   * - Duration (30%): Length of interaction
   * - Engagement depth (20%): Subjective measure of engagement
   */
  public calculateQualityResonance(
    hrvSync: number,        // HRV sync at 0.1 Hz (0-1)
    interactionDuration: number, // Minutes
    engagementDepth: number      // 0-1, subjective measure
  ): number {
    // Validate inputs
    hrvSync = Math.max(0, Math.min(1, hrvSync));
    engagementDepth = Math.max(0, Math.min(1, engagementDepth));
    
    // Duration component: normalize to 0-1 (60 minutes = 1.0)
    const durationComponent = Math.min(interactionDuration / 60, 1);
    
    // Combined metric: HRV sync + duration + engagement
    const resonance = (hrvSync * 0.5) + (durationComponent * 0.3) + (engagementDepth * 0.2);
    
    return Math.max(0, Math.min(1, resonance));
  }

  /**
   * Calculate Proof of Care score
   * Formula: Care_Score = Σ(T_prox × Q_res) + Tasks_verified
   */
  public calculateCareScore(metrics: CareMetrics[]): CareScore {
    let totalScore = 0;
    const interactionScores: number[] = [];
    
    // Sum of (T_prox × Q_res) for each interaction
    for (const metric of metrics) {
      const interactionScore = metric.timeProximity * metric.qualityResonance;
      interactionScores.push(interactionScore);
      totalScore += interactionScore;
    }
    
    // Add verified tasks
    const tasksScore = metrics.reduce((sum, m) => sum + m.tasksVerified, 0);
    totalScore += tasksScore;
    
    return {
      totalScore,
      interactionScores,
      tasksScore,
      timestamp: new Date(),
    };
  }

  /**
   * Record a care interaction
   */
  public recordInteraction(data: InteractionData): CareMetrics {
    const timeProximity = this.calculateTimeProximity(data.interactionTime);
    const qualityResonance = this.calculateQualityResonance(
      data.hrvSync,
      data.interactionDuration,
      data.engagementDepth
    );

    const metrics: CareMetrics = {
      timeProximity,
      qualityResonance,
      tasksVerified: data.tasksVerified,
      timestamp: data.interactionTime,
      memberId: data.memberId,
      interactionId: data.interactionId,
    };

    // Store metrics
    if (!this.careMetrics.has(data.memberId)) {
      this.careMetrics.set(data.memberId, []);
    }
    this.careMetrics.get(data.memberId)!.push(metrics);

    // Also store in database
    this.store.insert('care_interactions', {
      memberId: data.memberId,
      interactionId: data.interactionId,
      interactionTime: data.interactionTime.toISOString(),
      hrvSync: data.hrvSync,
      interactionDuration: data.interactionDuration,
      engagementDepth: data.engagementDepth,
      tasksVerified: data.tasksVerified,
      timeProximity,
      qualityResonance,
      timestamp: new Date().toISOString(),
    });

    this.logger.info(`Recorded care interaction for ${data.memberId}: T_prox=${timeProximity.toFixed(2)}, Q_res=${qualityResonance.toFixed(2)}, Tasks=${data.tasksVerified}`);

    return metrics;
  }

  /**
   * Get care score for a member
   */
  public getCareScore(memberId: string, currentTime: Date = new Date()): CareScore {
    // Get all interactions for this member
    const allInteractions = this.store.list<any>('care_interactions')
      .filter((i: any) => i.memberId === memberId);

    // Convert to CareMetrics with updated time proximity
    const metrics: CareMetrics[] = allInteractions.map((interaction: any) => {
      const interactionTime = new Date(interaction.interactionTime);
      const timeProximity = this.calculateTimeProximity(interactionTime, currentTime);
      
      return {
        timeProximity,
        qualityResonance: interaction.qualityResonance || 0,
        tasksVerified: interaction.tasksVerified || 0,
        timestamp: interactionTime,
        memberId: interaction.memberId,
        interactionId: interaction.interactionId,
      };
    });

    return this.calculateCareScore(metrics);
  }

  /**
   * Get recent interactions for a member
   */
  public getRecentInteractions(memberId: string, days: number = 30): CareMetrics[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const allInteractions = this.store.list<any>('care_interactions')
      .filter((i: any) => {
        if (i.memberId !== memberId) return false;
        const interactionTime = new Date(i.interactionTime);
        return interactionTime >= cutoffDate;
      })
      .map((interaction: any) => {
        const interactionTime = new Date(interaction.interactionTime);
        const timeProximity = this.calculateTimeProximity(interactionTime);
        
        return {
          timeProximity,
          qualityResonance: interaction.qualityResonance || 0,
          tasksVerified: interaction.tasksVerified || 0,
          timestamp: interactionTime,
          memberId: interaction.memberId,
          interactionId: interaction.interactionId,
        };
      });

    return allInteractions;
  }

  /**
   * Verify a care task (called by child's device)
   */
  public verifyTask(memberId: string, taskId: string, taskDescription: string): boolean {
    try {
      // Record verified task
      this.store.insert('verified_tasks', {
        memberId,
        taskId,
        taskDescription,
        verifiedAt: new Date().toISOString(),
        verifiedBy: 'child_device', // Should be actual device ID
      });

      this.logger.info(`Verified task for ${memberId}: ${taskDescription}`);
      return true;
    } catch (error) {
      this.logger.error('Failed to verify task:', error);
      return false;
    }
  }

  /**
   * Get verified tasks count for a member
   */
  public getVerifiedTasksCount(memberId: string, days: number = 30): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const tasks = this.store.list<any>('verified_tasks')
      .filter((t: any) => {
        if (t.memberId !== memberId) return false;
        const verifiedAt = new Date(t.verifiedAt);
        return verifiedAt >= cutoffDate;
      });

    return tasks.length;
  }

  /**
   * Calculate Performance Pool contribution based on Care Score
   * Higher care score = higher contribution to Performance Pool
   */
  public calculatePerformancePoolContribution(careScore: number, baseAmount: number): number {
    // Care score influences Performance Pool
    // Formula: performanceAmount = baseAmount * (0.5 + careScore / 100)
    // This means high care score (e.g., 10) increases Performance Pool by up to 10%
    const careMultiplier = Math.min(1.0, 0.5 + (careScore / 100));
    return baseAmount * careMultiplier;
  }

  /**
   * Get bond strength (for TETRAHEDRON_BOND)
   * Bond strengthens with repeated interaction
   */
  public getBondStrength(memberIds: string[]): number {
    if (memberIds.length < 3) {
      return 0; // Requires 3+ nodes for tetrahedron bond
    }

    // Calculate average care score across all members
    let totalScore = 0;
    for (const memberId of memberIds) {
      const score = this.getCareScore(memberId);
      totalScore += score.totalScore;
    }

    const averageScore = totalScore / memberIds.length;
    
    // Bond strength: 0-1, based on average care score
    // Higher care score = stronger bond
    return Math.min(1.0, averageScore / 10); // Normalize to 0-1
  }

  /**
   * Check if bond has decayed (no interaction for 30+ days)
   */
  public hasBondDecayed(memberIds: string[]): boolean {
    for (const memberId of memberIds) {
      const recentInteractions = this.getRecentInteractions(memberId, 30);
      if (recentInteractions.length === 0) {
        return true; // No interactions in last 30 days
      }
    }
    return false;
  }
}
