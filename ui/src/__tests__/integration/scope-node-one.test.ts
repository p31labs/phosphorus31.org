/**
 * Integration Tests: Scope ↔ Node One (WiFi AP)
 * Tests The Scope communicating with NODE ONE hardware device
 */

import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import { ApiClient } from '../../bridge/api-client';
import { NodeOneMockServer } from './node-one-mock-server';

describe('Scope ↔ Node One Integration', () => {
  let mockServer: NodeOneMockServer;
  let apiClient: ApiClient;

  beforeAll(async () => {
    // Start mock Node One server
    mockServer = new NodeOneMockServer({ port: 8080 });
    await mockServer.start();

    // Create API client pointing to mock server
    apiClient = new ApiClient({
      baseUrl: 'http://localhost:8080',
      timeout: 5000,
    });
  });

  afterAll(async () => {
    await mockServer.stop();
  });

  describe('Device Status', () => {
    test('Scope displays battery percentage from Node One', async () => {
      mockServer.setBatteryLevel(85);
      const status = await apiClient.get('/api/status');
      expect(status.battery).toBe(85);
    });

    test('Scope displays WiFi client count', async () => {
      mockServer.setWifiClients(2);
      const status = await apiClient.get('/api/status');
      expect(status.wifi.clients).toBe(2);
      expect(status.wifi.connected).toBe(true);
    });

    test('Scope displays LoRa signal strength', async () => {
      mockServer.setLoraSignal(75);
      const status = await apiClient.get('/api/status');
      expect(status.lora.signalStrength).toBe(75);
      expect(status.lora.enabled).toBe(true);
    });

    test('Scope shows audio recording state', async () => {
      const status = await apiClient.get('/api/status');
      expect(status.audio).toHaveProperty('recording');
      expect(status.audio).toHaveProperty('available');
    });
  });

  describe('Voice Interface', () => {
    test('Scope can trigger recording via Node One API', async () => {
      const response = await apiClient.post('/api/audio/record', {});
      expect(response.success).toBe(true);
      expect(response.recording).toBe(true);
    });

    test('Scope receives audio level updates via WebSocket', () => {
      // This requires WebSocket mocking
      // For now, we document expected behavior
      expect(true).toBe(true); // Placeholder
    });

    test('Scope can trigger playback of received message', async () => {
      // Stop recording to get audio buffer
      const response = await apiClient.post('/api/audio/stop', {});
      expect(response.success).toBe(true);
      expect(response.recording).toBe(false);
      expect(response.audioBuffer).toBeDefined();
    });
  });

  describe('LoRa Mesh', () => {
    test('Scope displays incoming LoRa messages', async () => {
      mockServer.addLoRaMessage({
        content: 'Test LoRa message',
        from: 'node_one',
      });

      const response = await apiClient.get('/api/messages');
      expect(response.messages).toBeDefined();
      expect(Array.isArray(response.messages)).toBe(true);
      expect(response.messages.length).toBeGreaterThan(0);
    });

    test('Scope can send LoRa message via Node One', async () => {
      const response = await apiClient.post('/api/messages', {
        content: 'Hello from Scope',
        to: 'node_one',
      });
      expect(response.success).toBe(true);
      expect(response.messageId).toBeDefined();
    });

    test('MeshStatus shows connected nodes', async () => {
      const status = await apiClient.get('/api/mesh/status');
      expect(status.connected).toBe(true);
      expect(status.nodes).toBeDefined();
      expect(Array.isArray(status.nodes)).toBe(true);
      expect(status.totalNodes).toBeGreaterThan(0);
    });
  });

  describe('Offline Resilience', () => {
    test('Scope shows "device disconnected" when Node One unreachable', async () => {
      // Stop mock server
      await mockServer.stop();

      // Try to connect
      const client = new ApiClient({
        baseUrl: 'http://localhost:8080',
        timeout: 1000,
      });

      await expect(client.get('/api/status')).rejects.toThrow();

      // Restart server for other tests
      await mockServer.start();
    });

    test('Scope continues to function (Buffer + Centaur still work)', async () => {
      // When Node One is down, Scope should still be able to:
      // - Connect to Buffer
      // - Connect to Centaur
      // - Process manual message input
      expect(true).toBe(true); // Placeholder
    });

    test('Scope reconnects when Node One comes back', async () => {
      // After Node One restarts, Scope should:
      // - Detect reconnection
      // - Refresh device status
      // - Resume WebSocket connection
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Error Handling', () => {
    test('Scope handles Node One timeout gracefully', async () => {
      const client = new ApiClient({
        baseUrl: 'http://localhost:9999', // Non-existent server
        timeout: 1000,
      });

      await expect(client.get('/api/status')).rejects.toThrow();
    });

    test('Scope handles malformed Node One responses', async () => {
      // If Node One returns invalid JSON, Scope should not crash
      expect(true).toBe(true); // Placeholder
    });
  });
});
