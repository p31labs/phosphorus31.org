/**
 * Family Bonding System
 * Tracks and enhances family bonding through collaborative play
 * 
 * "Four vertices. Six edges. Four faces. The minimum stable system."
 */

export interface BondingMetric {
  collaborationTime: number;         // Minutes spent building together
  challengesCompleted: number;        // Challenges completed together
  communicationEvents: number;        // Chat messages, reactions, etc.
  supportActions: number;             // Times family helped each other
  celebrationMoments: number;         // Times family celebrated together
  bondingScore: number;               // 0-100 overall bonding score
}

export interface FamilyBondingState {
  familyId: string;
  members: string[];                   // Player IDs
  metrics: BondingMetric;
  milestones: BondingMilestone[];
  lastActivity: number;
  streak: number;                      // Days in a row playing together
}

export interface BondingMilestone {
  id: string;
  name: string;
  description: string;
  unlockedAt: number;
  reward: string;
}

export interface CelebrationEvent {
  type: 'challenge_complete' | 'first_build' | 'perfect_stability' | 'family_record';
  message: string;
  timestamp: number;
  participants: string[];
}

export class FamilyBondingSystem {
  private bondingStates: Map<string, FamilyBondingState> = new Map();
  private celebrations: CelebrationEvent[] = [];

  /**
   * Initialize bonding system
   */
  init(): void {
    this.loadBondingStates();
    console.log('💜 Family Bonding System initialized');
  }

  /**
   * Create or get family bonding state
   */
  getFamilyBonding(familyId: string, memberIds: string[]): FamilyBondingState {
    let state = this.bondingStates.get(familyId);
    
    if (!state) {
      state = {
        familyId,
        members: [...memberIds],
        metrics: {
          collaborationTime: 0,
          challengesCompleted: 0,
          communicationEvents: 0,
          supportActions: 0,
          celebrationMoments: 0,
          bondingScore: 0,
        },
        milestones: [],
        lastActivity: Date.now(),
        streak: 0,
      };
      this.bondingStates.set(familyId, state);
    }

    return state;
  }

  /**
   * Record collaboration time
   */
  recordCollaborationTime(familyId: string, minutes: number): void {
    const state = this.getFamilyBonding(familyId, []);
    state.metrics.collaborationTime += minutes;
    state.lastActivity = Date.now();
    this.updateBondingScore(state);
    this.saveBondingState(state);
  }

  /**
   * Record challenge completion
   */
  recordChallengeComplete(familyId: string, challengeId: string): void {
    const state = this.getFamilyBonding(familyId, []);
    state.metrics.challengesCompleted++;
    state.lastActivity = Date.now();
    this.updateBondingScore(state);
    this.checkMilestones(state);
    this.celebrate(state, {
      type: 'challenge_complete',
      message: `🎉 Family completed challenge: ${challengeId}!`,
      timestamp: Date.now(),
      participants: state.members,
    });
    this.saveBondingState(state);
  }

  /**
   * Record communication event
   */
  recordCommunication(familyId: string, playerId: string, type: 'chat' | 'reaction' | 'help'): void {
    const state = this.getFamilyBonding(familyId, []);
    state.metrics.communicationEvents++;
    
    if (type === 'help') {
      state.metrics.supportActions++;
    }
    
    state.lastActivity = Date.now();
    this.updateBondingScore(state);
    this.saveBondingState(state);
  }

  /**
   * Record support action (family helping each other)
   */
  recordSupportAction(familyId: string, helperId: string, helpedId: string): void {
    const state = this.getFamilyBonding(familyId, []);
    state.metrics.supportActions++;
    state.lastActivity = Date.now();
    this.updateBondingScore(state);
    this.saveBondingState(state);
  }

  /**
   * Update bonding score (0-100)
   */
  private updateBondingScore(state: FamilyBondingState): void {
    let score = 0;

    // Collaboration time (up to 30 points)
    // 1 hour = 10 points, max 30 points at 3+ hours
    score += Math.min(30, (state.metrics.collaborationTime / 60) * 10);

    // Challenges completed (up to 25 points)
    // 1 challenge = 5 points, max 25 points at 5+ challenges
    score += Math.min(25, state.metrics.challengesCompleted * 5);

    // Communication (up to 20 points)
    // 10 events = 5 points, max 20 points at 40+ events
    score += Math.min(20, (state.metrics.communicationEvents / 10) * 5);

    // Support actions (up to 15 points)
    // 1 support = 3 points, max 15 points at 5+ supports
    score += Math.min(15, state.metrics.supportActions * 3);

    // Celebrations (up to 10 points)
    // 1 celebration = 2 points, max 10 points at 5+ celebrations
    score += Math.min(10, state.metrics.celebrationMoments * 2);

    state.metrics.bondingScore = Math.min(100, Math.round(score));
  }

  /**
   * Check for bonding milestones
   */
  private checkMilestones(state: FamilyBondingState): void {
    const milestones = this.getMilestoneDefinitions();
    
    milestones.forEach(milestone => {
      // Check if already unlocked
      if (state.milestones.some(m => m.id === milestone.id)) {
        return;
      }

      // Check if milestone is achieved
      if (this.checkMilestoneCondition(state, milestone)) {
        state.milestones.push({
          ...milestone,
          unlockedAt: Date.now(),
        });

        this.celebrate(state, {
          type: 'family_record',
          message: `🏆 Milestone Unlocked: ${milestone.name}!`,
          timestamp: Date.now(),
          participants: state.members,
        });
      }
    });
  }

