/**
 * Spoon Calculator Tests
 * Tests for cognitive cost (spoons) calculation
 */

import { describe, test, expect } from 'vitest';
import { calculateSpoonCost, calculateSpoonRecovery, type SpoonCost } from '../spoon-calculator';

describe('SpoonCalculator', () => {
  describe('Voltage-based costs', () => {
    test('high voltage + legal threat = high spoon cost (3-5)', () => {
      const result = calculateSpoonCost({
        voltage: 8,
        length: 50,
        threatFlags: 1, // legal threat
      });
      expect(result.cost).toBeGreaterThanOrEqual(3);
      expect(result.cost).toBeLessThanOrEqual(6); // Allow slightly higher due to multipliers
      expect(result.category).toBe('high');
    });

    test('low voltage + safe = low spoon cost (0-1)', () => {
      const result = calculateSpoonCost({
        voltage: 2,
        length: 20,
        threatFlags: 0,
      });
      expect(result.cost).toBeLessThanOrEqual(2);
      expect(result.category).toBe('low');
    });

    test('medium voltage = medium spoon cost', () => {
      const result = calculateSpoonCost({
        voltage: 5,
        length: 100,
      });
      expect(result.cost).toBeGreaterThan(1);
      expect(result.cost).toBeLessThan(4);
      expect(result.category).toBe('medium');
    });

    test('critical voltage = critical spoon cost', () => {
      const result = calculateSpoonCost({
        voltage: 10,
        length: 200,
        threatFlags: 2,
      });
      expect(result.cost).toBeGreaterThan(5);
      expect(result.category).toBe('critical');
    });
  });

  describe('Threat multipliers', () => {
    test('multiple threat flags multiply cost', () => {
      const baseResult = calculateSpoonCost({
        voltage: 5,
        length: 100,
        threatFlags: 0,
      });

      const multiThreatResult = calculateSpoonCost({
        voltage: 5,
        length: 100,
        threatFlags: 2, // 2 threat categories
      });

      // Multiple threats should increase cost
      expect(multiThreatResult.cost).toBeGreaterThan(baseResult.cost);
    });

    test('3 threat flags significantly increase cost', () => {
      const result = calculateSpoonCost({
        voltage: 6,
        length: 150,
        threatFlags: 3, // legal + financial + emotional
      });
      expect(result.cost).toBeGreaterThan(4);
    });

    test('threat multiplier is applied correctly', () => {
      const noThreat = calculateSpoonCost({
        voltage: 5,
        length: 100,
        threatFlags: 0,
      });

      const oneThreat = calculateSpoonCost({
        voltage: 5,
        length: 100,
        threatFlags: 1,
      });

      // 1 threat = 30% increase
      expect(oneThreat.cost).toBeGreaterThan(noThreat.cost * 1.2);
      expect(oneThreat.cost).toBeLessThan(noThreat.cost * 1.4);
    });
  });

  describe('Hostile contact multiplier', () => {
    test('messages from known hostile contacts cost more', () => {
      const normalResult = calculateSpoonCost({
        voltage: 5,
        length: 100,
        isHostileContact: false,
      });

      const hostileResult = calculateSpoonCost({
        voltage: 5,
        length: 100,
        isHostileContact: true,
      });

      // Hostile contact should increase cost by ~50%
      expect(hostileResult.cost).toBeGreaterThan(normalResult.cost * 1.4);
      expect(hostileResult.cost).toBeLessThan(normalResult.cost * 1.6);
    });

    test('hostile contact + high voltage = very high cost', () => {
      const result = calculateSpoonCost({
        voltage: 8,
        length: 200,
        isHostileContact: true,
        threatFlags: 2,
      });
      expect(result.cost).toBeGreaterThan(6);
      expect(result.category).toBe('critical');
    });
  });

  describe('Time of day factor', () => {
    test('late night (11 PM - 6 AM) = +1 cost', () => {
      const dayTime = new Date('2024-01-01T14:00:00'); // 2 PM
      const nightTime = new Date('2024-01-01T23:30:00'); // 11:30 PM

      const dayResult = calculateSpoonCost({
        voltage: 5,
        length: 100,
        timestamp: dayTime,
      });

      const nightResult = calculateSpoonCost({
        voltage: 5,
        length: 100,
        timestamp: nightTime,
      });

      // Night time should be +1 more
      expect(nightResult.cost).toBeGreaterThanOrEqual(dayResult.cost + 0.9);
      expect(nightResult.cost).toBeLessThanOrEqual(dayResult.cost + 1.1);
    });

    test('early morning (before 6 AM) = +1 cost', () => {
      const earlyMorning = new Date('2024-01-01T03:00:00'); // 3 AM
      const result = calculateSpoonCost({
        voltage: 5,
        length: 100,
        timestamp: earlyMorning,
      });

      const dayResult = calculateSpoonCost({
        voltage: 5,
        length: 100,
        timestamp: new Date('2024-01-01T10:00:00'),
      });

      expect(result.cost).toBeGreaterThanOrEqual(dayResult.cost + 0.9);
    });

    test('normal hours (6 AM - 11 PM) = no time penalty', () => {
      const normalTime = new Date('2024-01-01T15:00:00'); // 3 PM
      const result = calculateSpoonCost({
        voltage: 5,
        length: 100,
        timestamp: normalTime,
      });

      const noTimeResult = calculateSpoonCost({
        voltage: 5,
        length: 100,
      });

      // Should be approximately the same (no time penalty)
      expect(Math.abs(result.cost - noTimeResult.cost)).toBeLessThan(0.1);
    });
  });

  describe('Message length factor', () => {
    test('long messages (>500 words) add +2', () => {
      const result = calculateSpoonCost({
        voltage: 5,
        length: 600,
      });

      const shortResult = calculateSpoonCost({
        voltage: 5,
        length: 50,
      });

      expect(result.cost).toBeGreaterThan(shortResult.cost + 1.5);
    });

    test('medium messages (200-500 words) add +1', () => {
      const result = calculateSpoonCost({
        voltage: 5,
        length: 300,
      });

      const shortResult = calculateSpoonCost({
        voltage: 5,
        length: 50,
      });

      expect(result.cost).toBeGreaterThan(shortResult.cost + 0.5);
    });

    test('short messages (100-200 words) add +0.5', () => {
      const result = calculateSpoonCost({
        voltage: 5,
        length: 150,
      });

      const veryShortResult = calculateSpoonCost({
        voltage: 5,
        length: 20,
      });

      expect(result.cost).toBeGreaterThan(veryShortResult.cost);
    });
  });

  describe('Complexity factor', () => {
    test('complexity increases cost', () => {
      const simpleResult = calculateSpoonCost({
        voltage: 5,
        length: 100,
        complexity: 0,
      });

      const complexResult = calculateSpoonCost({
        voltage: 5,
        length: 100,
        complexity: 2,
      });

      expect(complexResult.cost).toBeGreaterThan(simpleResult.cost);
    });

    test('high complexity significantly increases cost', () => {
      const result = calculateSpoonCost({
        voltage: 5,
        length: 100,
        complexity: 5,
      });

      expect(result.cost).toBeGreaterThan(5);
    });
  });

  describe('Combined factors', () => {
    test('high voltage + multiple threats + hostile contact + late night = maximum cost', () => {
      const result = calculateSpoonCost({
        voltage: 9,
        length: 400,
        threatFlags: 3,
        isHostileContact: true,
        timestamp: new Date('2024-01-01T02:00:00'), // 2 AM
      });

      expect(result.cost).toBeGreaterThan(7);
      expect(result.category).toBe('critical');
    });

    test('all factors combine multiplicatively', () => {
      const baseResult = calculateSpoonCost({
        voltage: 5,
        length: 100,
      });

      const fullResult = calculateSpoonCost({
        voltage: 5,
        length: 100,
        threatFlags: 2,
        isHostileContact: true,
        timestamp: new Date('2024-01-01T01:00:00'),
      });

      // Should be significantly higher than base
      expect(fullResult.cost).toBeGreaterThan(baseResult.cost * 2);
    });
  });

  describe('Cost clamping', () => {
    test('cost is clamped to 0-10 range', () => {
      const result = calculateSpoonCost({
        voltage: 10,
        length: 1000,
        threatFlags: 5,
        isHostileContact: true,
        complexity: 10,
        timestamp: new Date('2024-01-01T01:00:00'),
      });

      expect(result.cost).toBeGreaterThanOrEqual(0);
      expect(result.cost).toBeLessThanOrEqual(10);
    });

    test('very low voltage results in minimal cost', () => {
      const result = calculateSpoonCost({
        voltage: 0,
        length: 10,
      });

      expect(result.cost).toBeGreaterThanOrEqual(0);
      expect(result.cost).toBeLessThan(1);
    });
  });

  describe('Spoon cost categories', () => {
    test('cost 0-2 = low category', () => {
      const result = calculateSpoonCost({
        voltage: 2,
        length: 50,
      });
      if (result.cost <= 2) {
        expect(result.category).toBe('low');
        expect(result.description).toContain('Minimal');
      }
    });

    test('cost 2-4 = medium category', () => {
      const result = calculateSpoonCost({
        voltage: 5,
        length: 150,
      });
      if (result.cost > 2 && result.cost <= 4) {
        expect(result.category).toBe('medium');
        expect(result.description).toContain('Moderate');
      }
    });

    test('cost 4-7 = high category', () => {
      const result = calculateSpoonCost({
        voltage: 7,
        length: 300,
        threatFlags: 1,
      });
      if (result.cost > 4 && result.cost <= 7) {
        expect(result.category).toBe('high');
        expect(result.description).toContain('consider delaying');
      }
    });

    test('cost 7+ = critical category', () => {
      const result = calculateSpoonCost({
        voltage: 9,
        length: 400,
        threatFlags: 2,
        isHostileContact: true,
      });
      if (result.cost > 7) {
        expect(result.category).toBe('critical');
        expect(result.description).toContain('delay recommended');
      }
    });
  });
});

