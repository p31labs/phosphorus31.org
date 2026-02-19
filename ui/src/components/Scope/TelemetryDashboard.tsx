/**
 * P31 Telemetry Dashboard - Voltage, spoons, haptics, LoRa
 * Demo mode uses synthetic data; Live mode fetches from Centaur (when available).
 */

import React, { useState, useMemo } from 'react';
import {
  demoVoltageData,
  demoHapticEvents,
  demoSpoonCheckins,
  demoLoRaMessages,
  type VoltageEntry,
} from '../../demo-data';
import { SpoonCheckin } from './SpoonCheckin';
import { VoltageAlert } from './VoltageAlert';
import { HapticTrigger } from './HapticTrigger';
import { LoRaStatus } from './LoRaStatus';

const P31_TOKENS = {
  phosphorus: '#2ecc71',
  void: '#050510',
  amber: '#f59e0b',
  calcium: '#60a5fa',
  crimson: '#dc2626',
  slate: '#64748b',
};

function voltageColor(v: number): string {
  if (v <= 3) return P31_TOKENS.phosphorus;
  if (v <= 6) return P31_TOKENS.amber;
  if (v <= 8) return P31_TOKENS.phosphorus;
  return P31_TOKENS.crimson;
}

export function TelemetryDashboard() {
  const [demoMode, setDemoMode] = useState(true);

  const voltageByDay = useMemo(() => {
    const byDay = new Map<string, VoltageEntry[]>();
    for (const e of demoVoltageData) {
      const day = e.timestamp.slice(0, 10);
      if (!byDay.has(day)) byDay.set(day, []);
      byDay.get(day)!.push(e);
    }
    return byDay;
  }, []);

  return (
    <div
      style={{
        background: P31_TOKENS.void,
        color: P31_TOKENS.slate,
        padding: 24,
        borderRadius: 8,
        minHeight: 400,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ color: P31_TOKENS.phosphorus, margin: 0 }}>P31 Telemetry</h2>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={demoMode}
            onChange={(e) => setDemoMode(e.target.checked)}
          />
          Demo Mode
        </label>
      </div>

      {demoMode && (
        <>
          <section style={{ marginBottom: 24 }}>
            <h3 style={{ color: P31_TOKENS.calcium, fontSize: '1rem' }}>Voltage timeline (7 days)</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Array.from(voltageByDay.entries()).map(([day, entries]) => (
                <div
                  key={day}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 2,
                    height: 60,
                  }}
                >
                  {entries.slice(0, 8).map((e, i) => (
                    <div
                      key={i}
                      style={{
                        width: 12,
                        height: Math.max(8, e.voltage * 5),
                        background: voltageColor(e.voltage),
                        borderRadius: 2,
                      }}
                      title={`${e.voltage}/10 - ${e.note}`}
                    />
                  ))}
                  <span style={{ fontSize: 10, marginLeft: 4 }}>{day.slice(5)}</span>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 24 }}>
            <h3 style={{ color: P31_TOKENS.calcium, fontSize: '1rem' }}>Haptic effectiveness</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {demoHapticEvents.map((e, i) => (
                <div
                  key={i}
                  style={{
                    padding: '6px 10px',
                    background: P31_TOKENS.phosphorus + '20',
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                >
                  {e.pattern} → {e.effectiveness}/10
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 24 }}>
            <h3 style={{ color: P31_TOKENS.calcium, fontSize: '1rem' }}>Spoon level trend</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80 }}>
              {demoSpoonCheckins.slice(0, 14).map((e, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    minWidth: 12,
                    height: `${e.level * 8}%`,
                    background: P31_TOKENS.calcium,
                    borderRadius: 2,
                    opacity: 0.8,
                  }}
                  title={`${e.level}/10 - ${e.activities.join(', ')}`}
                />
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 24 }}>
            <h3 style={{ color: P31_TOKENS.calcium, fontSize: '1rem' }}>LoRa mesh</h3>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12 }}>
              {demoLoRaMessages.map((m, i) => (
                <li key={i}>
                  {m.from} → {m.to}: {m.message} (RSSI {m.rssi})
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {!demoMode && (
        <p style={{ color: P31_TOKENS.slate }}>Live data: connect P31 Tandem and P31 NodeZero to see real telemetry.</p>
      )}

      <hr style={{ borderColor: P31_TOKENS.phosphorus + '40', margin: '24px 0' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <VoltageAlert voltage={demoMode ? 7 : undefined} source="email_triage" context="Demo: high load" />
        <LoRaStatus connected={demoMode} lastRssi={-78} nodeCount={demoMode ? 2 : 0} />
      </div>
      <HapticTrigger />
      <hr style={{ borderColor: P31_TOKENS.phosphorus + '40', margin: '24px 0' }} />
      <SpoonCheckin />
    </div>
  );
}
