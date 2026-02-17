import { useShelterWs } from './hooks/useShelterWs'
import { StatusBar } from './components/StatusBar'
import { SignalPanel } from './components/SignalPanel'
import { MessageQueue } from './components/MessageQueue'
import { VoltageMeter } from './components/VoltageMeter'
import { AccommodationLog } from './components/AccommodationLog'

const STATUS_BAR_HEIGHT = 44

export default function App() {
  useShelterWs()

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--p31-void)',
        overflowX: 'hidden',
      }}
    >
      <StatusBar
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          paddingTop: 'max(10px, env(safe-area-inset-top))',
        }}
      />
      <main
        style={{
          flex: 1,
          padding: 16,
          paddingTop: `max(${16 + STATUS_BAR_HEIGHT}px, calc(${16 + STATUS_BAR_HEIGHT}px + env(safe-area-inset-top)))`,
          paddingLeft: 'max(16px, env(safe-area-inset-left))',
          paddingRight: 'max(16px, env(safe-area-inset-right))',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        }}
        className="p31-scope-main"
      >
        <div style={{ gridColumn: '1 / -1', minHeight: 120 }}>
          <SignalPanel />
        </div>
        <div style={{ minWidth: 0 }}>
          <MessageQueue />
        </div>
        <div style={{ minWidth: 0 }}>
          <VoltageMeter />
        </div>
        <div style={{ gridColumn: '1 / -1', minHeight: 200 }}>
          <AccommodationLog />
        </div>
      </main>
    </div>
  )
}
