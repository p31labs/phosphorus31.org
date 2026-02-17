/**
 * MATA Demo Cockpit — Full-screen demo for accelerator video
 *
 * Layout: top bar, 3D Buffer (icosahedron) center, spoon gauge left,
 * mesh log right, timeline slider bottom. Scrubbing to 14:30 shows
 * Sensory Overload (red, vibrating).
 * Live Sprout signals (I need a break / I need help) appear in the mesh log
 * when emitted via p31:mesh:signal (Whale Channel simulator or real NODE ONE).
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { P31 } from '@p31/config';
import {
  DEMO_TIMELINE,
  MESH_LOGS,
  DEMO_MAX_SPOONS,
  type DemoTimePoint,
  type MeshLogEntry,
} from '../../demo-data';
import { VoltageIcosahedron } from '../3d/VoltageIcosahedron';
import { MESH_SIGNAL_EVENT } from '../../services/meshAdapter';

const MAX_LIVE_LOGS = 20;

interface MATADemoCockpitProps {
  onClose?: () => void;
}

export function MATADemoCockpit({ onClose }: MATADemoCockpitProps) {
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [liveLogs, setLiveLogs] = useState<MeshLogEntry[]>([]);
  const point: DemoTimePoint = DEMO_TIMELINE[timelineIndex];

  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<{ signal: 'break' | 'help'; timestamp: number }>;
      const d = ev.detail;
      if (!d?.signal) return;
      const msg = d.signal === 'break' ? 'SPROUT: I need a break' : 'SPROUT: I need help';
      setLiveLogs((prev) => {
        const next = [
          { id: `live-${d.timestamp}`, from: 'Sprout', msg, rssi: 0 },
          ...prev,
        ].slice(0, MAX_LIVE_LOGS);
        return next;
      });
    };
    window.addEventListener(MESH_SIGNAL_EVENT, handler);
    return () => window.removeEventListener(MESH_SIGNAL_EVENT, handler);
  }, []);

  const handleTimelineChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const i = Math.round(Number(e.target.value));
      setTimelineIndex(Math.max(0, Math.min(i, DEMO_TIMELINE.length - 1)));
    },
    []
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: P31.tokens.void,
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        gridTemplateColumns: '120px 1fr 280px',
        color: P31.tokens.slate,
        fontFamily: '"JetBrains Mono", monospace',
      }}
    >
      {/* Top bar */}
      <header
        style={{
          gridColumn: '1 / -1',
          padding: '10px 16px',
          borderBottom: `1px solid ${P31.tokens.phosphorus}40`,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          fontSize: 13,
        }}
      >
        <span style={{ color: P31.tokens.phosphorus, fontWeight: 600 }}>
          P31 NODE ZERO
        </span>
        <span>//</span>
        <span>STATUS: <span style={{ color: P31.tokens.phosphorus }}>ONLINE</span></span>
        <span>//</span>
        <span>MESH: <span style={{ color: P31.tokens.phosphorus }}>CONNECTED</span></span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            style={{
              marginLeft: 'auto',
              padding: '4px 12px',
              background: P31.tokens.slate + '40',
              border: `1px solid ${P31.tokens.slate}`,
              borderRadius: 4,
              color: P31.tokens.slate,
              fontSize: 12,
              cursor: 'pointer',
            }}
            aria-label="Exit MATA Demo"
          >
            ✕ Exit Demo
          </button>
        )}
      </header>

      {/* Left: Spoon Fuel gauge */}
      <aside
        style={{
          padding: 16,
          borderRight: `1px solid ${P31.tokens.slate}40`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 11, color: P31.tokens.slate }}>SPOON FUEL</span>
        <div
          style={{
            width: 24,
            height: 160,
            background: `${P31.tokens.slate}20`,
            borderRadius: 4,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column-reverse',
          }}
        >
          <div
            style={{
              height: `${(point.spoons / DEMO_MAX_SPOONS) * 100}%`,
              background: P31.tokens.calcium,
              borderRadius: 2,
            }}
          />
        </div>
        <span style={{ fontSize: 12, color: P31.tokens.calcium }}>
          {point.spoons}/{DEMO_MAX_SPOONS}
        </span>
      </aside>

      {/* Center: 3D Canvas */}
      <main style={{ position: 'relative', minHeight: 0 }}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ antialias: true }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={0.8} />
          <pointLight position={[-5, -5, 5]} intensity={0.3} />
          <VoltageIcosahedron voltage={point.voltage} spoons={point.spoons} />
          <OrbitControls enableZoom enablePan rotateSpeed={0.5} />
        </Canvas>
      </main>

      {/* Right: Live log terminal — live Sprout signals on top, then static demo logs */}
      <aside
        style={{
          padding: 12,
          borderLeft: `1px solid ${P31.tokens.slate}40`,
          overflow: 'auto',
          fontSize: 11,
        }}
      >
        <div style={{ color: P31.tokens.phosphorus, marginBottom: 8 }}>MESH LOG</div>
        {[...liveLogs, ...MESH_LOGS].map((log) => (
          <div
            key={log.id}
            style={{
              marginBottom: 6,
              padding: '4px 0',
              borderBottom: `1px solid ${P31.tokens.slate}20`,
            }}
          >
            <span style={{ color: P31.tokens.amber }}>{log.from}</span>
            <span style={{ margin: '0 6px' }}>→</span>
            <span style={{ color: P31.tokens.slate }}>{log.msg}</span>
            {log.rssi !== 0 && (
              <span style={{ color: P31.tokens.slate, marginLeft: 6 }}>
                RSSI {log.rssi}
              </span>
            )}
          </div>
        ))}
      </aside>

      {/* Bottom: Timeline slider */}
      <footer
        style={{
          gridColumn: '1 / -1',
          padding: '12px 16px',
          borderTop: `1px solid ${P31.tokens.phosphorus}40`,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span style={{ fontSize: 11, color: P31.tokens.slate, minWidth: 36 }}>
          {DEMO_TIMELINE[0].time}
        </span>
        <input
          type="range"
          min={0}
          max={DEMO_TIMELINE.length - 1}
          value={timelineIndex}
          onChange={handleTimelineChange}
          step={1}
          style={{
            flex: 1,
            accentColor: P31.tokens.phosphorus,
          }}
          aria-label="Scrub through demo day timeline"
        />
        <span style={{ fontSize: 11, color: P31.tokens.slate, minWidth: 36 }}>
          {DEMO_TIMELINE[DEMO_TIMELINE.length - 1].time}
        </span>
        <span
          style={{
            color: point.color,
            fontWeight: 600,
            minWidth: 140,
          }}
        >
          {point.time} — {point.label}
        </span>
        <span style={{ fontSize: 11, color: P31.tokens.slate }}>
          V: {point.voltage.toFixed(1)}
        </span>
      </footer>
    </div>
  );
}

export default MATADemoCockpit;
