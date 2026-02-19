/**
 * god.config.ts — Single Source of Truth
 *
 * P31 Labs runtime constants. Every app and package imports from here.
 * Values sourced from P31_PROTOCOL_BIBLE.md (canonical).
 *
 * If a value exists here, do NOT hardcode it elsewhere.
 */

export const GOD_CONFIG = {
  // ── Physics ──────────────────────────────────────────────────────────────
  MARK1_ATTRACTOR: Math.PI / 9, // ≈ 0.349065 — System health target (H)
  LARMOR_P31_HZ: 863, // ³¹P Larmor frequency in Earth's field (~50μT)
  GOLDEN_RATIO: 1.618033988749895, // φ — used in UI proportions

  // ── Breathing ────────────────────────────────────────────────────────────
  BREATHE_IN_MS: 4000,
  BREATHE_HOLD_MS: 2000,
  BREATHE_OUT_MS: 6000,
  BREATHE_CYCLE_MS: 12000,

  // ── Spoons ───────────────────────────────────────────────────────────────
  SPOONS_MAX: 12,

  // ── Voltage Scoring ──────────────────────────────────────────────────────
  WEIGHTS: {
    urgency: 0.4,
    emotional: 0.3,
    cognitive: 0.3,
  } as const,

  // ── Gate Thresholds ──────────────────────────────────────────────────────
  GATES: {
    GREEN: 3, // 0 ≤ V < 3  → Normal display
    YELLOW: 6, // 3 ≤ V < 6  → Summary first, confirm to expand
    RED: 8, // 6 ≤ V < 8  → Summary only, raw text gated
    CRITICAL: 10, // 8 ≤ V ≤ 10 → Defer recommended
  } as const,

  // ── Spoon Costs ──────────────────────────────────────────────────────────
  SPOON_COSTS: {
    readLow: 0.5,
    readMed: 1.0,
    readHigh: 2.0,
    replySimple: 1.0,
    replyComplex: 3.0,
    contextSwitch: 1.5,
    aiRewrite: 0.5,
    viewOriginal: 1.5,
  } as const,

  // ── Heartbeat Tiers (% of SPOONS_MAX) ────────────────────────────────────
  HEARTBEAT: {
    GREEN: 0.8, // ≥80% → NOMINAL
    YELLOW: 0.5, // ≥50% → CONSERVATION
    ORANGE: 0.25, // ≥25% → PROTECTIVE
    RED: 0.25, // <25% → DEEP PROCESSING LOCK
  } as const,

  // ── P31 Governor PID Controller ───────────────────────────────────────────
  SAMSON: {
    TARGET_H: Math.PI / 9, // ≈ 0.349065
    EPSILON: 0.05,
    K_DECAY: 0.1,
    TEMP_MIN: 0.3,
    TEMP_MAX: 1.2,
    TEMP_DEFAULT: 0.7,
  } as const,

  // ── 3-Register Architecture ──────────────────────────────────────────────
  REGISTERS: {
    P: "past", // Persistent storage — cached context, session history
    N: "now", // Current message being processed
    U: "universe", // Active session state — P folded with N
  } as const,

  // ── Design Tokens ────────────────────────────────────────────────────────
  COLORS: {
    PHOSPHOR_GREEN: "#39FF14",
    CALCIUM_WARM: "#ff9f43",
    SIGNAL_BLUE: "#00d4ff",
    VOID_BG: "#0a0a0f",
    TEXT_PRIMARY: "#d4d4d4",
    TEXT_DIM: "#6b7280",
    GATE_GREEN: "#22c55e",
    GATE_YELLOW: "#eab308",
    GATE_RED: "#ef4444",
    GATE_CRITICAL: "#7c3aed",
  } as const,

  // ── Font Stack (no external fonts) ───────────────────────────────────────
  FONTS: {
    MONO: "'IBM Plex Mono', 'JetBrains Mono', 'SF Mono', 'Cascadia Code', 'Fira Code', monospace",
    SANS: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  } as const,

  // ── BLE GATT (Node One firmware interface) ───────────────────────────────
  BLE: {
    SCORE_STRUCT_SIZE: 6,
    HAPTIC_GREEN: 1, // Effect #1 — single soft click
    HAPTIC_YELLOW: 4, // Effect #4 — medium double-tap
    HAPTIC_RED: 14, // Effect #14 — strong triple-buzz with ramp
    HAPTIC_CRITICAL: 87, // Effect #87 — sustained ramp-up warning
  } as const,

  // ── Identity ─────────────────────────────────────────────────────────────
  ORG: {
    NAME: "P31 Labs",
    DOMAIN_CORPORATE: "phosphorus31.org",
    DOMAIN_TECHNICAL: "p31ca.org",
    GITHUB: "github.com/p31labs",
    EMAIL: "will@p31ca.org",
    LICENSE: "AGPL-3.0",
    TAGLINE: "It's okay to be a little wonky.",
  } as const,
} as const;

export type GodConfig = typeof GOD_CONFIG;
export default GOD_CONFIG;
