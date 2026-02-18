import type { Quest, XPAction } from "./types";

const DAILY_QUEST_POOL: Omit<Quest, "id" | "expiresAt">[] = [
  {
    title: "Morning Calibration",
    description: "Set your spoon budget for the day.",
    type: "daily",
    objective: { action: "calibration", count: 1, current: 0 },
    xpReward: 100,
    loveReward: 10,
  },
  {
    title: "Voltage Triage",
    description: "Score 3 messages.",
    type: "daily",
    objective: { action: "message_scored", count: 3, current: 0 },
    xpReward: 150,
    loveReward: 15,
  },
  {
    title: "Deep Breath",
    description: "Complete a breathing exercise.",
    type: "daily",
    objective: { action: "breathing_completed", count: 1, current: 0 },
    xpReward: 100,
    loveReward: 10,
  },
  {
    title: "Medicine Cabinet",
    description: "Log all medications on time.",
    type: "daily",
    objective: { action: "med_streak_day", count: 1, current: 0 },
    xpReward: 200,
    loveReward: 25,
  },
  {
    title: "Depolarizer",
    description: "Rewrite 2 messages to neutral.",
    type: "daily",
    objective: { action: "message_rewritten", count: 2, current: 0 },
    xpReward: 200,
    loveReward: 20,
  },
  {
    title: "Entropy Dump",
    description: "Ingest 1 chaos entry.",
    type: "daily",
    objective: { action: "chaos_ingested", count: 1, current: 0 },
    xpReward: 100,
    loveReward: 10,
  },
  {
    title: "The Prudent Pause",
    description: "Defer 1 high-voltage message.",
    type: "daily",
    objective: { action: "message_deferred", count: 1, current: 0 },
    xpReward: 150,
    loveReward: 15,
  },
  {
    title: "Queue Clear",
    description: "Process all deferred messages.",
    type: "daily",
    objective: { action: "queue_cleared", count: 1, current: 0 },
    xpReward: 300,
    loveReward: 30,
  },
];

const WEEKLY_QUESTS: Omit<Quest, "id" | "expiresAt">[] = [
  {
    title: "7-Day Streak",
    description: "Check in 7 days in a row.",
    type: "weekly",
    objective: { action: "daily_checkin", count: 7, current: 0 },
    xpReward: 1000,
    loveReward: 100,
  },
  {
    title: "Voltage Master",
    description: "Score 20 messages this week.",
    type: "weekly",
    objective: { action: "message_scored", count: 20, current: 0 },
    xpReward: 800,
    loveReward: 80,
  },
  {
    title: "Molecular Stability",
    description: "Perfect medication compliance for 7 days.",
    type: "weekly",
    objective: { action: "med_streak_day", count: 7, current: 0 },
    xpReward: 1500,
    loveReward: 150,
  },
];

function getDayOfYear(date: Date): number {
  const y = date.getUTCFullYear();
  const start = Date.UTC(y, 0, 0);
  const diff = date.getTime() - start;
  return Math.floor(diff / 86400000);
}

/**
 * Generate daily quests for a given date.
 * Deterministic: same date always produces same 3 quests.
 */
export function generateDailyQuests(date: string): Quest[] {
  const dayOfYear = getDayOfYear(new Date(date));
  const pool = [...DAILY_QUEST_POOL];
  const selected: Quest[] = [];

  for (let i = 0; i < 3; i++) {
    const idx = (dayOfYear * 7 + i * 13) % pool.length;
    const quest = pool.splice(idx, 1)[0];
    if (!quest) continue;
    const endOfDay = new Date(date + "T23:59:59.999Z");

    selected.push({
      ...quest,
      id: `daily_${date}_${i}`,
      expiresAt: endOfDay.toISOString(),
    });
  }

  return selected;
}

/**
 * Generate weekly quests for the current week.
 */
export function generateWeeklyQuests(weekStart: string): Quest[] {
  const start = new Date(weekStart + "T00:00:00Z");
  const endOfWeek = new Date(start.getTime() + 7 * 86400000);
  endOfWeek.setUTCHours(23, 59, 59, 999);

  return WEEKLY_QUESTS.map((q, i) => ({
    ...q,
    id: `weekly_${weekStart}_${i}`,
    expiresAt: endOfWeek.toISOString(),
  }));
}

/**
 * Update quest progress when an action occurs.
 */
export function updateQuestProgress(
  quests: Quest[],
  action: XPAction
): { quests: Quest[]; completed: Quest[] } {
  const completed: Quest[] = [];

  const updated = quests.map((q) => {
    if (q.objective.action !== action) return q;
    if (q.objective.current >= q.objective.count) return q;

    const newCurrent = q.objective.current + 1;
    const updatedQuest: Quest = {
      ...q,
      objective: { ...q.objective, current: newCurrent },
    };

    if (newCurrent >= q.objective.count) {
      completed.push(updatedQuest);
    }

    return updatedQuest;
  });

  return { quests: updated, completed };
}
