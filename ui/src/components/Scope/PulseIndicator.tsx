/**
 * P31 Scope — PulseIndicator: copilot status (coherence + mode).
 * Shown in dashboard top bar.
 */

import React from 'react';
import { useCopilotStore } from '@/store/useCopilotStore';
import type { CoherenceLevel, CopilotMode } from '@/store/useCopilotStore';
import { useAnimationEnabled } from '@/store/useSensoryStore';

const COHERENCE_COLORS: Record<CoherenceLevel, string> = {
  high: '#22c55e',
  medium: '#eab308',
  low: '#f97316',
  critical: '#ef4444',
};

const MODE_LABELS: Record<CopilotMode, string> = {
  passive: 'Idle',
  nudge: 'Nudge',
  active: 'Active',
  emergency: 'Focus',
};

export function PulseIndicator() {
  const coherenceLevel = useCopilotStore((s) => s.coherenceLevel);
  const copilotMode = useCopilotStore((s) => s.copilotMode);
  const speaking = useCopilotStore((s) => s.speaking);
  const animationEnabled = useAnimationEnabled();

  const color = COHERENCE_COLORS[coherenceLevel];
  const label = MODE_LABELS[copilotMode];
  const showPulse = speaking && animationEnabled;

  return (
    <div
      className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5"
      role="status"
      aria-live="polite"
      aria-label={`Copilot ${label}, coherence ${coherenceLevel}`}
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${showPulse ? 'scope-pulse-animated' : ''}`}
        style={{
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}`,
          animation: showPulse ? 'scope-pulse 3s ease-in-out infinite' : undefined,
        }}
      />
      <span className="text-xs text-gray-300">{label}</span>
    </div>
  );
}
