/**
 * Wallet Integration
 * Helper class for wallet operations in the game engine
 * 
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 * Licensed under the AGPLv3 License
 */

import { WalletManager } from '../../wallet';
import { Logger } from '../../utils/logger';
import { DataStore } from '../../database/store';
import { ProofOfCareManager } from './ProofOfCareManager';

export interface RewardEvent {
  memberId: string;
  amount: number;
  description: string;
  source: 'challenge' | 'build' | 'achievement' | 'daily' | 'bonus';
  timestamp: number;
}

export class WalletIntegration {
  private logger: Logger;
  private walletManager: WalletManager;
  private store: DataStore;
  private proofOfCare: ProofOfCareManager | null;
  private rewardHistory: RewardEvent[] = [];

  constructor(walletManager: WalletManager, proofOfCareManager?: ProofOfCareManager | null) {
    this.logger = new Logger('WalletIntegration');
    this.walletManager = walletManager;
    this.store = DataStore.getInstance();
    this.proofOfCare = proofOfCareManager ?? null;
  }

  /**
   * Reward LOVE tokens to player
   * Splits 50/50 between Sovereignty Pool (immutable, kids) and Performance Pool (dynamic, earned)
   */
  public rewardLove(memberId: string, amount: number, description: string, source: RewardEvent['source'] = 'bonus'): boolean {
    try {
      const wallet = this.walletManager.getMemberWallet(memberId);
      if (!wallet) {
        this.logger.warn(`Wallet not found for member: ${memberId}`);
        return false;
      }

      // Validate amount
      if (amount <= 0) {
        this.logger.warn(`Invalid amount: ${amount}`);
        return false;
      }

      // Split 50/50 between pools
      const baseSovereigntyAmount = amount / 2;  // 50% to Sovereignty Pool
      let performanceAmount = amount / 2; // 50% to Performance Pool
      let sovereigntyAmount = baseSovereigntyAmount;

      // Adjust Performance Pool based on Proof of Care score when available
      if (this.proofOfCare) {
        const careScore = this.proofOfCare.getCareScore(memberId);
        performanceAmount = this.proofOfCare.calculatePerformancePoolContribution(
          careScore.totalScore,
          performanceAmount
        );
        sovereigntyAmount = amount - performanceAmount;
      }

      // Get or initialize pools
      let pools = this.walletManager.getPools(memberId);
      if (!pools) {
        pools = { sovereigntyPool: 0, performancePool: 0 };
      }

      // Update pools
      pools.sovereigntyPool += sovereigntyAmount;
      pools.performancePool += performanceAmount;

      // Update total balance
      const currentBalance = wallet.balance || 0;
      const newBalance = currentBalance + amount;
      
      // Update wallet with pools and balance
      this.store.update('wallets', wallet.id, { 
        balance: newBalance,
        pools: pools
      });
      
      // Create transaction record
      this.store.insert('wallet_transactions', {
        fromWalletId: 'system',
        toWalletId: wallet.id,
        amount,
        description,
        type: 'reward',
        timestamp: new Date().toISOString(),
        sovereigntyAmount,
        performanceAmount,
      });

      // Track reward event
      const rewardEvent: RewardEvent = {
        memberId,
        amount,
        description,
        source,
        timestamp: Date.now(),
      };
      this.rewardHistory.push(rewardEvent);
      
      // Keep only last 100 events
      if (this.rewardHistory.length > 100) {
        this.rewardHistory.shift();
      }

      this.logger.info(`Rewarded ${amount} LOVE to ${memberId} (${source}): ${description} [Sovereignty: ${sovereigntyAmount}, Performance: ${performanceAmount}]`);
      return true;
    } catch (error) {
      this.logger.error('Failed to reward LOVE tokens:', error);
      return false;
    }
  }

  /**
   * Get player balance
   */
  public getBalance(memberId: string): number {
    const wallet = this.walletManager.getMemberWallet(memberId);
    return wallet ? wallet.balance : 0;
  }

  /**
   * Transfer LOVE between players
   */
  public transfer(fromMemberId: string, toMemberId: string, amount: number, description: string): boolean {
    try {
      const fromWallet = this.walletManager.getMemberWallet(fromMemberId);
      const toWallet = this.walletManager.getMemberWallet(toMemberId);

      if (!fromWallet || !toWallet) {
        this.logger.warn(`Wallet not found for transfer: ${fromMemberId} -> ${toMemberId}`);
        return false;
      }

      const result = this.walletManager.transfer(fromWallet.id, toWallet.id, amount, description);
      
      if ('error' in result) {
        this.logger.error(`Transfer failed: ${result.error}`);
        return false;
      }

      this.logger.info(`Transferred ${amount} LOVE from ${fromMemberId} to ${toMemberId}`);
      return true;
    } catch (error) {
      this.logger.error('Failed to transfer LOVE tokens:', error);
      return false;
    }
  }

  /**
   * Get reward history
   */
  public getRewardHistory(memberId?: string): RewardEvent[] {
    if (memberId) {
      return this.rewardHistory.filter(event => event.memberId === memberId);
    }
    return [...this.rewardHistory];
  }

  /**
   * Get total rewards for member
   */
  public getTotalRewards(memberId: string, source?: RewardEvent['source']): number {
    const events = this.rewardHistory.filter(event => {
      if (event.memberId !== memberId) return false;
      if (source && event.source !== source) return false;
      return true;
    });

    return events.reduce((total, event) => total + event.amount, 0);
  }

  /**
   * Get wallet transactions
   */
  public getTransactions(memberId: string, limit: number = 50) {
    const wallet = this.walletManager.getMemberWallet(memberId);
    if (!wallet) return [];

    return this.walletManager.getWalletTransactions(wallet.id, limit);
  }

  /**
   * Get sovereignty pool balance (50%, immutable, kids)
   */
  public getSovereigntyPool(memberId: string): number {
    return this.walletManager.getSovereigntyPool(memberId);
  }

  /**
   * Get performance pool balance (50%, dynamic, earned)
   */
  public getPerformancePool(memberId: string): number {
    return this.walletManager.getPerformancePool(memberId);
  }

  /**
   * Get pool structure
   */
  public getPools(memberId: string) {
    return this.walletManager.getPools(memberId);
  }

  /**
   * Get Proof of Care manager (if set)
   */
  public getProofOfCare(): ProofOfCareManager | null {
    return this.proofOfCare;
  }
}
