/**
 * Type definitions for The Buffer
 * 
 * Centralized type exports for The Buffer component.
 * Types are defined in their respective modules to avoid circular dependencies,
 * and re-exported here for convenience.
 */

// Core message types
export type { QueuedMessage } from '../queue';
export type { QueueStatus } from '../types';

// Encryption types
export type { EncryptedBlob } from '../encryption';

// Centaur client types
export type { CentaurMessage, CentaurResponse } from '../centaur-client';

// Filter types
export type { FilterResult } from '../filter';

// Metabolism types
export type { MetabolismState, EnergyCost } from '../metabolism';

// Ping types
export type { HeartbeatRecord, PingStatus } from '../ping';

// Monitoring types
export type { Alert, Metrics } from '../monitoring';

// Retry types
export type { RetryOptions } from '../retry';

// API Request/Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface MessageSubmitRequest {
  message: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  metadata?: Record<string, unknown>;
}

export interface MessageSubmitResponse {
  success: boolean;
  messageId: string;
  status: 'queued';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  filterReason?: string;
}

export interface MessageStatusResponse {
  id: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: string;
  metadata: Record<string, unknown>;
}

// WebSocket message types
export interface WebSocketMessage {
  type: 'status' | 'subscribed' | 'batch_processed' | 'alerts' | 'ping' | 'pong';
  data?: unknown;
  channel?: string;
  count?: number;
  timestamp?: string;
  alerts?: unknown[];
  priorities?: Record<string, number>;
}

// Express Request/Response extensions
export interface BufferRequest extends Express.Request {
  body: {
    message?: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    metadata?: Record<string, unknown>;
    nodeId?: string;
    signalStrength?: number;
  };
  params: {
    messageId?: string;
    alertId?: string;
  };
  query: {
    limit?: string;
    offset?: string;
    status?: string;
  };
}
