/**
 * useBufferWebSocket — Live updates when P31 Shelter pushes triage/history events.
 * Connects to Shelter WS (wsUrl from VITE_SHELTER_URL / VITE_BUFFER_URL), calls onInvalidate
 * on any message so Scope can refetch Tasks without manual Refresh.
 */

import { useEffect, useRef, useState, useCallback } from 'react';

const WS_PATH = '/ws';
const RECONNECT_BASE_MS = 2000;
const RECONNECT_MAX_MS = 30000;

function getBufferWsUrl(): string | null {
  const base =
    import.meta.env.VITE_SHELTER_URL ||
    import.meta.env.VITE_BUFFER_URL ||
    'http://localhost:4000';
  if (typeof base !== 'string' || !base.trim()) return null;
  const url = base.replace(/^http/, 'ws').replace(/\/$/, '') + WS_PATH;
  return url;
}

export interface UseBufferWebSocketOptions {
  /** Called when the backend signals that history/triage changed. */
  onInvalidate: () => void;
  /** If false, do not connect (e.g. when tab hidden). Default true. */
  enabled?: boolean;
}

export interface UseBufferWebSocketResult {
  wsConnected: boolean;
}

export function useBufferWebSocket({
  onInvalidate,
  enabled = true,
}: UseBufferWebSocketOptions): UseBufferWebSocketResult {
  const [wsConnected, setWsConnected] = useState(false);
  const onInvalidateRef = useRef(onInvalidate);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptRef = useRef(0);

  onInvalidateRef.current = onInvalidate;

  const connect = useCallback(() => {
    const url = getBufferWsUrl();
    if (!url || !enabled) {
      setWsConnected(false);
      return () => {};
    }

    let ws: WebSocket | null = null;
    let closed = false;

    const cleanup = () => {
      closed = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (ws) {
        ws.onclose = null;
        ws.onerror = null;
        ws.onmessage = null;
        ws.onopen = null;
        try {
          ws.close();
        } catch {
          // ignore
        }
        ws = null;
      }
      setWsConnected(false);
    };

    try {
      ws = new WebSocket(url);
    } catch {
      setWsConnected(false);
      return cleanup;
    }

    ws.onopen = () => {
      if (closed) return;
      setWsConnected(true);
      reconnectAttemptRef.current = 0;
    };

    ws.onmessage = () => {
      if (closed) return;
      onInvalidateRef.current();
    };

    ws.onclose = () => {
      if (closed) return;
      setWsConnected(false);
      const delay = Math.min(
        RECONNECT_BASE_MS * 2 ** reconnectAttemptRef.current,
        RECONNECT_MAX_MS
      );
      reconnectAttemptRef.current += 1;
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectTimeoutRef.current = null;
        connect();
      }, delay);
    };

    ws.onerror = () => {
      // onclose will run and trigger reconnect
    };

    return cleanup;
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setWsConnected(false);
      return () => {};
    }
    return connect();
  }, [connect, enabled]);

  return { wsConnected };
}
