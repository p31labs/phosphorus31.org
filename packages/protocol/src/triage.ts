/**
 * @p31/protocol — triage status and hold reasons.
 * Shared between Shelter API and Buffer engine.
 */

import type { ThreatLevel } from './voltage.js';

export const TRIAGE_STATUSES = ['PASSED', 'HELD', 'RELEASED', 'ARCHIVED'] as const;
export type TriageStatus = (typeof TRIAGE_STATUSES)[number];

export const HOLD_REASONS = [
  'VOLTAGE_TOO_HIGH',   // ≥6
  'CRITICAL_ALERT',     // ≥8
  'EMERGENCY_PROTOCOL', // 10
  'MANUAL_HOLD',
] as const;
export type HoldReason = (typeof HOLD_REASONS)[number];

export interface TriageDecision {
  status: TriageStatus;
  holdReason?: HoldReason;
  autoHold: boolean;
  reviewed: boolean;
  reviewedAt?: string;
  releasedAt?: string;
  threatLevel: ThreatLevel;
  accommodationNote?: string;
}
