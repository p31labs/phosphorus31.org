import { describe, it, expect, vi } from 'vitest';
import { createBus } from '../src/core';

describe('broadcast adapter', () => {
  it('creates bus with broadcast enabled without throwing', () => {
    const bus = createBus({ persist: false, broadcast: true });
    expect(bus).toBeDefined();
    expect(bus.snapshot()).toEqual({});
    bus.destroy();
  });

  it('emit still works when broadcast is enabled', () => {
    const bus = createBus({ persist: false, broadcast: true });
    const listener = vi.fn();
    bus.on('test', listener);
    bus.emit('test', 'hello');
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'test', value: 'hello' }),
    );
    bus.destroy();
  });

  it('bus functions with broadcast disabled', () => {
    const bus = createBus({ persist: false, broadcast: false });
    bus.emit('x', 1);
    expect(bus.get('x')).toBe(1);
    bus.destroy();
  });
});
