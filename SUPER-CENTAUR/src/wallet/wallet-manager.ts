/**
 * Wallet Manager - Multi-wallet system for family LOVE economy
 * Separate from legacy single-wallet; uses `wallets` + `wallet_transactions` collections.
 */

import { Logger } from '../utils/logger';
import { DataStore } from '../database/store';

export interface WalletPools {
  sovereigntyPool: number;  // 50% - immutable, kids (founding nodes)
  performancePool: number;  // 50% - dynamic, earned through Proof of Care
}

export interface FamilyWallet {
  id: string;
  memberId: string;
  memberName: string;
  role: string;
  balance: number;  // Total balance (sovereigntyPool + performancePool)
  currency: string;
  pools?: WalletPools;  // Pool structure (50/50 split)
}

interface WalletTransaction {
  id: string;
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  description: string;
  timestamp: string;
  type: 'transfer' | 'reward' | 'mining';
}

export class WalletManager {
  private logger: Logger;
  private store: DataStore;

  constructor() {
    this.logger = new Logger('WalletManager');
    this.store = DataStore.getInstance();
    this.logger.info('Wallet Manager initialized');
  }

  getFamilyWallets(): FamilyWallet[] {
    return this.store.list<any>('wallets');
  }

  getMemberWallet(memberId: string): FamilyWallet | null {
    const wallets = this.store.list<any>('wallets');
    return wallets.find((w: any) => w.memberId === memberId) || null;
  }

  /**
   * Ensure a wallet exists for the member; create with zero balance if not.
   */
  ensureMemberWallet(memberId: string, memberName: string = 'Player', role: string = 'player'): FamilyWallet {
    const existing = this.getMemberWallet(memberId);
    if (existing) return existing;
    const record = this.store.insert<any>('wallets', {
      id: `wallet_${memberId}`,
      memberId,
      memberName,
      role,
      balance: 0,
      currency: 'LOVE',
      pools: { sovereigntyPool: 0, performancePool: 0 },
    });
    return record as FamilyWallet;
  }

  transfer(fromWalletId: string, toWalletId: string, amount: number, description: string): WalletTransaction | { error: string } {
    const from = this.store.get<any>('wallets', fromWalletId);
    const to = this.store.get<any>('wallets', toWalletId);

    if (!from) return { error: 'Source wallet not found' };
    if (!to) return { error: 'Destination wallet not found' };
    if (amount <= 0) return { error: 'Amount must be positive' };
    if (from.balance < amount) return { error: 'Insufficient balance' };

    this.store.update('wallets', fromWalletId, { balance: from.balance - amount });
    this.store.update('wallets', toWalletId, { balance: to.balance + amount });

    const txn = this.store.insert<any>('wallet_transactions', {
      fromWalletId,
      toWalletId,
      amount,
      description,
      type: 'transfer',
      timestamp: new Date().toISOString(),
    });

    this.logger.info(`Transfer: ${amount} LOVE from ${fromWalletId} to ${toWalletId}`);
    return txn;
  }

  getWalletTransactions(walletId?: string, limit: number = 50): WalletTransaction[] {
    const all = this.store.recent<any>('wallet_transactions', limit);
    if (!walletId) return all;
    return all.filter((t: any) => t.fromWalletId === walletId || t.toWalletId === walletId);
  }

  /**
   * Get sovereignty pool balance (50% of total, immutable, kids)
   */
  getSovereigntyPool(memberId: string): number {
    const wallet = this.getMemberWallet(memberId);
    if (!wallet || !wallet.pools) return 0;
    return wallet.pools.sovereigntyPool;
  }

  /**
   * Get performance pool balance (50% of total, dynamic, earned)
   */
  getPerformancePool(memberId: string): number {
    const wallet = this.getMemberWallet(memberId);
    if (!wallet || !wallet.pools) return 0;
    return wallet.pools.performancePool;
  }

  /**
   * Get pool structure
   */
  getPools(memberId: string): WalletPools | null {
    const wallet = this.getMemberWallet(memberId);
    if (!wallet || !wallet.pools) {
      // Initialize pools if they don't exist
      return { sovereigntyPool: 0, performancePool: 0 };
    }
    return wallet.pools;
  }
}

export default WalletManager;
