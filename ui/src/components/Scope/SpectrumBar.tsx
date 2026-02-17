/**
 * P31 Scope — SpectrumBar: ³¹P spectrum as bottom nav.
 * Each metabolite peak maps to a dashboard section (nav mode).
 */

import React from 'react';
import { useNavigationStore } from '@/store/useNavigationStore';
import type { PosnerNodeId } from '@/store/useNavigationStore';

export type SpectrumBarMode = 'nav' | 'chart';

interface PeakConfig {
  id: PosnerNodeId;
  label: string;
  /** Relative position 0–1 along the bar (simulated chemical shift). */
  position: number;
}

const DEFAULT_PEAKS: PeakConfig[] = [
  { id: null, label: 'Home', position: 0.15 },
  { id: 'neural-core', label: 'Core', position: 0.3 },
  { id: 'communication', label: 'Comm', position: 0.45 },
  { id: 'archives', label: 'Archives', position: 0.55 },
  { id: 'project-a', label: 'A', position: 0.7 },
  { id: 'project-b', label: 'B', position: 0.85 },
  { id: 'settings', label: 'Settings', position: 0.98 },
];

export interface SpectrumBarProps {
  mode?: SpectrumBarMode;
  peaks?: PeakConfig[];
  /** When > 0, show a badge/dot on the Comm peak (held/critical messages). */
  commAlertCount?: number;
  className?: string;
}

export function SpectrumBar({
  mode = 'nav',
  peaks = DEFAULT_PEAKS,
  commAlertCount = 0,
  className = '',
}: SpectrumBarProps) {
  const activeNode = useNavigationStore((s) => s.activeNode);
  const navigateTo = useNavigationStore((s) => s.navigateTo);

  return (
    <nav
      className={`scope-spectrum-bar flex h-14 items-center justify-between border-t border-white/10 bg-[#050510] px-4 ${className}`}
      role="navigation"
      aria-label="Dashboard sections"
    >
      <div className="relative flex h-full w-full items-center">
        {/* Simulated spectrum baseline */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(46,204,113,0.2) 50%, transparent 100%)`,
          }}
        />
        {peaks.map((peak) => {
          const isActive = activeNode === peak.id;
          const showCommBadge = peak.id === 'communication' && commAlertCount > 0;
          return (
            <button
              key={peak.label}
              type="button"
              onClick={() => navigateTo(peak.id)}
              className="scope-spectrum-peak absolute flex flex-col items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400/50 rounded"
              style={{
                left: `${peak.position * 100}%`,
                transform: 'translateX(-50%)',
              }}
              aria-label={peak.label + (showCommBadge ? `, ${commAlertCount} held or critical` : '')}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="relative inline-block">
                <span
                  className="h-2 w-3 rounded-sm transition-all duration-200"
                  style={{
                    width: 8,
                    backgroundColor: isActive ? '#2ecc71' : 'rgba(46, 204, 113, 0.4)',
                    boxShadow: isActive ? '0 0 10px rgba(46, 204, 113, 0.8)' : 'none',
                  }}
                />
                {showCommBadge && (
                  <span
                    className="absolute -top-0.5 -right-1.5 flex h-2.5 min-w-[10px] items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-medium text-black"
                    aria-hidden
                  >
                    {commAlertCount > 99 ? '99+' : commAlertCount}
                  </span>
                )}
              </span>
              <span
                className={`mt-1 text-[10px] ${isActive ? 'text-green-400 font-medium' : 'text-gray-500'}`}
              >
                {peak.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
