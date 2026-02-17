/**
 * P31 Game Integration — Spoon gating
 * When spoons are RED, the game goes into rest mode. The phosphorus is resting.
 */

import type { MetabolismState } from './types/molecule';

export interface GameBehavior {
  canBuild: boolean;
  canChallenge: boolean;
  recommendedActivity: 'high' | 'medium' | 'low';
  uiMode: 'full' | 'simplified' | 'rest';
  hapticIntensity: number;
  message?: string;
}

/**
 * Game behavior from GAS Brain metabolism (spoons). GREEN = full, YELLOW = simplified, RED = rest.
 */
export function getGameMode(metabolism: MetabolismState): GameBehavior {
  if (metabolism.color === 'GREEN') {
    return {
      canBuild: true,
      canChallenge: true,
      recommendedActivity: 'high',
      uiMode: 'full',
      hapticIntensity: 1.0,
    };
  }
  if (metabolism.color === 'YELLOW') {
    return {
      canBuild: true,
      canChallenge: false,
      recommendedActivity: 'medium',
      uiMode: 'simplified',
      hapticIntensity: 0.6,
    };
  }
  return {
    canBuild: false,
    canChallenge: false,
    recommendedActivity: 'low',
    uiMode: 'rest',
    hapticIntensity: 0.3,
    message: 'The phosphorus is resting. You can look at the mesh, but building waits.',
  };
}
