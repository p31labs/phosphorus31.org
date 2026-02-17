/**
 * Message Types
 * Core types for message processing pipeline
 */

export type MessageSource = 'email' | 'text' | 'chat' | 'manual' | 'mesh';

export interface RawMessage {
  id: string;
  source: MessageSource;
  sender: string;
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ProcessedMessage {
  id: string;
  raw: RawMessage;
  voltage: {
    score: number; // 0-10
    category: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
  };
  genre: {
    genre: 'physics' | 'poetics' | 'mixed';
    confidence: number;
  };
  safeSummary?: string;
  rawViewed?: boolean;
  senderOS?: string;
  domain?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface BufferedMessage {
  id: string;
  content: string;
  sender: string;
  receivedAt: number;
  voltage: number;
  status: 'buffered' | 'released' | 'filtered';
  releaseAt?: number;
  sanitizedContent?: string;
  metadata?: Record<string, any>;
}

// Store-specific buffered message type (used by buffer.store)
export interface StoreBufferedMessage {
  message: ProcessedMessage;
  bufferedAt: Date;
  releaseAt: Date;
  priority: 'low' | 'medium' | 'high' | 'bypass';
}
