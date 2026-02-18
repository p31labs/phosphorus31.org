/**
 * Super Star Quest (MAR10 Molecule Quest) — Birthday quest chain for March 10.
 * Active between configurable start and MAR10 Day. Rewards use "Star Bits" label.
 * All naming is original; no third-party IP references.
 *
 * @see docs/MAR10_MOLECULE_QUEST.md
 */

import type { Quest } from "./types";

/** March 10 — quest ends at end of this day (UTC). */
export const MAR10_DAY = "2026-03-10";

/** Quest is active from this date (inclusive) until end of MAR10_DAY. */
export const BIRTHDAY_QUEST_START = "2026-02-18";

const BIRTHDAY_QUEST_STEPS: Omit<Quest, "id" | "expiresAt">[] = [
  {
    title: "The First Atom",
    description: "Place the first atom together — a golden P31.",
    type: "milestone",
    objective: { action: "birthday_quest_step_1", count: 1, current: 0 },
    xpReward: 100,
    loveReward: 10,
    rewardLabel: "Star Bits",
  },
  {
    title: "The Wonky Cap Cluster",
    description: "Build a cluster of Wonky Cap elements (3× WNC).",
    type: "milestone",
    objective: { action: "birthday_quest_step_2", count: 1, current: 0 },
    xpReward: 150,
    loveReward: 15,
    rewardLabel: "Star Bits",
  },
  {
    title: "The Tunnel Tube",
    description: "Place a Tunnel Tube in the builder.",
    type: "milestone",
    objective: { action: "birthday_quest_step_3", count: 1, current: 0 },
    xpReward: 150,
    loveReward: 15,
    rewardLabel: "Star Bits",
  },
  {
    title: "The Super Star Molecule",
    description: "Complete the molecule — at least one each of P31, Wonky Cap, Tunnel Tube, and Sparkle Star.",
    type: "milestone",
    objective: { action: "birthday_quest_step_4", count: 1, current: 0 },
    xpReward: 250,
    loveReward: 50,
    rewardLabel: "Star Bits",
  },
];

/**
 * Returns true if the birthday quest should be shown (today >= start and <= MAR10).
 */
export function isBirthdayQuestActive(asOfDate: string = new Date().toISOString()): boolean {
  const start = new Date(BIRTHDAY_QUEST_START + "T00:00:00Z").getTime();
  const end = new Date(MAR10_DAY + "T23:59:59.999Z").getTime();
  const t = new Date(asOfDate).getTime();
  return t >= start && t <= end;
}

/**
 * Generate the 4-step Birthday Quest chain. Each quest expires at end of MAR10 Day.
 * Only include if isBirthdayQuestActive() is true.
 */
export function generateBirthdayQuestChain(asOfDate?: string): Quest[] {
  if (!isBirthdayQuestActive(asOfDate)) return [];

  const expiresAt = new Date(MAR10_DAY + "T23:59:59.999Z").toISOString();
  return BIRTHDAY_QUEST_STEPS.map((step, i) => ({
    ...step,
    id: `birthday_mar10_${i + 1}`,
    expiresAt,
  }));
}

/** Step titles for UI / discovery. */
export const BIRTHDAY_QUEST_STEP_TITLES = BIRTHDAY_QUEST_STEPS.map((s) => s.title);

/** Achievement unlocked when the full Super Star Quest chain is completed (March 10). */
export const MAR10_DAY_ACHIEVEMENT_ID = "level10_celebration";

/** Love reward per step for UI display. */
export const BIRTHDAY_QUEST_LOVE_REWARDS = BIRTHDAY_QUEST_STEPS.map((s) => s.loveReward);
