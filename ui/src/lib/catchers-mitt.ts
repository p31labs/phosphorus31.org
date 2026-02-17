// CatchersMitt Component
// 60-second batching buffer for message processing

import { calculateVoltage } from '../engine/voltage-calculator';

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

export interface VoltageStripData {
  current: number;
  trend: 'stable' | 'rising' | 'falling';
  color: 'green' | 'yellow' | 'orange' | 'red';
  label: string;
}

export interface MittConfig {
  bufferDuration: number; // 60000ms (60 seconds)
  thresholds?: {
    green: number;
    yellow: number;
    red: number;
    critical: number;
  };
  maxBufferSize?: number;
  autoSanitize?: boolean;
  whitelist?: string[];
  blacklist?: string[];
}

export class CatchersMitt {
  private config: Required<MittConfig>;
  private buffer: BufferedMessage[] = [];
  private isBatching: boolean = false;
  private batchTimer: NodeJS.Timeout | null = null;
  private batchStartTime: number = 0;
  private whitelist: Set<string> = new Set();
  private blacklist: Set<string> = new Set();
  private messageReleaseCallbacks: Array<(msg: BufferedMessage) => void> = [];

  constructor(config: MittConfig) {
    this.config = {
      maxBufferSize: 100,
      thresholds: {
        green: 30,
        yellow: 50,
        red: 70,
        critical: 90,
      },
      autoSanitize: true,
      whitelist: [],
      blacklist: [],
      ...config,
    };

    // Initialize whitelist and blacklist
    this.config.whitelist?.forEach((sender) => this.whitelist.add(sender));
    this.config.blacklist?.forEach((sender) => this.blacklist.add(sender));
  }

  addMessage(content: string, metadata?: Record<string, any>): void {
    const message: BufferedMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content,
      sender: metadata?.sender || 'unknown',
      receivedAt: Date.now(),
      voltage: 0,
      status: 'buffered',
      metadata,
    };

    this.buffer.push(message);

    // Start batching if not already started
    if (!this.isBatching) {
      this.startBatching();
    }

