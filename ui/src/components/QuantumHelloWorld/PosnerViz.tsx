/**
 * Posner molecule SVG — 9 Ca (green), 6 P (cyan), entanglement (violet).
 * Atom count scales with coherence (0.15 = barely visible, 0.95 = full).
 * Central phosphorus always visible and pulsing.
 */

import { BRAND } from './constants';

interface PosnerVizProps {
  coherence: number;
  forming?: boolean;
  className?: string;
}

const CA_COUNT = 9;
const P_COUNT = 6;

export function PosnerViz({ coherence, forming = false, className = '' }: PosnerVizProps) {
  const visible = Math.max(0.15, Math.min(1, coherence));
  const caOpacity = 0.2 + visible * 0.8;
  const pOpacity = 0.3 + visible * 0.7;
  const pulseClass = forming ? 'animate-pulse' : '';

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      style={{ maxWidth: 'min(80vmin, 320px)', margin: '0 auto' }}
    >
      <defs>
        <filter id="glow-cyan">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-green">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Entanglement filaments (violet) */}
      <g opacity={0.15 + visible * 0.35} stroke={BRAND.violet} strokeWidth="0.5" fill="none">
        <path d="M100 60 L100 140 M60 100 L140 100 M75 75 L125 125 M125 75 L75 125" />
      </g>
      {/* Calcium (green) — 9 positions around center */}
      {Array.from({ length: CA_COUNT }, (_, i) => {
        const angle = (i / CA_COUNT) * 2 * Math.PI - Math.PI / 2;
        const r = 45 + (i % 3) * 18;
        const cx = 100 + r * Math.cos(angle);
        const cy = 100 + r * Math.sin(angle);
        return (
          <circle
            key={`ca-${i}`}
            cx={cx}
            cy={cy}
            r={forming ? 6 : 5}
            fill={BRAND.green}
            opacity={caOpacity}
            className={pulseClass}
            style={{ filter: 'url(#glow-green)' }}
          />
        );
      })}
      {/* Phosphorus (cyan) — 6 positions, center always visible */}
      {Array.from({ length: P_COUNT }, (_, i) => {
        const angle = (i / P_COUNT) * 2 * Math.PI - Math.PI / 2;
        const r = i === 0 ? 0 : 35;
        const cx = 100 + r * Math.cos(angle);
        const cy = 100 + r * Math.sin(angle);
        const isCenter = i === 0;
        const opacity = isCenter ? 1 : pOpacity;
        return (
          <circle
            key={`p-${i}`}
            cx={cx}
            cy={cy}
            r={forming ? 8 : 6}
            fill={BRAND.cyan}
            opacity={opacity}
            className={pulseClass}
            style={{ filter: 'url(#glow-cyan)' }}
          />
        );
      })}
    </svg>
  );
}
