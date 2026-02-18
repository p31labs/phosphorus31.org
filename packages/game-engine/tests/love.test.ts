import { describe, it, expect } from "vitest";
import { mine, applyMining, createLOVEState } from "../src/love";

describe("mine", () => {
  it("yields correct base rate per action", () => {
    const ts = "2026-01-01T12:00:00Z";
    expect(mine("message_scored", "yellow", 1.0, ts).yield).toBe(5);
    expect(mine("queue_cleared", "yellow", 1.0, ts).yield).toBe(25);
  });

  it("heartbeat multipliers apply", () => {
    const ts = "2026-01-01T12:00:00Z";
    expect(mine("message_scored", "green", 1.0, ts).yield).toBe(5 * 2.5);
    expect(mine("message_scored", "red", 1.0, ts).yield).toBe(5 * 0.25);
  });

  it("proof hash is deterministic", () => {
    const ts = "2026-01-01T12:00:00Z";
    const a = mine("message_scored", "green", 1.0, ts);
    const b = mine("message_scored", "green", 1.0, ts);
    expect(a.proof).toBe(b.proof);
  });
});

describe("applyMining", () => {
  it("updates balance and totalMined", () => {
    const state = createLOVEState();
    const result = mine("message_scored", "yellow", 1.0, "2026-01-01T12:00:00Z");
    const next = applyMining(state, result);
    expect(next.balance).toBe(5);
    expect(next.totalMined).toBe(5);
  });
});

describe("createLOVEState", () => {
  it("returns zero balance and totalMined", () => {
    const state = createLOVEState();
    expect(state.balance).toBe(0);
    expect(state.totalMined).toBe(0);
  });
});

describe("mine quality factor", () => {
  it("scales yield by quality", () => {
    const ts = "2026-01-01T12:00:00Z";
    expect(mine("message_scored", "yellow", 0.5, ts).yield).toBe(2.5);
  });
});
