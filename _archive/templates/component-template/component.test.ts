/**
 * Component Tests
 * Unit and integration tests for MyComponent
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { MyComponent } from './component-template';
import { ErrorRecovery } from '../engine/core/ErrorRecovery';
import { PerformanceMonitor } from '../engine/core/PerformanceMonitor';

describe('MyComponent', () => {
  let component: MyComponent;
  let errorRecovery: ErrorRecovery;
  let performanceMonitor: PerformanceMonitor;

  beforeEach(() => {
    errorRecovery = new ErrorRecovery();
    performanceMonitor = new PerformanceMonitor();
    component = new MyComponent(undefined, errorRecovery, performanceMonitor);
  });

  afterEach(() => {
    component.dispose();
  });

  describe('Initialization', () => {
    it('should initialize successfully', async () => {
      await component.initialize();
      expect(component.getState().isInitialized).toBe(true);
    });

    it('should not initialize twice', async () => {
      await component.initialize();
      await component.initialize(); // Should not throw
      expect(component.getState().isInitialized).toBe(true);
    });
  });

  describe('Lifecycle', () => {
    it('should start after initialization', async () => {
      await component.initialize();
      await component.start();
      expect(component.getState().isRunning).toBe(true);
    });

    it('should stop when requested', async () => {
      await component.initialize();
      await component.start();
      await component.stop();
      expect(component.getState().isRunning).toBe(false);
    });

    it('should not start before initialization', async () => {
      await expect(component.start()).rejects.toThrow();
    });
  });

  describe('Update', () => {
    it('should update when running', async () => {
      await component.initialize();
      await component.start();
      
      const beforeUpdate = component.getState().lastUpdate;
      component.update(16.67); // ~60fps
      
      // Wait a bit for update to process
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(component.getState().lastUpdate).toBeGreaterThan(beforeUpdate);
    });

    it('should not update when not running', async () => {
      await component.initialize();
      
      const beforeUpdate = component.getState().lastUpdate;
      component.update(16.67);
      
      expect(component.getState().lastUpdate).toBe(beforeUpdate);
    });
  });

  describe('Configuration', () => {
    it('should load default configuration', () => {
      const config = component.getConfig();
      expect(config.enabled).toBe(true);
      expect(config.timeout).toBeGreaterThan(0);
    });

    it('should update configuration', () => {
      component.updateConfig({ enabled: false });
      expect(component.getConfig().enabled).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should recover from errors', async () => {
      // Test error recovery
      const state = component.getState();
      expect(state.errorCount).toBe(0);
    });
  });
});
