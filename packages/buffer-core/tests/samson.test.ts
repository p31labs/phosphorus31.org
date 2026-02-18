import { describe, it, expect } from "vitest";
import { SamsonV2Controller } from "../src/samson";
import { SAMSON } from "../src/constants";

describe("SamsonV2Controller", () => {
  it("defaults H to MARK1 when no messages processed", () => {
    const controller = new SamsonV2Controller();
    expect(controller.H).toBeCloseTo(SAMSON.TARGET_H, 4);
  });

  it("computes H as processed / total", () => {
    const controller = new SamsonV2Controller();
    controller.recordProcessed();
    controller.recordProcessed();
    controller.recordDeferred();
    expect(controller.H).toBeCloseTo(2 / 3, 4);
  });

  it("reports stable when near attractor", () => {
    const controller = new SamsonV2Controller();
    expect(controller.pTerm).toBe("stable");
  });

  it("detects over-actualized when H > target + epsilon", () => {
    const controller = new SamsonV2Controller();
    for (let i = 0; i < 10; i++) controller.recordProcessed();
    controller.recordDeferred();
    expect(controller.pTerm).toBe("over-actualized");
  });

  it("detects escalating drift when recent voltages are high", () => {
    const controller = new SamsonV2Controller();
    for (let i = 0; i < 5; i++) controller.addScore(7.5);
    expect(controller.drift).toBe("escalating");
  });

  it("detects looping when voltages barely change", () => {
    const controller = new SamsonV2Controller();
    for (let i = 0; i < 5; i++) controller.addScore(4.0);
    expect(controller.drift).toBe("looping");
  });

  it("reports critical burnout when spoons < 15%", () => {
    const controller = new SamsonV2Controller();
    controller.updateSpoons(1, 12);
    expect(controller.burnout).toBe("critical");
  });

  it("lowers AI temperature during escalation", () => {
    const controller = new SamsonV2Controller();
    for (let i = 0; i < 5; i++) controller.addScore(8);
    const temp = controller.aiTemp;
    expect(temp).toBeLessThan(SAMSON.TEMP_DEFAULT);
  });

  it("raises AI temperature during looping", () => {
    const controller = new SamsonV2Controller();
    for (let i = 0; i < 5; i++) controller.addScore(3);
    const temp = controller.aiTemp;
    expect(temp).toBeGreaterThan(SAMSON.TEMP_DEFAULT);
  });

  it("converges toward H ≈ 0.35 in simulation", () => {
    const controller = new SamsonV2Controller();

    for (let i = 0; i < 100; i++) {
      if (controller.H > SAMSON.TARGET_H + 0.1) {
        controller.recordDeferred();
      } else {
        controller.recordProcessed();
      }
      controller.addScore(5);
    }

    expect(Math.abs(controller.H - SAMSON.TARGET_H)).toBeLessThan(0.15);
  });

  it("serializes and loads state", () => {
    const controller = new SamsonV2Controller();
    controller.recordProcessed();
    controller.recordDeferred();
    controller.addScore(5);
    controller.updateSpoons(6, 12);

    const data = controller.serialize();
    const restored = new SamsonV2Controller();
    restored.load(data);

    expect(restored.state).toEqual(controller.state);
  });

  it("caps history at HISTORY_SIZE", () => {
    const controller = new SamsonV2Controller();
    for (let i = 0; i < 30; i++) controller.addScore(5);
    const data = controller.serialize();
    expect(data.history.length).toBeLessThanOrEqual(SAMSON.HISTORY_SIZE);
  });
});
