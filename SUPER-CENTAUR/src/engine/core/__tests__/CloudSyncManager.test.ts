/**
 * Cloud Sync Manager Tests
 * Test suite for cloud sync manager
 * 
 * @license
 * Copyright 2026 P31 Labs
 * Licensed under the AGPLv3 License
 */

import { CloudSyncManager } from '../CloudSyncManager';
import { Structure, PlayerProgress } from '../../types/game';

describe('CloudSyncManager', () => {
  let cloudSync: CloudSyncManager;

  beforeEach(async () => {
    // Mock fetch to return successful responses
    (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
      text: async () => '',
    });
    
    cloudSync = new CloudSyncManager();
    await cloudSync.init();
  });

  afterEach(() => {
    cloudSync.dispose();
  });

  describe('Initialization', () => {
    test('should initialize cloud sync manager', () => {
      expect(cloudSync).toBeDefined();
    });

    test('should have sync status', () => {
      const status = cloudSync.getSyncStatus();
      expect(status).toBeDefined();
      expect(status.isSyncing).toBe(false);
    });
  });

  describe('Structure Sync', () => {
    test('should sync structure', async () => {
      const structure: Structure = {
        id: 'test_structure',
        name: 'Test Structure',
        createdBy: 'test_member',
        createdAt: Date.now(),
        primitives: [],
        vertices: 0,
        edges: 0,
        isRigid: false,
        stabilityScore: 0,
        maxLoadBeforeFailure: 0,
      };

      const success = await cloudSync.syncStructure(structure);
      expect(success).toBe(true);
    });

    test('should load structure from cloud', async () => {
      const structure: Structure = {
        id: 'test_structure',
        name: 'Test Structure',
        createdBy: 'test_member',
        createdAt: Date.now(),
        primitives: [],
        vertices: 0,
        edges: 0,
        isRigid: false,
        stabilityScore: 0,
        maxLoadBeforeFailure: 0,
      };

      await cloudSync.syncStructure(structure);
      const loaded = await cloudSync.loadStructure(structure.id);
      
      expect(loaded).toBeDefined();
      expect(loaded?.id).toBe(structure.id);
    });
  });

  describe('Progress Sync', () => {
    test('should sync player progress', async () => {
      const progress: PlayerProgress = {
        familyMemberId: 'test_member',
        completedChallenges: [],
        totalLoveEarned: 100,
        badges: [],
        buildStreak: 5,
        structures: [],
        tier: 'seedling',
        xp: 50,
      };

      const success = await cloudSync.syncProgress(progress);
      expect(success).toBe(true);
    });

    test('should load progress from cloud', async () => {
      const progress: PlayerProgress = {
        familyMemberId: 'test_member',
        completedChallenges: [],
        totalLoveEarned: 100,
        badges: [],
        buildStreak: 5,
        structures: [],
        tier: 'seedling',
        xp: 50,
      };

      await cloudSync.syncProgress(progress);
      const loaded = await cloudSync.loadProgress(progress.familyMemberId);
      
      expect(loaded).toBeDefined();
      expect(loaded?.familyMemberId).toBe(progress.familyMemberId);
    });
  });

  describe('Force Sync', () => {
    test('should force sync all pending changes', async () => {
      const structure: Structure = {
        id: 'test_structure',
        name: 'Test Structure',
        createdBy: 'test_member',
        createdAt: Date.now(),
        primitives: [],
        vertices: 0,
        edges: 0,
        isRigid: false,
        stabilityScore: 0,
        maxLoadBeforeFailure: 0,
      };

      await cloudSync.syncStructure(structure);
      const success = await cloudSync.forceSync();
      expect(success).toBe(true);
    });
  });
});
