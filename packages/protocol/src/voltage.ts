/**
 * @p31/protocol — voltage tiers and noise levels.
 * Aligns with Buffer/Shelter: 0–10 scale, five tiers.
 */

import { VOLTAGE_TIER_MAX } from './constants.js';

/** Display tier (lowercase, for UI and logs). */
export type VoltageTier = 'green' | 'yellow' | 'orange' | 'red' | 'black';

/** Noise level (uppercase, for triage and API). */
export type NoiseLevel =
  | 'GREEN'   // 0–3: safe, pass
  | 'YELLOW'  // 4–5: caution, flag but pass
  | 'ORANGE'  // 6–7: hold for review
  | 'RED'     // 8–9: critical alert
  | 'BLACK';  // 10: emergency

/** @deprecated Use NoiseLevel instead */
export type ThreatLevel = NoiseLevel;

/** Map voltage score (0–10) to display tier. */
export function voltageTier(score: number): VoltageTier {
  if (score <= VOLTAGE_TIER_MAX.GREEN) return 'green';
  if (score <= VOLTAGE_TIER_MAX.YELLOW) return 'yellow';
  if (score <= VOLTAGE_TIER_MAX.ORANGE) return 'orange';
  if (score <= VOLTAGE_TIER_MAX.RED) return 'red';
  return 'black';
}

/** Map voltage score (0–10) to noise level. */
export function noiseLevelFromScore(score: number): NoiseLevel {
  if (score <= VOLTAGE_TIER_MAX.GREEN) return 'GREEN';
  if (score <= VOLTAGE_TIER_MAX.YELLOW) return 'YELLOW';
  if (score <= VOLTAGE_TIER_MAX.ORANGE) return 'ORANGE';
  if (score <= VOLTAGE_TIER_MAX.RED) return 'RED';
  return 'BLACK';
}

/** @deprecated Use noiseLevelFromScore instead */
export const threatLevelFromScore = noiseLevelFromScore;
