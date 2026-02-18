import { describe, it, expect } from "vitest";
import { computeVoltage, scoreAxis } from "../src/scorer";

describe("computeVoltage", () => {
  it("scores a message with low signals as GREEN", () => {
    const result = computeVoltage("FYI, no rush — just wanted to confirm. Sounds good, thanks!");
    expect(result.gate).toBe("GREEN");
    expect(result.voltage).toBeLessThan(3);
  });

  it("scores a neutral message as YELLOW (baseline)", () => {
    const result = computeVoltage("Sounds good, thanks!");
    expect(result.gate).toBe("YELLOW");
    expect(result.voltage).toBeGreaterThanOrEqual(3);
    expect(result.voltage).toBeLessThan(6);
  });

  it("scores an urgent message higher", () => {
    const result = computeVoltage("I need this ASAP, the deadline is today.");
    expect(result.urgency).toBeGreaterThanOrEqual(7);
    expect(result.voltage).toBeGreaterThanOrEqual(3);
  });

  it("scores passive-aggressive language as high emotional", () => {
    const result = computeVoltage("Per my last email, I'm not sure why this wasn't done.");
    expect(result.emotional).toBeGreaterThanOrEqual(7);
    expect(result.passiveAggressive.length).toBeGreaterThan(0);
  });

  it("scores a complex message with high cognitive load", () => {
    const longMessage = "Please review the attached spreadsheet with 5 items. " +
      "There are legal implications for each option. " +
      "Can you also schedule a meeting? What about the contract?";
    const result = computeVoltage(longMessage);
    expect(result.cognitive).toBeGreaterThanOrEqual(6);
  });

  it("detects CRITICAL gate for combined high signals", () => {
    const result = computeVoltage(
      "URGENT: I'm extremely frustrated!!! Per my last email, review the legal contract IMMEDIATELY. " +
      "This is unacceptable. Final notice — deadline is TODAY.",
    );
    expect(result.gate).toBe("CRITICAL");
    expect(result.voltage).toBeGreaterThanOrEqual(8);
  });

  it("never scores below 1 on any axis", () => {
    const result = computeVoltage("ok");
    expect(result.urgency).toBeGreaterThanOrEqual(1);
    expect(result.emotional).toBeGreaterThanOrEqual(1);
    expect(result.cognitive).toBeGreaterThanOrEqual(1);
  });

  it("never scores above 10 on any axis", () => {
    const extreme = "URGENT ASAP NOW IMMEDIATELY CRITICAL EMERGENCY DEADLINE TODAY FINAL NOTICE LAST CHANCE";
    const result = computeVoltage(extreme);
    expect(result.urgency).toBeLessThanOrEqual(10);
    expect(result.emotional).toBeLessThanOrEqual(10);
    expect(result.cognitive).toBeLessThanOrEqual(10);
  });

  it("returns deterministic results for the same input", () => {
    const text = "Please confirm the schedule by Friday.";
    const a = computeVoltage(text);
    const b = computeVoltage(text);
    expect(a).toEqual(b);
  });

  it("does NOT flag normal parenting messages", () => {
    const result = computeVoltage("Can you pick up the kids at 3?");
    expect(result.voltage).toBeLessThan(6);
    expect(result.passiveAggressive).toHaveLength(0);
  });
});

describe("scoreAxis", () => {
  it("returns 5 (neutral) when no patterns match", () => {
    const result = scoreAxis("hello world", [], [], []);
    expect(result).toBe(5);
  });

  it("clamps to range 1-10", () => {
    const high = [/./]; // matches everything
    const result = scoreAxis("test", high, [], []);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(10);
  });
});