    // Process immediately if buffer is full
    if (this.buffer.length >= this.config.maxBufferSize) {
      this.processBatch();
    }
  }

  /**
   * Catch a message with voltage calculation (shield.store API)
   */
  catch(content: string, sender: string, metadata?: Record<string, any>): BufferedMessage {
    // Check whitelist - bypass buffer
    if (this.whitelist.has(sender)) {
      const voltage = calculateVoltage(content, { sender }).score;
      const buffered: BufferedMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content,
        sender,
        receivedAt: Date.now(),
        voltage,
        status: 'released',
        releaseAt: Date.now(),
        metadata,
      };
      // Immediately trigger release callback
      setTimeout(() => {
        this.messageReleaseCallbacks.forEach((cb) => cb(buffered));
      }, 0);
      return buffered;
    }

    // Check blacklist - auto-filter
    if (this.blacklist.has(sender)) {
      const voltage = calculateVoltage(content, { sender }).score;
      return {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content,
        sender,
        receivedAt: Date.now(),
        voltage,
        status: 'filtered',
        metadata,
      };
    }

    // Calculate voltage
    const voltage = calculateVoltage(content, { sender }).score;
    const releaseAt = Date.now() + this.config.bufferDuration;

    const buffered: BufferedMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content,
      sender,
      receivedAt: Date.now(),
      voltage,
      status: voltage < this.config.thresholds.green ? 'released' : 'buffered',
      releaseAt,
      metadata,
    };

    // If low voltage, release immediately
    if (buffered.status === 'released') {
      setTimeout(() => {
        this.messageReleaseCallbacks.forEach((cb) => cb(buffered));
      }, 0);
      return buffered;
    }

    // Add to buffer
    this.buffer.push(buffered);

    // Start batching if not already started
    if (!this.isBatching) {
      this.startBatching();
    }

    // Schedule release
    setTimeout(() => {
      this.release(buffered.id);
    }, this.config.bufferDuration);

    return buffered;
  }

  /**
   * Release a buffered message by ID
   */
  release(id: string): void {
    const index = this.buffer.findIndex((msg) => msg.id === id);
    if (index === -1) return;

    const message = this.buffer[index];
    message.status = 'released';
    message.releaseAt = Date.now();

    // Trigger release callbacks
    this.messageReleaseCallbacks.forEach((cb) => cb(message));

    // Remove from buffer
    this.buffer.splice(index, 1);
  }

  /**
   * Filter (discard) a buffered message
   */
  filter(id: string): void {
    const index = this.buffer.findIndex((msg) => msg.id === id);
    if (index === -1) return;

    const message = this.buffer[index];
    message.status = 'filtered';
    this.buffer.splice(index, 1);
  }

  /**
   * Get buffered messages (shield.store API)
   */
  getBuffered(): BufferedMessage[] {
    return this.buffer.filter((msg) => msg.status === 'buffered');
  }

  /**
   * Get voltage strip data (shield.store API)
   */
  getVoltageStrip(): VoltageStripData {
    if (this.buffer.length === 0) {
      return {
        current: 0,
        trend: 'stable',
        color: 'green',
        label: 'Calm Waters',
      };
    }

    const avgVoltage = this.buffer.reduce((sum, msg) => sum + msg.voltage, 0) / this.buffer.length;

    let color: 'green' | 'yellow' | 'orange' | 'red' = 'green';
    let label = 'Calm Waters';

    if (avgVoltage >= this.config.thresholds.critical) {
      color = 'red';
      label = 'Critical Voltage';
    } else if (avgVoltage >= this.config.thresholds.red) {
      color = 'red';
      label = 'High Voltage';
    } else if (avgVoltage >= this.config.thresholds.yellow) {
      color = 'yellow';
      label = 'Moderate Voltage';
    } else if (avgVoltage >= this.config.thresholds.green) {
      color = 'green';
      label = 'Low Voltage';
    }

    return {
      current: Math.round(avgVoltage),
      trend: 'stable', // TODO: Calculate trend from history
      color,
      label,
    };
  }

  /**
   * Register callback for message release (shield.store API)
   */
  onMessageRelease(callback: (msg: BufferedMessage) => void): void {
    this.messageReleaseCallbacks.push(callback);
  }

  /**
   * Add sender to whitelist (bypass buffer)
   */
  addToWhitelist(sender: string): void {
    this.whitelist.add(sender);
  }

  /**
   * Add sender to blacklist (auto-filter)
   */
  addToBlacklist(sender: string): void {
    this.blacklist.add(sender);
  }

  private startBatching(): void {
    this.isBatching = true;
    this.batchStartTime = Date.now();

    // Set timer for 60-second batch window
    this.batchTimer = setTimeout(() => {
      this.processBatch();
    }, this.config.bufferDuration);
  }

  processBatch(): void {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    if (this.buffer.length === 0) {
      this.isBatching = false;
      return;
    }

    // Process the batch
    const batch = [...this.buffer];
    this.buffer = [];
    this.isBatching = false;

    // Emit processed batch event
    this.emit('batchProcessed', {
      messages: batch,
      timestamp: Date.now(),
      duration: Date.now() - this.batchStartTime,
    });
  }

  getBuffer(): BufferedMessage[] {
    return [...this.buffer];
  }

  isBatchingActive(): boolean {
    return this.isBatching;
  }

  getBatchTimeRemaining(): number {
    if (!this.isBatching || !this.batchTimer) {
      return 0;
    }

    const elapsed = Date.now() - this.batchStartTime;
    return Math.max(0, this.config.bufferDuration - elapsed);
  }

  // Simple event emitter
  private events: Record<string, Function[]> = {};

  on(event: string, callback: Function): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event: string, callback: Function): void {
    if (!this.events[event]) return;

    const index = this.events[event].indexOf(callback);
    if (index > -1) {
      this.events[event].splice(index, 1);
    }
  }

  private emit(event: string, data: any): void {
    if (!this.events[event]) return;

    this.events[event].forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  destroy(): void {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    this.buffer = [];
    this.isBatching = false;
    this.events = {};
  }
}

export default CatchersMitt;
