import { describe, it, expect } from "vitest";
import {
  calculateXP,
  awardXP,
  getTitle,
  xpToNextLevel,
  levelProgress,
  prestige,
} from "../src/xp";
import { XP_PER_LEVEL } from "../src/constants";
import { createStreakState } from "../src/streaks";
import { createLOVEState } from "../src/love";
import type { PlayerState, XPEvent } from "../src/types";

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

describe("calculateXP", () => {
  it("returns correct base XP for each action type", () => {
    expect(calculateXP({ action: "calibration", timestamp: "2026-01-01T00:00:00Z" })).toBe(50);
    expect(calculateXP({ action: "message_scored", timestamp: "2026-01-01T00:00:00Z" })).toBe(50);
    expect(calculateXP({ action: "queue_cleared", timestamp: "2026-01-01T00:00:00Z" })).toBe(200);
    expect(calculateXP({ action: "daily_checkin", timestamp: "2026-01-01T00:00:00Z" })).toBe(25);
  });

  it("adds voltage bonus correctly (voltage 8 -> +80 XP)", () => {
    const e: XPEvent = { action: "message_scored", voltage: 8, timestamp: "2026-01-01T00:00:00Z" };
    expect(calculateXP(e)).toBe(50 + 80);
  });

  it("applies quality multiplier", () => {
    const e: XPEvent = { action: "message_scored", quality: 0.5, timestamp: "2026-01-01T00:00:00Z" };
    expect(calculateXP(e)).toBe(Math.floor(50 * 0.5));
  });
});

describe("awardXP", () => {
  it("levels up correctly at 2000 XP boundary", () => {
    const state = baseState({ xp: 1990, level: 0 });
    const event: XPEvent = { action: "message_scored", timestamp: "2026-01-01T12:00:00Z" };
    const result = awardXP(state, event);
    expect(result.xpGained).toBe(50);
    expect(result.state.xp).toBe(40);
    expect(result.state.level).toBe(1);
    expect(result.leveledUp).toBe(true);
    expect(result.newLevel).toBe(1);
  });

  it("updates title on level-up", () => {
    const state = baseState({ xp: 0, level: 0 });
    let s = state;
    for (let i = 0; i < 41; i++) {
      const r = awardXP(s, { action: "message_scored", timestamp: new Date().toISOString() });
      s = r.state;
    }
    expect(s.level).toBeGreaterThanOrEqual(1);
    expect(getTitle(s.level)).toBe(s.title);
  });
});

describe("getTitle", () => {
  it("returns correct titles for levels", () => {
    expect(getTitle(0)).toBe("Observer");
    expect(getTitle(1)).toBe("Wonky Sprout");
    expect(getTitle(10)).toBe("Buffer Guardian");
    expect(getTitle(50)).toBe("Geodesic Architect");
  });
});

describe("xpToNextLevel and levelProgress", () => {
  it("xpToNextLevel returns remaining XP", () => {
    const state = baseState({ xp: 500 });
    expect(xpToNextLevel(state)).toBe(XP_PER_LEVEL - 500);
  });

  it("levelProgress returns 0-100 percentage", () => {
    const state = baseState({ xp: 1000 });
    expect(levelProgress(state)).toBe(50);
  });
});

describe("prestige", () => {
  it("resets level but keeps achievements", () => {
    const state = baseState({ level: 50, xp: 100, achievements: ["first_score"] });
    const result = prestige(state);
    expect(result).not.toBeNull();
    expect(result!.level).toBe(0);
    expect(result!.xp).toBe(0);
    expect(result!.prestige).toBe(1);
    expect(result!.achievements).toEqual(["first_score"]);
  });

  it("returns null below level 50", () => {
    expect(prestige(baseState({ level: 49 }))).toBeNull();
    expect(prestige(baseState({ level: 10 }))).toBeNull();
  });
});

describe("levelProgress edge cases", () => {
  it("returns 0 at 0 xp", () => {
    expect(levelProgress(baseState({ xp: 0 }))).toBe(0);
  });
  it("returns 99 at 1999 xp (just before level)", () => {
    expect(levelProgress(baseState({ xp: 1999 }))).toBe(99);
  });
});
