/**
 * App mode store — Slice, Build, Repair, Sierpinski, Explore.
 * Drives dashboard display and can sync with swarm goal.
 */

import { create } from 'zustand';

export type AppMode = 'slice' | 'build' | 'repair' | 'sierpinski' | 'explore';

interface ModeState {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
}

export const useModeStore = create<ModeState>((set) => ({
  currentMode: 'slice',
  setMode: (mode) => set({ currentMode: mode }),
}));
