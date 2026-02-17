import React, { useEffect, useState } from 'react';
import { useStore } from '../../store';

/**
 * GlitchOverlay - Cyberpunk-style glitch effects
 * Visualizes system stress and quantum fluctuations
 */
export default function GlitchOverlay() {
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [scanlineOffset, setScanlineOffset] = useState(0);
  
  const coherence = useStore((s) => s.coherence);
  const qStatistic = useStore((s) => s.qStatistic);
  const mode = useStore((s) => s.mode);

  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate glitch intensity based on system state
      const stress = (1 - coherence) * 0.5 + Math.abs(qStatistic - 1) * 0.3;
      const modeFactor = mode === 'SLICE' ? 0.3 : mode === 'EXPORT' ? 0.5 : 0;
      
      setGlitchIntensity(stress + modeFactor);
      setScanlineOffset(Math.random() * 100);
    }, 100);

    return () => clearInterval(interval);
  }, [coherence, qStatistic, mode]);

  return (
    <div className="glitch-overlay">
      {/* Scanlines */}
      <div 
        className="scanlines"
        style={{ 
          transform: `translateY(${scanlineOffset}px)`,
          opacity: glitchIntensity * 0.3
        }}
      />
      
      {/* Digital Rain */}
      <div 
        className="digital-rain"
        style={{ opacity: glitchIntensity * 0.2 }}
      >
        {Array.from({ length: 20 }, (_, i) => (
          <div 
            key={i}
            className="rain-char"
            style={{ 
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          >
            {Math.random() > 0.5 ? '0' : '1'}
          </div>
        ))}
      </div>

      {/* Glitch Text */}
      {glitchIntensity > 0.3 && (
        <div 
          className="glitch-text"
          style={{ 
            animationDuration: `${0.1 + (1 - glitchIntensity)}s`
          }}
        >
          SYSTEM STRESS: {(glitchIntensity * 100).toFixed(0)}%
        </div>
      )}

      {/* Static Noise */}
      <div 
        className="static-noise"
        style={{ 
          opacity: glitchIntensity * 0.1,
          backgroundSize: `${20 + glitchIntensity * 80}px ${20 + glitchIntensity * 80}px`
        }}
      />
    </div>
  );
}