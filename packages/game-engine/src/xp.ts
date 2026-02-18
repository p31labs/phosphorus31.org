import type { PlayerState, XPEvent } from "./types";
import { XP_TABLE, XP_PER_LEVEL, TITLES } from "./constants";

/**
 * Calculate XP earned for an action.
 * Higher voltage messages = more XP for scoring them.
 * Quality multiplier rewards doing things well.
 */
export function calculateXP(event: XPEvent): number {
  const base = XP_TABLE[event.action] ?? 50;
  const voltageBonus = event.voltage !== undefined ? Math.floor(event.voltage * 10) : 0;
  const qualityMultiplier = event.quality ?? 1.0;
  return Math.floor((base + voltageBonus) * qualityMultiplier);
}

/**
 * Award XP and handle level-ups. Returns updated state + any level-up info.
 */
export function awardXP(
  state: PlayerState,
  event: XPEvent
): { state: PlayerState; xpGained: number; leveledUp: boolean; newLevel: number } {
  const xpGained = calculateXP(event);
  const newXP = state.xp + xpGained;
  const newTotalXP = state.totalXpEarned + xpGained;

  const levelsGained = Math.floor(newXP / XP_PER_LEVEL);
  const level = state.level + levelsGained;
  const remainingXP = newXP % XP_PER_LEVEL;
  const leveledUp = level > state.level;

  return {
    state: {
      ...state,
      xp: remainingXP,
      level,
      totalXpEarned: newTotalXP,
      title: getTitle(level),
      lastActive: event.timestamp,
    },
    xpGained,
    leveledUp,
    newLevel: level,
  };
}

/**
 * Get title for a level. Single source of truth: derived from TITLES constant.
 */
export function getTitle(level: number): string {
  const sorted = [...TITLES].sort((a, b) => b.level - a.level);
  const entry = sorted.find((t) => level >= t.level);
  return entry?.title ?? "Observer";
}

/**
 * Get XP required for next level.
 */
export function xpToNextLevel(state: PlayerState): number {
  return XP_PER_LEVEL - state.xp;
}

/**
 * Get progress percentage to next level (0-100).
 */
export function levelProgress(state: PlayerState): number {
  return Math.floor((state.xp / XP_PER_LEVEL) * 100);
}

/**
 * Prestige: reset level to 0, keep achievements, get permanent multiplier.
 * Only available at level 50+.
 */
export function prestige(state: PlayerState): PlayerState | null {
  if (state.level < 50) return null;
  return {
    ...state,
    xp: 0,
    level: 0,
    prestige: state.prestige + 1,
    title: getTitle(0),
  };
}
