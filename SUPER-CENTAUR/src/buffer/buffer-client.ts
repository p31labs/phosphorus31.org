/**
 * Buffer Client - Integration with The Buffer message processing system
 */

import axios, { AxiosInstance } from 'axios';
import { Logger } from '../utils/logger';

export interface BufferMessage {
  message: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  metadata?: Record<string, any>;
}

export interface BufferResponse {
  success: boolean;
  messageId: string;
  status: string;
}

export class BufferClient {
  private client: AxiosInstance;
  private logger: Logger;
  private readonly bufferUrl: string;

  constructor(bufferUrl?: string) {
    this.bufferUrl = bufferUrl || process.env.BUFFER_URL || 'http://localhost:4000';
    this.logger = new Logger('BufferClient');
    
    this.client = axios.create({
      baseURL: this.bufferUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async submitMessage(message: BufferMessage): Promise<BufferResponse> {
    try {
      const response = await this.client.post<BufferResponse>('/api/messages', message);
      this.logger.debug(`Message submitted to Buffer: ${response.data.messageId}`);
      return response.data;
    } catch (error: any) {
      this.logger.error('Error submitting message to Buffer:', error.message);
      throw new Error(`Failed to submit message to Buffer: ${error.message}`);
    }
  }

  async getMessageStatus(messageId: string): Promise<any> {
    try {
      const response = await this.client.get(`/api/messages/${messageId}`);
      return response.data;
    } catch (error: any) {
      this.logger.error('Error getting message status:', error.message);
      return null;
    }
  }

  async getQueueStatus(): Promise<any> {
    try {
      const response = await this.client.get('/api/queue/status');
      return response.data;
    } catch (error: any) {
      this.logger.warn('Buffer not available, returning default status');
      return {
        queueLength: 0,
        connected: false,
        pending: 0,
        processing: 0,
      };
    }
  }

  async getPingStatus(): Promise<any> {
    try {
      const response = await this.client.get('/api/ping/status');
      return response.data;
    } catch (error: any) {
      this.logger.warn('Buffer ping not available');
      return {
        active: false,
        lastHeartbeat: null,
        nodes: {},
        health: 'red',
      };
    }
  }

  async sendHeartbeat(nodeId: string, signalStrength: number): Promise<void> {
    try {
      await this.client.post('/api/ping/heartbeat', { nodeId, signalStrength });
    } catch (error: any) {
      this.logger.debug('Heartbeat failed (Buffer may be unavailable)');
    }
  }

  isAvailable(): Promise<boolean> {
    return this.client.get('/health')
      .then(() => true)
      .catch(() => false);
  }
}
