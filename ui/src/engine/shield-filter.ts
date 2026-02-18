/**
 * Shield Filter
 * Core threat detection and message filtering logic
 *
 * Pure function - no React, no hooks, no DOM
 */

import { scanForThreats, hasHighSeverityThreats, type ThreatMatch } from './filter-patterns';
import { calculateVoltage, type VoltageResult } from './voltage-calculator';
import { detectGenre, type GenreAnalysis } from './genre-detector';

export interface MessageFilterResult {
  shouldBlock: boolean;
  shouldBuffer: boolean;
  voltage: VoltageResult;
  genre: GenreAnalysis;
  threats: ThreatMatch[];
  recommendation: 'safe' | 'buffer' | 'sanitize' | 'block';
  reason?: string;
}

/**
 * Filter a message through the shield
 */
export function filterMessage(
  content: string,
  metadata?: {
    sender?: string;
    source?: string;
    timestamp?: Date;
  }
): MessageFilterResult {
  // Calculate voltage
  const voltage = calculateVoltage(content, metadata);

  // Detect genre
  const genre = detectGenre(content);

  // Scan for threats
  const threats = scanForThreats(content);

  // Determine action
  let shouldBlock = false;
  let shouldBuffer = false;
  let recommendation: 'safe' | 'buffer' | 'sanitize' | 'block' = 'safe';
  let reason: string | undefined;

  // Critical threats = block
  const hasCriticalThreats = threats.some((t) => t.pattern.severity === 'critical');
  if (hasCriticalThreats) {
    shouldBlock = true;
    recommendation = 'block';
    reason = 'Critical threat patterns detected';
  }
  // High voltage + high severity threats = block
  else if (voltage.score >= 8 && hasHighSeverityThreats(content)) {
    shouldBlock = true;
    recommendation = 'block';
    reason = 'High voltage with threat patterns';
  }
  // High voltage = sanitize
  else if (voltage.score >= 7) {
    shouldBuffer = true;
    recommendation = 'sanitize';
    reason = 'High voltage - requires sanitization';
  }
  // Medium voltage = buffer
  else if (voltage.score >= 4) {
    shouldBuffer = true;
    recommendation = 'buffer';
    reason = 'Medium voltage - buffer recommended';
  }
  // Low voltage = safe
  else {
    recommendation = 'safe';
    reason = 'Low voltage - safe to view';
  }

  return {
    shouldBlock,
    shouldBuffer,
    voltage,
    genre,
    threats,
    recommendation,
    reason,
  };
}
