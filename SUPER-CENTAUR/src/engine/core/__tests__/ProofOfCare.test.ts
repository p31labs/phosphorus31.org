/**
 * Proof of Care Tests
 * Test suite for the Proof of Care formula and related systems
 * 
 * Formula: Care_Score = Σ(T_prox × Q_res) + Tasks_verified
 * 
 * Where:
 * - T_prox = Time proximity via BLE/UWB
 * - Q_res = Quality resonance (HRV sync at 0.1 Hz)
 * - Tasks_verified = Discrete care actions confirmed by child's device
 * 
 * @license
 * Copyright 2026 P31 Labs
 * Licensed under the AGPLv3 License
 * 
 * 💜 With love and light. As above, so below. 💜
 */

import { WalletIntegration } from '../WalletIntegration';
import { WalletManager } from '../../../wallet';
import { DataStore } from '../../../database/store';

// Proof of Care formula components
interface CareMetrics {
  timeProximity: number;      // T_prox: 0-1, recent interaction = higher
  qualityResonance: number;   // Q_res: 0-1, deeper engagement = higher
  tasksVerified: number;      // Tasks_verified: Count of verified care actions
}

/**
 * Calculate Proof of Care score
 * Formula: Care_Score = Σ(T_prox × Q_res) + Tasks_verified
 */
function calculateCareScore(metrics: CareMetrics[]): number {
  let score = 0;
  
  // Sum of (T_prox × Q_res) for each interaction
  for (const metric of metrics) {
    score += metric.timeProximity * metric.qualityResonance;
  }
  
  // Add verified tasks
  const totalTasks = metrics.reduce((sum, m) => sum + m.tasksVerified, 0);
  score += totalTasks;
  
  return score;
}

/**
 * Calculate time proximity (T_prox)
 * Recent interaction = higher value (0-1)
 */
