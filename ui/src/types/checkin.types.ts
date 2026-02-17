/**
 * Daily Check-In Types
 * Types for the daily check-in questionnaire system
 */

export interface CheckInQuestion {
  readonly id: string;
  readonly label: string;
  readonly min: number;
  readonly max: number;
  readonly unit?: string;
}

export interface CheckInResponse {
  readonly questionId: string;
  readonly value: number;
  readonly timestamp: number;
}

export interface DailyCheckIn {
  readonly id: string;
  readonly timestamp: number;
  readonly responses: readonly CheckInResponse[];
  readonly percentage?: number;
  readonly resonanceLevel?: 'low' | 'medium' | 'high' | 'critical';
}
