/**
 * LoRaStatus - Mesh network connectivity display
 */

import React from 'react';

const P31 = {
  tokens: { phosphorus: '#2ecc71', void: '#050510', slate: '#64748b', amber: '#f59e0b' },
};

interface LoRaStatusProps {
  connected?: boolean;
  lastRssi?: number;
  nodeCount?: number;
}

export function LoRaStatus({ connected = false, lastRssi, nodeCount = 0 }: LoRaStatusProps) {
  return (
    <div
      style={{
        background: P31.tokens.void,
        padding: 12,
        borderRadius: 8,
        border: `1px solid ${connected ? P31.tokens.phosphorus : P31.tokens.amber}40`,
      }}
    >
      <span style={{ color: P31.tokens.slate, marginRight: 8 }}>
        LoRa mesh: {connected ? 'Connected' : 'Offline'}
      </span>
      {lastRssi != null && <span style={{ color: P31.tokens.slate, fontSize: 12 }}>RSSI {lastRssi}</span>}
      {nodeCount > 0 && <span style={{ color: P31.tokens.phosphorus, marginLeft: 8 }}>{nodeCount} nodes</span>}
    </div>
  );
}
