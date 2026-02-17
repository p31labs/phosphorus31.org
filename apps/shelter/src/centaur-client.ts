/**
 * Centaur Client - Forwards processed messages from The Buffer to The Centaur
 * This is the integration point between The Buffer and The Centaur
 */

import { Logger } from './utils/logger.js';
import { QueuedMessage } from './types.js';

export interface CentaurMessage {
  content: string;
  source: string;
  priority: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface CentaurResponse {
  success: boolean;
  messageId?: string;
  response?: string;
  error?: string;
}

export class CentaurClient {
  private baseUrl: string;
  private apiKey?: string;
  private logger: Logger;
  private retryCount: number;
  private retryDelay: number;

  constructor() {
    this.baseUrl = process.env.CENTAUR_API_URL || 'http://localhost:3000';
    this.apiKey = process.env.CENTAUR_API_KEY;
    this.logger = new Logger('CentaurClient');
    this.retryCount = parseInt(process.env.CENTAUR_RETRY_COUNT || '3', 10);
    this.retryDelay = parseInt(process.env.CENTAUR_RETRY_DELAY || '1000', 10);
  }

  /**
   * Forward a processed message to The Centaur
   */
  async forwardMessage(message: QueuedMessage): Promise<CentaurResponse> {
    const centaurMessage: CentaurMessage = {
      content: message.message,
      source: message.metadata?.source || 'buffer',
      priority: message.priority,
      metadata: {
        ...message.metadata,
        bufferMessageId: message.id,
        receivedAt: message.timestamp,
      },
      timestamp: new Date().toISOString(),
    };

    return this.sendWithRetry(centaurMessage);
  }

  /**
   * Forward a batch of messages to The Centaur
   */
  async forwardBatch(messages: QueuedMessage[]): Promise<CentaurResponse[]> {
    this.logger.info(`Forwarding batch of ${messages.length} messages to The Centaur`);
    
    const results = await Promise.allSettled(
      messages.map(msg => this.forwardMessage(msg))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        const message = messages[index];
        const messageId = message?.id ?? `unknown_${index}`;
        this.logger.error(`Failed to forward message ${messageId}:`, result.reason);
        return {
          success: false,
          error: result.reason?.message || 'Unknown error',
        };
      }
    });
  }

  /**
   * Send message to The Centaur with retry logic
   */
  private async sendWithRetry(message: CentaurMessage): Promise<CentaurResponse> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.retryCount; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}/api/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
          },
          body: JSON.stringify(message),
        });

        if (!response) {
          throw new Error('No response from Centaur');
        }
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = (await response.json()) as { messageId?: string; id?: string; response?: string; content?: string };
        this.logger.debug(`Message forwarded to The Centaur: ${data.messageId ?? data.id ?? 'unknown'}`);
        return {
          success: true,
          messageId: data.messageId ?? data.id,
          response: data.response ?? data.content,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt < this.retryCount) {
          const delay = this.retryDelay * attempt;
          this.logger.warn(
            `Attempt ${attempt} failed, retrying in ${delay}ms:`,
            lastError.message
          );
          await this.sleep(delay);
        }
      }
    }

    this.logger.error(`Failed to forward message after ${this.retryCount} attempts:`, lastError);
    return {
      success: false,
      error: lastError?.message || 'Unknown error',
    };
  }

  /**
   * Check if The Centaur is available
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        },
      });

      return response.ok;
    } catch (error) {
      this.logger.debug('The Centaur health check failed:', error);
      return false;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
