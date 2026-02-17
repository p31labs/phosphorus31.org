/**
 * VOLTAGE GAUGE COMPONENT
 * Visual indicator of emotional intensity.
 * No data → GREEN (default safe state), VOLTAGE: GREEN, flat green line.
 */

import { useMemo } from 'react';

const GREEN = '#22c55e';
const FALLBACK_BG = '#1f2937';
const FALLBACK_TEXT = '#9ca3af';
const FALLBACK_BORDER = '#374151';

interface VoltageGaugeProps {
  /** When undefined/null, shows default safe state: GREEN, flat line */
  voltage?: number | null;
  size?: 'sm' | 'md' | 'lg';
}

export function VoltageGauge({ voltage, size = 'md' }: VoltageGaugeProps) {
  const { level, color, percentage, hasData } = useMemo(() => {
    if (voltage == null || Number.isNaN(voltage)) {
      return { level: 'GREEN' as const, color: GREEN, percentage: 0, hasData: false };
    }
    const v = Math.max(0, Math.min(1, voltage));
    const pct = Math.round(v * 100);
    if (v <= 0.3) return { level: 'LOW' as const, color: GREEN, percentage: pct, hasData: true };
    if (v <= 0.6) return { level: 'MEDIUM' as const, color: '#f59e0b', percentage: pct, hasData: true };
    return { level: 'HIGH' as const, color: '#ef4444', percentage: pct, hasData: true };
  }, [voltage]);

  const dimensions = {
    sm: { width: 120, height: 8, fontSize: 10 },
    md: { width: 180, height: 12, fontSize: 12 },
    lg: { width: 240, height: 16, fontSize: 14 },
  }[size];

  return (
    <div className="voltage-gauge" style={{ width: dimensions.width }}>
      <div
        className="gauge-label"
        style={{
          fontSize: dimensions.fontSize,
          color: FALLBACK_TEXT,
          marginBottom: 4,
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: '"Space Mono", monospace',
        }}
      >
        <span>VOLTAGE</span>
        <span style={{ color }}>
          {hasData ? `${level} (${percentage}%)` : 'GREEN'}
        </span>
      </div>
      <div
        className="gauge-track"
        style={{
          width: '100%',
          height: dimensions.height,
          backgroundColor: FALLBACK_BG,
          borderRadius: dimensions.height / 2,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* No data: flat green line at bottom (full width, thin); with data: fill by percentage */}
        <div
          className="gauge-fill"
          style={{
            width: hasData ? `${percentage}%` : '100%',
            height: '100%',
            backgroundColor: color,
            borderRadius: dimensions.height / 2,
            transition: 'width 0.5s ease-out, background-color 0.3s ease',
            boxShadow: hasData ? `0 0 ${dimensions.height}px ${color}40` : 'none',
            opacity: hasData ? 1 : 0.6,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '33%',
            width: 1,
            height: '100%',
            backgroundColor: FALLBACK_BORDER,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '66%',
            width: 1,
            height: '100%',
            backgroundColor: FALLBACK_BORDER,
          }}
        />
      </div>
    </div>
  );
}

export default VoltageGauge;
