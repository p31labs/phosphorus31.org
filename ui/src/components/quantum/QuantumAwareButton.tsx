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
 * QUANTUM-AWARE BUTTON
 * Button component that adapts to quantum coherence state
 */

import React from 'react';
import { useCoherence, useUIAdaptation } from '../../stores/quantum.store';
import GOD_CONFIG from '../../config/god.config';

interface QuantumAwareButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  quantumGlow?: boolean;
}

export const QuantumAwareButton: React.FC<QuantumAwareButtonProps> = ({
  children,
  variant = 'primary',
  quantumGlow = true,
  style,
  ...props
}) => {
  const coherence = useCoherence();
  const { glowIntensity, animationSpeed } = useUIAdaptation();

  // Calculate quantum-aware styles
  const baseColor = GOD_CONFIG.theme.border.accent || GOD_CONFIG.theme.text.accent;
  const glowColor = `hsla(180, 80%, 60%, ${glowIntensity * 0.6})`;
  const borderGlow = quantumGlow ? `0 0 ${glowIntensity * 8}px ${glowColor}` : 'none';

  const variantStyles = {
    primary: {
      backgroundColor: GOD_CONFIG.theme.bg.accent,
      borderColor: baseColor,
      color: GOD_CONFIG.theme.text.primary,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderColor: baseColor,
      color: baseColor,
    },
    accent: {
      backgroundColor: baseColor + '20',
      borderColor: baseColor,
      color: baseColor,
    },
  };

  const quantumStyle: React.CSSProperties = {
    ...variantStyles[variant],
    border: `1px solid ${baseColor}`,
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontFamily: GOD_CONFIG.typography.fontFamily.body,
    fontSize: '14px',
    transition: `all ${0.3 / animationSpeed}s ease`,
    boxShadow: borderGlow,
    position: 'relative',
    overflow: 'hidden',
    ...style,
  };

  // Quantum field effect (subtle animation)
  const fieldEffect: React.CSSProperties = quantumGlow
    ? {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '200%',
        height: '200%',
        background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        opacity: (coherence * glowIntensity) / 2,
        animation: `quantum-pulse ${2 / animationSpeed}s ease-in-out infinite`,
        pointerEvents: 'none',
      }
    : {};

  return (
    <>
      <style>
        {`
          @keyframes quantum-pulse {
            0%, 100% { opacity: ${(coherence * glowIntensity) / 3}; transform: translate(-50%, -50%) scale(0.8); }
            50% { opacity: ${(coherence * glowIntensity) / 2}; transform: translate(-50%, -50%) scale(1.2); }
          }
        `}
      </style>
      <button style={quantumStyle} {...props}>
        {quantumGlow && <div style={fieldEffect} />}
        <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
      </button>
    </>
  );
};
