/**
 * P31 Patterns Library
 * Reusable implementations of common P31 design patterns
 * 
 * Use these patterns throughout the P31 ecosystem
 */

import GodConfig from '@/config/god.config';

// ============================================================================
// 1. TETRAHEDRON TOPOLOGY PATTERN
// ============================================================================

export interface Vertex {
  id: string;
  type: 'operator' | 'synthetic_body' | 'node';
  data?: any;
}

export class ConstitutionalViolationError extends Error {
  constructor(message: string) {
    super(`Constitutional Violation: ${message}`);
    this.name = 'ConstitutionalViolationError';
  }
}

export class TetrahedronGroup {
  private vertices: Vertex[] = [];
  private readonly MAX_VERTICES = 4;

  addVertex(vertex: Vertex): void {
    if (this.vertices.length >= this.MAX_VERTICES) {
      throw new ConstitutionalViolationError(
        `Tetrahedron must have exactly ${this.MAX_VERTICES} vertices. Cannot add more.`
      );
    }
    this.vertices.push(vertex);
  }

  removeVertex(vertexId: string): void {
    const index = this.vertices.findIndex(v => v.id === vertexId);
    if (index === -1) return;
    this.vertices.splice(index, 1);
  }

  getVertices(): ReadonlyArray<Vertex> {
    return Object.freeze([...this.vertices]);
  }

  isValid(): boolean {
    return this.vertices.length === this.MAX_VERTICES;
  }

  validate(): void {
    if (!this.isValid()) {
      throw new ConstitutionalViolationError(
        `Tetrahedron must have exactly ${this.MAX_VERTICES} vertices. Current: ${this.vertices.length}`
      );
    }
  }
}

// ============================================================================
// 2. ENCRYPTED BLOB PATTERN
// ============================================================================

export type EncryptedBlob = string & { __brand: 'EncryptedBlob' };

export class EncryptionService {
  private static readonly ALGORITHM = 'AES-GCM';
  private static readonly KEY_LENGTH = 256;

  static encrypt(plaintext: string, key?: string): EncryptedBlob {
    // In production, use proper encryption (Web Crypto API, etc.)
    // This is a placeholder that enforces type safety
    const encrypted = btoa(plaintext); // Base64 encoding as placeholder
    return encrypted as EncryptedBlob;
  }

  static decrypt(encrypted: EncryptedBlob, key?: string): string {
    // In production, use proper decryption
    return atob(encrypted);
  }

  static isEncrypted(value: any): value is EncryptedBlob {
    return typeof value === 'string' && value.startsWith('encrypted:');
  }
}

// ============================================================================
// 3. LOCAL-FIRST PATTERN
// ============================================================================

export interface LocalFirstStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

export class LocalFirstDataManager {
  constructor(
    private localStore: LocalFirstStore,
    private remoteStore?: LocalFirstStore
  ) {}

  async get<T>(key: string): Promise<T | null> {
    // Try local first
    const local = await this.localStore.get<T>(key);
    if (local) return local;

    // Fetch from remote if available
    if (this.remoteStore) {
      const remote = await this.remoteStore.get<T>(key);
      if (remote) {
        // Store locally for next time
        await this.localStore.set(key, remote);
        return remote;
      }
    }

    return null;
  }

  async set<T>(key: string, value: T, sync: boolean = true): Promise<void> {
    // Always store locally first
    await this.localStore.set(key, value);

    // Sync to remote if enabled
    if (sync && this.remoteStore) {
      try {
        await this.remoteStore.set(key, value);
      } catch (error) {
        console.warn(`Failed to sync to remote: ${error}`);
        // Local storage succeeded, so we continue
      }
    }
  }
}

// ============================================================================
// 4. MESSAGE BATCHING PATTERN
// ============================================================================

export interface Message {
  id: string;
  timestamp: number;
  payload: any;
}

export class MessageBatcher {
  private batch: Message[] = [];
  private flushTimer?: NodeJS.Timeout;
  private readonly window: number;
  private readonly maxBatchSize: number;

  constructor(
    private onFlush: (messages: Message[]) => Promise<void>,
    windowMs: number = 60000, // 60 seconds
    maxBatchSize: number = 100
  ) {
    this.window = windowMs;
    this.maxBatchSize = maxBatchSize;
  }

  addMessage(message: Message): void {
    this.batch.push(message);

    // Flush if batch is full
    if (this.batch.length >= this.maxBatchSize) {
      this.flush();
      return;
    }

    // Schedule flush if not already scheduled
    if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => {
        this.flush();
      }, this.window);
    }
  }

  async flush(): Promise<void> {
    if (this.batch.length === 0) return;

    const messages = [...this.batch];
    this.batch = [];

    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = undefined;
    }

    try {
      await this.onFlush(messages);
    } catch (error) {
      console.error('Failed to flush messages:', error);
      // Re-add messages to batch for retry
      this.batch.unshift(...messages);
    }
  }

  dispose(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
    }
    this.flush();
  }
}

