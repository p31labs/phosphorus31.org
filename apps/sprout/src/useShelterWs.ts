import { useEffect, useRef, useState } from 'react'

const DEFAULT_WS_URL = 'ws://localhost:4000/ws'
const WS_URL = typeof import.meta !== 'undefined' && import.meta.env?.VITE_WS_URL
  ? String(import.meta.env.VITE_WS_URL)
  : DEFAULT_WS_URL

const INITIAL_RECONNECT_MS = 1000
const MAX_RECONNECT_MS = 30000
const PING_INTERVAL_MS = 25000
const PONG_TIMEOUT_MS = 5000
const MAX_QUEUE = 10

export type ConnectionStatus = 'connected' | 'reconnecting' | 'disconnected'

export function useShelterWs(onMessage?: (event: MessageEvent) => void) {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected')
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pongTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectAttemptRef = useRef(0)
  const onMessageRef = useRef(onMessage)
  const queueRef = useRef<string[]>([])
  onMessageRef.current = onMessage

  const clearPongTimeout = () => {
    if (pongTimeoutRef.current) {
      clearTimeout(pongTimeoutRef.current)
      pongTimeoutRef.current = null
    }
  }

  const schedulePongTimeout = () => {
    clearPongTimeout()
    pongTimeoutRef.current = setTimeout(() => {
      wsRef.current?.close()
    }, PONG_TIMEOUT_MS)
  }

  const flushQueue = () => {
    const ws = wsRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) return
    while (queueRef.current.length > 0) {
      const payload = queueRef.current.shift()
      if (payload) ws.send(payload)
    }
  }

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return
    try {
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        reconnectAttemptRef.current = 0
        setStatus('connected')
        flushQueue()
        schedulePongTimeout()
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current)
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }))
            schedulePongTimeout()
          }
        }, PING_INTERVAL_MS)
      }

      ws.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data as string) as { type?: string }
          if (data.type === 'pong') {
            clearPongTimeout()
          }
        } catch {
          // not JSON, ignore
        }
        onMessageRef.current?.(event)
      }

      ws.onclose = () => {
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current)
          pingIntervalRef.current = null
        }
        clearPongTimeout()
        wsRef.current = null
        setStatus('reconnecting')
        const delay = Math.min(
          INITIAL_RECONNECT_MS * 2 ** reconnectAttemptRef.current,
          MAX_RECONNECT_MS
        )
        reconnectAttemptRef.current += 1
        reconnectTimeoutRef.current = setTimeout(connect, delay)
      }

      ws.onerror = () => {
        // Rely on onclose for reconnect; no "error" in UI
      }
    } catch {
      setStatus('reconnecting')
      const delay = Math.min(
        INITIAL_RECONNECT_MS * 2 ** reconnectAttemptRef.current,
        MAX_RECONNECT_MS
      )
      reconnectAttemptRef.current += 1
      reconnectTimeoutRef.current = setTimeout(connect, delay)
    }
  }

  useEffect(() => {
    connect()
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current)
      clearPongTimeout()
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [])

  const send = (payload: object) => {
    const str = JSON.stringify(payload)
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(str)
    } else {
      if (queueRef.current.length < MAX_QUEUE) {
        queueRef.current.push(str)
      }
    }
  }

  return { status, send }
}
