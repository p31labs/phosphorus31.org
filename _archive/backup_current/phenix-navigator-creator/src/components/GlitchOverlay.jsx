// ══════════════════════════════════════════════════════════════════════════════
// GLITCH OVERLAY
// Voltage-driven visual effect layer.
// - Persistent CRT scanlines
// - Chromatic aberration (RGB split) at high voltage
// - Edge vignetting
// - Warning flash when voltage > 90
// Quantized intensity values to minimize keyframe regeneration.
// ══════════════════════════════════════════════════════════════════════════════

import { useMemo } from 'react';

/**
 * GlitchOverlay - Visual effects layer
 * @param {number} voltage - System voltage (0-100)
 */
export default function GlitchOverlay({ voltage }) {
  // ── Calculate Intensity ────────────────────────────────────────────────────
  // Only active above voltage 60
  const rawIntensity = Math.max(0, (voltage - 60) / 40);
  
  // Quantize to 0.05 steps (20 discrete states) to limit keyframe regeneration
  const intensity = Math.round(rawIntensity * 20) / 20;

  // ── Memoize Keyframes ──────────────────────────────────────────────────────
  const glitchKeyframes = useMemo(() => `
    @keyframes phenix-glitch-a {
      0% { transform: translate(0px, 0px); }
      20% { transform: translate(-${2 + intensity * 2}px, 0px); }
      40% { transform: translate(${1 + intensity * 3}px, 0px); }
      60% { transform: translate(-${1 + intensity}px, 0px); }
      80% { transform: translate(${intensity * 2}px, 0px); }
      100% { transform: translate(0px, 0px); }
    }
    @keyframes phenix-glitch-b {
      0% { transform: translate(0px, 0px); }
      15% { transform: translate(${2 + intensity * 2}px, 0px); }
      35% { transform: translate(-${1 + intensity * 3}px, 0px); }
      65% { transform: translate(${1 + intensity}px, 0px); }
      85% { transform: translate(-${intensity * 2}px, 0px); }
      100% { transform: translate(0px, 0px); }
    }
    @keyframes phenix-warning-flash {
      0%, 100% { opacity: 0.04; }
      50% { opacity: 0.12; }
    }
  `, [intensity]);

  // ── Chromatic Aberration Alpha ─────────────────────────────────────────────
  const aberrationAlpha = 0.02 + rawIntensity * 0.04;

  return (
    <>
      {/* ── Scanlines (always visible) ────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px)',
        opacity: 0.6
      }} />

      {/* ── Chromatic Aberration (high voltage only) ──────────────────────── */}
      {voltage > 60 && (
        <>
          {/* Red channel offset */}
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            pointerEvents: 'none',
            background: `rgba(255, 0, 0, ${aberrationAlpha})`,
            mixBlendMode: 'screen',
            animation: `phenix-glitch-a ${0.15 + (1 - intensity) * 0.1}s ease-in-out infinite`
          }} />
          
          {/* Cyan channel offset */}
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            pointerEvents: 'none',
            background: `rgba(0, 255, 255, ${aberrationAlpha})`,
            mixBlendMode: 'screen',
            animation: `phenix-glitch-b ${0.12 + (1 - intensity) * 0.08}s ease-in-out infinite`
          }} />
        </>
      )}

      {/* ── Vignette ──────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 45%, rgba(2, 6, 23, 0.55) 100%)'
      }} />

      {/* ── Warning Flash (voltage > 90) ──────────────────────────────────── */}
      {voltage > 90 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 6,
          pointerEvents: 'none',
          background: `rgba(239, 68, 68, ${0.04 + (voltage - 90) * 0.006})`,
          animation: 'phenix-warning-flash 0.8s ease-in-out infinite'
        }} />
      )}

      {/* ── Keyframes Injection ───────────────────────────────────────────── */}
      <style>{glitchKeyframes}</style>
    </>
  );
}
