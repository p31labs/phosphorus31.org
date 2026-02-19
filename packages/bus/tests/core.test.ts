import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBus } from '../src/core';

describe('bus core', () => {
  it('emit notifies listeners', () => {
    const bus = createBus({ persist: false, broadcast: false });
    const listener = vi.fn();
    bus.on('test', listener);
    bus.emit('test', 42);
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'test', value: 42, source: 'local' }),
    );
    bus.destroy();
  });

  it('get returns latest emitted value', () => {
    const bus = createBus({ persist: false, broadcast: false });
    expect(bus.get('x')).toBeNull();
    bus.emit('x', 'hello');
    expect(bus.get('x')).toBe('hello');
    bus.emit('x', 'world');
    expect(bus.get('x')).toBe('world');
    bus.destroy();
  });

  it('unsubscribe stops notifications', () => {
    const bus = createBus({ persist: false, broadcast: false });
    const listener = vi.fn();
    const unsub = bus.on('test', listener);
    unsub();
    bus.emit('test', 99);
    expect(listener).not.toHaveBeenCalled();
    bus.destroy();
  });

  it('multiple listeners on same key', () => {
    const bus = createBus({ persist: false, broadcast: false });
    const a = vi.fn();
    const b = vi.fn();
    bus.on('k', a);
    bus.on('k', b);
    bus.emit('k', 1);
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
    bus.destroy();
  });

  it('snapshot returns all keys', () => {
    const bus = createBus({ persist: false, broadcast: false });
    bus.emit('a', 1);
    bus.emit('b', 'two');
    bus.emit('c', { nested: true });
    const snap = bus.snapshot();
    expect(snap).toEqual({ a: 1, b: 'two', c: { nested: true } });
    bus.destroy();
  });

  it('destroy clears store and listeners', () => {
    const bus = createBus({ persist: false, broadcast: false });
    const listener = vi.fn();
    bus.on('x', listener);
    bus.emit('x', 1);
    bus.destroy();
    expect(bus.get('x')).toBeNull();
    expect(bus.snapshot()).toEqual({});
  });

  it('event has timestamp', () => {
    const bus = createBus({ persist: false, broadcast: false });
    const listener = vi.fn();
    const before = Date.now();
    bus.on('t', listener);
    bus.emit('t', true);
    const after = Date.now();
    const event = listener.mock.calls[0][0];
    expect(event.timestamp).toBeGreaterThanOrEqual(before);
    expect(event.timestamp).toBeLessThanOrEqual(after);
    bus.destroy();
  });

  it('listeners on different keys are independent', () => {
    const bus = createBus({ persist: false, broadcast: false });
    const listenerA = vi.fn();
    const listenerB = vi.fn();
    bus.on('a', listenerA);
    bus.on('b', listenerB);
    bus.emit('a', 1);
    expect(listenerA).toHaveBeenCalledTimes(1);
    expect(listenerB).not.toHaveBeenCalled();
    bus.destroy();
  });
});
