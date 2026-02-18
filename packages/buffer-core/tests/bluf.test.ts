import { describe, it, expect } from "vitest";
import { extractBLUF } from "../src/bluf";

describe("extractBLUF", () => {
  it("extracts action items from message", () => {
    const result = extractBLUF("Please review the document. Let me know your thoughts.");
    expect(result.actions.length).toBeGreaterThan(0);
    expect(result.summary).toContain("review");
  });

  it("counts questions", () => {
    const result = extractBLUF("Are you free? What time works? Can we meet?");
    expect(result.questionCount).toBe(3);
  });

  it("handles single-sentence input", () => {
    const result = extractBLUF("Hello.");
    expect(result.sentenceCount).toBe(1);
    expect(result.summary).toBe("Hello.");
  });

  it("prioritizes actions over questions", () => {
    const result = extractBLUF("What do you think? Please send the report by Friday.");
    expect(result.summary).toContain("send");
  });

  it("falls back to first sentences when no actions or questions", () => {
    const result = extractBLUF("The weather is nice. Birds are singing.");
    expect(result.summary.length).toBeGreaterThan(0);
    expect(result.actions).toHaveLength(0);
  });
});
