/**
 * Message Queue - Redis-based priority queue with fallback
 */

import Redis from 'ioredis';
import { Logger } from './utils/logger.js';

export interface QueuedMessage {
  id: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  metadata: Record<string, any>;
  timestamp: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export class MessageQueue {
  private redis: Redis | null = null;
  private logger: Logger;
  private readonly redisUrl: string;
  private fallbackQueue: QueuedMessage[] = [];
  private redisFallbackLogged = false;
  // retryAttempts tracked internally by Redis retryStrategy
  private readonly maxRetries = 3;

  constructor() {
    this.logger = new Logger('MessageQueue');
    this.redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  }

  async connect(): Promise<void> {
    try {
      this.redis = new Redis(this.redisUrl, {
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          if (times > this.maxRetries) {
            this.logger.warn('Redis connection failed after max retries, using fallback mode');
            return null; // Stop retrying
          }
          return delay;
        },
        maxRetriesPerRequest: 3,
        enableOfflineQueue: false, // Don't queue commands when disconnected
      });

      this.redis.on('connect', () => {
        this.redisFallbackLogged = false;
        this.logger.info('Connected to Redis');
        this.processFallbackQueue();
      });

      this.redis.on('error', (error: NodeJS.ErrnoException) => {
        if (!this.redisFallbackLogged) {
          this.redisFallbackLogged = true;
          this.logger.warn('Redis unavailable, using fallback mode. Start Redis for real-time queue.', error?.code || error);
        }
      });

      this.redis.on('close', () => {
        if (!this.redisFallbackLogged) {
          this.redisFallbackLogged = true;
          this.logger.warn('Redis connection closed, using fallback mode');
        }
      });

      // Test connection with timeout
      const pingPromise = this.redis.ping();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Redis ping timeout')), 5000)
      );

      await Promise.race([pingPromise, timeoutPromise]);
      this.logger.info('Redis connection verified');
    } catch (error) {
      this.logger.warn('Failed to connect to Redis, using fallback mode:', error);
      // Don't throw - allow fallback mode
    }
  }

  async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
      this.redis = null;
      this.logger.info('Disconnected from Redis');
    }
  }

  isConnected(): boolean {
    return this.redis !== null && this.redis.status === 'ready';
  }

  private getPriorityScore(priority: QueuedMessage['priority']): number {
    const scores = { urgent: 4, high: 3, normal: 2, low: 1 };
    return scores[priority];
  }

  private async processFallbackQueue(): Promise<void> {
    if (this.fallbackQueue.length > 0 && this.redis && this.redis.status === 'ready') {
      this.logger.info(`Processing ${this.fallbackQueue.length} messages from fallback queue`);
      for (const message of [...this.fallbackQueue]) {
        try {
          await this.enqueue(message);
          this.fallbackQueue = this.fallbackQueue.filter(m => m.id !== message.id);
        } catch (error) {
          this.logger.error('Error processing fallback message:', error);
        }
      }
    }
  }

  async enqueue(message: QueuedMessage): Promise<string> {
    if (!this.redis || this.redis.status !== 'ready') {
      // Fallback to in-memory queue if Redis unavailable
      this.logger.warn('Redis not connected, using fallback queue');
      return this.enqueueFallback(message);
    }

    try {
      const priorityScore = this.getPriorityScore(message.priority);
      const score = Date.now() + (priorityScore * 1000000); // Higher priority = higher score
      
      await this.redis.zadd('buffer:queue', score, JSON.stringify(message));
      this.logger.debug(`Enqueued message ${message.id} with priority ${message.priority}`);
      
      return message.id;
    } catch (error) {
      this.logger.error('Redis enqueue failed, using fallback:', error);
      return this.enqueueFallback(message);
    }
  }

  private enqueueFallback(message: QueuedMessage): string {
    this.fallbackQueue.push(message);
    this.fallbackQueue.sort((a, b) => {
      const scoreA = this.getPriorityScore(a.priority);
      const scoreB = this.getPriorityScore(b.priority);
      return scoreB - scoreA; // Higher priority first
    });
    this.logger.debug(`Enqueued to fallback queue: ${message.id}`);
    return message.id;
  }

  async dequeueBatch(maxSize: number): Promise<QueuedMessage[]> {
    // Try Redis first, fallback to in-memory
    if (this.redis && this.redis.status === 'ready') {
      try {
        // Get highest priority messages (highest scores first)
        const messages = await this.redis.zrevrange('buffer:queue', 0, maxSize - 1);
        
        if (messages.length === 0) {
          // Check fallback queue
          return this.dequeueFallback(maxSize);
        }

        // Remove from queue
        await this.redis.zrem('buffer:queue', ...messages);

        // Parse messages
        const parsed: QueuedMessage[] = [];
        for (const msgStr of messages) {
          try {
            const msg = JSON.parse(msgStr) as QueuedMessage;
            msg.status = 'processing';
            parsed.push(msg);
          } catch (error) {
            this.logger.error('Error parsing queued message:', error);
          }
        }

        return parsed;
      } catch (error) {
        this.logger.error('Error dequeuing from Redis, using fallback:', error);
        return this.dequeueFallback(maxSize);
      }
    }

    return this.dequeueFallback(maxSize);
  }

  private dequeueFallback(maxSize: number): QueuedMessage[] {
    const batch = this.fallbackQueue.splice(0, maxSize);
    batch.forEach(msg => {
      msg.status = 'processing';
    });
    if (batch.length > 0) {
      this.logger.debug(`Dequeued ${batch.length} messages from fallback queue`);
    }
    return batch;
  }

  async acknowledge(messageId: string): Promise<void> {
    if (!this.redis) {
      return;
    }

    // Message already removed from queue in dequeueBatch
    // This is for future acknowledgment tracking if needed
    this.logger.debug(`Acknowledged message ${messageId}`);
  }

  async getStatus(): Promise<{
    queueLength: number;
    connected: boolean;
    pending: number;
    processing: number;
  }> {
    const fallbackLength = this.fallbackQueue.length;
    
    if (!this.redis || this.redis.status !== 'ready') {
      return {
        queueLength: fallbackLength,
        connected: false,
        pending: fallbackLength,
        processing: 0,
      };
    }

    try {
      const queueLength = await this.redis.zcard('buffer:queue');
      
      return {
        queueLength: queueLength + fallbackLength,
        connected: this.isConnected(),
        pending: queueLength + fallbackLength,
        processing: 0,
      };
    } catch (error) {
      this.logger.error('Error getting queue status:', error);
      return {
        queueLength: fallbackLength,
        connected: false,
        pending: fallbackLength,
        processing: 0,
      };
    }
  }
}
