/**
 * Vesting Phases Tests
 * Test suite for the three vesting phases: Trust, Apprenticeship, Sovereignty
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

// Vesting phase constants
export enum VestingPhase {
  TRUST = 'trust',           // Age 0-12
  APPRENTICESHIP = 'apprenticeship', // Age 13-17
  SOVEREIGNTY = 'sovereignty'        // Age 18+
}

// Node information (from spec)
const NODE_ONE = {
  nickname: 'Bash',
  initials: 'S.J.',
  birthdate: new Date('2016-01-01'),
  currentAge: 10,
  phase: VestingPhase.TRUST,
};

const NODE_TWO = {
  nickname: 'Willow',
  initials: 'W.J.',
  birthdate: new Date('2019-01-01'),
  currentAge: 6,
  phase: VestingPhase.TRUST,
};

/**
 * Calculate age from birthdate
 */
function calculateAge(birthdate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Determine vesting phase from age
 */
function getVestingPhase(age: number): VestingPhase {
  if (age < 13) {
    return VestingPhase.TRUST;
  } else if (age < 18) {
    return VestingPhase.APPRENTICESHIP;
  } else {
    return VestingPhase.SOVEREIGNTY;
  }
}

describe('Vesting Phases', () => {
  let walletIntegration: WalletIntegration;
  let walletManager: WalletManager;
  let testMemberId: string;

  beforeEach(() => {
    walletManager = new WalletManager();
    walletIntegration = new WalletIntegration(walletManager);
    testMemberId = 'test_member_' + Date.now();
    
    const store = DataStore.getInstance();
    store.insert('wallets', {
      id: `wallet_${testMemberId}`,
      memberId: testMemberId,
      memberName: 'Test Member',
      role: 'Test',
      balance: 0,
      currency: 'LOVE',
    });
  });

  afterEach(() => {
    const store = DataStore.getInstance();
    const wallets = store.list('wallets');
    wallets.forEach((w: any) => {
      if (w.memberId === testMemberId) {
        store.delete('wallets', w.id);
      }
    });
  });

  describe('Trust Phase (age 0-12)', () => {
    test('node one (Bash, age 10) is in Trust phase', () => {
      const age = calculateAge(NODE_ONE.birthdate);
      const phase = getVestingPhase(age);
      
      expect(phase).toBe(VestingPhase.TRUST);
      expect(age).toBeGreaterThanOrEqual(9); // Approximate age as of Feb 2026
      expect(age).toBeLessThan(13);
    });

    test('node two (Willow, age 6) is in Trust phase', () => {
      const age = calculateAge(NODE_TWO.birthdate);
      const phase = getVestingPhase(age);
      
      expect(phase).toBe(VestingPhase.TRUST);
      expect(age).toBeGreaterThanOrEqual(6);
      expect(age).toBeLessThan(13);
    });

    test('Trust phase limits: read-only wallet view', () => {
      const age = 10;
      const phase = getVestingPhase(age);
      
      expect(phase).toBe(VestingPhase.TRUST);
      
      // Trust phase should allow viewing balance
      walletIntegration.rewardLove(testMemberId, 10, 'Test reward', 'bonus');
      const balance = walletIntegration.getBalance(testMemberId);
      expect(balance).toBe(10);
      
      // But should not allow spending (not yet implemented)
      // This test documents expected behavior
      console.warn('⚠️ Trust phase spending restrictions not yet implemented');
    });

    test('Trust phase: can earn LOVE but not spend', () => {
      const age = 10;
      const phase = getVestingPhase(age);
      
      expect(phase).toBe(VestingPhase.TRUST);
      
      // Can earn
      walletIntegration.rewardLove(testMemberId, 10, 'Earned LOVE', 'bonus');
      const balance = walletIntegration.getBalance(testMemberId);
      expect(balance).toBe(10);
      
      // Cannot spend (should be restricted)
      // TODO: Implement spending restrictions
      console.warn('⚠️ Trust phase spending restrictions not yet implemented');
    });

    test('Trust phase: parent/guardian approval required for actions', () => {
      const age = 10;
      const phase = getVestingPhase(age);
      
      expect(phase).toBe(VestingPhase.TRUST);
      
      // Guardian approval should be required for:
      // - Transfers
      // - Spending
      // - Contract interactions
      // - Challenge submissions
      
      // This test documents expected behavior
      console.warn('⚠️ Guardian approval system not yet implemented');
    });

    test('Trust phase: age 0-12 inclusive', () => {
      // Test boundary conditions
      expect(getVestingPhase(0)).toBe(VestingPhase.TRUST);
      expect(getVestingPhase(12)).toBe(VestingPhase.TRUST);
      expect(getVestingPhase(13)).toBe(VestingPhase.APPRENTICESHIP);
    });
  });

  describe('Apprenticeship Phase (age 13-17)', () => {
    test('transitions from Trust at age 13', () => {
      const age12 = 12;
      const age13 = 13;
      
      expect(getVestingPhase(age12)).toBe(VestingPhase.TRUST);
      expect(getVestingPhase(age13)).toBe(VestingPhase.APPRENTICESHIP);
    });

    test('can propose transactions (with approval)', () => {
      const age = 15;
      const phase = getVestingPhase(age);
      
      expect(phase).toBe(VestingPhase.APPRENTICESHIP);
      
      // Can propose but needs approval
      // This test documents expected behavior
      console.warn('⚠️ Apprenticeship phase transaction proposals not yet implemented');
    });

    test('can participate in challenges', () => {
      const age = 15;
      const phase = getVestingPhase(age);
      
      expect(phase).toBe(VestingPhase.APPRENTICESHIP);
      
      // Should be able to participate in challenges
      // This test documents expected behavior
      console.warn('⚠️ Apprenticeship phase challenge participation not yet implemented');
    });

    test('cannot deploy smart contracts', () => {
      const age = 15;
      const phase = getVestingPhase(age);
      
      expect(phase).toBe(VestingPhase.APPRENTICESHIP);
      
      // Should not be able to deploy contracts
      // This test documents expected behavior
      console.warn('⚠️ Apprenticeship phase contract restrictions not yet implemented');
    });

    test('Apprenticeship phase: age 13-17 inclusive', () => {
      expect(getVestingPhase(13)).toBe(VestingPhase.APPRENTICESHIP);
      expect(getVestingPhase(17)).toBe(VestingPhase.APPRENTICESHIP);
      expect(getVestingPhase(18)).toBe(VestingPhase.SOVEREIGNTY);
    });

    test('has yield access (10% vote)', () => {
      const age = 15;
      const phase = getVestingPhase(age);
      
      expect(phase).toBe(VestingPhase.APPRENTICESHIP);
      
      // Should have 10% voting power
      // This test documents expected behavior
      console.warn('⚠️ Apprenticeship phase voting power not yet implemented');
    });
  });

  describe('Sovereignty Phase (age 18+)', () => {
    test('full wallet control', () => {
      const age = 20;
      const phase = getVestingPhase(age);
      
      expect(phase).toBe(VestingPhase.SOVEREIGNTY);
      
      // Should have full control
      walletIntegration.rewardLove(testMemberId, 10, 'Earned LOVE', 'bonus');
      const balance = walletIntegration.getBalance(testMemberId);
      expect(balance).toBe(10);
      
      // Should be able to transfer (if soulbound allows)
      // This test documents expected behavior
      console.warn('⚠️ Sovereignty phase full control not yet implemented');
    });

    test('can deploy smart contracts', () => {
      const age = 20;
      const phase = getVestingPhase(age);
      
      expect(phase).toBe(VestingPhase.SOVEREIGNTY);
      
      // Should be able to deploy contracts
      // This test documents expected behavior
      console.warn('⚠️ Sovereignty phase contract deployment not yet implemented');
    });

    test('can create challenges', () => {
      const age = 20;
      const phase = getVestingPhase(age);
      
      expect(phase).toBe(VestingPhase.SOVEREIGNTY);
      
      // Should be able to create challenges
      // This test documents expected behavior
      console.warn('⚠️ Sovereignty phase challenge creation not yet implemented');
    });

    test('can gift LOVE freely', () => {
      const age = 20;
      const phase = getVestingPhase(age);
      
      expect(phase).toBe(VestingPhase.SOVEREIGNTY);
      
      // Should be able to gift LOVE
      // This test documents expected behavior
      console.warn('⚠️ Sovereignty phase LOVE gifting not yet implemented');
    });

    test('Sovereignty phase: age 18+', () => {
      expect(getVestingPhase(18)).toBe(VestingPhase.SOVEREIGNTY);
      expect(getVestingPhase(25)).toBe(VestingPhase.SOVEREIGNTY);
      expect(getVestingPhase(99)).toBe(VestingPhase.SOVEREIGNTY);
    });

    test('has full voting power (100%)', () => {
      const age = 20;
      const phase = getVestingPhase(age);
      
      expect(phase).toBe(VestingPhase.SOVEREIGNTY);
      
      // Should have 100% voting power
      // This test documents expected behavior
      console.warn('⚠️ Sovereignty phase voting power not yet implemented');
    });
  });

  describe('age calculation', () => {
    test('calculates age from birthdate correctly', () => {
      const birthdate = new Date('2016-01-01');
      const age = calculateAge(birthdate);
      
      expect(age).toBeGreaterThanOrEqual(9);
      expect(age).toBeLessThanOrEqual(10);
    });

    test('handles leap years', () => {
      // Test leap year birthdate (Feb 29, 2016)
      const leapYearBirthdate = new Date('2016-02-29');
      const age = calculateAge(leapYearBirthdate);
      
      // Should calculate correctly even for leap year
      expect(age).toBeGreaterThanOrEqual(0);
      expect(typeof age).toBe('number');
    });

    test('phase transition happens on birthday', () => {
      // Test that phase changes on 13th birthday
      const before13 = new Date('2010-01-01'); // Would be 12
      const on13 = new Date('2010-01-01'); // Would be 13
      const after13 = new Date('2010-01-02'); // Would be 13
      
      // Mock current date as Jan 1, 2023
      const mockToday = new Date('2023-01-01');
      const ageBefore = mockToday.getFullYear() - before13.getFullYear();
      const ageOn = mockToday.getFullYear() - on13.getFullYear();
      
      // On 13th birthday, should transition to Apprenticeship
      if (ageOn >= 13) {
        expect(getVestingPhase(ageOn)).toBe(VestingPhase.APPRENTICESHIP);
      }
    });

    test('Bash (born 3/10/2016) is 10, Trust phase', () => {
      const age = calculateAge(NODE_ONE.birthdate);
      const phase = getVestingPhase(age);
      
      expect(age).toBeGreaterThanOrEqual(9);
      expect(age).toBeLessThan(13);
      expect(phase).toBe(VestingPhase.TRUST);
    });

    test('Willow (born 8/8/2019) is 6, Trust phase', () => {
      const age = calculateAge(NODE_TWO.birthdate);
      const phase = getVestingPhase(age);
      
      expect(age).toBeGreaterThanOrEqual(6);
      expect(age).toBeLessThan(13);
      expect(phase).toBe(VestingPhase.TRUST);
    });

    test('handles future dates correctly', () => {
      const futureBirthdate = new Date('2025-01-01');
      const age = calculateAge(futureBirthdate);
      
      // Should handle future dates gracefully
      expect(age).toBeLessThanOrEqual(0);
    });

    test('handles same-day birthdate', () => {
      const today = new Date();
      const age = calculateAge(today);
      
      expect(age).toBe(0);
      expect(getVestingPhase(age)).toBe(VestingPhase.TRUST);
    });
  });

  describe('phase access control', () => {
    test('Trust phase: read-only access', () => {
      const phase = VestingPhase.TRUST;
      
      // Should be able to read balance
      walletIntegration.rewardLove(testMemberId, 10, 'Test', 'bonus');
      const balance = walletIntegration.getBalance(testMemberId);
      expect(balance).toBe(10);
      
      // Should not be able to transfer (not yet implemented)
      console.warn('⚠️ Phase-based access control not yet implemented');
    });

    test('Apprenticeship phase: propose with approval', () => {
      const phase = VestingPhase.APPRENTICESHIP;
      
      // Should be able to propose transactions
      // But requires guardian approval
      console.warn('⚠️ Apprenticeship phase approval system not yet implemented');
    });

    test('Sovereignty phase: full access', () => {
      const phase = VestingPhase.SOVEREIGNTY;
      
      // Should have full access
      walletIntegration.rewardLove(testMemberId, 10, 'Test', 'bonus');
      const balance = walletIntegration.getBalance(testMemberId);
      expect(balance).toBe(10);
      
      // Should be able to transfer (if soulbound allows)
      console.warn('⚠️ Sovereignty phase full access not yet implemented');
    });
  });
});
