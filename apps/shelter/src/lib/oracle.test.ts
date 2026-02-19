import { describe, it, expect } from "vitest";
import { buildOraclePrompt, estimateTokenCount, type OracleContext } from "./oracle";

const baseCtx: OracleContext = {
  coherence: 0.5,
  phase: "flow",
  spoons: 5,
  maxSpoons: 10,
  tier: "GREEN",
  level: 2,
  xp: 100,
  streakDays: 3,
  loveMined: 25,
  mode: "chat",
};

describe("oracle", () => {
  describe("buildOraclePrompt", () => {
    it("includes identity and safety blocks", () => {
      const p = buildOraclePrompt(baseCtx);
      expect(p).toContain("Oracle");
      expect(p).toContain("Five Companions");
      expect(p).toContain("988");
      expect(p).toContain("Bash and Willow");
    });

    it("includes live context", () => {
      const p = buildOraclePrompt(baseCtx);
      expect(p).toContain("50%");
      expect(p).toContain("5");
      expect(p).toContain("GREEN");
    });

    it("forces anchor mode when spoons <= 2", () => {
      const low = { ...baseCtx, spoons: 2, mode: "chat" as const };
      const p = buildOraclePrompt(low);
      expect(p).toContain("ANCHOR");
      expect(p).toContain("Steady presence");
    });
  });

  describe("estimateTokenCount", () => {
    it("returns 0 for empty", () => {
      expect(estimateTokenCount("")).toBe(0);
    });
    it("estimates ~4 chars per token", () => {
      expect(estimateTokenCount("abcd")).toBe(1);
      expect(estimateTokenCount("The mesh holds.")).toBeGreaterThanOrEqual(3);
    });
  });
});
