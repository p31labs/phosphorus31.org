import { useCallback } from "react";
import { useShelterStore } from "@/stores/shelter-store";
import { useSpoonStore } from "@/stores/spoon-store";
import { processAction } from "@/lib/events";
import { computeBrainState } from "@/lib/quantum-brain";
import type { XPAction } from "@p31labs/game-engine";

const STORAGE_KEY = "p31_shelter_player";
const QUEST_KEY = "p31_shelter_quests";

function persistPlayer(player: ReturnType<typeof useShelterStore.getState>["player"]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
  } catch { /* quota exceeded — non-critical */ }
}

function persistQuests(daily: unknown[], weekly: unknown[], dailyDate: string, weeklyDate: string) {
  try {
    localStorage.setItem(QUEST_KEY, JSON.stringify({ daily, weekly, dailyDate, weeklyDate }));
  } catch { /* quota exceeded — non-critical */ }
}

/**
 * Central hook: every component calls gameAction(action, opts) and the
 * entire pipeline — XP, streaks, mining, achievements, quests, toasts,
 * persistence — fires automatically.
 *
 * Brain coherence feeds back as a quality multiplier: higher consistency
 * yields better XP and L.O.V.E. returns — the virtuous loop.
 */
export function useGameAction() {
  const { player, dailyQuests, weeklyQuests, dailyDate, weeklyDate, setPlayer, updateQuests, addToast } =
    useShelterStore();
  const { current, max, tier } = useSpoonStore();

  const gameAction = useCallback(
    (action: XPAction, opts: { voltage?: number; quality?: number } = {}) => {
      const brain = computeBrainState(player, current, max, tier);
      const coherenceQuality = 0.5 + brain.coherence;

      const result = processAction(player, action, dailyQuests, weeklyQuests, {
        voltage: opts.voltage,
        quality: (opts.quality ?? 1.0) * coherenceQuality,
        tier,
      });

      setPlayer(result.player);
      updateQuests(result.dailyQuests, result.weeklyQuests);

      if (result.xpGained > 0) {
        addToast({ type: "xp", data: { xp: result.xpGained } });
      }
      if (result.leveledUp) {
        addToast({ type: "level", data: { level: result.newLevel, title: result.player.title } });
      }
      for (const a of result.newAchievements) {
        addToast({ type: "achievement", data: { name: a.name, icon: a.icon, rarity: a.rarity } });
      }
      for (const q of result.completedQuests) {
        addToast({ type: "quest", data: { title: q.title, xp: q.xpReward, love: q.loveReward } });
      }

      persistPlayer(result.player);
      persistQuests(result.dailyQuests, result.weeklyQuests, dailyDate, weeklyDate);

      return result;
    },
    [player, dailyQuests, weeklyQuests, dailyDate, weeklyDate, current, max, tier, setPlayer, updateQuests, addToast],
  );

  return gameAction;
}
