import { describe, it, expect } from "vitest";
import { ACHIEVEMENTS, checkAchievements } from "../src/achievements";
import { createStreakState } from "../src/streaks";
import { createLOVEState } from "../src/love";
import type { PlayerState } from "../src/types";

function baseState(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    xp: 0,
    level: 0,
    totalXpEarned: 0,
    prestige: 0,
    title: "Observer",
    streaks: createStreakState(),
    love: createLOVEState(),
    achievements: [],
    inventory: [],
    questsCompleted: 0,
    messagesScored: 0,
    lastActive: "",
    ...overrides,
  };
}

describe("ACHIEVEMENTS", () => {
  it("each achievement has valid condition and non-negative xpReward", () => {
    for (const a of ACHIEVEMENTS) {
      expect(a.xpReward).toBeGreaterThanOrEqual(0);
      expect(typeof a.condition).toBe("function");
    }
  });
});

describe("checkAchievements", () => {
  it("first_score unlocks when totalXpEarned > 0", () => {
    const state = baseState({ totalXpEarned: 1 });
    const unlocked = checkAchievements(state);
    expect(unlocked.some((a) => a.id === "first_score")).toBe(true);
  });

  it("returns only NEW unlocks not already earned", () => {
    const state = baseState({ totalXpEarned: 100, achievements: ["first_score"] });
    const unlocked = checkAchievements(state);
    expect(unlocked.some((a) => a.id === "first_score")).toBe(false);
  });

  it("first_rewrite unlocks on message_rewritten event", () => {
    const state = baseState();
    const unlocked = checkAchievements(state, {
      action: "message_rewritten",
      timestamp: "2026-01-01T00:00:00Z",
    });
    expect(unlocked.some((a) => a.id === "first_rewrite")).toBe(true);
  });

  it("hidden achievements unlock when condition met", () => {
    const state = baseState({ level: 10 });
    const unlocked = checkAchievements(state);
    expect(unlocked.some((a) => a.id === "wonky_and_proud")).toBe(true);
  });

  it("defuse_critical requires voltage >= 8", () => {
    const state = baseState();
    const unlocked = checkAchievements(state, {
      action: "message_scored",
      voltage: 8,
      timestamp: "2026-01-01T00:00:00Z",
    });
    expect(unlocked.some((a) => a.id === "defuse_critical")).toBe(true);
  });

  it("score_100 requires messagesScored >= 100", () => {
    const state = baseState({ messagesScored: 100 });
    const unlocked = checkAchievements(state);
    expect(unlocked.some((a) => a.id === "score_100")).toBe(true);
  });

  it("spoon_surplus_3 requires spoonSurplus streak >= 3", () => {
    const streaks = {
      ...createStreakState(),
      spoonSurplus: { current: 3, longest: 3, lastDate: "2026-01-15" },
    };
    const state = baseState({ streaks });
    const unlocked = checkAchievements(state);
    expect(unlocked.some((a) => a.id === "spoon_surplus_3")).toBe(true);
  });
});
