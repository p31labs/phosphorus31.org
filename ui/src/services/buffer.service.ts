/**
 * Buffer Service - Client for The Buffer API (P31 Shelter)
 * Connects P31 Spectrum to P31 Buffer message processing system.
 * Real backend: POST /process, GET /history, GET /accommodation-log, GET /health
 */

// Prefer VITE_SHELTER_URL (aligns with apps/scope, game-client); VITE_BUFFER_URL for backward compat
const BUFFER_API_URL =
  import.meta.env.VITE_SHELTER_URL || import.meta.env.VITE_BUFFER_URL || 'http://localhost:4000';

export interface BufferMessage {
  message: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  metadata?: Record<string, unknown>;
}

export interface BufferResponse {
  success: boolean;
  messageId: string;
  status: string;
}

/** Response from POST /process (P31 Shelter backend) */
export interface ProcessResponse {
  messageId: string;
  voltage: number;
  threatLevel: string;
  patterns: unknown[];
  triage: { status: string; holdReason?: string; autoHold?: boolean };
}

/** Message shape from GET /history */
export interface HistoryMessage {
  id: string;
  text: string;
  timestamp: string;
  processedAt: string;
  voltageResult: { voltage: number; threatLevel: string; patterns: unknown[] };
  triageDecision: { status: string; holdReason?: string; autoHold?: boolean };
}

export interface HistoryResponse {
  messages: HistoryMessage[];
  page: number;
  limit: number;
  total: number;
}

export interface QueueStatus {
  queueLength: number;
  connected: boolean;
  pending: number;
  processing: number;
}

export interface PingStatus {
  active: boolean;
  lastHeartbeat: string | null;
  nodes: Record<
    string,
    {
      nodeId: string;
      timestamp: string;
      signalStrength: number;
    }
  >;
  health: 'green' | 'yellow' | 'red';
}

export class BufferService {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || BUFFER_API_URL;
  }

  async submitMessage(message: BufferMessage): Promise<BufferResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response) {
        throw new Error('No response from Buffer API');
      }
      if (!response.ok) {
        throw new Error(`Buffer API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting message to Buffer:', error);
      throw error;
    }
  }

  async getMessageStatus(messageId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/messages/${messageId}`);

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting message status:', error);
      return null;
    }
  }

  async getQueueStatus(): Promise<QueueStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/api/queue/status`);

      if (!response.ok) {
        return {
          queueLength: 0,
          connected: false,
          pending: 0,
          processing: 0,
        };
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting queue status:', error);
      return {
        queueLength: 0,
        connected: false,
        pending: 0,
        processing: 0,
      };
    }
  }

  async getPingStatus(): Promise<PingStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ping/status`);

      if (!response.ok) {
        return {
          active: false,
          lastHeartbeat: null,
          nodes: {},
          health: 'red',
        };
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting ping status:', error);
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
      await fetch(`${this.baseUrl}/api/ping/heartbeat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodeId, signalStrength }),
      });
    } catch (error) {
      console.debug('Heartbeat failed (Buffer may be unavailable)');
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Process a message (P31 Shelter backend: POST /process).
   * Returns voltage, patterns, and triage decision.
   */
  async processMessage(text: string): Promise<ProcessResponse> {
    const response = await fetch(`${this.baseUrl}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim() }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(typeof err.error === 'string' ? err.error : 'Buffer process failed');
    }
    return response.json() as Promise<ProcessResponse>;
  }

  /**
   * Get message history (P31 Shelter backend: GET /history).
   * Returns 503 if database not available.
   */
  async getHistory(params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    voltageThreshold?: number;
    patternType?: string;
  }): Promise<HistoryResponse> {
    const search = new URLSearchParams();
    if (params?.page != null) search.set('page', String(params.page));
    if (params?.limit != null) search.set('limit', String(params.limit));
    if (params?.startDate) search.set('startDate', params.startDate);
    if (params?.endDate) search.set('endDate', params.endDate);
    if (params?.voltageThreshold != null) search.set('voltageThreshold', String(params.voltageThreshold));
    if (params?.patternType) search.set('patternType', params.patternType);
    const qs = search.toString();
    const url = qs ? `${this.baseUrl}/history?${qs}` : `${this.baseUrl}/history`;
    const response = await fetch(url);
    if (response.status === 503) {
      return { messages: [], page: 1, limit: 50, total: 0 };
    }
    if (!response.ok) {
      throw new Error(`Buffer history failed: ${response.statusText}`);
    }
    return response.json() as Promise<HistoryResponse>;
  }

  /**
   * Get accommodation log (P31 Shelter backend: GET /accommodation-log).
   * Backend may return 501 until implemented.
   */
  async getAccommodationLog(): Promise<{ available: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/accommodation-log`);
      if (response.status === 501) {
        return { available: false, error: 'Not yet implemented' };
      }
      if (!response.ok) {
        return { available: false, error: response.statusText };
      }
      return { available: true };
    } catch (e) {
      return { available: false, error: e instanceof Error ? e.message : 'Request failed' };
    }
  }
}

export const bufferService = new BufferService();
