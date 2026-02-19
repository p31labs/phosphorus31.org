import {
  awardXP,
  checkAchievements,
  incrementStreak,
  mine,
  applyMining,
  updateQuestProgress,
  toUTCDateString,
  type PlayerState,
  type XPAction,
  type XPEvent,
  type Quest,
  type Achievement,
} from "@p31labs/game-engine";
import type { HeartbeatTier } from "@p31labs/buffer-core";

export interface ActionResult {
  player: PlayerState;
  xpGained: number;
  loveMined: number;
  leveledUp: boolean;
  newLevel: number;
  newAchievements: Achievement[];
  completedQuests: Quest[];
  dailyQuests: Quest[];
  weeklyQuests: Quest[];
}

const STREAK_MAP: Partial<Record<XPAction, keyof PlayerState["streaks"]>> = {
  daily_checkin: "dailyCheckin",
  med_taken: "medication",
  med_streak_day: "medication",
  breathing_completed: "breathing",
  message_scored: "scoring",
  spoon_surplus: "spoonSurplus",
};

const COUNTER_ACTIONS = new Set<XPAction>(["message_scored", "message_rewritten"]);

/**
 * Central event processor. Every game-relevant action flows through here.
 * Pure function: takes state in, returns state out.
 */
export function processAction(
  player: PlayerState,
  action: XPAction,
  dailyQuests: Quest[],
  weeklyQuests: Quest[],
  opts: { voltage?: number; quality?: number; tier?: HeartbeatTier } = {},
): ActionResult {
  const now = new Date().toISOString();
  const today = toUTCDateString(now);

  const event: XPEvent = {
    action,
    voltage: opts.voltage,
    quality: opts.quality,
    timestamp: now,
  };

  // 1. Award XP
  const xpResult = awardXP(player, event);
  let p = xpResult.state;

  // 2. Increment counter fields
  if (action === "message_scored") {
    p = { ...p, messagesScored: p.messagesScored + 1 };
  }

  // 3. Update streaks
  const streakKey = STREAK_MAP[action];
  if (streakKey) {
    p = {
      ...p,
      streaks: {
        ...p.streaks,
        [streakKey]: incrementStreak(p.streaks[streakKey], today),
      },
    };
  }

  // 4. Mine L.O.V.E.
  const heartbeat = (opts.tier?.toLowerCase() ?? "green") as "green" | "yellow" | "orange" | "red";
  const miningResult = mine(action, heartbeat, opts.quality ?? 1.0, now);
  p = { ...p, love: applyMining(p.love, miningResult) };

  // 5. Check achievements
  const newAchievements = checkAchievements(p, event);
  if (newAchievements.length > 0) {
    let bonusXP = 0;
    for (const a of newAchievements) bonusXP += a.xpReward;
    p = {
      ...p,
      achievements: [...p.achievements, ...newAchievements.map((a) => a.id)],
      xp: p.xp + bonusXP,
      totalXpEarned: p.totalXpEarned + bonusXP,
    };
  }

  // 6. Update quest progress
  const dailyResult = updateQuestProgress(dailyQuests, action);
  const weeklyResult = updateQuestProgress(weeklyQuests, action);
  const completedQuests = [...dailyResult.completed, ...weeklyResult.completed];

  if (completedQuests.length > 0) {
    let questXP = 0;
    let questLove = 0;
    for (const q of completedQuests) {
      questXP += q.xpReward;
      questLove += q.loveReward;
    }
    p = {
      ...p,
      xp: p.xp + questXP,
      totalXpEarned: p.totalXpEarned + questXP,
      questsCompleted: p.questsCompleted + completedQuests.length,
      love: {
        ...p.love,
        balance: p.love.balance + questLove,
        totalMined: p.love.totalMined + questLove,
      },
    };
  }

  return {
    player: p,
    xpGained: xpResult.xpGained,
    loveMined: miningResult.yield,
    leveledUp: xpResult.leveledUp,
    newLevel: xpResult.newLevel,
    newAchievements,
    completedQuests,
    dailyQuests: dailyResult.quests,
    weeklyQuests: weeklyResult.quests,
  };
}
