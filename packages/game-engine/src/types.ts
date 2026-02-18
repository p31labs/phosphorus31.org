// ═══════════════════════════════════════════════════════════════
// XP & LEVELS
// ═══════════════════════════════════════════════════════════════

export interface PlayerState {
  xp: number;
  level: number;
  totalXpEarned: number;
  prestige: number;
  title: string;
  streaks: StreakState;
  love: LOVEState;
  achievements: string[];
  inventory: string[];
  questsCompleted: number;
  messagesScored: number;
  lastActive: string;
}

export interface XPEvent {
  action: XPAction;
  voltage?: number;
  quality?: number;
  timestamp: string;
}

export type XPAction =
  | "message_scored"
  | "message_rewritten"
  | "message_deferred"
  | "queue_cleared"
  | "breathing_completed"
  | "calibration"
  | "med_taken"
  | "med_streak_day"
  | "deep_lock_respected"
  | "chaos_ingested"
  | "code_committed"
  | "substack_published"
  | "quest_completed"
  | "daily_checkin"
  | "spoon_surplus"
  | "trimtab_adjusted"
  | "molecule_built"
  | "birthday_quest_step_1"
  | "birthday_quest_step_2"
  | "birthday_quest_step_3"
  | "birthday_quest_step_4";

// ═══════════════════════════════════════════════════════════════
// ACHIEVEMENTS
// ═══════════════════════════════════════════════════════════════

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (state: PlayerState, event?: XPEvent) => boolean;
  xpReward: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  hidden: boolean;
}

// ═══════════════════════════════════════════════════════════════
// STREAKS
// ═══════════════════════════════════════════════════════════════

export interface StreakState {
  dailyCheckin: Streak;
  medication: Streak;
  breathing: Streak;
  scoring: Streak;
  /** Consecutive days where the user ended the day with spoons remaining. */
  spoonSurplus: Streak;
}

export interface Streak {
  current: number;
  longest: number;
  lastDate: string;
}

// ═══════════════════════════════════════════════════════════════
// L.O.V.E. ECONOMY
// ═══════════════════════════════════════════════════════════════

export interface LOVEState {
  balance: number;
  totalMined: number;
  miningRate: number;
  lastMined: string;
}

export interface MiningResult {
  yield: number;
  multiplier: number;
  proof: string;
  reason: string;
}

// ═══════════════════════════════════════════════════════════════
// QUESTS
// ═══════════════════════════════════════════════════════════════

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "milestone";
  objective: QuestObjective;
  xpReward: number;
  loveReward: number;
  /** Optional label for rewards (e.g. "Star Bits" for birthday quest). */
  rewardLabel?: string;
  expiresAt?: string;
}

export interface QuestObjective {
  action: XPAction;
  count: number;
  current: number;
}
