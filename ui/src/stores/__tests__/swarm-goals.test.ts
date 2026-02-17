/**
 * Goal-directed swarm behavior — unit tests
 * Covers setGoal, goal types (repair, sierpinski, explore, build), and start/stop.
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { useSwarmStore } from '../swarm.store';

describe('SwarmStore goal-directed behavior', () => {
  beforeEach(() => {
    useSwarmStore.getState().clearAgents();
    useSwarmStore.getState().setGoal(null);
    useSwarmStore.getState().setRunning(false);
  });

  describe('setGoal', () => {
    test('initial goal is null', () => {
      expect(useSwarmStore.getState().goal).toBeNull();
    });

    test('setGoal(repair) sets goal type repair with optional priority', () => {
      useSwarmStore.getState().setGoal({ type: 'repair' });
      expect(useSwarmStore.getState().goal).toEqual({ type: 'repair' });
      useSwarmStore.getState().setGoal({ type: 'repair', priority: 10 });
      expect(useSwarmStore.getState().goal).toEqual({ type: 'repair', priority: 10 });
    });

    test('setGoal(sierpinski) sets depth', () => {
      useSwarmStore.getState().setGoal({ type: 'sierpinski', depth: 3 });
      expect(useSwarmStore.getState().goal).toEqual({ type: 'sierpinski', depth: 3 });
      useSwarmStore.getState().setGoal({ type: 'sierpinski', depth: 4 });
      expect(useSwarmStore.getState().goal).toEqual({ type: 'sierpinski', depth: 4 });
    });

    test('setGoal(explore) and setGoal(build)', () => {
      useSwarmStore.getState().setGoal({ type: 'explore' });
      expect(useSwarmStore.getState().goal).toEqual({ type: 'explore' });
      useSwarmStore.getState().setGoal({ type: 'build', shape: 'tetra' });
      expect(useSwarmStore.getState().goal).toEqual({ type: 'build', shape: 'tetra' });
    });

    test('setGoal(null) clears goal', () => {
      useSwarmStore.getState().setGoal({ type: 'repair' });
      useSwarmStore.getState().setGoal(null);
      expect(useSwarmStore.getState().goal).toBeNull();
    });
  });

  describe('run control', () => {
    test('setRunning(true/false) updates running', () => {
      expect(useSwarmStore.getState().running).toBe(false);
      useSwarmStore.getState().setRunning(true);
      expect(useSwarmStore.getState().running).toBe(true);
      useSwarmStore.getState().setRunning(false);
      expect(useSwarmStore.getState().running).toBe(false);
    });
  });

  describe('tick with goal (integration outline)', () => {
    test('tick does not throw when goal is repair and no agents', () => {
      useSwarmStore.getState().setGoal({ type: 'repair' });
      expect(() => useSwarmStore.getState().tick(0.016)).not.toThrow();
    });

    test('tick does not throw when goal is sierpinski and no agents', () => {
      useSwarmStore.getState().setGoal({ type: 'sierpinski', depth: 3 });
      expect(() => useSwarmStore.getState().tick(0.016)).not.toThrow();
    });
  });
});
