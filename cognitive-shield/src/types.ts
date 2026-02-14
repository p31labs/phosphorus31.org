/**
 * Type definitions for The Buffer
 * 
 * Note: Some types are defined in their respective modules to avoid circular dependencies.
 * This file contains only types that are shared across multiple modules.
 */

export interface QueuedMessage {
  id: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  metadata: Record<string, any>;
  timestamp: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface QueueStatus {
  queueLength: number;
  connected: boolean;
  pending: number;
  processing: number;
}
