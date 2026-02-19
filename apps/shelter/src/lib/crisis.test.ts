import { describe, it, expect } from "vitest";
import { getCrisisLevel, CRISIS_988_MESSAGE } from "./crisis";

describe("crisis", () => {
  describe("getCrisisLevel", () => {
    it("returns 0 for empty string", () => {
      expect(getCrisisLevel("")).toBe(0);
      expect(getCrisisLevel("   ")).toBe(0);
    });

    it("returns 3 for explicit self-harm or suicide intent", () => {
      expect(getCrisisLevel("I want to kill myself")).toBe(3);
      expect(getCrisisLevel("I'm suicidal")).toBe(3);
      expect(getCrisisLevel("thinking about suicide")).toBe(3);
      expect(getCrisisLevel("take my life tonight")).toBe(3);
      expect(getCrisisLevel("no reason to live")).toBe(3);
    });

    it("returns 2 for hopelessness or ideation without explicit plan", () => {
      expect(getCrisisLevel("I can't go on")).toBe(2);
      expect(getCrisisLevel("nobody cares about me")).toBe(2);
      expect(getCrisisLevel("they'd be better off without me")).toBe(2);
      expect(getCrisisLevel("I feel hopeless")).toBe(2);
      expect(getCrisisLevel("don't want to be here anymore")).toBe(2);
      expect(getCrisisLevel("thoughts of ending it")).toBe(2);
    });

    it("returns 1 for work/safe context that could be confused", () => {
      expect(getCrisisLevel("I'm going to kill this project")).toBe(1);
      expect(getCrisisLevel("die of boredom")).toBe(1);
      expect(getCrisisLevel("so tired I could die")).toBe(1);
    });

    it("returns 0 for normal safe text", () => {
      expect(getCrisisLevel("Hello how are you")).toBe(0);
      expect(getCrisisLevel("Meeting at 5pm")).toBe(0);
      expect(getCrisisLevel("The mesh holds.")).toBe(0);
    });
  });

  describe("CRISIS_988_MESSAGE", () => {
    it("includes 988 and lifeline", () => {
      expect(CRISIS_988_MESSAGE).toContain("988");
      expect(CRISIS_988_MESSAGE).toContain("lifeline");
    });
  });
});
