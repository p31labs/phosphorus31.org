import { describe, it, expect, beforeEach } from "vitest";
import { freeze, thaw, getPhase, resetPhase } from "../src/phase";

describe("game-core phase", () => {
  beforeEach(() => {
    resetPhase();
  });

  it("starts fluid", () => {
    expect(getPhase()).toBe("fluid");
  });

  it("freeze sets frozen", () => {
    freeze();
    expect(getPhase()).toBe("frozen");
  });

  it("thaw sets fluid", () => {
    freeze();
    thaw();
    expect(getPhase()).toBe("fluid");
  });

  it("resetPhase sets fluid", () => {
    freeze();
    resetPhase();
    expect(getPhase()).toBe("fluid");
  });
});
