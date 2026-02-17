/**
 * P31 Scope — GlowBadge: icon + label with phosphor glow.
 * Used in OctahedralNav and anywhere a Posner node is shown.
 */

import React from 'react';

export interface GlowBadgeProps {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  glowIntensity?: number;
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
}

const PHOSPHOR = 'rgba(46, 204, 113, 0.9)'; // P31 green

export function GlowBadge({
  label,
  icon,
  active = false,
  glowIntensity = 0.7,
  onClick,
  className = '',
  'aria-label': ariaLabel,
}: GlowBadgeProps) {
  const intensity = active ? Math.max(glowIntensity, 0.6) : glowIntensity * 0.4;
  const scale = active ? 1.08 : 1;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`scope-glow-badge rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400/60 ${className}`}
      style={{
        transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1), border-color 200ms ease, background-color 200ms ease',
        transform: `scale(${scale})`,
        boxShadow: `0 0 ${12 * intensity}px ${PHOSPHOR}, 0 0 ${24 * intensity}px rgba(46, 204, 113, 0.3)`,
        borderColor: active ? PHOSPHOR : 'rgba(46, 204, 113, 0.35)',
        backgroundColor: active ? 'rgba(46, 204, 113, 0.12)' : 'rgba(5, 5, 16, 0.85)',
        color: active ? '#fff' : 'rgba(200, 220, 210, 0.9)',
      }}
      aria-label={ariaLabel ?? label}
      aria-pressed={active}
    >
      {icon && <span className="scope-glow-badge-icon mr-2 inline-block align-middle">{icon}</span>}
      <span className="scope-glow-badge-label text-sm font-medium">{label}</span>
    </button>
  );
}
