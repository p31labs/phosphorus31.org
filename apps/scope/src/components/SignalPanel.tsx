import { useEffect, useRef } from 'react'
import { useSignalStore } from '../stores/useSignalStore'
import { useScopeStore } from '../stores/useScopeStore'

const SIGNAL_COLORS: Record<string, string> = {
  ok: 'var(--p31-green)',
  break: 'var(--p31-amber)',
  hug: 'var(--p31-cyan)',
  help: 'var(--p31-red-product)',
}

const SIGNAL_LABELS: Record<string, string> = {
  ok: "I'm okay",
  break: 'I need a break',
  hug: 'I need a hug',
  help: 'I need help',
}

const ACKNOWLEDGE_MESSAGE = 'They saw your signal 💚'
const FADE_AFTER_MS = 30_000

function formatSignalTime(iso: string): string {
  const d = new Date(iso)
  const now = Date.now()
  const diffMs = now - d.getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  const diffHr = Math.floor(diffMs / 3600_000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin} min ago`
  if (diffHr < 1) return `${diffMin} min ago`
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export function SignalPanel() {
  const lastSignal = useSignalStore((s) => s.lastSignal)
  const clearLastSignal = useSignalStore((s) => s.clearHelpTriage)
  const connectionStatus = useScopeStore((s) => s.connectionStatus)
  const sendToShelter = useScopeStore((s) => s.sendToShelter)
  const isHelp = lastSignal?.signal === 'help'
  const color = lastSignal ? SIGNAL_COLORS[lastSignal.signal] ?? 'var(--p31-green)' : 'var(--p31-surface3)'
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Non-help signals auto-fade after 30s
  useEffect(() => {
    if (!lastSignal || lastSignal.signal === 'help') return
    timerRef.current = setTimeout(() => clearLastSignal(), FADE_AFTER_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [lastSignal?.receivedAt, lastSignal?.signal, clearLastSignal])

  const handleAcknowledge = () => {
    sendToShelter({ type: 'scope:respond', message: ACKNOWLEDGE_MESSAGE })
    clearLastSignal()
  }

  return (
    <section
      aria-label="Sprout signal"
      className="p31-scope-panel"
      style={{
        padding: 16,
        minHeight: 120,
        height: isHelp ? 'auto' : 120,
        border: `1px solid ${isHelp ? 'rgba(255,0,204,0.4)' : 'var(--panel-border)'}`,
        boxShadow: isHelp ? '0 0 20px rgba(255,0,204,0.25)' : undefined,
        transition: 'height 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
      }}
    >
      <h2 className="p31-scope-panel-header" style={{ margin: '0 0 12px' }}>
        Last signal
      </h2>
      {connectionStatus === 'disconnected' ? (
        <p style={{ color: 'var(--p31-muted)', margin: 0, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          Reconnecting…
        </p>
      ) : lastSignal ? (
        <>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 14px',
              borderRadius: 6,
              background: `${color}22`,
              border: `1px solid ${color}`,
              boxShadow: `0 0 12px ${color}40`,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: color,
                boxShadow: `0 0 8px ${color}`,
              }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color, fontWeight: 500 }}>
              {SIGNAL_LABELS[lastSignal.signal] ?? lastSignal.signal}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--p31-muted)' }}>
              {formatSignalTime(lastSignal.receivedAt)}
            </span>
          </div>

          {isHelp && (
            <div
              style={{
                marginTop: 20,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <button type="button" className="p31-btn p31-btn-secondary" onClick={() => {}}>
                Send calm message
              </button>
              <button type="button" className="p31-btn p31-btn-secondary" onClick={() => {}}>
                Draft message
              </button>
              <button type="button" className="p31-btn p31-btn-primary" onClick={handleAcknowledge}>
                Acknowledge
              </button>
            </div>
          )}
        </>
      ) : (
        <p style={{ color: 'var(--p31-muted)', margin: 0, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          No signal yet
        </p>
      )}
    </section>
  )
}