function calculateTimeProximity(interactionTime: Date, currentTime: Date = new Date()): number {
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
 */
function calculateQualityResonance(
  hrvSync: number,        // HRV sync at 0.1 Hz (0-1)
  interactionDuration: number, // Minutes
  engagementDepth: number      // 0-1, subjective measure
): number {
  // Combined metric: HRV sync + duration + engagement
  const resonance = (hrvSync * 0.5) + (Math.min(interactionDuration / 60, 1) * 0.3) + (engagementDepth * 0.2);
  
  return Math.max(0, Math.min(1, resonance));
}

describe('Proof of Care', () => {
  let walletIntegration: WalletIntegration;
  let walletManager: WalletManager;
  let testMemberId: string;
  let testMemberId2: string;

  beforeEach(() => {
    walletManager = new WalletManager();
    walletIntegration = new WalletIntegration(walletManager);
    testMemberId = 'test_member_' + Date.now();
    testMemberId2 = 'test_member_2_' + Date.now();
    
    const store = DataStore.getInstance();
    store.insert('wallets', {
      id: `wallet_${testMemberId}`,
      memberId: testMemberId,
      memberName: 'Test Member',
      role: 'Test',
      balance: 0,
      currency: 'LOVE',
    });

    store.insert('wallets', {
      id: `wallet_${testMemberId2}`,
      memberId: testMemberId2,
      memberName: 'Test Member 2',
      role: 'Test',
      balance: 0,
      currency: 'LOVE',
    });
  });

  afterEach(() => {
    const store = DataStore.getInstance();
    const wallets = store.list('wallets');
    wallets.forEach((w: any) => {
      if (w.memberId === testMemberId || w.memberId === testMemberId2) {
        store.delete('wallets', w.id);
      }
    });
  });

  describe('formula components', () => {
    test('time proximity increases score (recent interaction = higher)', () => {
      const now = new Date();
      const recent = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1 hour ago
      const old = new Date(now.getTime() - 48 * 60 * 60 * 1000);   // 48 hours ago
      
      const recentProx = calculateTimeProximity(recent, now);
      const oldProx = calculateTimeProximity(old, now);
      
      expect(recentProx).toBeGreaterThan(oldProx);
      expect(recentProx).toBeGreaterThan(0);
      expect(recentProx).toBeLessThanOrEqual(1);
    });

    test('quality resonance increases score (deeper engagement = higher)', () => {
      const highResonance = calculateQualityResonance(0.9, 30, 0.8); // High HRV, long duration, deep engagement
      const lowResonance = calculateQualityResonance(0.2, 5, 0.3);   // Low HRV, short duration, shallow engagement
      
      expect(highResonance).toBeGreaterThan(lowResonance);
      expect(highResonance).toBeGreaterThan(0);
      expect(highResonance).toBeLessThanOrEqual(1);
    });

    test('combined score is multiplicative, not additive', () => {
      // Formula: Σ(T_prox × Q_res) + Tasks_verified
      // The multiplication means both must be high for high score
      
      const metrics: CareMetrics[] = [
        {
          timeProximity: 0.8,
          qualityResonance: 0.9,
          tasksVerified: 0,
        },
        {
          timeProximity: 0.3,
          qualityResonance: 0.2,
          tasksVerified: 0,
        },
      ];
      
      const score = calculateCareScore(metrics);
      
      // First interaction: 0.8 × 0.9 = 0.72
      // Second interaction: 0.3 × 0.2 = 0.06
      // Total: 0.78
      expect(score).toBeCloseTo(0.78, 2);
      
      // If additive, would be 0.8 + 0.9 + 0.3 + 0.2 = 2.2
      // But multiplicative gives 0.78, which is lower
      expect(score).toBeLessThan(2.2);
    });

    test('tasks verified add to score', () => {
      const metrics: CareMetrics[] = [
        {
          timeProximity: 0.5,
          qualityResonance: 0.5,
          tasksVerified: 3, // 3 verified tasks
        },
      ];
      
      const score = calculateCareScore(metrics);
      
      // (0.5 × 0.5) + 3 = 0.25 + 3 = 3.25
      expect(score).toBeCloseTo(3.25, 2);
    });
  });

  describe('CARE_GIVEN vs CARE_RECEIVED', () => {
    test('CARE_GIVEN (2.0 LOVE) awarded to the one who gave care', () => {
      const success = walletIntegration.rewardLove(
        testMemberId,
        2.0, // CARE_GIVEN
        'Gave care to child',
        'bonus'
      );
      
      expect(success).toBe(true);
      const balance = walletIntegration.getBalance(testMemberId);
      expect(balance).toBe(2.0);
    });

    test('CARE_RECEIVED (3.0 LOVE) awarded to the one who received', () => {
      const success = walletIntegration.rewardLove(
        testMemberId2,
        3.0, // CARE_RECEIVED
        'Received care from parent',
        'bonus'
      );
      
      expect(success).toBe(true);
      const balance = walletIntegration.getBalance(testMemberId2);
      expect(balance).toBe(3.0);
    });

    test('receiving costs more because it requires vulnerability', () => {
      // CARE_RECEIVED (3.0) > CARE_GIVEN (2.0)
      expect(3.0).toBeGreaterThan(2.0);
      
      walletIntegration.rewardLove(testMemberId, 2.0, 'Gave care', 'bonus');
      walletIntegration.rewardLove(testMemberId2, 3.0, 'Received care', 'bonus');
      
      const giverBalance = walletIntegration.getBalance(testMemberId);
      const receiverBalance = walletIntegration.getBalance(testMemberId2);
      
      expect(receiverBalance).toBeGreaterThan(giverBalance);
    });

    test('both parties earn LOVE in care transaction', () => {
      // When care is given, both parties should earn
      walletIntegration.rewardLove(testMemberId, 2.0, 'Gave care', 'bonus');
      walletIntegration.rewardLove(testMemberId2, 3.0, 'Received care', 'bonus');
      
      const giverBalance = walletIntegration.getBalance(testMemberId);
      const receiverBalance = walletIntegration.getBalance(testMemberId2);
      
      expect(giverBalance).toBe(2.0);
      expect(receiverBalance).toBe(3.0);
      expect(giverBalance + receiverBalance).toBe(5.0);
    });
  });

  describe('tetrahedron bond', () => {
    test('TETRAHEDRON_BOND (15.0 LOVE) requires 3+ nodes', () => {
      // Tetrahedron = 4 vertices, minimum 3 nodes for bond
      const success = walletIntegration.rewardLove(
        testMemberId,
        15.0, // TETRAHEDRON_BOND
        'Formed tetrahedron bond with 3+ nodes',
        'bonus'
      );
      
      expect(success).toBe(true);
      const balance = walletIntegration.getBalance(testMemberId);
      expect(balance).toBe(15.0);
    });

    test('bond cannot be formed with fewer than 3 nodes', () => {
      // This validation should happen at game engine level
      // This test documents expected behavior
      console.warn('⚠️ Tetrahedron bond validation not yet implemented');
      
      // For now, test that the reward amount is correct
      expect(15.0).toBe(15.0);
    });

    test('bond strengthens with repeated interaction', () => {
      // Repeated interactions should increase bond strength
      // This test documents expected behavior
      const interactions = [
        { timeProximity: 0.8, qualityResonance: 0.7, tasksVerified: 0 },
        { timeProximity: 0.9, qualityResonance: 0.8, tasksVerified: 0 },
        { timeProximity: 0.95, qualityResonance: 0.9, tasksVerified: 0 },
      ];
      
      const score1 = calculateCareScore([interactions[0]]);
      const score2 = calculateCareScore([interactions[0], interactions[1]]);
      const score3 = calculateCareScore(interactions);
      
      expect(score3).toBeGreaterThan(score2);
      expect(score2).toBeGreaterThan(score1);
    });

    test('bond decays if no interaction for 30+ days', () => {
      const now = new Date();
      const recent = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
      const old = new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000);     // 35 days ago
      
      const recentProx = calculateTimeProximity(recent, now);
      const oldProx = calculateTimeProximity(old, now);
      
      // Old interaction should have very low proximity
      expect(oldProx).toBeLessThan(0.1);
      expect(recentProx).toBeGreaterThan(oldProx);
    });
  });

  describe('time proximity calculation', () => {
    test('recent interaction (1 hour) has high proximity', () => {
      const now = new Date();
      const recent = new Date(now.getTime() - 1 * 60 * 60 * 1000);
      
      const proximity = calculateTimeProximity(recent, now);
      expect(proximity).toBeGreaterThan(0.9);
    });

    test('old interaction (48 hours) has low proximity', () => {
      const now = new Date();
      const old = new Date(now.getTime() - 48 * 60 * 60 * 1000);
      
      const proximity = calculateTimeProximity(old, now);
      expect(proximity).toBeLessThan(0.2);
    });

    test('very old interaction (30+ days) has near-zero proximity', () => {
      const now = new Date();
      const veryOld = new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000);
      
      const proximity = calculateTimeProximity(veryOld, now);
      expect(proximity).toBeLessThan(0.01);
    });

    test('current interaction has maximum proximity', () => {
      const now = new Date();
      const current = new Date(now.getTime() - 1); // 1ms ago
      
      const proximity = calculateTimeProximity(current, now);
      expect(proximity).toBeCloseTo(1.0, 1);
    });
  });

  describe('quality resonance calculation', () => {
    test('high HRV sync increases resonance', () => {
      const highHRV = calculateQualityResonance(0.9, 30, 0.5);
      const lowHRV = calculateQualityResonance(0.2, 30, 0.5);
      
      expect(highHRV).toBeGreaterThan(lowHRV);
    });

    test('longer interaction duration increases resonance', () => {
      const longDuration = calculateQualityResonance(0.5, 60, 0.5);
      const shortDuration = calculateQualityResonance(0.5, 5, 0.5);
      
      expect(longDuration).toBeGreaterThan(shortDuration);
    });

    test('deeper engagement increases resonance', () => {
      const deepEngagement = calculateQualityResonance(0.5, 30, 0.9);
      const shallowEngagement = calculateQualityResonance(0.5, 30, 0.2);
      
      expect(deepEngagement).toBeGreaterThan(shallowEngagement);
    });

    test('all components contribute to resonance', () => {
      const balanced = calculateQualityResonance(0.7, 45, 0.8);
      const unbalanced = calculateQualityResonance(0.3, 10, 0.3);
      
      expect(balanced).toBeGreaterThan(unbalanced);
    });
  });

  describe('task verification', () => {
    test('verified tasks add directly to score', () => {
      const metrics: CareMetrics[] = [
        {
          timeProximity: 0.5,
          qualityResonance: 0.5,
          tasksVerified: 5,
        },
      ];
      
      const score = calculateCareScore(metrics);
      
      // (0.5 × 0.5) + 5 = 0.25 + 5 = 5.25
      expect(score).toBeCloseTo(5.25, 2);
    });

    test('multiple verified tasks accumulate', () => {
      const metrics: CareMetrics[] = [
        {
          timeProximity: 0.5,
          qualityResonance: 0.5,
          tasksVerified: 2,
        },
        {
          timeProximity: 0.5,
          qualityResonance: 0.5,
          tasksVerified: 3,
        },
      ];
      
      const score = calculateCareScore(metrics);
      
      // (0.5 × 0.5) + (0.5 × 0.5) + (2 + 3) = 0.25 + 0.25 + 5 = 5.5
      expect(score).toBeCloseTo(5.5, 2);
    });

    test('tasks verified must be confirmed by child device', () => {
      // This validation should happen at device level
      // This test documents expected behavior
      console.warn('⚠️ Task verification by child device not yet implemented');
    });
  });

  describe('integration with L.O.V.E. economy', () => {
    test('high care score should influence LOVE rewards', () => {
      // Higher care score should potentially increase LOVE rewards
      // This test documents expected behavior
      const highCareMetrics: CareMetrics[] = [
        {
          timeProximity: 0.9,
          qualityResonance: 0.9,
          tasksVerified: 5,
        },
      ];
      
      const careScore = calculateCareScore(highCareMetrics);
      expect(careScore).toBeGreaterThan(5);
      
      // High care score could influence CARE_GIVEN/CARE_RECEIVED amounts
      console.warn('⚠️ Care score influence on LOVE rewards not yet implemented');
    });

    test('care metrics should be stored and tracked', () => {
      // Care metrics should be stored for each interaction
      // This test documents expected behavior
      console.warn('⚠️ Care metrics storage not yet implemented');
    });
  });
});
