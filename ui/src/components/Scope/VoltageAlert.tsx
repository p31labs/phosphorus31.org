/**
 * VoltageAlert - Shows when Buffer detects high voltage
 */

import React from 'react';

const P31 = {
  tokens: { phosphorus: '#2ecc71', void: '#050510', amber: '#f59e0b', crimson: '#dc2626', slate: '#64748b' },
};

interface VoltageAlertProps {
  voltage?: number;
  source?: string;
  context?: string;
  timestamp?: string;
}

export function VoltageAlert({ voltage = 0, source, context, timestamp }: VoltageAlertProps) {
  if (voltage < 7) return null;

  const isCritical = voltage >= 8;
  const color = isCritical ? P31.tokens.crimson : P31.tokens.amber;

  return (
    <div
      style={{
        background: P31.tokens.void,
        border: `2px solid ${color}`,
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
      }}
    >
      <strong style={{ color }}>High voltage: {voltage}/10</strong>
      {source && <div style={{ color: P31.tokens.slate, fontSize: 12 }}>Source: {source}</div>}
      {context && <div style={{ color: P31.tokens.slate, fontSize: 12 }}>{context}</div>}
      {timestamp && <div style={{ color: P31.tokens.slate, fontSize: 11 }}>{timestamp}</div>}
    </div>
  );
}