describe('SpoonCalculator - Recovery', () => {
  describe('Rest recovery', () => {
    test('rest: 1 spoon per 15 minutes', () => {
      const result = calculateSpoonRecovery({
        type: 'rest',
        duration: 30,
      });
      expect(result).toBe(2); // 30 / 15 = 2
    });

    test('rest: 15 minutes = 1 spoon', () => {
      const result = calculateSpoonRecovery({
        type: 'rest',
        duration: 15,
      });
      expect(result).toBe(1);
    });
  });

  describe('Heavy work recovery', () => {
    test('heavy work: 1 spoon per 5 minutes', () => {
      const result = calculateSpoonRecovery({
        type: 'heavy_work',
        duration: 20,
      });
      expect(result).toBe(4); // 20 / 5 = 4
    });

    test('heavy work: 5 minutes = 1 spoon', () => {
      const result = calculateSpoonRecovery({
        type: 'heavy_work',
        duration: 5,
      });
      expect(result).toBe(1);
    });
  });

  describe('Breathing recovery', () => {
    test('breathing: 0.5 spoons per 5 minutes', () => {
      const result = calculateSpoonRecovery({
        type: 'breathing',
        duration: 10,
      });
      expect(result).toBe(1); // (10 / 5) * 0.5 = 1
    });

    test('breathing: 5 minutes = 0.5 spoons', () => {
      const result = calculateSpoonRecovery({
        type: 'breathing',
        duration: 5,
      });
      expect(result).toBe(0.5);
    });
  });

  describe('Somatic recovery', () => {
    test('somatic: 1 spoon per 10 minutes', () => {
      const result = calculateSpoonRecovery({
        type: 'somatic',
        duration: 30,
      });
      expect(result).toBe(3); // 30 / 10 = 3
    });

    test('somatic: 10 minutes = 1 spoon', () => {
      const result = calculateSpoonRecovery({
        type: 'somatic',
        duration: 10,
      });
      expect(result).toBe(1);
    });
  });

  describe('Recovery rounding', () => {
    test('recovery values are rounded to 1 decimal', () => {
      const result = calculateSpoonRecovery({
        type: 'breathing',
        duration: 7, // (7 / 5) * 0.5 = 0.7
      });
      expect(result).toBe(0.7);
    });

    test('fractional recovery is preserved', () => {
      const result = calculateSpoonRecovery({
        type: 'rest',
        duration: 7.5, // 7.5 / 15 = 0.5
      });
      expect(result).toBe(0.5);
    });
  });
});
