/**
 * @p31/protocol — P31 and voltage/triage constants.
 * Single source of truth for thresholds and physics constants.
 */

/** P31 Bible constants (coherence, governor, L.O.V.E.) */
export const P31 = {
  HOME_FREQUENCY: 0.35,
  GROUND_THRESHOLD: 3.5,
  SIC_OVERLAP: 1 / 3,
  MESH_CAPACITY: 0.577,
  DAMPING_COEFFICIENT: 0.1,
  SPARK_DECAY_RATE: 0.1,
} as const;

/** Voltage scale 0–10. Triage: pass &lt; CAUTION_MAX, hold ≥ HOLD_MIN, critical ≥ CRITICAL_MIN. */
export const VOLTAGE_THRESHOLDS = {
  /** Below this: pass through (green). */
  CAUTION_MAX: 4,
  /** ≥ this: auto-hold for review (orange). */
  HOLD_MIN: 6,
  /** ≥ this: critical alert (red/black). */
  CRITICAL_MIN: 8,
  /** Max voltage value. */
  MAX: 10,
} as const;

/** Upper bound (inclusive) for each voltage tier. Green ≤3, Yellow ≤5, Orange ≤7, Red ≤9, Black 10. */
export const VOLTAGE_TIER_MAX = {
  GREEN: 3,
  YELLOW: 5,
  ORANGE: 7,
  RED: 9,
  BLACK: 10,
} as const;
