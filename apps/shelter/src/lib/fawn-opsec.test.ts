import { describe, it, expect } from "vitest";
import { scoreFawn, shouldShowFawnReview, FAWN_REVIEW_THRESHOLD } from "./fawn";
import { filterOPSEC } from "./opsec";

describe("fawn", () => {
  describe("scoreFawn", () => {
    it("returns sovereignty 10 minus fawn score", () => {
      const r = scoreFawn("Hello");
      expect(r.sovereignty).toBe(10 - r.score);
    });

    it("scores high for permission-seeking and related patterns", () => {
      const r = scoreFawn("Is it ok if I ask you something? Sorry to bother, I was just wondering if that would be ok. Hope that's ok.");
      expect(r.triggers).toContain("permission_seeking");
      expect(r.score).toBeGreaterThan(FAWN_REVIEW_THRESHOLD);
    });

    it("scores high for unnecessary apology", () => {
      const r = scoreFawn("Sorry for bothering you, I just wanted to ask.");
      expect(r.triggers.some((t) => t.includes("apology") || t.includes("filler"))).toBe(true);
    });

    it("scores high for self-diminishing", () => {
      const r = scoreFawn("Just my opinion but I might be wrong.");
      expect(r.triggers).toContain("self_diminishing");
    });

    it("scores low for direct sovereign text", () => {
      const r = scoreFawn("Meeting at 5pm. Bring the report.");
      expect(r.score).toBeLessThanOrEqual(4);
      expect(r.sovereignty).toBeGreaterThanOrEqual(6);
    });
  });

  describe("shouldShowFawnReview", () => {
    it("returns true when score > 4", () => {
      expect(shouldShowFawnReview({ score: 5, sovereignty: 5, triggers: [] })).toBe(true);
      expect(shouldShowFawnReview({ score: 4, sovereignty: 6, triggers: [] })).toBe(false);
    });
  });
});

describe("opsec", () => {
  describe("filterOPSEC", () => {
    it("redacts Sebastian to Bash", () => {
      expect(filterOPSEC("Tell Sebastian to come home")).toContain("Bash");
      expect(filterOPSEC("Tell Sebastian to come home")).not.toContain("Sebastian");
    });

    it("redacts William to Will", () => {
      expect(filterOPSEC("William said yes")).toContain("Will");
      expect(filterOPSEC("William said yes")).not.toContain("William");
    });

    it("redacts Will Johnson to Will", () => {
      expect(filterOPSEC("Will Johnson is the operator")).not.toContain("Johnson");
    });

    it("redacts standalone Johnson", () => {
      expect(filterOPSEC("Johnson filed the form")).toContain("[name]");
    });

    it("returns empty string unchanged", () => {
      expect(filterOPSEC("")).toBe("");
    });
  });
});
