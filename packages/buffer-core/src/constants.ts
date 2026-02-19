import type { GateConfig, GateName, HeartbeatConfig, HeartbeatTier } from "./types";

/** Home Frequency — system health target: H ≈ π/9 */
export const MARK1 = Math.PI / 9;

/** Larmor frequency of ³¹P in Earth's field (~50μT) */
export const LARMOR_HZ = 863;

/** Larmor period in milliseconds */
export const LARMOR_MS = 1000 / LARMOR_HZ;

/** 4-2-6 breathing cycle (seconds) */
export const BREATHE = {
  IN: 4,
  HOLD: 2,
  OUT: 6,
  TOTAL: 12,
} as const;

/** Maximum spoon capacity */
export const SPOONS_MAX = 12;

/** Golden ratio φ */
export const GOLDEN_RATIO = 1.618033988749895;

/** Voltage axis weights: V = U×0.4 + E×0.3 + C×0.3 */
export const WEIGHTS = {
  urgency: 0.4,
  emotional: 0.3,
  cognitive: 0.3,
} as const;

/** Gate thresholds and display configuration */
export const GATES: Record<GateName, GateConfig> = {
  GREEN: { max: 3, label: "CLEAR", color: "#22c55e", bg: "#052e16", desc: "Safe to process" },
  YELLOW: { max: 6, label: "CAUTION", color: "#f59e0b", bg: "#422006", desc: "Summary first" },
  RED: { max: 8, label: "HIGH VOLTAGE", color: "#ef4444", bg: "#450a0a", desc: "Gated display" },
  CRITICAL: { max: 10, label: "CRITICAL", color: "#dc2626", bg: "#4c0519", desc: "Defer recommended" },
} as const;

/** Spoon costs per action */
export const SPOON_COSTS = {
  readLow: 0.5,
  readMed: 1.0,
  readHigh: 2.0,
  replySimple: 1.0,
  replyComplex: 3.0,
  contextSwitch: 1.5,
  aiRewrite: 0.5,
  viewOriginal: 1.5,
} as const;

/** Heartbeat tier thresholds (percentage of max spoons) */
export const HEARTBEATS: Record<HeartbeatTier, HeartbeatConfig> = {
  GREEN: { minPercent: 80, color: "#22c55e", bg: "#052e16", label: "NOMINAL" },
  YELLOW: { minPercent: 50, color: "#ca8a04", bg: "#422006", label: "CONSERVATION" },
  ORANGE: { minPercent: 25, color: "#ea580c", bg: "#431407", label: "PROTECTIVE" },
  RED: { minPercent: 0, color: "#dc2626", bg: "#450a0a", label: "DEEP LOCK" },
} as const;

/** P31 Governor PID controller tuning */
export const SAMSON = {
  TARGET_H: MARK1,
  EPSILON: 0.05,
  K_DECAY: 0.1,
  TEMP_MIN: 0.1,
  TEMP_MAX: 1.0,
  TEMP_DEFAULT: 0.7,
  HISTORY_SIZE: 20,
} as const;
