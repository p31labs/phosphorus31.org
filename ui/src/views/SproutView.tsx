/**
 * Sprout — four quadrants: OK, HELP, LOVE, THINK. Ages 4–12. Touch targets ≥120px.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { haptic } from '../lib/haptics';

const BRAND = {
  green: '#00FF88',
  magenta: '#FF00CC',
  amber: '#FFB800',
  cyan: '#00D4FF',
  void: '#050510',
  text: '#E0E0EE',
  muted: '#7878AA',
} as const;

const SHELTER_URL = import.meta.env.VITE_SHELTER_URL || '';
const STORAGE_KEY = 'p31:molecule';

const BUTTONS = [
  { id: 'ok', label: "I'm okay", sub: 'All good', color: BRAND.green, signal: 'ok' },
  { id: 'help', label: 'I need help', sub: 'I need you', color: BRAND.magenta, signal: 'help' },
  { id: 'love', label: 'I love you', sub: 'Sending love', color: BRAND.amber, signal: 'love' },
  { id: 'think', label: 'I need to think', sub: 'Give me a moment', color: BRAND.cyan, signal: 'think' },
] as const;

export function SproutView(): React.ReactElement {
  const navigate = useNavigate();
  const [sent, setSent] = useState<string | null>(null);
  const [fingerprint, setFingerprint] = useState<string>('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const storage = typeof window !== 'undefined' ? window.storage : undefined;
    if (!storage) {
      setLoaded(true);
      return;
    }
    storage.get(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const mol = JSON.parse(raw) as { fingerprint: string };
          setFingerprint(mol.fingerprint);
        } catch {}
      }
      setLoaded(true);
    });
  }, []);

  const sendAnchor = useCallback(
    async () => {
      haptic('anchor');
      const ts = new Date().toISOString();
      const payload = { type: 'anchor', direction: 'child_to_parent', fingerprint, timestamp: ts };
      const storage = typeof window !== 'undefined' ? window.storage : undefined;
      if (SHELTER_URL) {
        try {
          await fetch(`${SHELTER_URL.replace(/\/$/, '')}/api/sprout/anchor`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch {
          if (storage) await storage.set(`p31:anchor:${ts}`, JSON.stringify(payload));
        }
      } else if (storage) {
        await storage.set(`p31:anchor:${ts}`, JSON.stringify(payload));
      }
      setSent('anchor');
      setTimeout(() => setSent(null), 2000);
    },
    [fingerprint]
  );

  const sendSignal = useCallback(
    async (signal: string) => {
      // Fire the matching haptic pattern for each Sprout signal
      const hapticMap: Record<string, 'ok' | 'help' | 'love' | 'think'> = {
        ok: 'ok', help: 'help', love: 'love', think: 'think',
      };
      haptic(hapticMap[signal] ?? 'tap');
      const ts = new Date().toISOString();
      const payload = { type: signal, fingerprint, timestamp: ts };
      if (SHELTER_URL) {
        try {
          await fetch(`${SHELTER_URL.replace(/\/$/, '')}/api/sprout/signal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch {
          try {
            const storage = window.storage;
            if (storage) await storage.set(`p31:signals:${ts}`, JSON.stringify(payload));
          } catch {}
        }
      } else {
        try {
          const storage = window.storage;
          if (storage) await storage.set(`p31:signals:${ts}`, JSON.stringify(payload));
        } catch {}
        }
      setSent(signal);
      setTimeout(() => setSent(null), 2000);
    },
    [fingerprint]
  );

  if (loaded && !fingerprint) return <Navigate to="/" replace />;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: BRAND.void,
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
      }}
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#00FF88] focus:text-[#050510] focus:rounded">
        Skip to main content
      </a>
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          fontSize: 8,
          color: BRAND.muted,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          zIndex: 2,
        }}
        aria-label="Back"
      >
        ← back
      </button>

      <main
        id="main-content"
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 0,
          padding: 16,
          paddingTop: 48,
        }}
      >
        {BUTTONS.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => sendSignal(b.signal)}
            style={{
              minHeight: 120,
              minWidth: 120,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: b.color,
              color: BRAND.void,
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
              fontFamily: 'Oxanium, sans-serif',
              fontSize: 14,
              fontWeight: 200,
            }}
            aria-label={b.label}
          >
            <span style={{ fontSize: 48, marginBottom: 8 }}>{b.id.toUpperCase()}</span>
            <span>{b.label}</span>
            <span style={{ fontSize: 10, opacity: 0.9, marginTop: 4 }}>{b.sub}</span>
          </button>
        ))}
      </main>
      {/* Anchor — 5th button: "Thinking of you" */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 16px 16px' }}>
        <button
          type="button"
          onClick={sendAnchor}
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'transparent',
            border: `2px solid ${BRAND.text}`,
            color: BRAND.text,
            cursor: 'pointer',
            fontFamily: 'Oxanium, sans-serif',
            fontSize: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(224, 224, 238, 0.15)',
          }}
          aria-label="Thinking of you — send an anchor signal"
        >
          <span style={{ fontSize: 18, marginBottom: 2 }}>●</span>
          <span style={{ fontSize: 8, letterSpacing: 1 }}>ANCHOR</span>
        </button>
      </div>

      {sent && (
        <p
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: sent === 'anchor' ? BRAND.text : BRAND.green,
            color: BRAND.void,
            padding: '10px 20px',
            borderRadius: 8,
            fontFamily: 'Oxanium, sans-serif',
            fontSize: 14,
          }}
        >
          {sent === 'anchor' ? 'Sent. 💚' : 'Signal sent ✓'}
        </p>
      )}
    </div>
  );
}
