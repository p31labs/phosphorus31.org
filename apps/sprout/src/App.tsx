import { useState, useCallback, useEffect, useRef } from 'react'
import { useShelterWs } from './useShelterWs'
import type { SproutSignal, SproutSignalPayload } from './types'
import './App.css'

const BUTTONS: { signal: SproutSignal; label: string; color: string; emoji: string }[] = [
  { signal: 'ok', label: "I'm okay", color: '#00FF88', emoji: '💚' },
  { signal: 'break', label: 'I need a break', color: '#FFB800', emoji: '🟡' },
  { signal: 'hug', label: 'I need a hug', color: '#00D4FF', emoji: '🤗' },
  { signal: 'help', label: 'I need help', color: '#FF00CC', emoji: '🆘' },
]

const CONFIRM_DURATION_MS = 2000
const SCOPE_RESPONSE_DURATION_MS = 3000

function haptic() {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30)
    }
  } catch {
    // Degrade silently
  }
}

export default function App() {
  const [confirming, setConfirming] = useState(false)
  const [scopeResponse, setScopeResponse] = useState<string | null>(null)
  const confirmTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data as string) as { type?: string; message?: string }
      if (data.type === 'scope:response') {
        setConfirming(false)
        setScopeResponse(data.message ?? 'They saw your signal 💚')
      }
    } catch {
      // Ignore non-JSON or unexpected payloads
    }
  }, [])

  const { status, send } = useShelterWs(handleMessage)

  useEffect(() => {
    if (!scopeResponse) return
    const t = setTimeout(() => setScopeResponse(null), SCOPE_RESPONSE_DURATION_MS)
    return () => clearTimeout(t)
  }, [scopeResponse])

  const handlePress = (signal: SproutSignal) => {
    if (confirmTimeoutRef.current) {
      clearTimeout(confirmTimeoutRef.current)
      confirmTimeoutRef.current = null
    }
    haptic()
    const payload: SproutSignalPayload = {
      type: 'sprout:signal',
      signal,
      timestamp: new Date().toISOString(),
    }
    send(payload)
    setConfirming(true)
    setScopeResponse(null)
    confirmTimeoutRef.current = setTimeout(() => {
      setConfirming(false)
      confirmTimeoutRef.current = null
    }, CONFIRM_DURATION_MS)
  }

  return (
    <div className="app">
      {/* Connection status: small dot, never red */}
      <div className="status-dot" role="status" aria-live="polite" aria-label={status === 'connected' ? 'Connected' : 'Reconnecting'}>
        <span
          className={`dot ${status === 'connected' ? 'connected' : 'reconnecting'}`}
          aria-hidden="true"
        />
        {status === 'reconnecting' && (
          <span className="status-text">Reconnecting...</span>
        )}
      </div>

      {scopeResponse ? (
        <div className="confirmation scope-response" role="status" aria-live="polite" aria-atomic="true">
          {scopeResponse}
        </div>
      ) : confirming ? (
        <div className="confirmation sent" role="status" aria-live="polite" aria-atomic="true" aria-label="Signal sent">
          Sent ✓
        </div>
      ) : (
        <div className="grid" role="group" aria-label="How are you feeling?">
          {BUTTONS.map(({ signal, label, color, emoji }) => (
            <button
              key={signal}
              type="button"
              className="sprout-button"
              style={{ '--btn-color': color } as React.CSSProperties}
              onClick={() => handlePress(signal)}
              aria-label={`Send ${label} signal`}
            >
              <span className="emoji" aria-hidden="true">
                {emoji}
              </span>
              <span className="label">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
