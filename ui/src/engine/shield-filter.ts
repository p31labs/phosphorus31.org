/**
 * Shield Filter
 * Core noise detection and message filtering logic
 *
 * Pure function - no React, no hooks, no DOM
 */

import { scanForNoise, hasHighSeverityNoise, type NoiseMatch } from './filter-patterns';
import { calculateVoltage, type VoltageResult } from './voltage-calculator';
import { detectGenre, type GenreAnalysis } from './genre-detector';

export interface MessageFilterResult {
  shouldBlock: boolean;
  shouldBuffer: boolean;
  voltage: VoltageResult;
  genre: GenreAnalysis;
  noiseMatches: NoiseMatch[];
  /** @deprecated Use noiseMatches instead */
  threats: NoiseMatch[];
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

  // Scan for noise
  const noiseMatches = scanForNoise(content);

  // Determine action
  let shouldBlock = false;
  let shouldBuffer = false;
  let recommendation: 'safe' | 'buffer' | 'sanitize' | 'block' = 'safe';
  let reason: string | undefined;

  // Critical noise = block
  const hasCriticalNoise = noiseMatches.some((t) => t.pattern.severity === 'critical');
  if (hasCriticalNoise) {
    shouldBlock = true;
    recommendation = 'block';
    reason = 'Critical noise patterns detected';
  }
  // High voltage + high severity noise = block
  else if (voltage.score >= 8 && hasHighSeverityNoise(content)) {
    shouldBlock = true;
    recommendation = 'block';
    reason = 'High voltage with noise patterns';
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
    noiseMatches,
    threats: noiseMatches,
    recommendation,
    reason,
  };
}
