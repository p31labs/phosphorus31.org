import { describe, it, expect } from 'vitest';
import { BUS_KEYS } from '../src/keys';

describe('BUS_KEYS', () => {
  it('all keys start with p31:', () => {
    Object.values(BUS_KEYS).forEach((key) => {
      expect(key.startsWith('p31:')).toBe(true);
    });
  });

  it('all keys are unique', () => {
    const values = Object.values(BUS_KEYS);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
  });

  it('has expected minimum key count', () => {
    const count = Object.keys(BUS_KEYS).length;
    expect(count).toBeGreaterThanOrEqual(15);
  });

  it('keys are readonly strings', () => {
    Object.values(BUS_KEYS).forEach((key) => {
      expect(typeof key).toBe('string');
    });
  });
});
