import { describe, it, expect } from "vitest";
import { incrementStreak, isStreakAlive, createStreakState, toUTCDateString } from "../src/streaks";

describe("incrementStreak", () => {
  it("same-day action does not double-increment", () => {
    const streak = { current: 1, longest: 1, lastDate: "2026-01-15" };
    const result = incrementStreak(streak, "2026-01-15");
    expect(result.current).toBe(1);
    expect(result.longest).toBe(1);
  });

  it("consecutive days extend streak", () => {
    const streak = { current: 3, longest: 5, lastDate: "2026-01-14" };
    const result = incrementStreak(streak, "2026-01-15");
    expect(result.current).toBe(4);
    expect(result.longest).toBe(5);
  });

  it("gap > 1 day resets current but preserves longest", () => {
    const streak = { current: 5, longest: 10, lastDate: "2026-01-10" };
    const result = incrementStreak(streak, "2026-01-15");
    expect(result.current).toBe(1);
    expect(result.longest).toBe(10);
  });

  it("empty lastDate starts streak at 1", () => {
    const streak = { current: 0, longest: 0, lastDate: "" };
    const result = incrementStreak(streak, "2026-01-15");
    expect(result.current).toBe(1);
    expect(result.longest).toBe(1);
    expect(result.lastDate).toBe("2026-01-15");
  });

  it("uses UTC calendar days across midnight boundary", () => {
    const streak = { current: 1, longest: 1, lastDate: "2026-01-14" };
    const result = incrementStreak(streak, "2026-01-15T00:01:00Z");
    expect(result.current).toBe(2);
    expect(result.lastDate).toBe("2026-01-15");
  });
});

describe("isStreakAlive", () => {
  it("returns true when last was today or yesterday", () => {
    expect(isStreakAlive({ current: 1, longest: 1, lastDate: "2026-01-15" }, "2026-01-15")).toBe(true);
    expect(isStreakAlive({ current: 1, longest: 1, lastDate: "2026-01-14" }, "2026-01-15")).toBe(true);
  });

  it("returns false after 2-day gap", () => {
    expect(isStreakAlive({ current: 1, longest: 1, lastDate: "2026-01-13" }, "2026-01-15")).toBe(false);
  });

  it("returns false when lastDate empty", () => {
    expect(isStreakAlive({ current: 0, longest: 0, lastDate: "" }, "2026-01-15")).toBe(false);
  });
});

describe("createStreakState", () => {
  it("returns all five streak keys with empty values", () => {
    const state = createStreakState();
    const empty = { current: 0, longest: 0, lastDate: "" };
    expect(state.dailyCheckin).toEqual(empty);
    expect(state.medication).toEqual(empty);
    expect(state.breathing).toEqual(empty);
    expect(state.scoring).toEqual(empty);
    expect(state.spoonSurplus).toEqual(empty);
  });
});

describe("toUTCDateString", () => {
  it("normalizes YYYY-MM-DD and ISO to UTC date", () => {
    expect(toUTCDateString("2026-01-15")).toBe("2026-01-15");
    expect(toUTCDateString("2026-01-15T23:59:59.999Z")).toBe("2026-01-15");
    expect(toUTCDateString("2026-01-15T00:00:00Z")).toBe("2026-01-15");
  });
});

describe("longest streak preserved", () => {
  it("longest is preserved after gap reset", () => {
    let streak = createStreakState().medication;
    streak = incrementStreak(streak, "2026-01-01");
    streak = incrementStreak(streak, "2026-01-02");
    streak = incrementStreak(streak, "2026-01-03");
    expect(streak.current).toBe(3);
    expect(streak.longest).toBe(3);
    streak = incrementStreak(streak, "2026-01-05");
    expect(streak.current).toBe(1);
    expect(streak.longest).toBe(3);
  });
});
