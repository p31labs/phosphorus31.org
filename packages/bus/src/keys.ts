/**
 * @p31labs/bus — Canonical Bus Keys
 *
 * These are the ONLY keys that matter. Source of truth is per-key:
 * - Shelter owns: SPOONS, MAX_SPOONS, VOLTAGE, MODE, XP, LEVEL, LOVE, QUEST_ACTIVE
 * - BONDING owns: ATOMS, MOLECULE, TIER
 * - Buffer-core owns: HARMONY, PID_OUTPUT
 * - System: HEARTBEAT, PHASE
 */

export const BUS_KEYS = {
  // Spoon economy (source: Shelter spoon-store)
  SPOONS: 'p31:spoons',
  MAX_SPOONS: 'p31:maxSpoons',

  // Buffer state (source: Shelter buffer-store)
  VOLTAGE: 'p31:voltage',
  MODE: 'p31:mode',

  // Game state (source: Shelter game-store)
  XP: 'p31:xp',
  LEVEL: 'p31:level',
  LOVE: 'p31:love',
  QUEST_ACTIVE: 'p31:questActive',

  // BONDING game (source: BONDING app)
  ATOMS: 'p31:atoms',
  MOLECULE: 'p31:molecule',
  TIER: 'p31:tier',

  // PID / Samson (source: buffer-core scorer)
  HARMONY: 'p31:harmony',
  PID_OUTPUT: 'p31:pidOutput',

  // System
  HEARTBEAT: 'p31:heartbeat',
  PHASE: 'p31:phase',
} as const;

export type BusKey = (typeof BUS_KEYS)[keyof typeof BUS_KEYS];
