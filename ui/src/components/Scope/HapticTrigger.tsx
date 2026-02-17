/**
 * HapticTrigger - Manual button to trigger Node One haptic pattern
 */

import React from 'react';
import { p31, P31 } from '@p31/shared';

const PATTERNS = ['pulse', 'wave', 'alert', 'success', 'error'] as const;

export function HapticTrigger() {
  const trigger = (pattern: (typeof PATTERNS)[number]) => {
    p31.N1.haptic(pattern);
    p31.log('s', `Haptic triggered: ${pattern}`);
  };

  return (
    <div
      style={{
        background: P31.tokens.void,
        padding: 16,
        borderRadius: 8,
        border: `1px solid ${P31.tokens.phosphorus}40`,
      }}
    >
      <h4 style={{ color: P31.tokens.phosphorus, margin: '0 0 8px 0' }}>Node One haptic</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {PATTERNS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => trigger(p)}
            style={{
              background: P31.tokens.phosphorus,
              color: P31.tokens.void,
              border: 'none',
              padding: '8px 12px',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
