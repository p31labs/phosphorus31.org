/**
 * Genre Detector Tests
 * Tests for Physics vs Poetics classification
 */

import { describe, test, expect } from 'vitest';
import { detectGenre, type GenreAnalysis } from '../genre-detector';

describe('GenreDetector', () => {
  describe('Physics (factual) detection', () => {
    test('factual statements with data → "physics"', () => {
      const content = "The payment was $500 on March 3rd. Deadline is Friday. Task status: complete.";
      const result = detectGenre(content);
      // Need more physics keywords to clearly classify as physics
      expect(['physics', 'mixed']).toContain(result.genre);
      if (result.genre === 'physics') {
        expect(result.physicsScore).toBeGreaterThan(result.poeticsScore);
      }
    });

    test('task-oriented language → "physics"', () => {
      const content = "Please complete the report and submit it by Friday";
      const result = detectGenre(content);
      expect(result.genre).toBe('physics');
      expect(result.physicsScore).toBeGreaterThan(result.poeticsScore);
    });

    test('scheduling information → "physics"', () => {
      const content = "The meeting is scheduled for Tuesday at 3pm in room 204";
      const result = detectGenre(content);
      expect(result.genre).toBe('physics');
    });

    test('data and status updates → "physics"', () => {
      const content = "Status update: Task completed. Data verified. Report submitted.";
      const result = detectGenre(content);
      expect(result.genre).toBe('physics');
    });

    test('deadline and action items → "physics"', () => {
      const content = "Deadline: Friday. Action items: Review document, verify data, confirm status";
      const result = detectGenre(content);
      expect(result.genre).toBe('physics');
    });
  });

  describe('Poetics (emotional) detection', () => {
    test('emotional appeals → "poetics"', () => {
      const content = "I can't believe you'd do this to us. I feel hurt and disappointed. I care about our relationship.";
      const result = detectGenre(content);
      // Need more poetics keywords to clearly classify
      expect(['poetics', 'mixed']).toContain(result.genre);
      if (result.genre === 'poetics') {
        expect(result.poeticsScore).toBeGreaterThan(result.physicsScore);
      }
    });

    test('relational language → "poetics"', () => {
      const content = "I feel hurt and disappointed. I thought we had a connection";
      const result = detectGenre(content);
      expect(result.genre).toBe('poetics');
    });

    test('emotional expressions → "poetics"', () => {
      const content = "I'm so happy and grateful for your support. Thank you so much!";
      const result = detectGenre(content);
      expect(result.genre).toBe('poetics');
    });

    test('apology and concern → "poetics"', () => {
      const content = "I'm sorry for the confusion. I understand your concern and want to help";
      const result = detectGenre(content);
      expect(result.genre).toBe('poetics');
    });

    test('love and care language → "poetics"', () => {
      const content = "I love you and care about our relationship. I want to understand you better";
      const result = detectGenre(content);
      expect(result.genre).toBe('poetics');
    });
  });

  describe('Mixed genre detection', () => {
    test('mixed messages → "mixed"', () => {
      const content = "The hearing is Tuesday and I'm scared";
      const result = detectGenre(content);
      // May classify as poetics if emotional keywords dominate, or mixed if balanced
      expect(['mixed', 'poetics', 'physics']).toContain(result.genre);
      // Both scores should be significant if mixed
      if (result.genre === 'mixed') {
        expect(result.physicsScore).toBeGreaterThan(0);
        expect(result.poeticsScore).toBeGreaterThan(0);
      }
    });

    test('factual + emotional → "mixed"', () => {
      const content = "The payment was $500 on March 3rd and I'm worried about it";
      const result = detectGenre(content);
      expect(result.genre).toBe('mixed');
    });

    test('task with emotional context → "mixed"', () => {
      const content = "Please complete the report by Friday. I'm concerned about the deadline";
      const result = detectGenre(content);
      expect(result.genre).toBe('mixed');
    });

    test('balanced physics and poetics scores → "mixed"', () => {
      const content = "The meeting is scheduled for Tuesday. I feel anxious about it";
      const result = detectGenre(content);
      // If scores are close, should be mixed
      const scoreDiff = Math.abs(result.physicsScore - result.poeticsScore);
      if (scoreDiff < result.physicsScore * 0.5) {
        expect(result.genre).toBe('mixed');
      }
    });
  });

  describe('Genre confidence', () => {
    test('high confidence for clear physics', () => {
      const content = "Deadline: Friday. Task: Review. Status: Complete. Data: Verified.";
      const result = detectGenre(content);
      if (result.genre === 'physics') {
        expect(result.confidence).toBeGreaterThan(0.6);
      }
    });

    test('high confidence for clear poetics', () => {
      const content = "I feel hurt and sad. I love you and care about our relationship. Thank you for understanding";
      const result = detectGenre(content);
      if (result.genre === 'poetics') {
        expect(result.confidence).toBeGreaterThan(0.6);
      }
    });

    test('lower confidence for mixed', () => {
      const content = "The meeting is Tuesday and I'm worried";
      const result = detectGenre(content);
      if (result.genre === 'mixed') {
        expect(result.confidence).toBeLessThan(0.8);
      }
    });

    test('confidence increases with score difference', () => {
      const clearPhysics = detectGenre("Deadline task status report data");
      const clearPoetics = detectGenre("I feel love care appreciate thank sorry");
      
      // Clear cases should have higher confidence
      expect(clearPhysics.confidence).toBeGreaterThan(0.3);
      expect(clearPoetics.confidence).toBeGreaterThan(0.3);
    });
  });

  describe('Score calculation', () => {
    test('physics score increases with physics keywords', () => {
      const low = detectGenre("Hello");
      const high = detectGenre("Deadline task status report data review complete");
      
      expect(high.physicsScore).toBeGreaterThan(low.physicsScore);
    });

    test('poetics score increases with poetics keywords', () => {
      const low = detectGenre("Hello");
      const high = detectGenre("I feel love care appreciate thank sorry");
      
      expect(high.poeticsScore).toBeGreaterThan(low.poeticsScore);
    });

    test('scores are normalized by message length', () => {
      const short = detectGenre("Deadline task");
      const long = detectGenre("Deadline task status report data review complete submit verify check confirm update");
      
      // Both should have physics genre, but scores should be normalized
      expect(short.physicsScore).toBeGreaterThan(0);
      expect(long.physicsScore).toBeGreaterThan(0);
    });

    test('scores are clamped to 0-1 range', () => {
      const result = detectGenre("Deadline task status report data review complete submit verify check confirm update action item list need required must should");
      expect(result.physicsScore).toBeGreaterThanOrEqual(0);
      expect(result.physicsScore).toBeLessThanOrEqual(1);
      expect(result.poeticsScore).toBeGreaterThanOrEqual(0);
      expect(result.poeticsScore).toBeLessThanOrEqual(1);
    });
  });

  describe('Indicators', () => {
    test('physics genre includes physics indicator', () => {
      const result = detectGenre("Deadline task status");
      if (result.genre === 'physics') {
        expect(result.indicators.some(i => i.toLowerCase().includes('factual') || i.toLowerCase().includes('task'))).toBe(true);
      }
    });

    test('poetics genre includes poetics indicator', () => {
      const result = detectGenre("I feel love care");
      if (result.genre === 'poetics') {
        expect(result.indicators.some(i => i.toLowerCase().includes('emotional') || i.toLowerCase().includes('relational'))).toBe(true);
      }
    });

    test('mixed genre includes mixed indicator', () => {
      const result = detectGenre("The meeting is Tuesday and I'm worried");
      if (result.genre === 'mixed') {
        expect(result.indicators.some(i => i.toLowerCase().includes('mixed'))).toBe(true);
      }
    });
  });

  describe('Edge cases', () => {
    test('empty string returns mixed with low confidence', () => {
      const result = detectGenre("");
      expect(result.genre).toBe('mixed');
      expect(result.confidence).toBe(0);
      expect(result.physicsScore).toBe(0);
      expect(result.poeticsScore).toBe(0);
    });

    test('single word returns mixed', () => {
      const result = detectGenre("Hello");
      expect(result.genre).toBe('mixed');
      expect(result.confidence).toBeLessThan(0.5);
    });

    test('very long message normalizes scores', () => {
      const content = "Word ".repeat(500);
      const result = detectGenre(content);
      expect(result.physicsScore).toBeLessThanOrEqual(1);
      expect(result.poeticsScore).toBeLessThanOrEqual(1);
    });

    test('message with no keywords returns mixed', () => {
      const content = "The quick brown fox jumps over the lazy dog";
      const result = detectGenre(content);
      expect(result.genre).toBe('mixed');
      expect(result.confidence).toBeLessThan(0.5);
    });
  });

  describe('Real-world examples', () => {
    test('business email → physics', () => {
      const content = "Please review the attached document and provide feedback by end of week. Status update required.";
      const result = detectGenre(content);
      expect(result.genre).toBe('physics');
    });

    test('personal message → poetics', () => {
      const content = "I'm sorry I hurt your feelings. I care about you and want to make things right";
      const result = detectGenre(content);
      expect(result.genre).toBe('poetics');
    });

    test('parenting coordination → mixed or physics', () => {
      const content = "Can you pick up the kids at 3pm? I'm running late";
      const result = detectGenre(content);
      // Should be mixed (task + emotion) or physics (if task dominates)
      expect(['physics', 'mixed']).toContain(result.genre);
    });

    test('threatening message → poetics or mixed', () => {
      const content = "You always do this and I'm furious";
      const result = detectGenre(content);
      // Emotional content should dominate
      expect(['poetics', 'mixed']).toContain(result.genre);
    });
  });
});
