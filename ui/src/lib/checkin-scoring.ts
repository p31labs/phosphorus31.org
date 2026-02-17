/**
 * Check-In Scoring Utilities
 * Calculate π-Metric percentage and resonance levels
 */

import type { DailyCheckIn, CheckInResponse } from '@/types/checkin.types';

export function calculatePercentage(responses: readonly CheckInResponse[]): number {
  if (responses.length === 0) return 0;

  // Simple average for now - can be enhanced with weighted scoring
  const sum = responses.reduce((acc, r) => acc + r.value, 0);
  return Math.round((sum / responses.length) * 10) / 10;
}

export function getResonanceLevel(percentage: number): 'low' | 'medium' | 'high' | 'critical' {
  if (percentage >= 80) return 'high';
  if (percentage >= 60) return 'medium';
  if (percentage >= 40) return 'low';
  return 'critical';
}

export function getResonanceDescription(level: 'low' | 'medium' | 'high' | 'critical'): string {
  const descriptions = {
    high: 'Strong resonance - system operating optimally',
    medium: 'Moderate resonance - minor adjustments may be needed',
    low: 'Low resonance - attention required',
    critical: 'Critical resonance - immediate intervention needed',
  };
  return descriptions[level];
}
