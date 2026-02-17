import { useState, useEffect } from 'react'
import { useScopeStore } from '../stores/useScopeStore'

const statusColors = {
  connected: 'var(--p31-green)',
  reconnecting: 'var(--p31-amber)',
  disconnected: 'var(--p31-muted)',
} as const

export function StatusBar({ style }: { style?: React.CSSProperties }) {
  const connectionStatus = useScopeStore((s) => s.connectionStatus)
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header
      aria-label="Scope status"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 16px',
        minHeight: 44,
        background: 'var(--p31-void)',
        borderBottom: '1px solid var(--panel-border)',
        ...style,
      }}
    >
      <span
        aria-label={connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'reconnecting' ? 'Reconnecting' : 'Disconnected'}
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: statusColors[connectionStatus],
          boxShadow: connectionStatus === 'connected' ? `0 0 8px ${statusColors.connected}` : connectionStatus === 'reconnecting' ? `0 0 6px ${statusColors.reconnecting}` : undefined,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 400,
          fontSize: 14,
        }}
      >
        P31 Scope
      </span>
      <span
        style={{
          marginLeft: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--p31-muted)',
        }}
      >
        {now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
      </span>
    </header>
  )
}
