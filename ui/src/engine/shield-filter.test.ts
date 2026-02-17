import { describe, it, expect, vi, beforeEach } from 'vitest';
import { filterMessage } from './shield-filter';
import * as filterPatterns from './filter-patterns';
import * as voltageCalculator from './voltage-calculator';

// Mock dependencies
vi.mock('./filter-patterns', () => ({
  scanForThreats: vi.fn((content: string) => {
    if (content.includes('critical threat')) {
      return [{ pattern: { severity: 'critical', name: 'test' }, matches: [] }];
    }
    if (content.includes('high threat')) {
      return [{ pattern: { severity: 'high', name: 'test' }, matches: [] }];
    }
    return [];
  }),
  hasHighSeverityThreats: vi.fn((content: string) => content.includes('high threat')),
}));

vi.mock('./voltage-calculator', () => ({
  calculateVoltage: vi.fn((content: string) => {
    if (content.includes('very high voltage')) return { score: 9, level: 'high' };
    if (content.includes('high threat') && content.includes('high voltage')) return { score: 9, level: 'high' };
    if (content.includes('high voltage')) return { score: 7, level: 'high' };
    if (content.includes('medium voltage')) return { score: 5, level: 'medium' };
    return { score: 2, level: 'low' };
  }),
}));

vi.mock('./genre-detector', () => ({
  detectGenre: vi.fn(() => ({
    genre: 'neutral',
    confidence: 0.8,
    error: false,
  })),
}));

describe('ShieldFilter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns safe recommendation for low voltage messages', () => {
    const result = filterMessage('This is a normal message');
    expect(result.recommendation).toBe('safe');
    expect(result.shouldBlock).toBe(false);
    expect(result.shouldBuffer).toBe(false);
  });

  it('blocks messages with critical threats', () => {
    const result = filterMessage('This message contains critical threat patterns');
    expect(result.recommendation).toBe('block');
    expect(result.shouldBlock).toBe(true);
    expect(result.reason).toContain('Critical threat');
  });

  it('blocks high voltage messages with high severity threats', () => {
    // Force voltage >= 8 and high severity so implementation takes block branch (not sanitize)
    vi.mocked(voltageCalculator.calculateVoltage).mockReturnValueOnce({
      score: 9,
      category: 'high',
      factors: [],
    });
    vi.mocked(filterPatterns.hasHighSeverityThreats).mockReturnValueOnce(true);
    const result = filterMessage('message with high threat');
    expect(result.recommendation).toBe('block');
    expect(result.shouldBlock).toBe(true);
  });

  it('sanitizes high voltage messages', () => {
    const result = filterMessage('This is a very high voltage message');
    expect(result.recommendation).toBe('sanitize');
    expect(result.shouldBuffer).toBe(true);
    expect(result.reason).toContain('High voltage');
  });

  it('buffers medium voltage messages', () => {
    const result = filterMessage('This is a medium voltage message');
    expect(result.recommendation).toBe('buffer');
    expect(result.shouldBuffer).toBe(true);
    expect(result.reason).toContain('Medium voltage');
  });

  it('includes voltage in result', () => {
    const result = filterMessage('test message');
    expect(result.voltage).toBeDefined();
    expect(result.voltage.score).toBeDefined();
  });

  it('includes genre analysis in result', () => {
    const result = filterMessage('test message');
    expect(result.genre).toBeDefined();
    expect(result.genre.genre).toBeDefined();
  });

  it('includes threats in result', () => {
    const result = filterMessage('test message');
    expect(result.threats).toBeDefined();
    expect(Array.isArray(result.threats)).toBe(true);
  });

  it('handles metadata correctly', () => {
    const result = filterMessage('test message', {
      sender: 'test@example.com',
      source: 'email',
      timestamp: new Date(),
    });
    expect(result).toBeDefined();
  });

  it('provides reason for recommendation', () => {
    const result = filterMessage('test message');
    expect(result.reason).toBeDefined();
    expect(typeof result.reason).toBe('string');
  });

  it('handles empty message', () => {
    const result = filterMessage('');
    expect(result).toBeDefined();
    expect(result.recommendation).toBe('safe');
  });

  it('handles very long messages', () => {
    const longMessage = 'a'.repeat(10000);
    const result = filterMessage(longMessage);
    expect(result).toBeDefined();
    expect(result.voltage).toBeDefined();
  });
});
