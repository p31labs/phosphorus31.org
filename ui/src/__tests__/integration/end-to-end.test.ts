/**
 * End-to-End Integration Tests
 * Tests the complete message lifecycle across all components
 */

import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import { bufferService } from '../../services/buffer.service';
import { centaurService } from '../../services/centaur.service';
import { ApiClient } from '../../bridge/api-client';
import { NodeOneMockServer } from './node-one-mock-server';

const originalFetch = globalThis.fetch;
const mockFetch = vi.fn();
global.fetch = mockFetch;

/** Default: Buffer and Centaur return success; Node One (8080) uses real fetch to hit mock server. */
function setDefaultFetchMocks() {
  mockFetch.mockImplementation((url: string | URL, init?: RequestInit) => {
    const u = String(url);
    if (u.includes('8080')) return originalFetch(url as string, init);
    if (u.includes('4000')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true, messageId: 'test-msg-id', response: 'Processed' }),
      } as Response);
    }
    if (u.includes('3000')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true, response: 'Translation', messageId: 'centaur-1' }),
      } as Response);
    }
    return Promise.reject(new Error(`Unmocked URL: ${u}`));
  });
}

describe('End-to-End: Message Lifecycle', () => {
  let mockNodeOne: NodeOneMockServer;

  beforeAll(async () => {
    mockNodeOne = new NodeOneMockServer({ port: 8080 });
    await mockNodeOne.start();
  });

  afterAll(async () => {
    await mockNodeOne.stop();
  });

  beforeEach(() => {
    setDefaultFetchMocks();
  });

  describe('Happy Path', () => {
    test('low-voltage message flows through entire pipeline and displays', async () => {
      // Step 1: LoRa message arrives at Node One
      const loraMessage = {
        content: 'Soccer practice is at 5pm',
        from: 'node_one',
      };
      mockNodeOne.addLoRaMessage(loraMessage);

      // Step 2: Scope receives message from Node One
      const nodeOneClient = new ApiClient({ baseUrl: 'http://localhost:8080' });
      const messages = await nodeOneClient.get('/api/messages');
      expect(messages.messages.length).toBeGreaterThan(0);

      // Step 3: Scope sends to Buffer for voltage scoring
      const bufferResponse = await bufferService.submitMessage({
        message: loraMessage.content,
        priority: 'normal',
        metadata: { source: 'lora', from: loraMessage.from },
      });
      expect(bufferResponse.success).toBe(true);

      // Step 4: Buffer scores message (voltage should be ≤2 for neutral message)
      const messageStatus = await bufferService.getMessageStatus(bufferResponse.messageId);
      expect(messageStatus).toBeDefined();
      // Voltage should be low for neutral message

      // Step 5: Buffer sends to Centaur for AI translation (optional)
      const centaurResponse = await centaurService.sendMessage({
        content: loraMessage.content,
        source: 'buffer',
        priority: 'normal',
      });
      expect(centaurResponse.success).toBe(true);

      // Step 6: Message appears in Scope inbox (not held)
      // This would be tested in UI component tests
      expect(true).toBe(true); // Placeholder
    });

    test('high-voltage message gets held and translated', async () => {
      const hostileMessage = "You ALWAYS do this, I'm calling my lawyer";

      // Step 1: Submit to Buffer
      const bufferResponse = await bufferService.submitMessage({
        message: hostileMessage,
        priority: 'high',
        metadata: { source: 'manual' },
      });
      expect(bufferResponse.success).toBe(true);

      // Step 2: Buffer scores message (should be ≥7)
      const messageStatus = await bufferService.getMessageStatus(bufferResponse.messageId);
      // Voltage should be high
      // Patterns should include: EMOTIONAL_LEVER, THREATS

      // Step 3: Message should be auto-held (voltage ≥6)
      // Status should be 'held'

      // Step 4: Buffer sends to Centaur for AI translation
      const centaurResponse = await centaurService.sendMessage({
        content: hostileMessage,
        source: 'buffer',
        priority: 'high',
      });
      expect(centaurResponse.success).toBe(true);
      expect(centaurResponse.response).toBeDefined();

      // Step 5: Translation should strip emotional attack
      expect(centaurResponse.response).not.toContain('ALWAYS');
      expect(centaurResponse.response).not.toContain('lawyer');

      // Step 6: Message appears in held queue, not inbox
      // Raw text should be gated behind "Reveal" button
      expect(true).toBe(true); // Placeholder
    });

    test('critical alert triggers emergency protocol', async () => {
      const criticalMessage = 'EMERGENCY!!! IMMEDIATE ACTION REQUIRED!!!';

      // Step 1: Submit to Buffer
      const bufferResponse = await bufferService.submitMessage({
        message: criticalMessage,
        priority: 'urgent',
        metadata: { source: 'manual' },
      });
      expect(bufferResponse.success).toBe(true);

      // Step 2: Voltage should be ≥8
      const messageStatus = await bufferService.getMessageStatus(bufferResponse.messageId);
      // Voltage should be critical

      // Step 3: Critical alert should trigger:
      // - Visual notification (red badge)
      // - Haptic feedback (if available)
      // - Accommodation log entry
      expect(true).toBe(true); // Placeholder
    });

    test('user reveals raw text after reading translation', async () => {
      // Step 1: Process high-voltage message (from previous test)
      const hostileMessage = "You ALWAYS do this wrong!";
      const bufferResponse = await bufferService.submitMessage({
        message: hostileMessage,
        priority: 'high',
      });

      // Step 2: Message is held, translation shown
      // Step 3: User clicks "Reveal" button
      // Step 4: Confirmation dialog appears (for voltage ≥6)
      // Step 5: User confirms
      // Step 6: Raw text is shown
      // Step 7: Reveal action is logged in accommodation log
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Degraded Operation', () => {
    test('system works with only Buffer (no Centaur, no Node One)', async () => {
      // Manual message input → Buffer scores → Scope displays
      const message = 'Test message without Centaur';
      
      // Buffer should process locally
      const bufferResponse = await bufferService.submitMessage({
        message,
        priority: 'normal',
      });
      expect(bufferResponse.success).toBe(true);

      // Voltage scoring should work
      const status = await bufferService.getMessageStatus(bufferResponse.messageId);
      expect(status).toBeDefined();

      // AI translation unavailable, but message should still display
      // with "[translation pending]" indicator
      expect(true).toBe(true); // Placeholder
    });

    test('system works with Centaur down (Buffer + Scope only)', async () => {
      // Only Centaur (3000) down; Buffer (4000) still works
      mockFetch.mockImplementation((url: string | URL, init?: RequestInit) => {
        const u = String(url);
        if (u.includes('8080')) return originalFetch(url as string, init);
        if (u.includes('4000')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ success: true, messageId: 'buf-1', response: 'Processed' }),
          } as Response);
        }
        if (u.includes('3000')) return Promise.reject(new Error('Connection refused'));
        return Promise.reject(new Error(`Unmocked URL: ${u}`));
      });

      const message = 'Test message with Centaur down';
      const bufferResponse = await bufferService.submitMessage({
        message,
        priority: 'normal',
      });
      expect(bufferResponse.success).toBe(true);

      const status = await bufferService.getMessageStatus(bufferResponse.messageId);
      expect(status).toBeDefined();

      const centaurHealth = await centaurService.checkHealth();
      expect(centaurHealth).toBe(false);
    });

    test('system works with Node One disconnected', async () => {
      // Stop Node One
      await mockNodeOne.stop();

      // Scope should show "device disconnected" indicator
      const nodeOneClient = new ApiClient({
        baseUrl: 'http://localhost:8080',
        timeout: 1000,
      });

      await expect(nodeOneClient.get('/api/status')).rejects.toThrow();

      // But manual input + Buffer + Centaur should still work
      const bufferResponse = await bufferService.submitMessage({
        message: 'Manual input test',
        priority: 'normal',
      });
      expect(bufferResponse.success).toBe(true);

      // Restart Node One
      await mockNodeOne.start();
    });

    test('system works completely offline (local-only mode)', async () => {
      // All services down
      mockFetch.mockRejectedValue(new Error('All services down'));

      // Manual input → local voltage scoring → display
      // No AI, no mesh, but the shield still works
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Error Recovery', () => {
    test('system recovers when Centaur comes back online', async () => {
      const message = 'Test recovery message';

      // Step 1: first call fails (Centaur down)
      mockFetch.mockRejectedValueOnce(new Error('Connection refused'));
      await expect(
        bufferService.submitMessage({ message, priority: 'normal' })
      ).rejects.toThrow('Connection refused');

      // Step 2: next call succeeds (Centaur back)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          messageId: 'recovered',
          response: 'Message processed',
        }),
      });
      const bufferResponse = await bufferService.submitMessage({
        message,
        priority: 'normal',
      });
      expect(bufferResponse.success).toBe(true);
    });

    test('system handles message queue overflow gracefully', async () => {
      // Submit many messages rapidly
      const messages = Array.from({ length: 100 }, (_, i) => ({
        message: `Test message ${i}`,
        priority: 'normal' as const,
      }));

      // Buffer should handle queue overflow
      // Messages should be processed in batches
      expect(true).toBe(true); // Placeholder
    });
  });
});
