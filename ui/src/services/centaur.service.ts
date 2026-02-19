/**
 * Centaur Service - Client for P31 Tandem API
 * Connects P31 Spectrum to P31 Tandem backend AI protocol system
 */

const CENTAUR_API_URL = import.meta.env.VITE_CENTAUR_API_URL || 'http://localhost:3000';

export interface CentaurMessage {
  content: string;
  source?: string;
  priority?: string;
  metadata?: Record<string, any>;
  timestamp?: string;
}

export interface CentaurResponse {
  success: boolean;
  messageId?: string;
  response?: string;
  error?: string;
}

export class CentaurService {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || CENTAUR_API_URL;
  }

  /**
   * Send message to P31 Tandem
   */
  async sendMessage(message: CentaurMessage): Promise<CentaurResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message to Centaur:', error);
      throw error;
    }
  }

  /**
   * Get messages from P31 Tandem
   */
  async getMessages(limit: number = 50): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/messages?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      console.error('Error getting messages from Centaur:', error);
      return [];
    }
  }

  /**
   * Get specific message
   */
  async getMessage(messageId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/messages/${messageId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting message from Centaur:', error);
      return null;
    }
  }

  /**
   * Check Centaur health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
      });

      return response.ok;
    } catch (error) {
      console.error('Centaur health check failed:', error);
      return false;
    }
  }
}

export const centaurService = new CentaurService();
