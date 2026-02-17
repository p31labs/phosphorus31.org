/**
 * P31 Scope — Subtle connection banner. Not a modal, not an alert.
 * "Connection interrupted · Retrying..." #FFB800, 10px Space Mono.
 * At top of panel; auto-dismiss when connection restored.
 */

import React from 'react';

export function ScopeConnectionBanner({ message = 'Connection interrupted · Retrying...' }: { message?: string }) {
  return (
    <div
      className="scope-connection-banner border-b border-[#FFB800]/30 bg-[#FFB800]/10 px-4 py-2 text-center"
      role="status"
      aria-live="polite"
    >
      <span className="font-mono text-[10px] tracking-wide" style={{ color: '#FFB800' }}>
        {message}
      </span>
    </div>
  );
}
