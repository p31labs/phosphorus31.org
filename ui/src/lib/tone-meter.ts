/**
 * Tone Meter
 * Analyzes message tone and provides color coding
 */

import type { ProcessedPayload } from '../types/shield.types';
import GOD_CONFIG from '../config/god.config';

export interface ToneAnalysis {
  genre: 'physics' | 'poetics' | 'mixed';
  genreError: boolean;
  voltage: number;
  color: string;
}

/**
 * Analyze tone from a processed payload
 */
export function analyzeTone(payload: ProcessedPayload): ToneAnalysis {
  const voltage = payload.voltage?.score ?? 0;
  const genre = payload.genre?.genre ?? 'mixed';

  // Genre error: payload marked as physics but contains emotional content
  const genreError = genre === 'physics' && voltage > 5;

  // Determine color based on voltage
  let color = GOD_CONFIG.voltage.low.color;
  if (voltage >= GOD_CONFIG.voltage.critical.threshold) {
    color = GOD_CONFIG.voltage.critical.color;
  } else if (voltage >= GOD_CONFIG.voltage.high.threshold) {
    color = GOD_CONFIG.voltage.high.color;
  } else if (voltage >= GOD_CONFIG.voltage.medium.threshold) {
    color = GOD_CONFIG.voltage.medium.color;
  }

  return {
    genre,
    genreError,
    voltage,
    color,
  };
}

/**
 * Get color for tone analysis
 */
export function getToneColor(analysis: ToneAnalysis): string {
  return analysis.color;
}
