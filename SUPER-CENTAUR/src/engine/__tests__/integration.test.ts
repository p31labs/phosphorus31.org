/**
 * Integration Tests
 * End-to-end tests for game engine integration
 * 
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 * Licensed under the AGPLv3 License
 */

import { GameEngine } from '../core/GameEngine';
import { DataStore } from '../../database/store';

describe('Game Engine Integration', () => {
  let gameEngine: GameEngine;

  beforeEach(async () => {
    gameEngine = new GameEngine();
    await gameEngine.init();
  });

  afterEach(() => {
    gameEngine.dispose();
  });

  describe('Full Game Flow', () => {
    test('should complete full game cycle', async () => {
      // Create structure
      gameEngine.createNewStructure('Integration Test Structure');
      
      // Start game
      gameEngine.start();
      
      // Play for a bit
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Pause
      gameEngine.pause();
      
      // Resume
      gameEngine.resume();
      
      // Stop
      gameEngine.stop();
      
      const state = gameEngine.getGameState();
      expect(state.currentStructure).toBeDefined();
    });
  });

  describe('Wallet Integration Flow', () => {
    test('should reward and track LOVE tokens', async () => {
      const memberId = 'integration_test_member';
      
      // Reward tokens
      const success = gameEngine.rewardLoveTokens(memberId, 50, 'Integration test reward', 'bonus');
      expect(success).toBe(true);
      
      // Check balance
      const balance = gameEngine.getPlayerWalletBalance(memberId);
      expect(balance).toBeGreaterThanOrEqual(50);
      
      // Get reward history
      const walletIntegration = gameEngine.getWalletIntegration();
      const history = walletIntegration.getRewardHistory(memberId);
      expect(history.length).toBeGreaterThan(0);
    });
  });

  describe('Network Integration Flow', () => {
    test('should join room and broadcast', async () => {
      const network = gameEngine.getNetworkManager();
      
      await network.joinRoom('integration_test_room', 'Test Player');
      expect(network.getRoomId()).toBe('integration_test_room');
      
      // Broadcast structure update
      gameEngine.createNewStructure('Network Test Structure');
      const structure = gameEngine.getGameState().currentStructure;
      
      if (structure) {
        network.broadcastStructureUpdate(structure);
      }
      
      network.leaveRoom();
    });
  });

  describe('Cloud Sync Integration Flow', () => {
    test('should sync structure to cloud', async () => {
      gameEngine.createNewStructure('Cloud Sync Test Structure');
      const structure = gameEngine.getGameState().currentStructure;
      
      if (structure) {
        const cloudSync = gameEngine.getCloudSyncManager();
        const success = await cloudSync.syncStructure(structure);
        expect(success).toBe(true);
      }
    });
  });

  describe('Performance Integration', () => {
    test('should track performance during gameplay', async () => {
      gameEngine.start();
      
      // Run for a bit
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const metrics = gameEngine.getPerformanceMetrics();
      expect(metrics.fps).toBeGreaterThan(0);
      expect(metrics.frameTime).toBeGreaterThan(0);
      
      gameEngine.stop();
    });
  });
});
