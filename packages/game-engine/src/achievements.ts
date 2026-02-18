import type { Achievement, PlayerState, XPEvent } from "./types";

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_score", name: "First Voltage", description: "Scored your first message.", icon: "⚡", condition: (s) => s.totalXpEarned > 0, xpReward: 100, rarity: "common", hidden: false },
  { id: "first_rewrite", name: "Depolarized", description: "Used AI rewrite for the first time.", icon: "🔄", condition: (_s, e) => e?.action === "message_rewritten", xpReward: 150, rarity: "common", hidden: false },
  { id: "first_defer", name: "Wise Restraint", description: "Deferred a high-voltage message.", icon: "🛡️", condition: (_s, e) => e?.action === "message_deferred" && (e?.voltage ?? 0) >= 6, xpReward: 200, rarity: "uncommon", hidden: false },
  { id: "deep_lock_honored", name: "The Pause", description: "Hit Deep Lock and chose rest.", icon: "🧘", condition: (_s, e) => e?.action === "deep_lock_respected", xpReward: 300, rarity: "uncommon", hidden: false },
  { id: "spoon_surplus_3", name: "Energy Reserve", description: "Ended 3 days with spoons remaining.", icon: "🔋", condition: (s) => s.streaks.spoonSurplus.current >= 3, xpReward: 250, rarity: "uncommon", hidden: false },
  { id: "streak_meds_7", name: "Calcium Keeper", description: "7-day medication streak.", icon: "💊", condition: (s) => s.streaks.medication.current >= 7, xpReward: 500, rarity: "rare", hidden: false },
  { id: "streak_meds_30", name: "Molecular Stability", description: "30-day medication streak.", icon: "🧬", condition: (s) => s.streaks.medication.current >= 30, xpReward: 2000, rarity: "epic", hidden: false },
  { id: "streak_breathing_7", name: "Rhythm Found", description: "7-day breathing streak.", icon: "🌊", condition: (s) => s.streaks.breathing.current >= 7, xpReward: 500, rarity: "rare", hidden: false },
  { id: "streak_checkin_30", name: "The Mesh Holds", description: "30-day daily check-in streak.", icon: "🔺", condition: (s) => s.streaks.dailyCheckin.current >= 30, xpReward: 2000, rarity: "epic", hidden: false },
  { id: "defuse_critical", name: "Bomb Defused", description: "Processed a CRITICAL voltage message.", icon: "💣", condition: (_s, e) => e?.action === "message_scored" && (e?.voltage ?? 0) >= 8, xpReward: 400, rarity: "rare", hidden: false },
  { id: "score_100", name: "Centurion", description: "Scored 100 messages.", icon: "📊", condition: (s) => s.messagesScored >= 100, xpReward: 1000, rarity: "rare", hidden: false },
  { id: "love_first_mine", name: "First Yield", description: "Mined your first L.O.V.E. token.", icon: "💜", condition: (s) => s.love.totalMined > 0, xpReward: 100, rarity: "common", hidden: false },
  { id: "love_1000", name: "Love Hoard", description: "Accumulated 1,000 L.O.V.E. tokens.", icon: "💎", condition: (s) => s.love.totalMined >= 1000, xpReward: 2000, rarity: "epic", hidden: false },
  { id: "prestige_1", name: "Rebirth", description: "Prestiged for the first time.", icon: "🌅", condition: (s) => s.prestige >= 1, xpReward: 5000, rarity: "legendary", hidden: true },
  { id: "wonky_and_proud", name: "It's Okay to Be a Little Wonky", description: "Reached Level 10.", icon: "🌱", condition: (s) => s.level >= 10, xpReward: 1000, rarity: "rare", hidden: true },
  { id: "geodesic_complete", name: "Geodesic Architect", description: "Reached Level 50.", icon: "🏛️", condition: (s) => s.level >= 50, xpReward: 10000, rarity: "legendary", hidden: true },
];

export function checkAchievements(state: PlayerState, event?: XPEvent): Achievement[] {
  return ACHIEVEMENTS.filter((a) => !state.achievements.includes(a.id) && a.condition(state, event));
}
