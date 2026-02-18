/**
 * @p31labs/buffer-core — The Buffer scoring engine
 *
 * Pure TypeScript library for voltage-gated message processing.
 * Zero external dependencies. Runs anywhere: browser, Node, Worker, ESP32 WASM.
 *
 * @example
 * ```typescript
 * import { computeVoltage, extractBLUF, SpoonTracker, SamsonV2Controller } from "@p31labs/buffer-core";
 *
 * const score = computeVoltage("Please review this ASAP, per my last email.");
 * // { urgency: 8, emotional: 7, cognitive: 5, voltage: 7.1, gate: "RED", passiveAggressive: [...] }
 *
 * const bluf = extractBLUF("Please review the contract. Let me know if you have questions.");
 * // { summary: "Please review the contract.", actions: ["Please review the contract."], ... }
 *
 * const spoons = new SpoonTracker(8);
 * spoons.spend(SpoonTracker.readCost(score.voltage));
 *
 * const samson = new SamsonV2Controller();
 * samson.addScore(score.voltage);
 * samson.updateSpoons(spoons.current, spoons.max);
 * console.log(samson.aiTemp); // Governed temperature for AI rewrite
 * ```
 *
 * @packageDocumentation
 */

// Scoring
export { computeVoltage, scoreAxis, getGateConfig } from "./scorer";

// BLUF extraction
export { extractBLUF } from "./bluf";

// Spoon management
export { SpoonTracker } from "./spoons";

// Samson V2 PID controller
export { SamsonV2Controller } from "./samson";

// Pattern detection
export { detectPassiveAggressive } from "./patterns";

// Constants
export {
  MARK1,
  LARMOR_HZ,
  LARMOR_MS,
  BREATHE,
  SPOONS_MAX,
  GOLDEN_RATIO,
  WEIGHTS,
  GATES,
  SPOON_COSTS,
  HEARTBEATS,
  SAMSON,
} from "./constants";

// Types
export type {
  GateName,
  GateConfig,
  AxisScore,
  PAMatch,
  VoltageScore,
  BLUFResult,
  HeartbeatTier,
  HeartbeatConfig,
  SpoonState,
  PTerm,
  DriftTerm,
  BurnoutTerm,
  SamsonState,
} from "./types";
