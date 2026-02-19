/**
 * @p31/protocol — shared types and constants for P31 apps.
 * Voltage tiers, signals, messages, L.O.V.E., mesh. Phase 1: types only.
 */

// Design tokens (single source of truth for colors, fonts, glow, spacing)
export {
  colors,
  productColors,
  fonts,
  typeScale,
  glow,
  spacing,
  radii,
  transitions,
} from './tokens.js';

// Motion system (durations, easings, reduced-motion–aware)
export { motion, transition, type MotionDuration, type MotionEasing } from './motion.js';

// Constants
export {
  P31,
  VOLTAGE_THRESHOLDS,
  VOLTAGE_TIER_MAX,
} from './constants.js';

// Voltage / noise level
export {
  type VoltageTier,
  type NoiseLevel,
  type ThreatLevel,
  voltageTier,
  noiseLevelFromScore,
  threatLevelFromScore,
} from './voltage.js';

// Patterns
export {
  THREAT_PATTERNS,
  PATTERN_WEIGHTS,
  type ThreatPattern,
} from './patterns.js';

// Triage
export {
  TRIAGE_STATUSES,
  HOLD_REASONS,
  type TriageStatus,
  type HoldReason,
  type TriageDecision,
} from './triage.js';

// Messages
export {
  type PatternMatch,
  type VoltageResult,
  type Message,
  type ProcessedMessage,
} from './messages.js';

// WebSocket signals
export {
  WS_EVENT_TYPES,
  type WsEventType,
  type WsFrame,
  type MessageNewData,
  type MessageProcessedData,
  type SproutSignalData,
  type ScopeSubscribedData,
} from './signals.js';

// Mesh / tetrahedron
export {
  NODE_IDS,
  VERTEX_IDS,
  VERTEX_ROLES,
  type NodeId,
  type VertexId,
} from './mesh.js';

// L.O.V.E.
export {
  LOVE_TRANSACTION_TYPES,
  type LoveTransactionType,
  type LoveTransaction,
} from './love.js';

// Metabolism / spoon state (game + Scope)
export {
  type MetabolismColor,
  type BrainStateShape,
} from './metabolism.js';
