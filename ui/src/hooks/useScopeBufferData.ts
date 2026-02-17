/**
 * useScopeBufferData — Live Buffer data for Scope Tasks and Health
 * Fetches message history and accommodation log status when P31 Shelter backend is available.
 * No kid data; Tasks show triage (voltage 0–10) and accommodation log blurb.
 */

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { bufferService } from '../services/buffer.service';
import type { HistoryMessage } from '../services/buffer.service';

export interface ScopeBufferData {
  connected: boolean;
  messages: HistoryMessage[];
  accommodationLogAvailable: boolean;
  accommodationLogError?: string;
  /** User-facing: never "Error" or "Failed". Use connectionInterrupted for banner. */
  error: string | null;
  /** True when we had data and a fetch then failed (show banner, keep last data). */
  connectionInterrupted: boolean;
  loading: boolean;
  refetch: () => Promise<void>;
}

/** Start of today in local time (YYYY-MM-DD) for history filter */
function todayStart(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10) + 'T00:00:00.000Z';
}

/** End of today (start of next day) */
function todayEnd(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10) + 'T00:00:00.000Z';
}

export function useScopeBufferData(): ScopeBufferData {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<HistoryMessage[]>([]);
  const [accommodationLogAvailable, setAccommodationLogAvailable] = useState(false);
  const [accommodationLogError, setAccommodationLogError] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [connectionInterrupted, setConnectionInterrupted] = useState(false);
  const [loading, setLoading] = useState(true);
  const hasHadSuccessfulLoad = useRef(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const ok = await bufferService.healthCheck();
      setConnected(ok);
      if (ok) {
        setConnectionInterrupted(false);
      }
      if (!ok) {
        setAccommodationLogAvailable(false);
        setAccommodationLogError(undefined);
        setLoading(false);
        return;
      }

      const [historyRes, logRes] = await Promise.all([
        bufferService.getHistory({
          startDate: todayStart(),
          endDate: todayEnd(),
          limit: 50,
          page: 1,
        }),
        bufferService.getAccommodationLog(),
      ]);

      setMessages(historyRes.messages ?? []);
      setAccommodationLogAvailable(logRes.available);
      setAccommodationLogError(logRes.error);
      setConnectionInterrupted(false);
      hasHadSuccessfulLoad.current = true;
    } catch {
      setConnected(false);
      if (hasHadSuccessfulLoad.current) {
        setConnectionInterrupted(true);
        /* Keep last known messages and log state; banner shows Retrying... */
      } else {
        setMessages([]);
        setAccommodationLogAvailable(false);
      }
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Auto-retry when connection interrupted so banner auto-dismisses when restored
  useEffect(() => {
    if (!connectionInterrupted) return;
    const id = setInterval(refetch, 5000);
    return () => clearInterval(id);
  }, [connectionInterrupted, refetch]);

  return useMemo(
    () => ({
      connected,
      messages,
      accommodationLogAvailable,
      accommodationLogError,
      error,
      connectionInterrupted,
      loading,
      refetch,
    }),
    [
      connected,
      messages,
      accommodationLogAvailable,
      accommodationLogError,
      error,
      connectionInterrupted,
      loading,
      refetch,
    ]
  );
}
