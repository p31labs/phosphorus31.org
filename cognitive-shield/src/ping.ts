/**
 * Ping - Object permanence automation and heartbeat monitoring
 * 
 * Tracks connection health and provides "Dad is still here" signals
 */

import { Logger } from './utils/logger';

export interface HeartbeatRecord {
  nodeId: string;
  timestamp: string;
  signalStrength: number;
}

export interface PingStatus {
  active: boolean;
  lastHeartbeat: string | null;
  nodes: Record<string, HeartbeatRecord>;
  health: 'green' | 'yellow' | 'red';
}

export class Ping {
  private logger: Logger;
  private heartbeats: Map<string, HeartbeatRecord>;
  private interval: NodeJS.Timeout | null = null;
  private readonly timeoutMs = 60000; // 60 seconds

  constructor() {
    this.logger = new Logger('Ping');
    this.heartbeats = new Map();
  }

  start(): void {
    this.logger.info('Starting Ping system');
    
    // Clean up stale heartbeats every 30 seconds
    this.interval = setInterval(() => {
      this.cleanupStaleHeartbeats();
    }, 30000);
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.logger.info('Ping system stopped');
  }

  recordHeartbeat(nodeId: string, signalStrength: number): void {
    const record: HeartbeatRecord = {
      nodeId,
      timestamp: new Date().toISOString(),
      signalStrength,
    };

    this.heartbeats.set(nodeId, record);
    this.logger.debug(`Heartbeat recorded for ${nodeId} (signal: ${signalStrength})`);
  }

  private cleanupStaleHeartbeats(): void {
    const now = Date.now();
    const staleNodes: string[] = [];

    for (const [nodeId, record] of this.heartbeats.entries()) {
      const age = now - new Date(record.timestamp).getTime();
      if (age > this.timeoutMs) {
        staleNodes.push(nodeId);
      }
    }

    for (const nodeId of staleNodes) {
      this.heartbeats.delete(nodeId);
      this.logger.debug(`Removed stale heartbeat for ${nodeId}`);
    }
  }

  getStatus(): PingStatus {
    const nodes: Record<string, HeartbeatRecord> = {};
    let lastHeartbeat: string | null = null;
    let maxAge = 0;

    for (const [nodeId, record] of this.heartbeats.entries()) {
      nodes[nodeId] = record;
      const age = Date.now() - new Date(record.timestamp).getTime();
      if (age > maxAge) {
        maxAge = age;
        lastHeartbeat = record.timestamp;
      }
    }

    // Determine health based on heartbeat age using GOD_CONFIG thresholds
    // Using inline config - should match god.config.ts Heartbeat thresholds
    const thresholds = {
      green: 70,
      yellow: 50,
      red: 30,
    };
    
    // Calculate health percentage (inverse of age - fresher = higher)
    const healthPercentage = this.heartbeats.size === 0 
      ? 0 
      : Math.max(0, 100 - (maxAge / 1000)); // Convert age to percentage
    
    let health: 'green' | 'yellow' | 'red';
    if (this.heartbeats.size === 0 || healthPercentage < thresholds.red) {
      health = 'red';
    } else if (healthPercentage < thresholds.yellow) {
      health = 'yellow';
    } else {
      health = 'green';
    }

    return {
      active: this.interval !== null,
      lastHeartbeat,
      nodes,
      health,
    };
  }

  isActive(): boolean {
    return this.interval !== null;
  }
}
