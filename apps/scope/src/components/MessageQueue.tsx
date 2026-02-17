import { useState, useEffect } from 'react'
import { useMessageStore } from '../stores/useMessageStore'
import { fetchHistory } from '../api/shelter'
import { priorityToVoltage, VOLTAGE_BADGE_STYLES } from '../constants'
import type { HistoryMessage } from '../types'

function sourceIcon(source: string): string {
  const s = String(source || 'manual').toLowerCase()
  if (s.includes('email')) return '✉'
  if (s.includes('sms')) return '💬'
  if (s.includes('messenger') || s.includes('msg')) return '💬'
  return '✉'
}

function kernelPreview(msg: HistoryMessage, maxLen: number): string {
  const text = msg.kernel ?? msg.message
  if (!text) return '(no content)'
  return text.length <= maxLen ? text : text.slice(0, maxLen) + '…'
}

export function MessageQueue() {
  const { messages, loading, setMessages, setLoading, updateMessage } = useMessageStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showOriginalId, setShowOriginalId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchHistory(50, 0)
      .then((res) => {
        if (!cancelled) setMessages(res.messages, res.total)
      })
      .catch(() => {
        if (!cancelled) setMessages([], 0)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [setMessages, setLoading])

  const handleRelease = (id: string) => {
    updateMessage(id, { status: 'released' })
  }

  return (
    <section
      aria-label="Message queue"
      className="p31-scope-panel"
      style={{
        padding: 16,
        minHeight: 280,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h2 className="p31-scope-panel-header" style={{ margin: '0 0 12px' }}>
        Message queue
      </h2>
      {loading ? (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3].map((i) => (
            <li
              key={i}
              style={{
                height: 56,
                borderRadius: 6,
                background: 'var(--p31-surface3)',
                animation: 'p31-pulse 1.5s ease-in-out infinite',
              }}
            />
          ))}
        </ul>
      ) : messages.length === 0 ? (
        <p style={{ color: 'var(--p31-muted)', margin: 0, fontFamily: 'var(--font-mono)', fontSize: 13 }}>
          No messages in queue
        </p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, overflow: 'auto', flex: 1 }}>
          {messages.slice(0, 20).map((msg) => {
            const voltage = priorityToVoltage(msg.priority)
            const style = VOLTAGE_BADGE_STYLES[voltage] ?? VOLTAGE_BADGE_STYLES.green
            const isHeld = msg.status !== 'completed' && msg.status !== 'released' && (msg.priority === 'high' || msg.priority === 'urgent')
            const isReleased = msg.status === 'completed' || msg.status === 'released'
            const expanded = expandedId === msg.id
            const showOriginal = showOriginalId === msg.id
            return (
              <li
                key={msg.id}
                className="p31-scope-message-card p31-scope-message-card-enter"
                style={{
                  borderBottom: '1px solid var(--panel-border)',
                  padding: '10px 0',
                  ['--card-glow' as string]: `${style.glow}`,
                }}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : msg.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    font: 'inherit',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: 4,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: style.bg,
                      boxShadow: style.outline ? undefined : `0 0 8px ${style.glow}`,
                      outline: style.outline,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: style.bg,
                      textTransform: 'uppercase',
                      flexShrink: 0,
                    }}
                  >
                    {style.label}
                  </span>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                    {sourceIcon((msg.metadata?.source as string) ?? '')} {kernelPreview(msg, 80)}
                  </span>
                  <span style={{ color: 'var(--p31-muted)', fontSize: 12, fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                  </span>
                  {isReleased && <span style={{ color: 'var(--p31-green)', flexShrink: 0 }}>✓</span>}
                </button>
                {expanded && (
                  <div
                    style={{
                      paddingLeft: 24,
                      paddingTop: 8,
                      paddingBottom: 8,
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      color: 'var(--p31-data)',
                      borderTop: '1px solid var(--panel-border)',
                    }}
                  >
                    <div style={{ marginBottom: 8 }}>{showOriginal ? (msg.original ?? msg.message) : (msg.kernel ?? msg.message)}</div>
                    <button
                      type="button"
                      className="p31-btn p31-btn-secondary"
                      style={{ minWidth: 'auto', textTransform: 'none', letterSpacing: 0, fontSize: 12 }}
                      onClick={(e) => { e.stopPropagation(); setShowOriginalId(showOriginal ? null : msg.id) }}
                    >
                      {showOriginal ? 'Show kernel' : 'Show original'}
                    </button>
                    {isHeld && (
                      <div style={{ marginTop: 10 }}>
                        <button
                          type="button"
                          className="p31-btn p31-btn-danger"
                          onClick={(e) => { e.stopPropagation(); handleRelease(msg.id) }}
                        >
                          Release
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
