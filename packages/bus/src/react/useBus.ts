/**
 * React hook for @p31labs/bus
 *
 * Usage:
 *   import { useBus } from '@p31labs/bus/react';
 *   const spoons = useBus<number>('p31:spoons') ?? 12;
 */

import { useEffect, useState } from 'react';
import type { Bus } from '../index';
import { createBus } from '../core';

// Singleton bus for React apps
let globalBus: Bus | null = null;
function getBus(): Bus {
  if (!globalBus) {
    globalBus = createBus();
  }
  return globalBus;
}

/**
 * Subscribe to a bus key. Returns current value, updates on change.
 * Uses the global singleton bus instance.
 */
export function useBus<T>(key: string): T | null {
  const bus = getBus();
  const [value, setValue] = useState<T | null>(() => bus.get<T>(key));

  useEffect(() => {
    // Re-read in case it changed between render and effect
    setValue(bus.get<T>(key));

    const unsubscribe = bus.on<T>(key, (event) => {
      setValue(event.value);
    });
    return unsubscribe;
  }, [key]);

  return value;
}

/**
 * Create a useBus hook bound to a specific bus instance.
 * Use when you need a non-singleton bus (testing, multiple buses).
 */
export function createUseBus(bus: Bus) {
  return function useCustomBus<T>(key: string): T | null {
    const [value, setValue] = useState<T | null>(() => bus.get<T>(key));

    useEffect(() => {
      setValue(bus.get<T>(key));
      const unsubscribe = bus.on<T>(key, (event) => {
        setValue(event.value);
      });
      return unsubscribe;
    }, [key]);

    return value;
  };
}
