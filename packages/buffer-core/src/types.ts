/** Gate classification for voltage levels */
export type GateName = "GREEN" | "YELLOW" | "RED" | "CRITICAL";

/** Individual gate configuration */
export interface GateConfig {
  readonly max: number;
  readonly label: string;
  readonly color: string;
  readonly bg: string;
  readonly desc: string;
}

/** Result of scoring a single axis (urgency, emotional, or cognitive) */
export interface AxisScore {
  readonly urgency: number;
  readonly emotional: number;
  readonly cognitive: number;
}

/** Passive-aggressive pattern match */
export interface PAMatch {
  readonly pattern: string;
  readonly translation: string;
}

/** Full voltage score for a message */
export interface VoltageScore {
  readonly urgency: number;
  readonly emotional: number;
  readonly cognitive: number;
  readonly voltage: number;
  readonly gate: GateName;
  readonly passiveAggressive: readonly PAMatch[];
}

/** BLUF (Bottom Line Up Front) extraction */
export interface BLUFResult {
  readonly summary: string;
  readonly actions: readonly string[];
  readonly questionCount: number;
  readonly sentenceCount: number;
}

/** Heartbeat tier classification */
export type HeartbeatTier = "GREEN" | "YELLOW" | "ORANGE" | "RED";

/** Heartbeat tier configuration */
export interface HeartbeatConfig {
  readonly minPercent: number;
  readonly color: string;
  readonly bg: string;
  readonly label: string;
}

/** Spoon tracker state */
export interface SpoonState {
  readonly current: number;
  readonly max: number;
  readonly tier: HeartbeatTier;
  readonly locked: boolean;
}

/** Samson V2 PID controller terms */
export type PTerm = "stable" | "over-actualized" | "under-actualized";
export type DriftTerm = "nominal" | "escalating" | "looping";
export type BurnoutTerm = "ok" | "warning" | "critical";

/** Full Samson V2 controller state */
export interface SamsonState {
  readonly H: number;
  readonly error: number;
  readonly pTerm: PTerm;
  readonly drift: DriftTerm;
  readonly burnout: BurnoutTerm;
  readonly aiTemp: number;
  readonly zScore: number;
}

/** Spoon cost action names */
export type SpoonAction =
  | "readLow"
  | "readMed"
  | "readHigh"
  | "replySimple"
  | "replyComplex"
  | "contextSwitch"
  | "aiRewrite"
  | "viewOriginal";
