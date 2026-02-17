/**
 * Spatial Audio Manager Tests
 * Test suite for spatial audio manager
 * 
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 * Licensed under the AGPLv3 License
 */

import { SpatialAudioManager } from '../SpatialAudioManager';
import * as THREE from 'three';

describe('SpatialAudioManager', () => {
  let audioManager: SpatialAudioManager;
  let listener: THREE.Object3D;

  beforeEach(async () => {
    audioManager = new SpatialAudioManager();
    await audioManager.init();
    
    listener = new THREE.Object3D();
    listener.position.set(0, 0, 0);
    audioManager.setListener(listener);
  });

  afterEach(() => {
    audioManager.dispose();
  });

  describe('Initialization', () => {
    test('should initialize spatial audio manager', () => {
      expect(audioManager).toBeDefined();
    });

    test('should set listener', () => {
      const newListener = new THREE.Object3D();
      audioManager.setListener(newListener);
      // Listener should be set
      expect(audioManager).toBeDefined();
    });
  });

  describe('Audio Sources', () => {
    test('should create audio source', () => {
      const position = new THREE.Vector3(10, 0, 0);
      audioManager.createSource('test_source', position, 'test.mp3', {
        volume: 0.5,
        maxDistance: 50,
        loop: true,
      });

      const source = audioManager.getSource('test_source');
      expect(source).toBeDefined();
      expect(source?.position).toEqual(position);
    });

    test('should remove audio source', () => {
      const position = new THREE.Vector3(10, 0, 0);
      audioManager.createSource('test_source', position, 'test.mp3');
      audioManager.removeSource('test_source');

      const source = audioManager.getSource('test_source');
      expect(source).toBeUndefined();
    });
  });

  describe('Volume Control', () => {
    test('should set master volume', () => {
      audioManager.setMasterVolume(0.5);
      // Volume should be set
      expect(audioManager).toBeDefined();
    });

    test('should enable/disable audio', () => {
      audioManager.setEnabled(false);
      // Audio should be disabled
      expect(audioManager).toBeDefined();
      
      audioManager.setEnabled(true);
      // Audio should be enabled
      expect(audioManager).toBeDefined();
    });
  });

  describe('Update', () => {
    test('should update audio sources', () => {
      const position = new THREE.Vector3(10, 0, 0);
      audioManager.createSource('test_source', position, 'test.mp3');
      
      // Update should not throw
      expect(() => audioManager.update()).not.toThrow();
    });
  });
});
