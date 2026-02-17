import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts'
import { useVoltageStore } from '../stores/useVoltageStore'
import {
  type VoltageLevel,
  VOLTAGE_LEVEL_TO_NUM,
  VOLTAGE_COLORS,
  VOLTAGE_LABELS,
} from '../constants'

export function VoltageMeter() {
  const { current, numeric, history } = useVoltageStore()

  const gaugeColor = VOLTAGE_COLORS[current] ?? VOLTAGE_COLORS.green

  // Last 60 min trend: chronological order, value 0–13+
  const now = Date.now()
  const sixtyMinAgo = now - 60 * 60 * 1000
  const filtered = [...history].reverse().filter((r) => new Date(r.at).getTime() >= sixtyMinAgo)
  const chartData =
    filtered.length === 0
      ? [
          { at: new Date(sixtyMinAgo).toISOString(), time: sixtyMinAgo, value: numeric },
          { at: new Date().toISOString(), time: now, value: numeric },
        ]
      : filtered.map((r) => ({
          at: r.at,
          time: new Date(r.at).getTime(),
          value: VOLTAGE_LEVEL_TO_NUM[r.level as VoltageLevel] ?? 2,
        }))

  const fillPercent = Math.min(100, (numeric / 13) * 100)

  return (
    <section
      aria-label="Voltage meter"
      className="p31-scope-panel p31-scope-voltage-meter"
      style={{
        padding: 16,
        minHeight: 280,
        minWidth: 160,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <h2 className="p31-scope-panel-header" style={{ margin: '0 0 12px' }}>
        Voltage
      </h2>
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 16, marginBottom: 12, flexShrink: 0 }}>
        {/* Vertical thermometer: green bottom, amber middle, red top */}
        <div
          style={{
            width: 28,
            minHeight: 100,
            background: 'linear-gradient(to top, #00FF88 0%, #00FF88 33%, #FFB800 33%, #FFB800 66%, #FF00CC 66%, #FF00CC 100%)',
            borderRadius: 6,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: `${fillPercent}%`,
              background: gaugeColor,
              borderRadius: '0 0 6px 6px',
              opacity: 0.9,
              transition: 'height 200ms ease',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: -2,
              right: -2,
              bottom: `${fillPercent}%`,
              height: 4,
              background: gaugeColor,
              borderRadius: 2,
              boxShadow: `0 0 10px ${gaugeColor}`,
              transition: 'bottom 200ms ease',
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--p31-muted)',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Voltage
          </p>
          <p
            style={{
              margin: '4px 0 0',
              fontFamily: 'var(--font-mono)',
              fontSize: 20,
              fontWeight: 700,
              color: gaugeColor,
              textShadow: `0 0 12px ${gaugeColor}80`,
            }}
          >
            {VOLTAGE_LABELS[current] ?? 'GREEN'}
          </p>
          <p style={{ margin: '2px 0 0', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--p31-muted)' }}>
            {numeric}
          </p>
        </div>
      </div>
      {/* 1hr trend: transparent bg, horizontal grid only, gradient line */}
      <div style={{ height: 80, flex: 1, minHeight: 80 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 4, right: 4, left: 4, bottom: 4 }}
            style={{ background: 'transparent' }}
          >
            <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.03)" horizontal={true} vertical={false} />
            <XAxis
              dataKey="time"
              type="number"
              domain={[sixtyMinAgo, now]}
              tickFormatter={(t) => {
                const d = new Date(t)
                const min = d.getMinutes()
                return `${d.getHours()}:${min < 10 ? '0' : ''}${min}`
              }}
              tick={{ fontSize: 9, fill: 'var(--p31-muted)' }}
              interval="preserveStartEnd"
            />
            <YAxis domain={[0, 13]} hide />
            <ReferenceLine y={13} stroke="transparent" />
            <Line
              type="monotone"
              dataKey="value"
              stroke={gaugeColor}
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