// ============================================================================
// 5. RETRY WITH EXPONENTIAL BACKOFF
// ============================================================================

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    backoffMultiplier = 2
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      const delay = Math.min(
        initialDelay * Math.pow(backoffMultiplier, attempt),
        maxDelay
      );

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

// ============================================================================
// 6. CIRCUIT BREAKER PATTERN
// ============================================================================

export type CircuitState = 'closed' | 'open' | 'half-open';

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  resetTimeout?: number;
  monitoringPeriod?: number;
}

export class CircuitBreaker {
  private failures: number = 0;
  private state: CircuitState = 'closed';
  private lastFailureTime: number = 0;
  private readonly failureThreshold: number;
  private readonly resetTimeout: number;
  private readonly monitoringPeriod: number;

  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold ?? 5;
    this.resetTimeout = options.resetTimeout ?? 60000; // 1 minute
    this.monitoringPeriod = options.monitoringPeriod ?? 60000; // 1 minute
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    if (this.state === 'half-open') {
      this.state = 'closed';
    }
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.failureThreshold) {
      this.state = 'open';
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  reset(): void {
    this.failures = 0;
    this.state = 'closed';
    this.lastFailureTime = 0;
  }
}

// ============================================================================
// 7. PING PATTERN (Object Permanence)
// ============================================================================

export class PingSystem {
  private lastPing: Map<string, number> = new Map();
  private readonly threshold: number;

  constructor(thresholdMs: number = 60000) {
    this.threshold = thresholdMs;
  }

  async ping(id: string): Promise<void> {
    this.lastPing.set(id, Date.now());
    // In production, send actual heartbeat
    console.log(`Ping: ${id} at ${Date.now()}`);
  }

  isAlive(id: string): boolean {
    const last = this.lastPing.get(id);
    if (!last) return false;
    return Date.now() - last < this.threshold;
  }

  getLastPing(id: string): number | null {
    return this.lastPing.get(id) || null;
  }

  getAllAlive(): string[] {
    const now = Date.now();
    return Array.from(this.lastPing.entries())
      .filter(([_, timestamp]) => now - timestamp < this.threshold)
      .map(([id]) => id);
  }
}

// ============================================================================
// 8. GOD_CONFIG PATTERN
// ============================================================================

export function getConfigValue<T>(
  path: string,
  defaultValue: T
): T {
  const keys = path.split('.');
  let value: any = GodConfig;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }

  return (value as T) ?? defaultValue;
}

// ============================================================================
// 9. PERFORMANCE MONITORING PATTERN
// ============================================================================

export interface PerformanceMetrics {
  operation: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export class PerformanceTracker {
  private metrics: PerformanceMetrics[] = [];
  private readonly maxMetrics: number;

  constructor(maxMetrics: number = 1000) {
    this.maxMetrics = maxMetrics;
  }

  async track<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;

      this.record({
        operation,
        duration,
        timestamp: Date.now(),
        metadata
      });

      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.record({
        operation,
        duration,
        timestamp: Date.now(),
        metadata: { ...metadata, error: true }
      });
      throw error;
    }
  }

  private record(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  getMetrics(operation?: string): PerformanceMetrics[] {
    if (operation) {
      return this.metrics.filter(m => m.operation === operation);
    }
    return [...this.metrics];
  }

  getAverageDuration(operation: string): number {
    const operationMetrics = this.getMetrics(operation);
    if (operationMetrics.length === 0) return 0;

    const total = operationMetrics.reduce((sum, m) => sum + m.duration, 0);
    return total / operationMetrics.length;
  }

  clear(): void {
    this.metrics = [];
  }
}

// ============================================================================
// 10. ABDICATION PATTERN (No Backdoors)
// ============================================================================

export class AdminKeys {
  private keys: Set<string> = new Set();
  private destroyed: boolean = false;

  addKey(key: string): void {
    if (this.destroyed) {
      throw new Error('Admin keys have been destroyed. Cannot add new keys.');
    }
    this.keys.add(key);
  }

  hasKey(key: string): boolean {
    if (this.destroyed) return false;
    return this.keys.has(key);
  }

  destroy(): void {
    this.keys.clear();
    this.destroyed = true;
    // In production, ensure keys are cryptographically erased
    console.warn('⚠️ Admin keys permanently destroyed. No recovery possible.');
  }

  isDestroyed(): boolean {
    return this.destroyed;
  }
}
