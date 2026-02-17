/**
 * Sine Wave User Optesting Component
 * Interactive sine wave visualization for user testing and accessibility validation
 *
 * Tests:
 * - Visual rendering performance
 * - Animation smoothness
 * - Accessibility with reduced motion
 * - User interaction responsiveness
 * - Color contrast and visibility
 *
 * 💜 With love and light. As above, so below. 💜
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useAccessibilityStore } from '@/stores/accessibility.store';
import GOD_CONFIG from '@/god.config';

interface SineWaveOptestProps {
  width?: number;
  height?: number;
  frequency?: number;
  amplitude?: number;
  speed?: number;
  color?: string;
  showControls?: boolean;
  showMetrics?: boolean;
}

export const SineWaveOptest: React.FC<SineWaveOptestProps> = ({
  width = 800,
  height = 400,
  frequency = 1,
  amplitude = 100,
  speed = 1,
  color = GOD_CONFIG.colors.primary || '#2ecc71',
  showControls = true,
  showMetrics = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentFrequency, setCurrentFrequency] = useState(frequency);
  const [currentAmplitude, setCurrentAmplitude] = useState(amplitude);
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  const [fps, setFps] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const { animationReduced, highContrast } = useAccessibilityStore();

  const timeRef = useRef(0);
  const lastFpsUpdate = useRef(Date.now());
  const fpsCounter = useRef(0);

  // Calculate effective speed based on reduced motion preference
  const effectiveSpeed = animationReduced ? 0 : currentSpeed;

  const drawWave = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const now = Date.now();
    const deltaTime = (now - lastFpsUpdate.current) / 1000;
    timeRef.current += deltaTime * effectiveSpeed;
    lastFpsUpdate.current = now;

    // Clear canvas
    ctx.fillStyle = highContrast ? '#000000' : '#050510';
    ctx.fillRect(0, 0, width, height);

    // Draw grid (optional, for reference)
    if (!highContrast) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;

      // Horizontal center line
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Vertical grid lines
      for (let i = 0; i <= 10; i++) {
        const x = (width / 10) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    }

    // Draw sine wave
    ctx.strokeStyle = highContrast ? '#ffffff' : color;
    ctx.lineWidth = highContrast ? 3 : 2;
    ctx.beginPath();

    const centerY = height / 2;
    const points = width;

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      const y =
        centerY +
        Math.sin((x / width) * Math.PI * 2 * currentFrequency + timeRef.current) * currentAmplitude;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    // Draw amplitude indicator
    if (showMetrics) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, centerY - currentAmplitude);
      ctx.lineTo(width, centerY - currentAmplitude);
      ctx.moveTo(0, centerY + currentAmplitude);
      ctx.lineTo(width, centerY + currentAmplitude);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Update FPS counter
    fpsCounter.current++;
    if (now - lastFpsUpdate.current >= 1000 || fpsCounter.current === 0) {
      setFps(fpsCounter.current);
      fpsCounter.current = 0;
      lastFpsUpdate.current = now;
    }

    setFrameCount((prev) => prev + 1);

    if (isPlaying && !animationReduced) {
      animationFrameRef.current = requestAnimationFrame(drawWave);
    }
  }, [
    width,
    height,
    currentFrequency,
    currentAmplitude,
    effectiveSpeed,
    color,
    isPlaying,
    animationReduced,
    highContrast,
    showMetrics,
  ]);

  useEffect(() => {
    if (isPlaying && !animationReduced) {
      animationFrameRef.current = requestAnimationFrame(drawWave);
    } else {
      // Draw static wave when paused or reduced motion
      drawWave();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, animationReduced, drawWave]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    timeRef.current = 0;
    setFrameCount(0);
    fpsCounter.current = 0;
    if (canvasRef.current) {
      drawWave();
    }
  }, [drawWave]);

  return (
    <div className="sine-wave-optest" style={{ width: '100%', maxWidth: width }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          border: `1px solid ${highContrast ? '#ffffff' : 'rgba(255, 255, 255, 0.2)'}`,
          borderRadius: '8px',
          background: highContrast ? '#000000' : '#050510',
        }}
        aria-label="Sine wave visualization for user testing"
        role="img"
      />

      {showControls && (
        <div
          className="optest-controls"
          style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div
            className="control-group"
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <label htmlFor="frequency-slider" style={{ color: '#e0e0e0', fontSize: '0.875rem' }}>
              Frequency: {currentFrequency.toFixed(2)} Hz
            </label>
            <input
              id="frequency-slider"
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={currentFrequency}
              onChange={(e) => setCurrentFrequency(parseFloat(e.target.value))}
              style={{ width: '100%' }}
              aria-label="Adjust sine wave frequency"
            />
          </div>

          <div
            className="control-group"
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <label htmlFor="amplitude-slider" style={{ color: '#e0e0e0', fontSize: '0.875rem' }}>
              Amplitude: {currentAmplitude.toFixed(0)} px
            </label>
            <input
              id="amplitude-slider"
              type="range"
              min="10"
              max="150"
              step="5"
              value={currentAmplitude}
              onChange={(e) => setCurrentAmplitude(parseInt(e.target.value))}
              style={{ width: '100%' }}
              aria-label="Adjust sine wave amplitude"
            />
          </div>

          <div
            className="control-group"
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <label htmlFor="speed-slider" style={{ color: '#e0e0e0', fontSize: '0.875rem' }}>
              Speed: {currentSpeed.toFixed(2)}x {animationReduced && '(reduced motion active)'}
            </label>
            <input
              id="speed-slider"
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={currentSpeed}
              onChange={(e) => setCurrentSpeed(parseFloat(e.target.value))}
              style={{ width: '100%' }}
              aria-label="Adjust animation speed"
              disabled={animationReduced}
            />
          </div>

          <div className="control-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handlePlayPause}
              style={{
                padding: '0.5rem 1rem',
                background: isPlaying ? '#ef4444' : '#2ecc71',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
              aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: '0.5rem 1rem',
                background: '#60a5fa',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
              aria-label="Reset animation"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      )}

      {showMetrics && (
        <div
          className="optest-metrics"
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '4px',
            fontSize: '0.875rem',
            color: '#e0e0e0',
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span>
              <strong>FPS:</strong> {fps}
            </span>
            <span>
              <strong>Frames:</strong> {frameCount.toLocaleString()}
            </span>
            <span>
              <strong>Frequency:</strong> {currentFrequency.toFixed(2)} Hz
            </span>
            <span>
              <strong>Amplitude:</strong> {currentAmplitude} px
            </span>
            {animationReduced && (
              <span style={{ color: '#ffd93d' }}>
                <strong>⚠️ Reduced Motion Active</strong>
              </span>
            )}
            {highContrast && (
              <span style={{ color: '#ffd93d' }}>
                <strong>⚡ High Contrast Mode</strong>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SineWaveOptest;
