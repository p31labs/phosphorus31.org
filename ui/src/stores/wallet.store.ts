/**
 * Wallet store — donation wallet / Coherence Tokens (CT) integration.
 * Mock implementation; production can use Chrome extension or wallet adapter.
 */

import { create } from 'zustand';

export interface WalletState {
  balance: number;
  address: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  donate: (amount: number) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 0,
  address: null,
  isConnected: false,
  connect: async () => {
    // In production: communicate with donation wallet extension (e.g. chrome.runtime.connect)
    set({
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      balance: 1250,
      isConnected: true,
    });
  },
  disconnect: () => set({ address: null, balance: 0, isConnected: false }),
  donate: async (amount) => {
    // Send donation request to extension when integrated
    console.log(`Donating ${amount} CT`);
    set((state) => ({ balance: Math.max(0, state.balance - amount) }));
  },
}));
