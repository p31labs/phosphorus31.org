/**
 * Spoon Meter Component
 * Energy level display + tracking for Node A (You)
 */

import { useSpoons, useHeartbeatStatus, useHeartbeatPercent, useHeartbeatStore } from '../../stores/heartbeat.store';

export function SpoonMeter() {
  const spoons = useSpoons();
  const heartbeat = useHeartbeatStatus();
  const heartbeatPercent = useHeartbeatPercent();
  const maxSpoons = useHeartbeatStore((s) => s.operator.maxSpoons);

  const getColor = () => {
    switch (heartbeat) {
      case 'green':
        return '#10b981';
      case 'yellow':
        return '#f59e0b';
      case 'orange':
        return '#f97316';
      case 'red':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const energyLevel = spoons / maxSpoons;
  const energyStatus =
    energyLevel > 0.75
      ? 'high'
      : energyLevel > 0.5
        ? 'moderate'
        : energyLevel > 0.25
          ? 'low'
          : 'critical';
  const ariaLabel = `Cognitive Energy: ${spoons} out of ${maxSpoons} spoons remaining. Energy level is ${energyStatus}. Heartbeat is ${heartbeatPercent.toFixed(0)}% and ${heartbeat}.`;

  return (
    <div
      style={{ padding: 16, backgroundColor: '#1f2937', borderRadius: 8 }}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>
          Cognitive Energy (Spoons)
        </span>
        <span
          style={{ color: getColor(), fontSize: 14, fontWeight: 600 }}
          aria-label={`${spoons} out of ${maxSpoons} spoons`}
        >
          {spoons} / {maxSpoons}
        </span>
      </div>

      {/* Spoon bar */}
      <div
        style={{ display: 'flex', gap: 4, marginBottom: 8 }}
        role="progressbar"
        aria-valuenow={spoons}
        aria-valuemin={0}
        aria-valuemax={maxSpoons}
        aria-label={`${spoons} spoons available`}
      >
        {Array.from({ length: maxSpoons }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              backgroundColor: i < spoons ? getColor() : '#374151',
              transition: 'background-color 0.3s ease',
            }}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Heartbeat indicator */}
      <div style={{ fontSize: 11, color: '#9ca3af' }}>
        Heartbeat: {heartbeatPercent.toFixed(0)}% ({heartbeat})
      </div>
    </div>
  );
}
