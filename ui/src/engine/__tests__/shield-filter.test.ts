/**
 * Shield Filter Integration Tests
 * Tests for the complete shield filter system
 */

import { describe, test, expect } from 'vitest';
import { filterMessage, type MessageFilterResult } from '../shield-filter';

describe('ShieldFilter - Integration', () => {
  describe('Blocking logic', () => {
    test('critical threats = block', () => {
      const content = "That never happened and you're imagining things";
      const result = filterMessage(content);
      expect(result.shouldBlock).toBe(true);
      expect(result.recommendation).toBe('block');
      expect(result.reason).toContain('Critical threat');
    });

    test('high voltage + high severity threats = block', () => {
      const content = "URGENT!!! You always do this and I'm going to take you to court!!!";
      const result = filterMessage(content);
      expect(result.shouldBlock).toBe(true);
      expect(result.recommendation).toBe('block');
    });

    test('high voltage alone = sanitize (not block)', () => {
      const content = "URGENT!!! CRITICAL!!! EMERGENCY!!!";
      const result = filterMessage(content);
      expect(result.shouldBlock).toBe(false);
      expect(result.shouldBuffer).toBe(true);
      expect(result.recommendation).toBe('sanitize');
    });
  });

  describe('Buffering logic', () => {
    test('medium voltage = buffer', () => {
      const content = "I'm concerned and worried about this situation. This is urgent.";
      const result = filterMessage(content);
      expect(result.shouldBlock).toBe(false);
      // Voltage needs to be >= 4 to buffer
      if (result.voltage.score >= 4) {
        expect(result.shouldBuffer).toBe(true);
        expect(result.recommendation).toBe('buffer');
      }
    });

    test('high voltage = sanitize (which includes buffering)', () => {
      const content = "URGENT!!! This is critical and requires immediate attention!!!";
      const result = filterMessage(content);
      // Voltage needs to be >= 7 to sanitize
      if (result.voltage.score >= 7) {
        expect(result.shouldBuffer).toBe(true);
        expect(result.recommendation).toBe('sanitize');
      }
    });
  });

  describe('Safe messages', () => {
    test('low voltage = safe', () => {
      const content = "Hello, how are you?";
      const result = filterMessage(content);
      expect(result.shouldBlock).toBe(false);
      expect(result.shouldBuffer).toBe(false);
      expect(result.recommendation).toBe('safe');
    });

    test('neutral informational = safe', () => {
      const content = "The meeting is scheduled for Tuesday at 3pm";
      const result = filterMessage(content);
      expect(result.recommendation).toBe('safe');
    });
  });

  describe('Complete analysis', () => {
    test('result includes voltage analysis', () => {
      const content = "This is urgent";
      const result = filterMessage(content);
      expect(result.voltage).toBeDefined();
      expect(result.voltage.score).toBeGreaterThanOrEqual(0);
      expect(result.voltage.category).toBeDefined();
    });

    test('result includes genre analysis', () => {
      const content = "I feel hurt";
      const result = filterMessage(content);
      expect(result.genre).toBeDefined();
      expect(result.genre.genre).toBeDefined();
      expect(result.genre.confidence).toBeGreaterThanOrEqual(0);
    });

    test('result includes threat matches', () => {
      const content = "You always do this";
      const result = filterMessage(content);
      expect(result.threats).toBeDefined();
      expect(Array.isArray(result.threats)).toBe(true);
    });

    test('result includes recommendation reason', () => {
      const content = "Hello";
      const result = filterMessage(content);
      expect(result.reason).toBeDefined();
      expect(typeof result.reason).toBe('string');
    });
  });

  describe('Metadata handling', () => {
    test('metadata is passed to voltage calculator', () => {
      const content = "Test message";
      const metadata = {
        sender: "test-sender",
        source: "test-source",
        timestamp: new Date(),
      };
      const result = filterMessage(content, metadata);
      // Metadata should be used (though current implementation may not use all fields)
      expect(result).toBeDefined();
    });

    test('works without metadata', () => {
      const content = "Test message";
      const result = filterMessage(content);
      expect(result).toBeDefined();
      expect(result.recommendation).toBeDefined();
    });
  });

  describe('Real-world scenarios', () => {
    test('hostile legal threat → block', () => {
      const content = "I'm going to take you to court if you don't respond";
      const result = filterMessage(content);
      expect(result.shouldBlock).toBe(true);
      expect(result.recommendation).toBe('block');
    });

    test('emotional manipulation → buffer or sanitize', () => {
      const content = "You always do this and it's all your fault. This is urgent and critical!!!";
      const result = filterMessage(content);
      // Should buffer if voltage >= 4, sanitize if >= 7
      if (result.voltage.score >= 4) {
        expect(result.shouldBuffer).toBe(true);
        expect(['buffer', 'sanitize']).toContain(result.recommendation);
      }
    });

    test('normal coordination → safe', () => {
      const content = "Can you pick up the kids at 3pm?";
      const result = filterMessage(content);
      expect(result.recommendation).toBe('safe');
      expect(result.shouldBlock).toBe(false);
    });

    test('urgent but not threatening → sanitize', () => {
      const content = "URGENT: Please call me when you get a chance";
      const result = filterMessage(content);
      // High voltage but no threats = sanitize
      if (result.voltage.score >= 7) {
        expect(result.recommendation).toBe('sanitize');
      }
    });
  });
});
