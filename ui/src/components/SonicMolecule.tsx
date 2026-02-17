/**
 * Sonic Molecule — SVG visualization of resonance signature.
 * Atoms from last 60 notes; entanglement filaments; central atom; coherence ring.
 * Cap total atoms at 206 (bones in adult human skeleton).
 */

import React from 'react';
import type { FreqPoint, NoteRecord } from '../lib/resonance-engine';

const MAX_ATOMS = 206;
const DISPLAY_ATOMS = 60;
const FILAMENT_DIST = 0.18;
const FILAMENT_MOD = 3;

interface SonicMoleculeProps {
  notes: FreqPoint[];
  coherence: number;
  activeNote: NoteRecord | null;
  sz?: number;
  reducedMotion?: boolean;
}

export function SonicMolecule({
  notes,
  coherence,
  activeNote,
  sz = 300,
  reducedMotion = false,
}: SonicMoleculeProps): React.ReactElement {
  const center = sz / 2;
  const sc = sz / 300;
  const displayNotes = notes.slice(-Math.min(DISPLAY_ATOMS, MAX_ATOMS));

  const atoms = displayNotes.map((note) => {
    const angle = note.x * 2 * Math.PI;
    const radius = (0.15 + note.y * 0.7) * (sz * 0.38);
    const x = center + Math.cos(angle) * radius;
    const y = center + Math.sin(angle) * radius;
    const r = 1.5 + note.size * 0.8;
    const opacity = 0.3 + (note.coherence ?? 0) * 0.5;
    return { x, y, r, color: note.color, opacity };
  });

  const filaments: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const dist = Math.hypot(atoms[j]!.x - atoms[i]!.x, atoms[j]!.y - atoms[i]!.y);
      if (dist < sz * FILAMENT_DIST && (i + j) % FILAMENT_MOD === 0) {
        filaments.push({
          x1: atoms[i].x,
          y1: atoms[i].y,
          x2: atoms[j].x,
          y2: atoms[j].y,
        });
      }
    }
  }

  const coherenceRingR = sz * 0.38 * coherence;
  const dashArray = coherence > 0.9 ? '1 137' : '2 3';

  return (
    <svg
      width={sz}
      height={sz}
      viewBox={`0 0 ${sz} ${sz}`}
      role="img"
      aria-label="Sonic molecule: resonance signature visualization"
    >
      <defs>
        <radialGradient id="sonic-radial" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00FF88" stopOpacity={0.06 + coherence * 0.06} />
          <stop offset="100%" stopColor="#00FF88" stopOpacity="0" />
        </radialGradient>
        <filter id="sonic-glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width={sz} height={sz} fill="url(#sonic-radial)" />

      {filaments.map((f, i) => (
        <line
          key={`fil-${i}`}
          x1={f.x1}
          y1={f.y1}
          x2={f.x2}
          y2={f.y2}
          stroke="#7A27FF"
          strokeWidth="0.5"
          opacity={0.06 * coherence}
        />
      ))}

      {atoms.map((a, i) => (
        <circle
          key={`atom-${i}`}
          cx={a.x}
          cy={a.y}
          r={a.r}
          fill={a.color}
          opacity={a.opacity}
          filter="url(#sonic-glow)"
        />
      ))}

      {/* Central atom — 2.5s pulse ≈ T1 spin-lattice relaxation */}
      <circle
        cx={center}
        cy={center}
        r={4 * sc}
        fill="#00FF88"
        opacity={reducedMotion ? 0.85 : undefined}
        style={
          reducedMotion
            ? undefined
            : {
                animation: 'sonic-central-pulse 2.5s ease-in-out infinite',
              }
        }
      />

      {activeNote && !reducedMotion && (
        <g transform={`translate(${center}, ${center})`}>
          <circle
            cx={0}
            cy={0}
            r={24}
            fill="none"
            stroke={activeNote.role === 'human' ? '#00FF88' : '#00D4FF'}
            strokeWidth="2"
            style={{
              transformOrigin: '0 0',
              animation: 'sonic-active-ring 0.6s ease-out forwards',
            }}
          />
        </g>
      )}

      {/* Coherence ring — 4s breath */}
      <circle
        cx={center}
        cy={center}
        r={coherenceRingR}
        fill="none"
        stroke="#00FF88"
        strokeWidth="0.5"
        strokeDasharray={dashArray}
        style={
          reducedMotion
            ? undefined
            : {
                animation: 'sonic-coherence-breathe 4s ease-in-out infinite',
                transformOrigin: `${center}px ${center}px`,
              }
        }
      />

      <style>{`
        @keyframes sonic-central-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes sonic-active-ring {
          0% { transform: scale(0.33); opacity: 0.5; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes sonic-coherence-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sonic-animate { animation: none !important; }
        }
      `}</style>
    </svg>
  );
}
