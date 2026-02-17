/**
 * Waveform — heartbeat monitor of last notes (velocity + pitch).
 */

import React from 'react';
import type { FreqPoint } from '../lib/resonance-engine';

interface WaveformProps {
  notes: FreqPoint[];
  width: number;
  height?: number;
}

export function Waveform({ notes, width, height = 40 }: WaveformProps): React.ReactElement {
  const total = notes.length;
  const points: string[] = [];
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i]!;
    const x = (i / Math.max(1, total)) * width;
    const y = (1 - note.y) * height * 0.6 + note.x * height * 0.3;
    points.push(`${x},${y}`);
  }
  const polyline = points.join(' ');
  const last20 = notes.slice(-20);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Resonance waveform"
    >
      {polyline && (
        <polyline
          points={polyline}
          fill="none"
          stroke="#00FF88"
          strokeWidth="1"
          opacity="0.4"
        />
      )}
      {last20.map((note, i) => {
        const idx = notes.length - 20 + i;
        const x = total > 0 ? (idx / total) * width : 0;
        const y = (1 - note.y) * height * 0.6 + note.x * height * 0.3;
        return (
          <circle
            key={`dot-${i}`}
            cx={x}
            cy={y}
            r="1.5"
            fill={note.color}
            opacity="0.6"
          />
        );
      })}
    </svg>
  );
}
