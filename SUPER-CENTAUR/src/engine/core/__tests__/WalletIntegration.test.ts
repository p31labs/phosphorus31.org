/**
 * Wallet Integration Tests
 * Test suite for wallet integration
 * 
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 * Licensed under the AGPLv3 License
 */

import { WalletIntegration } from '../WalletIntegration';
import { WalletManager } from '../../../wallet';
import { DataStore } from '../../../database/store';

describe('WalletIntegration', () => {
  let walletIntegration: WalletIntegration;
  let walletManager: WalletManager;
  let testMemberId: string;

  beforeEach(() => {
    walletManager = new WalletManager();
    walletIntegration = new WalletIntegration(walletManager);
    testMemberId = 'test_member_' + Date.now();
    
    // Create test wallet
    const store = DataStore.getInstance();
    store.insert('wallets', {
      id: `wallet_${testMemberId}`,
      memberId: testMemberId,
      memberName: 'Test Member',
      role: 'Test',
      balance: 100,
      currency: 'LOVE',
    });
  });

  afterEach(() => {
    // Cleanup test data
    const store = DataStore.getInstance();
    const wallets = store.list('wallets');
    wallets.forEach((w: any) => {
      if (w.memberId === testMemberId) {
        store.delete('wallets', w.id);
      }
    });
  });

  describe('Reward LOVE', () => {
    test('should reward LOVE tokens', () => {
      const amount = 50;
      const success = walletIntegration.rewardLove(testMemberId, amount, 'Test reward', 'bonus');
      
      expect(success).toBe(true);
      
      const balance = walletIntegration.getBalance(testMemberId);
      expect(balance).toBe(150); // 100 initial + 50 reward
    });

    test('should track reward history', () => {
      walletIntegration.rewardLove(testMemberId, 10, 'Reward 1', 'challenge');
      walletIntegration.rewardLove(testMemberId, 20, 'Reward 2', 'build');
      
      const history = walletIntegration.getRewardHistory(testMemberId);
      expect(history.length).toBe(2);
      expect(history[0].amount).toBe(10);
      expect(history[1].amount).toBe(20);
    });

    test('should calculate total rewards', () => {
      walletIntegration.rewardLove(testMemberId, 10, 'Challenge reward', 'challenge');
      walletIntegration.rewardLove(testMemberId, 5, 'Build reward', 'build');
      walletIntegration.rewardLove(testMemberId, 15, 'Another challenge', 'challenge');
      
      const challengeTotal = walletIntegration.getTotalRewards(testMemberId, 'challenge');
      expect(challengeTotal).toBe(25); // 10 + 15
      
      const buildTotal = walletIntegration.getTotalRewards(testMemberId, 'build');
      expect(buildTotal).toBe(5);
      
      const allTotal = walletIntegration.getTotalRewards(testMemberId);
      expect(allTotal).toBe(30); // 10 + 5 + 15
    });
  });

  describe('Balance', () => {
    test('should get balance', () => {
      const balance = walletIntegration.getBalance(testMemberId);
      expect(balance).toBe(100);
    });

    test('should return 0 for non-existent member', () => {
      const balance = walletIntegration.getBalance('non_existent');
      expect(balance).toBe(0);
    });
  });

  describe('Transfer', () => {
    let toMemberId: string;

    beforeEach(() => {
      toMemberId = 'to_member_' + Date.now();
      const store = DataStore.getInstance();
      store.insert('wallets', {
        id: `wallet_${toMemberId}`,
        memberId: toMemberId,
        memberName: 'To Member',
        role: 'Test',
        balance: 50,
        currency: 'LOVE',
      });
    });

    afterEach(() => {
      const store = DataStore.getInstance();
      const wallets = store.list('wallets');
      wallets.forEach((w: any) => {
        if (w.memberId === toMemberId) {
          store.delete('wallets', w.id);
        }
      });
    });

    test('should transfer LOVE tokens', () => {
      const amount = 25;
      const success = walletIntegration.transfer(testMemberId, toMemberId, amount, 'Test transfer');
      
      expect(success).toBe(true);
      
      const fromBalance = walletIntegration.getBalance(testMemberId);
      const toBalance = walletIntegration.getBalance(toMemberId);
      
      expect(fromBalance).toBe(75); // 100 - 25
      expect(toBalance).toBe(75); // 50 + 25
    });

    test('should fail transfer with insufficient balance', () => {
      const amount = 200; // More than balance
      const success = walletIntegration.transfer(testMemberId, toMemberId, amount, 'Test transfer');
      
      expect(success).toBe(false);
      
      const fromBalance = walletIntegration.getBalance(testMemberId);
      expect(fromBalance).toBe(100); // Unchanged
    });
  });

  describe('Transactions', () => {
    test('should get transactions', () => {
      walletIntegration.rewardLove(testMemberId, 10, 'Test reward', 'bonus');
      
      const transactions = walletIntegration.getTransactions(testMemberId, 10);
      expect(transactions.length).toBeGreaterThan(0);
    });
  });
});
