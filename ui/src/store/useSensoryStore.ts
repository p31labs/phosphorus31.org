/**
 * P31 Scope — Sensory store (mode, animation, glow, haptic).
 * Neurodivergent-friendly: full / calm / quiet; respects prefers-reduced-motion.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { prefersReducedMotion } from '@/utils/accessibility';

export type SensoryMode = 'full' | 'calm' | 'quiet';

interface SensoryState {
  mode: SensoryMode;
  hapticEnabled: boolean;
  setMode: (mode: SensoryMode) => void;
  toggleHaptic: () => void;
}

export const useSensoryStore = create<SensoryState>()(
  persist(
    (set) => ({
      mode: 'full',
      hapticEnabled: true,

      setMode: (mode) => set({ mode }),
      toggleHaptic: () => set((s) => ({ hapticEnabled: !s.hapticEnabled })),
    }),
    { name: 'p31-sensory', partialize: (s) => ({ mode: s.mode, hapticEnabled: s.hapticEnabled }) }
  )
);

/** Whether animations should run (mode + prefers-reduced-motion). */
export function useAnimationEnabled(): boolean {
  const mode = useSensoryStore((s) => s.mode);
  if (typeof window === 'undefined') return mode !== 'quiet';
  const reduced = prefersReducedMotion();
  if (reduced) return false;
  return mode !== 'quiet';
}

/** Glow intensity 0–1 derived from mode. */
export function useGlowIntensity(): number {
  const mode = useSensoryStore((s) => s.mode);
  switch (mode) {
    case 'full':
      return 1;
    case 'calm':
      return 0.5;
    case 'quiet':
      return 0.15;
    default:
      return 0.7;
  }
}
