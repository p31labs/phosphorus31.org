import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBus } from '../src/core';

describe('localStorage adapter', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists emitted values to localStorage', () => {
    const bus = createBus({ broadcast: false });
    bus.emit('p31:spoons', 8);
    expect(localStorage.getItem('p31:spoons')).toBe(JSON.stringify(8));
    bus.destroy();
  });

  it('loads initial values from localStorage on creation', () => {
    localStorage.setItem('p31:voltage', JSON.stringify(0.42));
    const bus = createBus({ broadcast: false });
    expect(bus.get('p31:voltage')).toBe(0.42);
    bus.destroy();
  });

  it('handles storage events from other tabs', () => {
    const bus = createBus({ broadcast: false });
    const listener = vi.fn();
    bus.on('p31:mode', listener);

    // Simulate storage event from another tab
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'p31:mode',
        newValue: JSON.stringify('red'),
      }),
    );

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'p31:mode', value: 'red', source: 'local' }),
    );
    expect(bus.get('p31:mode')).toBe('red');
    bus.destroy();
  });

  it('ignores storage events for non-p31 keys', () => {
    const bus = createBus({ broadcast: false });
    const listener = vi.fn();
    bus.on('other:key', listener);

    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'other:key',
        newValue: JSON.stringify('nope'),
      }),
    );

    // Should not fire because 'other:key' doesn't start with 'p31:'
    expect(listener).not.toHaveBeenCalled();
    bus.destroy();
  });

  it('round-trips complex objects', () => {
    const bus = createBus({ broadcast: false });
    const obj = { nested: { deep: [1, 2, 3] }, flag: true };
    bus.emit('p31:complex', obj);
    expect(bus.get('p31:complex')).toEqual(obj);
    expect(JSON.parse(localStorage.getItem('p31:complex')!)).toEqual(obj);
    bus.destroy();
  });
});
