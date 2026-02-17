/**
 * Network Manager Tests
 * Test suite for network manager
 * 
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 * Licensed under the AGPLv3 License
 */

import { NetworkManager, NetworkMessage } from '../NetworkManager';

describe('NetworkManager', () => {
  let networkManager: NetworkManager;

  beforeEach(async () => {
    networkManager = new NetworkManager();
    await networkManager.init();
  });

  afterEach(() => {
    networkManager.dispose();
  });

  describe('Initialization', () => {
    test('should initialize network manager', () => {
      expect(networkManager).toBeDefined();
    });

    test('should be connected after init', async () => {
      await networkManager.init();
      expect(networkManager.isNetworkConnected()).toBe(true);
    });
  });

  describe('Room Management', () => {
    test('should join room', async () => {
      await networkManager.joinRoom('test_room', 'Test Player');
      expect(networkManager.getRoomId()).toBe('test_room');
    });

    test('should leave room', async () => {
      await networkManager.joinRoom('test_room', 'Test Player');
      networkManager.leaveRoom();
      expect(networkManager.getRoomId()).toBeNull();
    });

    test('should track peers', async () => {
      await networkManager.joinRoom('test_room', 'Test Player');
      const peers = networkManager.getPeers();
      expect(peers.length).toBeGreaterThan(0);
    });
  });

  describe('Messaging', () => {
    test('should broadcast structure update', async () => {
      await networkManager.joinRoom('test_room', 'Test Player');
      
      let received = false;
      networkManager.onMessage('structure_update', (message) => {
        received = true;
        expect(message.type).toBe('structure_update');
      });

      networkManager.broadcastStructureUpdate({
        id: 'test_structure',
        name: 'Test',
        primitives: [],
        vertices: 0,
        edges: 0,
        isRigid: false,
        stabilityScore: 0,
        maxLoadBeforeFailure: 0,
        createdBy: 'test',
        createdAt: Date.now(),
      });

      expect(received).toBe(true);
    });

    test('should send chat message', async () => {
      await networkManager.joinRoom('test_room', 'Test Player');
      
      let received = false;
      networkManager.onMessage('chat', (message) => {
        received = true;
        expect(message.data.message).toBe('Hello');
      });

      networkManager.sendChat('Hello');
      expect(received).toBe(true);
    });
  });

  describe('Peer Management', () => {
    test('should update peer position', async () => {
      await networkManager.joinRoom('test_room', 'Test Player');
      networkManager.updatePeerPosition({ x: 10, y: 20, z: 30 });
      
      const peer = networkManager.getPeers().find(p => p.id === networkManager.getLocalPeerId());
      expect(peer?.position).toEqual({ x: 10, y: 20, z: 30 });
    });

    test('should cleanup disconnected peers', async () => {
      await networkManager.joinRoom('test_room', 'Test Player');
      networkManager.cleanupDisconnectedPeers(0); // Immediate cleanup
      
      // Should still have local peer
      const peers = networkManager.getPeers();
      expect(peers.length).toBeGreaterThan(0);
    });
  });
});