  /**
   * Get milestone definitions
   */
  private getMilestoneDefinitions(): BondingMilestone[] {
    return [
      {
        id: 'first-together',
        name: 'First Together',
        description: 'Complete your first challenge as a family',
        reward: 'Family photo frame',
      },
      {
        id: 'hour-together',
        name: 'An Hour Together',
        description: 'Spend 1 hour building together',
        reward: 'Family time badge',
      },
      {
        id: 'five-challenges',
        name: 'Five Challenges',
        description: 'Complete 5 challenges together',
        reward: 'Family trophy',
      },
      {
        id: 'perfect-stability',
        name: 'Perfect Stability',
        description: 'Build a structure with 100 stability',
        reward: 'Perfect build badge',
      },
      {
        id: 'ten-hours',
        name: 'Ten Hours Together',
        description: 'Spend 10 hours building together',
        reward: 'Family master badge',
      },
      {
        id: 'all-challenges',
        name: 'All Challenges',
        description: 'Complete all family challenges',
        reward: 'Family champion trophy',
      },
    ];
  }

  /**
   * Check if milestone condition is met
   */
  private checkMilestoneCondition(state: FamilyBondingState, milestone: BondingMilestone): boolean {
    switch (milestone.id) {
      case 'first-together':
        return state.metrics.challengesCompleted >= 1;
      case 'hour-together':
        return state.metrics.collaborationTime >= 60;
      case 'five-challenges':
        return state.metrics.challengesCompleted >= 5;
      case 'perfect-stability':
        // Would need to check structure history
        return false; // Placeholder
      case 'ten-hours':
        return state.metrics.collaborationTime >= 600;
      case 'all-challenges':
        return state.metrics.challengesCompleted >= 5; // All 5 family challenges
      default:
        return false;
    }
  }

  /**
   * Celebrate an achievement
   */
  private celebrate(state: FamilyBondingState, event: CelebrationEvent): void {
    state.metrics.celebrationMoments++;
    this.celebrations.push(event);
    this.updateBondingScore(state);
    
    // Keep only last 100 celebrations
    if (this.celebrations.length > 100) {
      this.celebrations = this.celebrations.slice(-100);
    }

    console.log(`🎉 ${event.message}`);
  }

  /**
   * Get bonding state
   */
  getBondingState(familyId: string): FamilyBondingState | null {
    return this.bondingStates.get(familyId) || null;
  }

  /**
   * Get recent celebrations
   */
  getRecentCelebrations(familyId: string, limit: number = 10): CelebrationEvent[] {
    return this.celebrations
      .filter(c => c.participants.includes(familyId) || c.participants.some(p => p.startsWith(familyId)))
      .slice(-limit)
      .reverse();
  }

  /**
   * Get bonding insights
   */
  getBondingInsights(familyId: string): {
    score: number;
    level: string;
    nextMilestone: BondingMilestone | null;
    recommendations: string[];
  } {
    const state = this.getFamilyBonding(familyId, []);
    const level = this.getBondingLevel(state.metrics.bondingScore);
    const nextMilestone = this.getNextMilestone(state);
    const recommendations = this.getRecommendations(state);

    return {
      score: state.metrics.bondingScore,
      level,
      nextMilestone,
      recommendations,
    };
  }

  private getBondingLevel(score: number): string {
    if (score >= 90) return 'Unbreakable';
    if (score >= 75) return 'Strong';
    if (score >= 60) return 'Growing';
    if (score >= 40) return 'Building';
    if (score >= 20) return 'Starting';
    return 'New';
  }

  private getNextMilestone(state: FamilyBondingState): BondingMilestone | null {
    const milestones = this.getMilestoneDefinitions();
    const unlockedIds = new Set(state.milestones.map(m => m.id));
    
    for (const milestone of milestones) {
      if (!unlockedIds.has(milestone.id)) {
        return milestone;
      }
    }
    
    return null;
  }

  private getRecommendations(state: FamilyBondingState): string[] {
    const recommendations: string[] = [];

    if (state.metrics.collaborationTime < 60) {
      recommendations.push('Spend more time building together to strengthen your bond');
    }

    if (state.metrics.challengesCompleted < 2) {
      recommendations.push('Complete more challenges together to unlock milestones');
    }

    if (state.metrics.communicationEvents < 10) {
      recommendations.push('Talk more while building - communication strengthens bonds');
    }

    if (state.metrics.supportActions < 3) {
      recommendations.push('Help each other when building - support creates stronger connections');
    }

    if (recommendations.length === 0) {
      recommendations.push('Keep building together! Your family bond is strong.');
    }

    return recommendations;
  }

  // Save/load methods
  private saveBondingState(state: FamilyBondingState): void {
    localStorage.setItem(`p31_family_bonding_${state.familyId}`, JSON.stringify(state));
  }

  private loadBondingStates(): void {
    // Load from localStorage in real implementation
  }
}
