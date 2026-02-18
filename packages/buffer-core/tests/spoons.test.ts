import { describe, it, expect } from "vitest";
import { SpoonTracker } from "../src/spoons";

describe("SpoonTracker", () => {
  it("initializes with default max (12)", () => {
    const tracker = new SpoonTracker();
    expect(tracker.current).toBe(12);
    expect(tracker.max).toBe(12);
  });

  it("initializes with custom values", () => {
    const tracker = new SpoonTracker(8, 12);
    expect(tracker.current).toBe(8);
    expect(tracker.percentage).toBeCloseTo(66.67, 1);
  });

  it("spends spoons correctly", () => {
    const tracker = new SpoonTracker(8);
    tracker.spend(1.5);
    expect(tracker.current).toBe(6.5);
  });

  it("never goes below zero", () => {
    const tracker = new SpoonTracker(1);
    tracker.spend(5);
    expect(tracker.current).toBe(0);
  });

  it("restores spoons up to max", () => {
    const tracker = new SpoonTracker(5);
    tracker.restore(100);
    expect(tracker.current).toBe(12);
  });

  it("returns correct tier thresholds", () => {
    expect(new SpoonTracker(12).tier).toBe("GREEN");
    expect(new SpoonTracker(7).tier).toBe("YELLOW");
    expect(new SpoonTracker(4).tier).toBe("ORANGE");
    expect(new SpoonTracker(2).tier).toBe("RED");
  });

  it("locks when below 25%", () => {
    const tracker = new SpoonTracker(2);
    expect(tracker.locked).toBe(true);
  });

  it("calculates read cost by voltage", () => {
    expect(SpoonTracker.readCost(2)).toBe(0.5);
    expect(SpoonTracker.readCost(4)).toBe(1.0);
    expect(SpoonTracker.readCost(7)).toBe(2.0);
  });
});
