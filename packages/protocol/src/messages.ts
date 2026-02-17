/**
 * @p31/protocol — message and voltage result types.
 * Shared between Shelter, Scope, and Buffer engine.
 */

import type { ThreatPattern } from './patterns.js';
import type { TriageDecision } from './triage.js';
import type { ThreatLevel } from './voltage.js';

export interface PatternMatch {
  pattern: ThreatPattern;
  confidence: number;
  evidence: string;
  weight: number;
}

export interface VoltageResult {
  voltage: number;
  threatLevel: ThreatLevel;
  patterns: PatternMatch[];
  baseVoltage: number;
  escalationModifier: number;
}

export interface Message {
  id: string;
  text: string;
  sender?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ProcessedMessage extends Message {
  voltageResult: VoltageResult;
  triageDecision: TriageDecision;
  processedAt: string;
}
