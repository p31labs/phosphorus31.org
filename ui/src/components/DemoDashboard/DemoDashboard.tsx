// DemoDashboard.tsx
// MATA demo: living narrative of neurodivergent executive function
// Voltage, Spoons, Haptics, LoRa Mesh — P31 design tokens

import React, { useState } from 'react';
import { p31 } from '@p31/shared';
import {
  demoVoltageData,
  demoSpoonCheckins,
  demoHapticEvents,
  demoLoRaMessages,
  getVoltageColor,
  getSpoonColor,
} from '../../demo-data';

export function DemoDashboard() {
  const [isDemoMode, setIsDemoMode] = useState(true);

  return (
    <div
      style={{
        background: p31.color('void'),
        minHeight: '100vh',
        color: '#e5e7eb',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <button
        type="button"
        onClick={() => setIsDemoMode(!isDemoMode)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: isDemoMode ? p31.color('phosphorus') : p31.color('slate'),
          color: p31.color('void'),
          padding: '10px 20px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          zIndex: 1000,
        }}
        aria-label={isDemoMode ? 'Switch to live data' : 'Switch to demo mode'}
      >
        {isDemoMode ? '🎬 DEMO MODE' : '📡 LIVE DATA'}
      </button>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <header style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1
            style={{
              color: p31.color('phosphorus'),
              fontSize: '48px',
              fontWeight: 'bold',
              marginBottom: '10px',
            }}
          >
            P31 Labs: P31 Compass
          </h1>
          <p style={{ color: p31.color('slate'), fontSize: '18px' }}>
            Powered Communication System • FDA 21 CFR §890.3710 (Class II, 510(k) Exempt)
          </p>
        </header>

        {!isDemoMode && (
          <div
            style={{
              background: p31.color('void'),
              padding: '24px',
              borderRadius: '8px',
              marginBottom: '24px',
              border: `1px solid ${p31.color('slate')}`,
              color: p31.color('slate'),
              textAlign: 'center',
            }}
          >
            Live telemetry will appear when the device connects.
          </div>
        )}

        {isDemoMode && (
          <>
            {/* A. Voltage Timeline */}
            <div
              style={{
                background: p31.color('void'),
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: `1px solid ${p31.color('slate')}40`,
              }}
            >
              <h2 style={{ color: p31.color('phosphorus'), marginBottom: '15px' }}>
                ⚡ Cognitive Voltage Timeline
              </h2>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '200px' }}>
                {demoVoltageData.map((point, i) => (
                  <div
                    key={`v-${i}`}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <div
                      style={{
                        height: `${point.voltage * 20}px`,
                        background: getVoltageColor(point.voltage),
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      title={`${point.time}: ${point.voltage}V - ${point.label}`}
                    />
                    <div
                      style={{
                        fontSize: '10px',
                        color: p31.color('slate'),
                        marginTop: '5px',
                        transform: 'rotate(-45deg)',
                        transformOrigin: 'top left',
                      }}
                    >
                      {point.time}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '20px', color: p31.color('slate'), fontSize: '14px' }}>
                <strong>Legend:</strong>
                <span style={{ color: '#2ecc71', marginLeft: '10px' }}>● Regulated (1–4V)</span>
                <span style={{ color: '#60a5fa', marginLeft: '10px' }}>● Moderate (5–6V)</span>
                <span style={{ color: '#f59e0b', marginLeft: '10px' }}>● High (7–7.9V)</span>
                <span style={{ color: '#dc2626', marginLeft: '10px' }}>● Critical (8–10V)</span>
              </div>
            </div>

            {/* B. Spoon Energy Gauge */}
            <div
              style={{
                background: p31.color('void'),
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: `1px solid ${p31.color('slate')}40`,
              }}
            >
              <h2 style={{ color: p31.color('phosphorus'), marginBottom: '15px' }}>
                🥄 Energy Level (Spoon Theory)
              </h2>
              {demoSpoonCheckins.map((checkin, i) => (
                <div
                  key={`s-${i}`}
                  style={{
                    marginBottom: '15px',
                    padding: '10px',
                    background: '#0a0a15',
                    borderRadius: '4px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: p31.color('calcium') }}>{checkin.time}</span>
                    <span
                      style={{
                        color: getSpoonColor(checkin.level),
                        fontWeight: 'bold',
                        fontSize: '18px',
                      }}
                    >
                      {checkin.level}/10 spoons
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      background: '#1a1a2e',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${checkin.level * 10}%`,
                        height: '100%',
                        background: getSpoonColor(checkin.level),
                        transition: 'width 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                  </div>
                  <div style={{ color: p31.color('slate'), fontSize: '12px', marginTop: '5px' }}>
                    {checkin.note} • {checkin.activities.join(', ')}
                  </div>
                </div>
              ))}
            </div>

            {/* C. LoRa Mesh Log */}
            <div
              style={{
                background: p31.color('void'),
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: `1px solid ${p31.color('slate')}40`,
              }}
            >
              <h2 style={{ color: p31.color('phosphorus'), marginBottom: '15px' }}>
                📻 LoRa Mesh Network Log
              </h2>
              <div
                style={{
                  background: '#0a0a15',
                  padding: '15px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                }}
              >
                {demoLoRaMessages.map((msg) => (
                  <div key={msg.id} style={{ marginBottom: '8px', color: p31.color('slate') }}>
                    <span style={{ color: p31.color('calcium') }}>[{msg.timestamp}]</span>{' '}
                    <span style={{ color: p31.color('phosphorus') }}>{msg.from}</span>
                    {' → '}
                    <span style={{ color: p31.color('amber') }}>{msg.to}</span>
                    {': '}
                    <span>{msg.message}</span>{' '}
                    <span style={{ color: '#64748b', fontSize: '11px' }}>
                      (RSSI: {msg.rssi}dBm, {msg.distance})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* D. Haptic Effectiveness Tracker */}
            <div
              style={{
                background: p31.color('void'),
                padding: '20px',
                borderRadius: '8px',
                border: `1px solid ${p31.color('slate')}40`,
              }}
            >
              <h2 style={{ color: p31.color('phosphorus'), marginBottom: '15px' }}>
                🔊 Haptic Interventions
              </h2>
              {demoHapticEvents.map((event, i) => (
                <div
                  key={`h-${i}`}
                  style={{
                    marginBottom: '12px',
                    padding: '12px',
                    background: '#0a0a15',
                    borderRadius: '4px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ color: p31.color('calcium') }}>
                      {event.time} — {event.pattern.toUpperCase()}
                    </span>
                    <span style={{ color: p31.color('phosphorus') }}>
                      Effectiveness: {event.effectiveness}/10
                    </span>
                  </div>
                  <div style={{ color: p31.color('slate'), fontSize: '12px' }}>
                    Trigger: {event.trigger} • {event.note}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
