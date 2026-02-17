/**
 * Overload Guard — "Visual noise cancelling"
 * When spoons hit 0–2, the interface itself demonstrates
 * what overwhelm looks like and what accommodation means.
 * Two choices. Not nine routes. Not ten apps. Two.
 */

import React, { useState, useEffect, useCallback } from 'react';

const BRAND = {
  green: '#00FF88',
  magenta: '#FF00CC',
  amber: '#FFB800',
  void: '#050510',
  text: '#E0E0EE',
  muted: '#7878AA',
} as const;

interface OverloadGuardProps {
  currentSpoons: number;
  hasSpoonData: boolean;
  onBreathe: () => void;
  onLogFriction: () => void;
}

export function OverloadGuard({
  currentSpoons,
  hasSpoonData,
  onBreathe,
  onLogFriction,
}: OverloadGuardProps): React.ReactElement | null {
  const [dismissed, setDismissed] = useState(false);
  const [enabled, setEnabled] = useState(true);

  // Check if guard is enabled
  useEffect(() => {
    try {
      const stored = localStorage.getItem('p31:overload-guard');
      if (stored === 'false') setEnabled(false);
    } catch { /* default on */ }
  }, []);

  // Reset dismissed state when spoons recover
  useEffect(() => {
    if (currentSpoons > 3) setDismissed(false);
  }, [currentSpoons]);

  const shouldShow = enabled && hasSpoonData && currentSpoons <= 2 && !dismissed;

  // Add/remove blur class on body
  useEffect(() => {
    if (shouldShow) {
      document.body.classList.add('overloaded');
    } else {
      document.body.classList.remove('overloaded');
    }
    return () => document.body.classList.remove('overloaded');
  }, [shouldShow]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  if (!shouldShow) return null;

  return (
    <div
      className="overload-focus"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(5, 5, 16, 0.6)',
      }}
      role="alertdialog"
      aria-modal="true"
      aria-label="Overload guard — low energy"
    >
      <div
        style={{
          background: BRAND.void,
          border: `1px solid ${BRAND.muted}`,
          borderRadius: 16,
          padding: 32,
          maxWidth: 400,
          width: '90%',
          textAlign: 'center',
          fontFamily: 'Oxanium, sans-serif',
        }}
      >
        <p style={{ fontSize: 16, color: BRAND.text, marginBottom: 8 }}>
          You are at {currentSpoons} spoon{currentSpoons !== 1 ? 's' : ''}.
        </p>
        <p style={{ fontSize: 14, color: BRAND.muted, marginBottom: 24 }}>
          One thing at a time.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
          <button
            type="button"
            onClick={onBreathe}
            style={{
              padding: '12px 20px',
              background: BRAND.green,
              border: 'none',
              borderRadius: 8,
              color: BRAND.void,
              fontFamily: 'Oxanium, sans-serif',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              minHeight: 44,
            }}
          >
            BREATHE
          </button>
          <button
            type="button"
            onClick={onLogFriction}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: `1px solid ${BRAND.magenta}`,
              borderRadius: 8,
              color: BRAND.magenta,
              fontFamily: 'Oxanium, sans-serif',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              minHeight: 44,
            }}
          >
            LOG FRICTION
          </button>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: BRAND.muted,
            fontSize: 12,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          I'M OK — DISMISS
        </button>
      </div>
    </div>
  );
}
