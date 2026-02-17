/**
 * App State Types
 * Types for application state (spoons, mode, etc.)
 */

export interface OperatorState {
  spoons: number;
  maxSpoons: number;
  heartbeat: 'green' | 'yellow' | 'orange' | 'red';
  heartbeatPercent: number;
  deepProcessingLock: boolean;
  lastCheckIn: Date;
  stressIndicators: {
    physicalTension: number;
    mentalLoad: number;
    emotionalState: number;
  };
}

export interface ShieldState {
  rawMessage: RawMessage | null;
  processedPayload: ProcessedMessage | null;
  voltage: number;
  curvature: number;
  humanOS: string | null;
  domain: string | null;
  isProcessing: boolean;
  error: string | null;
}

export interface ShieldActions {
  submitMessage: (message: RawMessage) => Promise<void>;
  clearMessage: () => void;
  markRawViewed: () => void;
  clearError: () => void;
}

import type { HeartbeatStatus } from '../config/god.config';
import type { DailyCheckIn } from './checkin.types';

export interface Peer {
  id: string;
  name: string;
  status: HeartbeatStatus;
  lastSeen: Date;
}

export interface CheckInInterval {
  id: string;
  label: string;
  ms: number;
  minutes?: number; // Optional for compatibility
}

// Extended DailyCheckIn for HeartbeatPanel (compatible with checkin.types)
export interface HeartbeatDailyCheckIn extends DailyCheckIn {
  date?: string;
  metrics?: Record<string, any>;
}

export interface HeartbeatState {
  operator: OperatorState;
  // Extended properties for HeartbeatPanel
  currentStatus: HeartbeatStatus;
  checkInInterval: CheckInInterval | null;
  checkInTimerRemaining: number;
  missedCheckIns: number;
  isDeadManActive: boolean;
  peers: Peer[];
  connectionCode: string | null;
  escalationConfig: Record<string, any>;
  dailyCheckIn: HeartbeatDailyCheckIn | null;
  checkInHistory: HeartbeatDailyCheckIn[];
}

export interface HeartbeatActions {
  updateSpoons: (delta: number) => void;
  setSpoons: (value: number) => void;
  checkIn: (status: Partial<OperatorState>) => void;
  toggleDeepProcessingLock: (locked: boolean) => void;
  updateStress: (indicators: Partial<OperatorState['stressIndicators']>) => void;
  // Extended actions for HeartbeatPanel
  setStatus: (status: HeartbeatStatus) => void;
  setCheckInInterval: (interval: CheckInInterval | null) => void;
  generateConnectionCode: () => string;
  clearConnectionCode: () => void;
  addPeer: (peer: Peer) => void;
  removePeer: (id: string) => void;
  setEscalationConfig: (config: Record<string, any>) => void;
  exportLog: () => string;
  exportCheckInHistory: () => string;
  getTodayCheckIn: () => HeartbeatDailyCheckIn | null;
  initializeMesh: () => void;
  destroyMesh: () => void;
}

export interface BufferState {
  buffer: StoreBufferedMessage[];
  isBatching: boolean;
}

export interface BufferActions {
  addToBuffer: (message: ProcessedMessage) => void;
  releaseMessage: (id: string) => void;
  getReadyMessages: () => StoreBufferedMessage[];
  clearBuffer: () => void;
}

import type { RawMessage, ProcessedMessage, StoreBufferedMessage } from './messages';
