/**
 * PosnerHome — Full-screen molecule navigation with starfield and ambient music.
 * This IS home after formation. The atoms ARE the navigation. The void hums.
 * Sub-routes open as overlay panels. Sprout is full-screen (kids get their own universe).
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Starfield } from './Starfield';
import { PosnerNav } from './PosnerNav';
import { AmbientEngine } from '../lib/ambient-engine';

const BRAND = {
  green: '#00FF88',
  void: '#050510',
  text: '#E0E0EE',
  muted: '#7878AA',
  dim: '#4A4A7A',
} as const;

const STORAGE_KEY = 'p31:molecule';

interface PosnerHomeProps {
  children?: React.ReactNode;
}

export function PosnerHome({ children }: PosnerHomeProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [molecule, setMolecule] = useState<{
    fingerprint: string;
    dome: { name: string; color: string; intent: string };
    resonanceHistory?: unknown[];
    coherence?: number;
  } | null>(null);
  const [muted, setMuted] = useState(true);
  const [loveBalance] = useState(50);
  const [loading, setLoading] = useState(true);
  const ambientRef = useRef<AmbientEngine | null>(null);
  const [soundStarted, setSoundStarted] = useState(false);

  // Load molecule
  useEffect(() => {
    const storage = typeof window !== 'undefined' ? window.storage : undefined;
    if (!storage) { setLoading(false); return; }
    storage.get(STORAGE_KEY).then((raw) => {
      if (raw) {
        try { setMolecule(JSON.parse(raw)); } catch { /* skip */ }
      }
      setLoading(false);
    });
  }, []);

  // Sound toggle
  const toggleSound = useCallback(async () => {
    if (!soundStarted) {
      const engine = new AmbientEngine();
      await engine.init();
      ambientRef.current = engine;
      setSoundStarted(true);
      setMuted(false);
    } else if (ambientRef.current) {
      const next = !muted;
      setMuted(next);
      ambientRef.current.setMuted(next);
    }
  }, [soundStarted, muted]);

  useEffect(() => {
    return () => {
      ambientRef.current?.dispose();
    };
  }, []);

  const handleNavigate = useCallback((route: string) => {
    navigate(route);
  }, [navigate]);

  const handleHoverRoute = useCallback((route: string | null) => {
    if (route && ambientRef.current) {
      ambientRef.current.playRouteNote(route);
    }
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: BRAND.void,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: BRAND.muted,
        fontFamily: 'Oxanium, sans-serif',
      }}>
        The mesh is thinking...
      </div>
    );
  }

  if (!molecule) {
    navigate('/', { replace: true });
    return null;
  }

  const fp = molecule.fingerprint.slice(0, 6);
  const isHome = location.pathname === '/mesh';
  const hasPanel = !isHome && location.pathname !== '/sprout';

  return (
    <div style={{ position: 'fixed', inset: 0, background: BRAND.void, overflow: 'hidden' }}>
      {/* Starfield always renders behind */}
      <Starfield />

      {/* The Posner molecule */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          opacity: hasPanel ? 0.3 : 1,
          transition: 'opacity 0.4s ease-out',
          pointerEvents: hasPanel ? 'none' : 'auto',
        }}
      >
        <PosnerNav
          onNavigate={handleNavigate}
          onHoverRoute={handleHoverRoute}
          moleculeHash={molecule.fingerprint}
          domeFingerprint={molecule.fingerprint}
        />
      </div>

      {/* Floating HUD */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
        {/* Top-left: P31 wordmark */}
        <span style={{
          position: 'absolute', top: 16, left: 16,
          fontFamily: 'Space Mono, monospace', fontWeight: 700,
          color: BRAND.green, fontSize: 14, opacity: 0.4,
          pointerEvents: 'auto',
        }}>
          P³¹
        </span>

        {/* Top-right: mute toggle + dome name */}
        <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 12, alignItems: 'center', pointerEvents: 'auto' }}>
          <span style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 10, color: BRAND.muted, opacity: 0.5 }}>
            {molecule.dome?.name}
          </span>
          <button
            type="button"
            onClick={toggleSound}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: 16,
              color: BRAND.muted,
              opacity: 0.5,
            }}
            aria-label={muted ? 'Unmute ambient sound' : 'Mute ambient sound'}
          >
            {!soundStarted ? '🔇 tap for sound' : muted ? '🔇' : '🔊'}
          </button>
        </div>

        {/* Bottom-left: LOVE balance */}
        <span style={{
          position: 'absolute', bottom: 40, left: 16,
          fontFamily: 'Oxanium, sans-serif', fontSize: 10,
          color: BRAND.muted, opacity: 0.4,
        }}>
          ♡ {loveBalance} LOVE
        </span>

        {/* Bottom-right: fingerprint */}
        <span style={{
          position: 'absolute', bottom: 40, right: 16,
          fontFamily: 'Space Mono, monospace', fontSize: 10,
          color: BRAND.dim, opacity: 0.3,
        }}>
          {fp}
        </span>

        {/* Bottom-center: footer */}
        <span style={{
          position: 'absolute', bottom: 12, left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'Oxanium, sans-serif', fontSize: 10,
          color: BRAND.dim, opacity: 0.3, fontStyle: 'italic',
          whiteSpace: 'nowrap',
        }}>
          It&apos;s okay to be a little wonky. 🔺
        </span>
      </div>

      {/* Route panel overlay */}
      {hasPanel && children && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 5, 16, 0.92)',
            zIndex: 100,
            overflow: 'auto',
            animation: 'fadeSlideIn 0.3s ease',
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/mesh')}
            style={{
              position: 'sticky',
              top: 12,
              left: 12,
              zIndex: 101,
              background: 'transparent',
              border: `1px solid ${BRAND.dim}`,
              borderRadius: 6,
              padding: '6px 14px',
              color: BRAND.muted,
              fontFamily: 'Oxanium, sans-serif',
              fontSize: 11,
              cursor: 'pointer',
              marginLeft: 12,
              marginTop: 12,
            }}
          >
            ← back to molecule
          </button>
          <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
            {children}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
