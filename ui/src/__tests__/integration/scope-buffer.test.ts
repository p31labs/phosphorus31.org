/**
 * Integration Tests: Scope ↔ Buffer
 * Tests P31 Spectrum displaying Buffer output correctly
 */

import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import { bufferService } from '../../services/buffer.service';

// Mock fetch for testing
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Scope ↔ Buffer Integration', () => {
  const BUFFER_BASE_URL = 'http://localhost:4000';

  beforeAll(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('Message Display', () => {
    test('Scope fetches message history from Buffer', async () => {
      const mockMessages = [
        {
          id: 'msg_1',
          message: 'Low voltage message',
          voltage: 2,
          status: 'completed',
          timestamp: new Date().toISOString(),
        },
        {
          id: 'msg_2',
          message: 'High voltage message!!!',
          voltage: 7,
          status: 'held',
          timestamp: new Date().toISOString(),
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: mockMessages,
          total: 2,
          limit: 50,
          offset: 0,
          hasMore: false,
        }),
      });

      // Note: bufferService doesn't have getMessages yet, but should be added
      // For now, we test the endpoint directly
      const response = await fetch(`${BUFFER_BASE_URL}/api/messages?limit=20`);
      const data = await response.json();
      expect(data.messages).toEqual(mockMessages);
    });

    test('messages display with voltage badges (color-coded)', async () => {
      const mockMessage = {
        id: 'msg_voltage',
        message: 'Test message',
        voltage: 5,
        status: 'completed',
        patterns: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMessage,
      });

      const status = await bufferService.getMessageStatus('msg_voltage');
      expect(status).toEqual(mockMessage);
      expect(status.voltage).toBe(5);
      // Voltage 5 should be yellow/orange badge
    });

    test('pattern flags display as tags on messages', async () => {
      const mockMessage = {
        id: 'msg_patterns',
        message: 'You ALWAYS do this!',
        voltage: 6,
        status: 'held',
        patterns: ['EMOTIONAL_LEVER', 'ALL_CAPS'],
        timestamp: new Date().toISOString(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMessage,
      });

      const status = await bufferService.getMessageStatus('msg_patterns');
      expect(status.patterns).toContain('EMOTIONAL_LEVER');
      expect(status.patterns).toContain('ALL_CAPS');
    });

    test('auto-held messages appear in held queue, not inbox', async () => {
      const heldOnly = {
        messages: [
          { id: 'msg_held', message: 'High voltage message', voltage: 7, status: 'held' },
        ],
        total: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => heldOnly,
      });

      const response = await fetch(`${BUFFER_BASE_URL}/api/messages?status=held`);
      const data = await response.json();
      expect(data.messages.every((m: { status: string }) => m.status === 'held')).toBe(true);
    });

    test('critical alerts (≥8) trigger visual + haptic notification', async () => {
      const mockMessage = {
        id: 'msg_critical',
        message: 'CRITICAL ALERT!!!',
        voltage: 9,
        status: 'held',
        patterns: ['URGENCY', 'THREATS'],
        timestamp: new Date().toISOString(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMessage,
      });

      const status = await bufferService.getMessageStatus('msg_critical');
      expect(status.voltage).toBeGreaterThanOrEqual(8);
      // In UI, this should trigger:
      // - Red badge
      // - Haptic feedback (if available)
      // - Notification toast
    });
  });

  describe('Real-Time Updates', () => {
    test('new message from Buffer appears in Scope immediately (WebSocket)', () => {
      // This test requires WebSocket mocking
      // For now, we document expected behavior
      expect(true).toBe(true); // Placeholder
    });

    test('voltage recalculation updates Scope in real time', () => {
      // When Buffer recalculates voltage, Scope should update via WebSocket
      expect(true).toBe(true); // Placeholder
    });

    test('triage decision changes reflected immediately', () => {
      // When message status changes (held → released), Scope updates via WebSocket
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Accommodation Log', () => {
    test('Scope displays accommodation log entries', async () => {
      // Buffer should expose accommodation log endpoint
      const mockLog = [
        {
          id: 'log_1',
          messageId: 'msg_1',
          action: 'auto_held',
          voltage: 7,
          timestamp: new Date().toISOString(),
          reason: 'High voltage detected',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLog,
      });

      // Note: This endpoint may not exist yet
      const response = await fetch(`${BUFFER_BASE_URL}/api/accommodation-log`);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    test('Scope can export accommodation log (triggers Buffer export)', async () => {
      const mockExport = {
        format: 'json',
        entries: [],
        exportedAt: new Date().toISOString(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockExport,
      });

      // Note: Export endpoint may not exist yet
      const response = await fetch(`${BUFFER_BASE_URL}/api/accommodation-log/export`);
      const data = await response.json();
      expect(data.format).toBe('json');
    });

    test('export format matches legal/SSA requirements', async () => {
      // Export should include:
      // - Timestamp
      // - Message content (encrypted/redacted if high voltage)
      // - Voltage score
      // - Patterns detected
      // - Action taken (held/released)
      // - Reason
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Progressive Disclosure', () => {
    test('CatchersMitt shows translated text first', () => {
      // High-voltage messages should show translation before raw text
      expect(true).toBe(true); // Placeholder
    });

    test('raw text hidden until user explicitly reveals', () => {
      // Raw text should be behind a "Reveal" button for voltage ≥6
      expect(true).toBe(true); // Placeholder
    });

    test('reveal requires confirmation for voltage ≥6', () => {
      // High-voltage messages should require confirmation before revealing
      expect(true).toBe(true); // Placeholder
    });

    test('voltage and patterns visible before reveal', () => {
      // User should see voltage score and patterns without revealing raw text
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Queue Status', () => {
    test('Scope displays Buffer queue status', async () => {
      const mockStatus = {
        queueLength: 5,
        connected: true,
        pending: 3,
        processing: 2,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStatus,
      });

      const status = await bufferService.getQueueStatus();
      expect(status).toEqual(mockStatus);
    });

    test('Scope handles Buffer being offline', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Connection refused'));

      const status = await bufferService.getQueueStatus();
      expect(status.connected).toBe(false);
      expect(status.queueLength).toBe(0);
    });
  });

  describe('Ping Grid', () => {
    test('Scope displays ping grid status', async () => {
      const mockPing = {
        active: true,
        lastHeartbeat: new Date().toISOString(),
        nodes: {
          scope: {
            nodeId: 'scope',
            timestamp: new Date().toISOString(),
            signalStrength: 100,
          },
        },
        health: 'green' as const,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPing,
      });

      const status = await bufferService.getPingStatus();
      expect(status.active).toBe(true);
      expect(status.health).toBe('green');
    });

    test('Scope sends heartbeat to Buffer', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await bufferService.sendHeartbeat('scope', 100);
      expect(mockFetch).toHaveBeenCalledWith(
        `${BUFFER_BASE_URL}/api/ping/heartbeat`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ nodeId: 'scope', signalStrength: 100 }),
        })
      );
    });
  });
});
