/**
 * Buffer Monitoring - Alerting and metrics collection
 */

import { Logger } from './utils/logger';
import { MessageQueue } from './queue';
import { BufferStore } from './store';

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface Metrics {
  messagesProcessed: number;
  messagesFailed: number;
  averageProcessingTime: number;
  queueDepth: number;
  errorRate: number;
}

export class BufferMonitoring {
  private logger: Logger;
  private alerts: Map<string, Alert>;
  private metrics: Metrics;
  private messageQueue: MessageQueue;
  private bufferStore: BufferStore;

  constructor(messageQueue: MessageQueue, bufferStore: BufferStore) {
    this.logger = new Logger('BufferMonitoring');
    this.alerts = new Map();
    this.messageQueue = messageQueue;
    this.bufferStore = bufferStore;
    
    this.metrics = {
      messagesProcessed: 0,
      messagesFailed: 0,
      averageProcessingTime: 0,
      queueDepth: 0,
      errorRate: 0,
    };
  }

  /**
   * Check system health and generate alerts
   */
  async checkHealth(): Promise<Alert[]> {
    const alerts: Alert[] = [];
    
    // Check queue depth
    const queueStatus = await this.messageQueue.getStatus();
    if (queueStatus.queueLength > 1000) {
      alerts.push(this.createAlert('critical', `Queue depth critical: ${queueStatus.queueLength} messages`));
    } else if (queueStatus.queueLength > 500) {
      alerts.push(this.createAlert('warning', `Queue depth high: ${queueStatus.queueLength} messages`));
    }

    // Check Redis connection
    if (!queueStatus.connected) {
      alerts.push(this.createAlert('warning', 'Redis disconnected - using fallback mode'));
    }

    // Check error rate
    const stats = await this.bufferStore.getMessageCount();
    const failed = await this.bufferStore.getMessageCount('failed');
    if (stats > 0) {
      const errorRate = (failed / stats) * 100;
      if (errorRate > 10) {
        alerts.push(this.createAlert('error', `High error rate: ${errorRate.toFixed(1)}%`));
      }
    }

    // Store alerts
    for (const alert of alerts) {
      this.alerts.set(alert.id, alert);
    }

    return alerts;
  }

  /**
   * Update metrics
   */
  updateMetrics(processed: number, failed: number, processingTime: number): void {
    this.metrics.messagesProcessed += processed;
    this.metrics.messagesFailed += failed;
    
    // Update average processing time (exponential moving average)
    const alpha = 0.1;
    this.metrics.averageProcessingTime = 
      alpha * processingTime + (1 - alpha) * this.metrics.averageProcessingTime;

    // Update error rate
    const total = this.metrics.messagesProcessed + this.metrics.messagesFailed;
    if (total > 0) {
      this.metrics.errorRate = (this.metrics.messagesFailed / total) * 100;
    }
  }

  /**
   * Get current metrics
   */
  getMetrics(): Metrics {
    return { ...this.metrics };
  }

  /**
   * Get active alerts
   */
  getAlerts(): Alert[] {
    return Array.from(this.alerts.values()).filter(a => !a.resolved);
  }

  /**
   * Resolve alert
   */
  resolveAlert(alertId: string): void {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.resolved = true;
      this.logger.info(`Alert resolved: ${alert.message}`);
    }
  }

  private createAlert(type: Alert['type'], message: string): Alert {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      timestamp: new Date().toISOString(),
      resolved: false,
    };
    
    this.logger.warn(`Alert: ${type.toUpperCase()} - ${message}`);
    return alert;
  }
}
