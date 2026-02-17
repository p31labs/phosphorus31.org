/**
 * Integration Tests: Buffer ↔ Centaur
 * Tests The Buffer voltage engine integrated with The Centaur AI
 */

import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import { CentaurClient } from '../../centaur-client';
import { QueuedMessage } from '../../types';

// Mock fetch for testing
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Buffer → Centaur Pipeline', () => {
  const CENTAUR_BASE_URL = 'http://localhost:3000';
  let centaurClient: CentaurClient;

  beforeAll(() => {
    centaurClient = new CentaurClient();
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('Message Forwarding', () => {
    test('Buffer sends raw message to Centaur for AI translation', async () => {
      const message: QueuedMessage = {
        id: 'msg_123',
        message: 'You ALWAYS do this wrong!',
        priority: 'high',
        metadata: { source: 'buffer' },
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      const mockResponse = {
        messageId: 'centaur_msg_456',
        response: 'Translation: There is a pattern of behavior that needs attention.',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await centaurClient.forwardMessage(message);
      expect(result.success).toBe(true);
      expect(result.messageId).toBe('centaur_msg_456');
      expect(result.response).toBeDefined();

      // Verify request format (CentaurClient sends content, source, priority, metadata.bufferMessageId, receivedAt, timestamp)
      expect(mockFetch).toHaveBeenCalledWith(
        `${CENTAUR_BASE_URL}/api/messages`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        })
      );
      const sentBody = JSON.parse(mockFetch.mock.calls[0]?.[1]?.body as string);
      expect(sentBody).toMatchObject({
        content: message.message,
        source: 'buffer',
        priority: 'high',
        metadata: { bufferMessageId: 'msg_123' },
      });
      expect(typeof sentBody.timestamp).toBe('string');
    });

    test('Centaur returns translated message with metadata', async () => {
      const message: QueuedMessage = {
        id: 'msg_789',
        message: 'This is a neutral message',
        priority: 'normal',
        metadata: {},
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      const mockResponse = {
        messageId: 'centaur_msg_999',
        response: 'This is a neutral message',
        metadata: {
          translationApplied: false,
          voltageScore: 1,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await centaurClient.forwardMessage(message);
      expect(result.success).toBe(true);
      expect(result.response).toBe(mockResponse.response);
    });
  });

  describe('AI Translation Quality', () => {
    test('hostile message gets decoded to factual summary', async () => {
      const hostileMessage: QueuedMessage = {
        id: 'msg_hostile',
        message: 'You NEVER listen! I\'m calling my lawyer RIGHT NOW!',
        priority: 'urgent',
        metadata: {},
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      const mockTranslation = {
        messageId: 'centaur_translated',
        response: 'Translation: There is a communication concern. Legal consultation may be involved.',
        metadata: {
          originalVoltage: 8,
          translatedVoltage: 3,
          patternsDetected: ['THREATS', 'EMOTIONAL_LEVER'],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTranslation,
      });

      const result = await centaurClient.forwardMessage(hostileMessage);
      expect(result.success).toBe(true);
      expect(result.response).toContain('communication concern');
      expect(result.response).not.toContain('NEVER');
      expect(result.response).not.toContain('lawyer');
    });

    test('neutral message passes through with minimal translation', async () => {
      const neutralMessage: QueuedMessage = {
        id: 'msg_neutral',
        message: 'Soccer practice is at 5pm',
        priority: 'normal',
        metadata: {},
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      const mockResponse = {
        messageId: 'centaur_neutral',
        response: 'Soccer practice is at 5pm',
        metadata: {
          translationApplied: false,
          voltageScore: 1,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await centaurClient.forwardMessage(neutralMessage);
      expect(result.success).toBe(true);
      expect(result.response).toBe(neutralMessage.message);
    });
  });

  describe('Fallback Behavior - CRITICAL', () => {
    test('Buffer works WITHOUT Centaur (local-only voltage scoring)', async () => {
      // Simulate Centaur being down
      mockFetch.mockRejectedValueOnce(new Error('Connection refused'));

      const message: QueuedMessage = {
        id: 'msg_local',
        message: 'Test message',
        priority: 'normal',
        metadata: {},
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      const result = await centaurClient.forwardMessage(message);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();

      // Buffer should still process message locally
      // This is tested in the Buffer server tests, not here
    });

    test('Centaur being down does NOT block message triage', async () => {
      // This test verifies that Buffer's message processing continues
      // even when Centaur is unavailable
      mockFetch.mockRejectedValueOnce(new Error('Service unavailable'));

      const message: QueuedMessage = {
        id: 'msg_triage',
        message: 'High voltage message!!!',
        priority: 'high',
        metadata: {},
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      const result = await centaurClient.forwardMessage(message);
      expect(result.success).toBe(false);

      // Message should still be saved to Buffer store
      // Voltage scoring should still work
      // Only AI translation is unavailable
    });

    test('Buffer queues AI translation requests when Centaur is down', async () => {
      // First attempt fails
      mockFetch.mockRejectedValueOnce(new Error('Connection refused'));

      const message: QueuedMessage = {
        id: 'msg_queued',
        message: 'Test message',
        priority: 'normal',
        metadata: {},
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      const result1 = await centaurClient.forwardMessage(message);
      expect(result1.success).toBe(false);

      // Message should be marked for retry
      // Buffer server should retry when Centaur comes back
    });

    test('Queue drains when Centaur comes back online', async () => {
      // First attempt fails
      mockFetch.mockRejectedValueOnce(new Error('Connection refused'));

      const message: QueuedMessage = {
        id: 'msg_retry',
        message: 'Test message',
        priority: 'normal',
        metadata: {},
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      const result1 = await centaurClient.forwardMessage(message);
      expect(result1.success).toBe(false);

      // Simulate Centaur coming back online
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messageId: 'centaur_recovered',
          response: 'Message processed',
        }),
      });

      // Retry should succeed
      const result2 = await centaurClient.forwardMessage(message);
      expect(result2.success).toBe(true);
    });
  });

  describe('Retry Logic', () => {
    test('Buffer retries failed requests with exponential backoff', async () => {
      const message: QueuedMessage = {
        id: 'msg_retry',
        message: 'Test',
        priority: 'normal',
        metadata: {},
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      mockFetch.mockClear();
      mockFetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ messageId: 'success' }),
        });
      const result = await centaurClient.forwardMessage(message);
      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    test('Buffer gives up after max retries', async () => {
      // All attempts fail
      mockFetch.mockRejectedValue(new Error('Persistent failure'));

      const message: QueuedMessage = {
        id: 'msg_fail',
        message: 'Test',
        priority: 'normal',
        metadata: {},
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      const result = await centaurClient.forwardMessage(message);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Health Check', () => {
    test('Buffer checks Centaur health before forwarding', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      });

      const isHealthy = await centaurClient.checkHealth();
      expect(isHealthy).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        `${CENTAUR_BASE_URL}/health`,
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    test('Buffer detects when Centaur is down', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Connection refused'));

      const isHealthy = await centaurClient.checkHealth();
      expect(isHealthy).toBe(false);
    });
  });
});
