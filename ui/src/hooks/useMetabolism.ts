/**
 * useMetabolism Hook
 * React hook for accessing metabolism/energy state from The Buffer
 *
 * Provides real-time energy/spoon tracking with automatic updates
 * and helper functions for energy management.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  API_ENDPOINTS,
  UPDATE_INTERVALS,
  PRIORITY_COSTS,
  REQUEST_TIMEOUTS,
} from '../utils/constants';

export type StressLevel = 'low' | 'medium' | 'high' | 'critical';
export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent';

export interface MetabolismState {
  currentSpoons: number;
  maxSpoons: number;
  stressLevel: StressLevel;
  recoveryRate: number;
  lastUpdate: string;
}

interface UseMetabolismOptions {
  updateInterval?: number;
  apiUrl?: string;
  enabled?: boolean;
}

interface UseMetabolismReturn {
  metabolism: MetabolismState | null;
  loading: boolean;
  error: Error | null;
  energyPercentage: number;
  isStressed: boolean;
  canProcess: (priority?: MessagePriority) => boolean;
  refetch: () => Promise<void>;
}

const DEFAULT_UPDATE_INTERVAL = UPDATE_INTERVALS.METABOLISM;
const DEFAULT_API_URL = `${API_ENDPOINTS.BUFFER.BASE}${API_ENDPOINTS.BUFFER.METABOLISM}`;

export function useMetabolism(options: UseMetabolismOptions = {}): UseMetabolismReturn {
  const {
    updateInterval = DEFAULT_UPDATE_INTERVAL,
    apiUrl = DEFAULT_API_URL,
    enabled = true,
  } = options;

  const [metabolism, setMetabolism] = useState<MetabolismState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetabolism = useCallback(async () => {
    if (!enabled) return;

    try {
      setError(null);
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUTS.DEFAULT),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Validate response structure
      if (!data || typeof data.currentSpoons !== 'number') {
        throw new Error('Invalid metabolism data received');
      }

      setMetabolism(data as MetabolismState);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch metabolism data');
      setError(error);
      console.error('[useMetabolism] Error fetching metabolism:', error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, enabled]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchMetabolism();

    // Set up polling interval
    const interval = setInterval(fetchMetabolism, updateInterval);

    return () => {
      clearInterval(interval);
    };
  }, [fetchMetabolism, updateInterval, enabled]);

  // Computed values
  const energyPercentage = useMemo(() => {
    if (!metabolism || metabolism.maxSpoons === 0) return 0;
    return Math.max(0, Math.min(100, (metabolism.currentSpoons / metabolism.maxSpoons) * 100));
  }, [metabolism]);

  const isStressed = useMemo(() => {
    if (!metabolism) return false;
    return metabolism.stressLevel === 'high' || metabolism.stressLevel === 'critical';
  }, [metabolism]);

  const canProcess = useCallback(
    (priority: MessagePriority = 'normal'): boolean => {
      if (!metabolism) return false;
      const cost = PRIORITY_COSTS[priority];
      return metabolism.currentSpoons >= cost;
    },
    [metabolism]
  );

  return {
    metabolism,
    loading,
    error,
    energyPercentage,
    isStressed,
    canProcess,
    refetch: fetchMetabolism,
  };
}
