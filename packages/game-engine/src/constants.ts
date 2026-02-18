import type { XPAction } from "./types";

/** XP awarded per action type (base, before voltage/quality modifiers) */
export const XP_TABLE: Record<XPAction, number> = {
  message_scored: 50,
  message_rewritten: 75,
  message_deferred: 60,
  queue_cleared: 200,
  breathing_completed: 100,
  calibration: 50,
  med_taken: 30,
  med_streak_day: 150,
  deep_lock_respected: 200,
  chaos_ingested: 40,
  code_committed: 100,
  substack_published: 500,
  quest_completed: 0,
  daily_checkin: 25,
  spoon_surplus: 100,
  trimtab_adjusted: 30,
  molecule_built: 80,
  birthday_quest_step_1: 100,
  birthday_quest_step_2: 150,
  birthday_quest_step_3: 150,
  birthday_quest_step_4: 250,
};

/** L.O.V.E. token base mining rates per action */
export const MINING_RATES: Record<XPAction, number> = {
  message_scored: 5,
  message_rewritten: 8,
  message_deferred: 6,
  queue_cleared: 25,
  breathing_completed: 15,
  calibration: 5,
  med_taken: 3,
  med_streak_day: 20,
  deep_lock_respected: 30,
  chaos_ingested: 5,
  code_committed: 10,
  substack_published: 50,
  quest_completed: 0,
  daily_checkin: 3,
  spoon_surplus: 10,
  trimtab_adjusted: 3,
  molecule_built: 15,
  birthday_quest_step_1: 10,
  birthday_quest_step_2: 15,
  birthday_quest_step_3: 15,
  birthday_quest_step_4: 50,
};

/** Level titles — synced with xp.ts getTitle() */
export const TITLES = [
  { level: 0, title: "Observer" },
  { level: 1, title: "Wonky Sprout" },
  { level: 3, title: "Entropy Tamer" },
  { level: 5, title: "Spoon Shepherd" },
  { level: 7, title: "Voltage Rider" },
  { level: 10, title: "Buffer Guardian" },
  { level: 15, title: "Signal Keeper" },
  { level: 20, title: "Mesh Weaver" },
  { level: 30, title: "Delta Engineer" },
  { level: 40, title: "Quantum Operator" },
  { level: 50, title: "Geodesic Architect" },
] as const;

/** XP required per level (from Protocol Bible / god.config) */
export const XP_PER_LEVEL = 2000;
