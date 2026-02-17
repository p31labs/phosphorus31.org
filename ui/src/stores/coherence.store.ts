/**
 * Platform-wide coherence store for the Quantum Geodesic Platform
 * Global + player coherence; sync with quantum store where needed.
 */

import { create } from 'zustand';

interface CoherenceState {
  globalCoherence: number;
  playerCoherence: number;
  updateGlobalCoherence: (value: number) => void;
  updatePlayerCoherence: (value: number) => void;
  nudgeCoherence: (amount: number) => void;
}

export const useCoherenceStore = create<CoherenceState>((set) => ({
  globalCoherence: 1.0,
  playerCoherence: 1.0,
  updateGlobalCoherence: (value) =>
    set({ globalCoherence: Math.min(1, Math.max(0, value)) }),
  updatePlayerCoherence: (value) =>
    set({ playerCoherence: Math.min(1, Math.max(0, value)) }),
  nudgeCoherence: (amount) =>
    set((state) => ({
      playerCoherence: Math.min(
        1,
        Math.max(0, state.playerCoherence + amount)
      ),
    })),
}));
