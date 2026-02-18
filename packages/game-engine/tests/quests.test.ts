import { describe, it, expect } from "vitest";
import {
  generateDailyQuests,
  generateWeeklyQuests,
  updateQuestProgress,
} from "../src/quests";

describe("generateDailyQuests", () => {
  it("returns exactly 3 quests", () => {
    const q = generateDailyQuests("2026-01-15");
    expect(q).toHaveLength(3);
  });

  it("same date generates same quests (deterministic)", () => {
    const a = generateDailyQuests("2026-01-15");
    const b = generateDailyQuests("2026-01-15");
    expect(a.map((x) => x.id)).toEqual(b.map((x) => x.id));
    expect(a.map((x) => x.title)).toEqual(b.map((x) => x.title));
  });

  it("different dates generate different quests", () => {
    const a = generateDailyQuests("2026-01-15");
    const b = generateDailyQuests("2026-01-16");
    expect(a.map((x) => x.id)).not.toEqual(b.map((x) => x.id));
  });

  it("each quest has expiresAt end of day (UTC)", () => {
    const q = generateDailyQuests("2026-01-15");
    for (const quest of q) {
      expect(quest.expiresAt).toBeDefined();
      const exp = new Date(quest.expiresAt!);
      expect(exp.getUTCFullYear()).toBe(2026);
      expect(exp.getUTCMonth()).toBe(0);
      expect(exp.getUTCDate()).toBe(15);
      expect(exp.getUTCHours()).toBe(23);
      expect(exp.getUTCMinutes()).toBe(59);
    }
  });
});

describe("generateWeeklyQuests", () => {
  it("returns 3 weekly quests with expiresAt 7 days later (UTC)", () => {
    const q = generateWeeklyQuests("2026-01-06");
    expect(q).toHaveLength(3);
    const exp = new Date(q[0]!.expiresAt!);
    expect(exp.getUTCDate()).toBe(13);
  });
});

describe("updateQuestProgress", () => {
  it("increments correct quest by action", () => {
    const quests = generateDailyQuests("2026-01-15");
    const messageScoredQuest = quests.find((q) => q.objective.action === "message_scored");
    expect(messageScoredQuest).toBeDefined();
    expect(messageScoredQuest!.objective.action).toBe("message_scored");
    expect(messageScoredQuest!.objective.count).toBe(3);
    expect(messageScoredQuest!.objective.current).toBe(0);

    let q = quests;
    const r1 = updateQuestProgress(q, "message_scored");
    q = r1.quests;
    expect(r1.completed).toHaveLength(0);
    const vt1 = q.find((x) => x.objective.action === "message_scored")!;
    expect(vt1.objective.current).toBe(1);

    const r2 = updateQuestProgress(q, "message_scored");
    q = r2.quests;
    const r3 = updateQuestProgress(q, "message_scored");
    expect(r3.completed.some((c) => c.objective.action === "message_scored")).toBe(true);
  });

  it("already-completed quests do not re-complete", () => {
    const quests = generateDailyQuests("2026-01-08");
    const cal = quests.find((q) => q.objective.action === "calibration");
    expect(cal).toBeDefined();
    const { quests: afterFirst, completed: firstCompleted } = updateQuestProgress(
      quests,
      "calibration"
    );
    expect(firstCompleted.some((c) => c.objective.action === "calibration")).toBe(true);
    const cal2 = afterFirst.find((q) => q.objective.action === "calibration")!;
    expect(cal2.objective.current).toBe(1);
    const { completed: secondCompleted } = updateQuestProgress(afterFirst, "calibration");
    expect(secondCompleted).toHaveLength(0);
  });
});
