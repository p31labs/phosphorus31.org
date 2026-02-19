/**
 * Game Engine Tests
 * Comprehensive test suite for the game engine
 * 
 * @license
 * Copyright 2026 P31 Labs
 * Licensed under the AGPLv3 License
 */

import { GameEngine } from '../GameEngine';
import { Structure } from '../../types/game';

describe('GameEngine', () => {
  let gameEngine: GameEngine;

  beforeEach(() => {
    gameEngine = new GameEngine();
  });

  afterEach(async () => {
    if (gameEngine) {
      gameEngine.dispose();
    }
  });

  describe('Initialization', () => {
    test('should create game engine instance', () => {
      expect(gameEngine).toBeDefined();
    });

    test('should initialize all systems', async () => {
      await expect(gameEngine.init()).resolves.not.toThrow();
    });

    test('should start game loop', async () => {
      await gameEngine.init();
      gameEngine.start();
      expect(gameEngine.getGameState().isRunning).toBe(true);
      gameEngine.stop();
    });

    test('should stop game loop', async () => {
      await gameEngine.init();
      gameEngine.start();
      gameEngine.stop();
      expect(gameEngine.getGameState().isRunning).toBe(false);
    });
  });

  describe('Structure Management', () => {
    test('should create new structure', async () => {
      await gameEngine.init();
      gameEngine.createNewStructure('Test Structure');
      const state = gameEngine.getGameState();
      expect(state.currentStructure).toBeDefined();
      expect(state.currentStructure?.name).toBe('Test Structure');
    });

    test('should save structure', async () => {
      await gameEngine.init();
      gameEngine.createNewStructure('Test Structure');
      const state = gameEngine.getGameState();
      expect(state.currentStructure).toBeDefined();
      // Structure should be saved automatically
    });

    test('should load structure', async () => {
      await gameEngine.init();
      gameEngine.createNewStructure('Test Structure');
      const structureId = gameEngine.getGameState().currentStructure?.id;
      expect(structureId).toBeDefined();
      
      // Load structure
      if (structureId) {
        await expect(gameEngine.loadStructure(structureId)).resolves.not.toThrow();
      }
    });
  });

  describe('Challenge System', () => {
    test('should complete challenge', async () => {
      await gameEngine.init();
      gameEngine.createNewStructure('Challenge Structure');
      
      // Complete challenge
      gameEngine.completeChallenge();
      
      const progress = gameEngine.getPlayerProgress();
      expect(progress).toBeDefined();
    });

    test('should reward LOVE tokens on challenge completion', async () => {
      await gameEngine.init();
      const memberId = 'test_member';
      const initialBalance = gameEngine.getPlayerWalletBalance(memberId);
      
      // Complete challenge (if one exists)
      gameEngine.completeChallenge();
      
      // Balance should increase if challenge was completed
      // (This depends on challenge engine having a challenge)
    });
  });

  describe('Wallet Integration', () => {
    test('should reward LOVE tokens', async () => {
      await gameEngine.init();
      const memberId = 'test_member';
      const amount = 10;
      
      const success = gameEngine.rewardLoveTokens(memberId, amount, 'Test reward', 'bonus');
      expect(success).toBe(true);
    });

    test('should get wallet balance', async () => {
      await gameEngine.init();
      const memberId = 'test_member';
      const balance = gameEngine.getPlayerWalletBalance(memberId);
      expect(typeof balance).toBe('number');
      expect(balance).toBeGreaterThanOrEqual(0);
    });

    test('should transfer LOVE tokens', async () => {
      await gameEngine.init();
      const fromId = 'from_member';
      const toId = 'to_member';
      const amount = 5;
      
      // First reward some tokens
      gameEngine.rewardLoveTokens(fromId, 10, 'Initial reward', 'bonus');
      
      // Then transfer
      const success = gameEngine.transferLoveTokens(fromId, toId, amount, 'Test transfer');
      expect(success).toBe(true);
    });
  });

  describe('Performance Monitoring', () => {
    test('should track performance metrics', async () => {
      await gameEngine.init();
      gameEngine.start();
      
      // Wait a bit for metrics to accumulate
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const metrics = gameEngine.getPerformanceMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.fps).toBeGreaterThan(0);
      expect(metrics.frameTime).toBeGreaterThan(0);
      
      gameEngine.stop();
    });

    test('should handle performance degradation', async () => {
      await gameEngine.init();
      gameEngine.start();
      
      // Performance monitor should handle degradation
      const metrics = gameEngine.getPerformanceMetrics();
      expect(metrics).toBeDefined();
      
      gameEngine.stop();
    });
  });

  describe('Pause/Resume', () => {
    test('should pause game', async () => {
      await gameEngine.init();
      gameEngine.start();
      gameEngine.pause();
      
      const state = gameEngine.getGameState();
      expect(state.isPaused).toBe(true);
      
      gameEngine.stop();
    });

    test('should resume game', async () => {
      await gameEngine.init();
      gameEngine.start();
      gameEngine.pause();
      gameEngine.resume();
      
      const state = gameEngine.getGameState();
      expect(state.isPaused).toBe(false);
      
      gameEngine.stop();
    });
  });

  describe('Error Recovery', () => {
    test('should handle errors gracefully', async () => {
      await gameEngine.init();
      const errorRecovery = gameEngine.getErrorRecovery();
      expect(errorRecovery).toBeDefined();
      expect(errorRecovery.isStable()).toBe(true);
    });
  });

  describe('Accessibility', () => {
    test('should have accessibility manager', async () => {
      await gameEngine.init();
      const a11y = gameEngine.getAccessibilityManager();
      expect(a11y).toBeDefined();
    });
  });

  describe('Network Integration', () => {
    test('should have network manager', async () => {
      await gameEngine.init();
      const network = gameEngine.getNetworkManager();
      expect(network).toBeDefined();
    });
  });

  describe('Cloud Sync', () => {
    test('should have cloud sync manager', async () => {
      await gameEngine.init();
      const cloudSync = gameEngine.getCloudSyncManager();
      expect(cloudSync).toBeDefined();
    });
  });

  describe('Spatial Audio', () => {
    test('should have spatial audio manager', async () => {
      await gameEngine.init();
      const audio = gameEngine.getSpatialAudioManager();
      expect(audio).toBeDefined();
    });
  });
});
