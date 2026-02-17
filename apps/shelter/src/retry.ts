/**
 * Retry Logic - Exponential backoff for message processing
 */

import { Logger } from './utils/logger.js';

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
}

export class RetryHandler {
  private logger: Logger;
  private readonly maxRetries: number;
  private readonly initialDelay: number;
  private readonly maxDelay: number;
  private readonly backoffMultiplier: number;

  constructor(options: RetryOptions = {}) {
    this.logger = new Logger('RetryHandler');
    this.maxRetries = options.maxRetries || 3;
    this.initialDelay = options.initialDelay || 1000;
    this.maxDelay = options.maxDelay || 30000;
    this.backoffMultiplier = options.backoffMultiplier || 2;
  }

  /**
   * Execute function with exponential backoff retry
   */
  async execute<T>(
    fn: () => Promise<T>,
    context?: string
  ): Promise<T> {
    let lastError: Error | null = null;
    let delay = this.initialDelay;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt === this.maxRetries) {
          this.logger.error(
            `Max retries (${this.maxRetries}) exceeded${context ? ` for ${context}` : ''}`,
            lastError
          );
          throw lastError;
        }

        this.logger.warn(
          `Attempt ${attempt + 1}/${this.maxRetries + 1} failed${context ? ` for ${context}` : ''}, retrying in ${delay}ms...`,
          lastError.message
        );

        await this.sleep(delay);
        delay = Math.min(delay * this.backoffMultiplier, this.maxDelay);
      }
    }

    throw lastError || new Error('Retry failed');
  }

  /**
   * Execute with jitter (randomized delay to prevent thundering herd)
   */
  async executeWithJitter<T>(
    fn: () => Promise<T>,
    context?: string
  ): Promise<T> {
    let lastError: Error | null = null;
    let delay = this.initialDelay;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt === this.maxRetries) {
          this.logger.error(
            `Max retries (${this.maxRetries}) exceeded${context ? ` for ${context}` : ''}`,
            lastError
          );
          throw lastError;
        }

        // Add jitter: random value between 0.5x and 1.5x of delay
        const jitteredDelay = delay * (0.5 + Math.random());
        
        this.logger.warn(
          `Attempt ${attempt + 1}/${this.maxRetries + 1} failed${context ? ` for ${context}` : ''}, retrying in ${Math.round(jitteredDelay)}ms...`,
          lastError.message
        );

        await this.sleep(jitteredDelay);
        delay = Math.min(delay * this.backoffMultiplier, this.maxDelay);
      }
    }

    throw lastError || new Error('Retry failed');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
