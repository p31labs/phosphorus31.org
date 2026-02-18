/**
 * @p31labs/game-engine — Gamification layer for The Buffer
 *
 * Pure TypeScript: XP, achievements, streaks, L.O.V.E. economy, quests.
 * Zero React. Consumed by PWA, Chrome extension, GENESIS_GATE, and eventually ESP32 (BLE).
 *
 * @packageDocumentation
 */

export { calculateXP, awardXP, getTitle, xpToNextLevel, levelProgress, prestige } from "./xp";
export { ACHIEVEMENTS, checkAchievements } from "./achievements";
export { incrementStreak, isStreakAlive, createStreakState, toUTCDateString } from "./streaks";
export { mine, applyMining, createLOVEState } from "./love";
export { generateDailyQuests, generateWeeklyQuests, updateQuestProgress } from "./quests";
export {
  generateBirthdayQuestChain,
  isBirthdayQuestActive,
  BIRTHDAY_QUEST_STEP_TITLES,
  BIRTHDAY_QUEST_LOVE_REWARDS,
  MAR10_DAY,
  MAR10_DAY_ACHIEVEMENT_ID,
  BIRTHDAY_QUEST_START,
} from "./birthdayQuest";
export { XP_TABLE, MINING_RATES, TITLES, XP_PER_LEVEL } from "./constants";
export type * from "./types";
