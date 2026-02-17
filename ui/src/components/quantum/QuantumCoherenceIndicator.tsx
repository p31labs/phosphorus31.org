/**
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * QUANTUM COHERENCE INDICATOR
 * Visual indicator of quantum coherence state with real-time updates
 */

import React, { useEffect, useRef } from 'react';
import { useCoherence, useQuantumPhase, useUIAdaptation } from '../../stores/quantum.store';
import GOD_CONFIG from '../../config/god.config';

interface QuantumCoherenceIndicatorProps {
  size?: number;
  showLabel?: boolean;
  animated?: boolean;
}

export const QuantumCoherenceIndicator: React.FC<QuantumCoherenceIndicatorProps> = ({
  size = 24,
  showLabel = true,
  animated = true,
}) => {
  const coherence = useCoherence();
  const phase = useQuantumPhase();
  const { glowIntensity, animationSpeed } = useUIAdaptation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !animated) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.35;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, size, size);

      // Outer glow ring (coherence-based)
      const glowRadius = radius + glowIntensity * 5;
      const gradient = ctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, glowRadius);
      gradient.addColorStop(0, `hsla(180, 80%, 60%, ${coherence * 0.8})`);
      gradient.addColorStop(1, 'hsla(180, 80%, 60%, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Main coherence ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsl(${180 + coherence * 60}, 80%, ${50 + coherence * 30}%)`;
      ctx.lineWidth = 2 + coherence * 2;
      ctx.stroke();

      // Phase indicator (rotating dot)
      const phaseX = centerX + Math.cos(phase + time * animationSpeed * 0.01) * radius;
      const phaseY = centerY + Math.sin(phase + time * animationSpeed * 0.01) * radius;

      ctx.beginPath();
      ctx.arc(phaseX, phaseY, 2 + coherence * 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${180 + coherence * 60}, 100%, 70%)`;
      ctx.fill();

      // Inner core (purity indicator)
      const coreRadius = radius * 0.4 * coherence;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${180 + coherence * 60}, 80%, 60%, ${coherence * 0.6})`;
      ctx.fill();

      time += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [size, coherence, phase, glowIntensity, animationSpeed, animated]);

  const coherencePercent = Math.round(coherence * 100);
  const coherenceColor = `hsl(${180 + coherence * 60}, 80%, ${50 + coherence * 30}%)`;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontFamily: GOD_CONFIG.typography.fontFamily.body,
      }}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{
          display: 'block',
          filter: `drop-shadow(0 0 ${glowIntensity * 4}px ${coherenceColor})`,
        }}
      />
      {showLabel && (
        <span
          style={{
            fontSize: '12px',
            color: GOD_CONFIG.theme.text.secondary,
            fontFamily: 'monospace',
          }}
        >
          {coherencePercent}%
        </span>
      )}
    </div>
  );
};
