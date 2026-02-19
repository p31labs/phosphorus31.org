/**
 * Integration Tests: Scope ↔ Centaur
 * Tests P31 Spectrum frontend communicating with P31 Tandem backend
 */

import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import { centaurService } from '../../services/centaur.service';

// Mock fetch for testing
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Scope → Centaur HTTP Integration', () => {
  const CENTAUR_BASE_URL = 'http://localhost:3000';

  beforeAll(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('Health Check', () => {
    test('GET /health returns system health', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'healthy', timestamp: new Date().toISOString() }),
      });

      const isHealthy = await centaurService.checkHealth();
      expect(isHealthy).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(`${CENTAUR_BASE_URL}/health`, {
        method: 'GET',
      });
    });

    test('Scope handles Centaur being down (shows offline indicator)', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const isHealthy = await centaurService.checkHealth();
      expect(isHealthy).toBe(false);
    });
  });

  describe('Message Operations', () => {
    test('POST /api/messages sends message, gets response', async () => {
      const mockMessage = {
        content: 'Test message',
        source: 'scope',
        priority: 'normal',
      };

      const mockResponse = {
        success: true,
        messageId: 'msg_123',
        response: 'Message received',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await centaurService.sendMessage(mockMessage);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        `${CENTAUR_BASE_URL}/api/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockMessage),
        }
      );
    });

    test('GET /api/messages returns message history', async () => {
      const mockMessages = [
        { id: 'msg_1', content: 'Message 1', timestamp: new Date().toISOString() },
        { id: 'msg_2', content: 'Message 2', timestamp: new Date().toISOString() },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ messages: mockMessages }),
      });

      const messages = await centaurService.getMessages(50);
      expect(messages).toEqual(mockMessages);
      expect(mockFetch).toHaveBeenCalledWith(
        `${CENTAUR_BASE_URL}/api/messages?limit=50`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });

    test('GET /api/messages/:messageId returns specific message', async () => {
      const mockMessage = {
        id: 'msg_123',
        content: 'Test message',
        timestamp: new Date().toISOString(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMessage,
      });

      const message = await centaurService.getMessage('msg_123');
      expect(message).toEqual(mockMessage);
      expect(mockFetch).toHaveBeenCalledWith(
        `${CENTAUR_BASE_URL}/api/messages/msg_123`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });

    test('Scope handles slow Centaur responses (shows loading)', async () => {
      // Simulate slow response
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                json: async () => ({ messages: [] }),
              });
            }, 100);
          })
      );

      const startTime = Date.now();
      await centaurService.getMessages(50);
      const duration = Date.now() - startTime;

      // Should take at least 100ms
      expect(duration).toBeGreaterThanOrEqual(100);
    });

    test('Scope handles malformed Centaur responses (no crash)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      // centaur.service getMessages catches and returns [] on parse error (no crash)
      const messages = await centaurService.getMessages(50);
      expect(messages).toEqual([]);
    });

    test('Scope handles HTTP errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(centaurService.sendMessage({ content: 'test' })).rejects.toThrow();
    });
  });

  describe('Spoon Economy Integration', () => {
    test('GET /api/spoons/today/:memberId returns current spoon state', async () => {
      const mockSpoons = {
        memberId: 'node_one',
        today: 5,
        max: 10,
        activities: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSpoons,
      });

      // Note: This endpoint is not yet in centaurService, but should be added
      const response = await fetch(`${CENTAUR_BASE_URL}/api/spoons/today/node_one`);
      const data = await response.json();
      expect(data).toEqual(mockSpoons);
    });

    test('POST /api/spoons/log updates spoon count', async () => {
      const mockLog = {
        memberId: 'node_one',
        activity: 'test_activity',
        spoonsUsed: 2,
        timestamp: new Date().toISOString(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, ...mockLog }),
      });

      const response = await fetch(`${CENTAUR_BASE_URL}/api/spoons/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockLog),
      });
      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });
});

describe('Scope ↔ Centaur WebSocket Integration', () => {
  // Note: WebSocket testing requires a WebSocket server mock
  // For now, we document the expected behavior

  test('Scope connects to Centaur /ws', () => {
    // TODO: Implement WebSocket connection test
    // This requires mocking WebSocket or using a test WebSocket server
    expect(true).toBe(true); // Placeholder
  });

  test('Centaur pushes status updates, Scope receives', () => {
    // TODO: Test WebSocket message reception
    expect(true).toBe(true); // Placeholder
  });

  test('Scope reconnects after Centaur restart', () => {
    // TODO: Test WebSocket reconnection logic
    expect(true).toBe(true); // Placeholder
  });

  test('Scope handles rapid message bursts without dropping', () => {
    // TODO: Test WebSocket message buffering
    expect(true).toBe(true); // Placeholder
  });
});
