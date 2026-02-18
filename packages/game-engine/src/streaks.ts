import type { Streak, StreakState } from "./types";

const MS_PER_DAY = 86400000;

/**
 * Normalize a date string to UTC calendar date (YYYY-MM-DD).
 * Accepts "YYYY-MM-DD" or full ISO; uses UTC to avoid midnight boundary bugs.
 */
export function toUTCDateString(s: string): string {
  const d = new Date(s.length === 10 ? s + "T12:00:00Z" : s);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Increment a streak by calendar day (UTC). Same calendar day = no change;
 * next calendar day = extend; gap > 1 day = reset. Call with today as UTC
 * date string (YYYY-MM-DD) or ISO; lastDate is stored as YYYY-MM-DD.
 */
export function incrementStreak(streak: Streak, today: string): Streak {
  const todayNorm = toUTCDateString(today);
  const lastDate = streak.lastDate;
  if (!lastDate) {
    return { current: 1, longest: Math.max(1, streak.longest), lastDate: todayNorm };
  }

  const lastNorm = toUTCDateString(lastDate);
  if (lastNorm === todayNorm) return streak;

  const lastMs = new Date(lastNorm + "T12:00:00Z").getTime();
  const todayMs = new Date(todayNorm + "T12:00:00Z").getTime();
  const diffDays = Math.round((todayMs - lastMs) / MS_PER_DAY);

  if (diffDays === 1) {
    const newCurrent = streak.current + 1;
    return {
      current: newCurrent,
      longest: Math.max(newCurrent, streak.longest),
      lastDate: todayNorm,
    };
  }
  return { current: 1, longest: streak.longest, lastDate: todayNorm };
}

/**
 * Check if a streak is still alive (last action was today or yesterday in UTC).
 */
export function isStreakAlive(streak: Streak, today: string): boolean {
  if (!streak.lastDate) return false;
  const todayNorm = toUTCDateString(today);
  const lastNorm = toUTCDateString(streak.lastDate);
  const lastMs = new Date(lastNorm + "T12:00:00Z").getTime();
  const todayMs = new Date(todayNorm + "T12:00:00Z").getTime();
  const diffDays = Math.round((todayMs - lastMs) / MS_PER_DAY);
  return diffDays >= 0 && diffDays <= 1;
}

/**
 * Create a fresh streak state.
 */
export function createStreakState(): StreakState {
  const empty: Streak = { current: 0, longest: 0, lastDate: "" };
  return {
    dailyCheckin: { ...empty },
    medication: { ...empty },
    breathing: { ...empty },
    scoring: { ...empty },
    spoonSurplus: { ...empty },
  };
}
