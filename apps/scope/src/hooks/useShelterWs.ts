import { useEffect, useRef, useCallback } from 'react'
import { getShelterWsUrl } from '../api/shelter'
import { useSignalStore } from '../stores/useSignalStore'
import { useMessageStore } from '../stores/useMessageStore'
import { useVoltageStore } from '../stores/useVoltageStore'
import { useScopeStore } from '../stores/useScopeStore'
import type { VoltageLevel } from '../constants'
import type { HistoryMessage } from '../types'

const RECONNECT_BASE = 1000
const RECONNECT_MAX = 30000

export function useShelterWs(): void {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectAttempt = useRef(0)

  const addSignal = useSignalStore((s) => s.addSignal)
  const setVoltage = useVoltageStore((s) => s.setVoltage)
  const prependMessage = useMessageStore((s) => s.prependMessage)
  const updateMessage = useMessageStore((s) => s.updateMessage)
  const setConnectionStatus = useScopeStore((s) => s.setConnectionStatus)
  const setScopeSubscribed = useScopeStore((s) => s.setScopeSubscribed)
  const setSendToShelter = useScopeStore((s) => s.setSendToShelter)

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return
    const url = getShelterWsUrl()
    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      reconnectAttempt.current = 0
      setConnectionStatus('connected')
      setSendToShelter((payload: object) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify(payload))
        }
      })
      ws.send(JSON.stringify({ type: 'scope:subscribe' }))
    }

    ws.onmessage = (event) => {
      try {
        const frame = JSON.parse(event.data) as { type: string; data?: unknown; timestamp?: string }
        const { type, data, timestamp } = frame

        switch (type) {
          case 'scope:subscribed': {
            const d = data as { currentVoltage?: string; queueLength?: number }
            setScopeSubscribed({
              currentVoltage: d?.currentVoltage ?? 'green',
              queueLength: d?.queueLength ?? 0,
            })
            setVoltage((d?.currentVoltage as VoltageLevel) ?? 'green')
            break
          }
          case 'sprout:signal': {
            const d = data as { signal?: string; timestamp?: string; urgency?: string }
            addSignal({
              signal: d?.signal ?? 'ok',
              timestamp: d?.timestamp ?? timestamp,
              urgency: d?.urgency as 'low' | 'medium' | 'high' | undefined,
            })
            if (d?.signal === 'help') setVoltage('red', 8)
            else if (d?.signal === 'break' || d?.signal === 'hug') setVoltage('amber', 5)
            else if (d?.signal === 'ok') setVoltage('green', 2)
            break
          }
          case 'signal:help': {
            const d = data as { signal?: string; timestamp?: string }
            addSignal({ signal: d?.signal ?? 'help', timestamp: d?.timestamp, urgency: 'high' })
            setVoltage('red', 8)
            break
          }
          case 'signal:status': {
            const d = data as { signal?: string; timestamp?: string }
            addSignal({ signal: d?.signal ?? 'ok', timestamp: d?.timestamp, urgency: 'medium' })
            break
          }
          case 'message:new': {
            const d = data as { id?: string; source?: string; priority?: string }
            if (d?.id) {
              prependMessage({
                id: d.id,
                message: '',
                priority: (d.priority as HistoryMessage['priority']) ?? 'normal',
                metadata: {},
                timestamp: new Date().toISOString(),
                status: 'pending',
              })
            }
            break
          }
          case 'message:processed': {
            const d = data as { id?: string; priority?: string; status?: string; source?: string }
            if (d?.id)
              updateMessage(d.id, {
                status: (d.status as HistoryMessage['status']) ?? 'completed',
                priority: (d.priority as HistoryMessage['priority']) ?? 'normal',
              })
            break
          }
          case 'voltage:update': {
            const d = data as { voltage?: string; level?: string; value?: number }
            const level = (d?.voltage ?? d?.level ?? 'green') as VoltageLevel
            setVoltage(level, d?.value)
            break
          }
          case 'status': {
            const d = data as { queueLength?: number }
            setScopeSubscribed({ queueLength: d?.queueLength ?? 0 })
            break
          }
          default:
            break
        }
      } catch {
        // ignore parse errors
      }
    }

    ws.onclose = () => {
      wsRef.current = null
      setSendToShelter(() => {})
      setConnectionStatus('reconnecting')
      const delay = Math.min(
        RECONNECT_BASE * 2 ** reconnectAttempt.current,
        RECONNECT_MAX
      )
      reconnectAttempt.current += 1
      reconnectTimeoutRef.current = setTimeout(connect, delay)
    }

    ws.onerror = () => {
      setConnectionStatus('reconnecting')
    }
  }, [
    addSignal,
    setVoltage,
    prependMessage,
    updateMessage,
    setConnectionStatus,
    setScopeSubscribed,
    setSendToShelter,
  ])

  useEffect(() => {
    connect()
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [connect])
}
