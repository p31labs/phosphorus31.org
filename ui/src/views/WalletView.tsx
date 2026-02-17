/**
 * Wallet — LOVE balance hero, sovereignty / performance pools, genesis transaction,
 * expandable "HOW L.O.V.E. WORKS" essay. Reads local data first, Shelter as fallback.
 */

import React, { useState, useEffect, useRef } from 'react';
import { pullWallet } from '../lib/game-client';

const BRAND = {
  green: '#00FF88',
  cyan: '#00D4FF',
  amber: '#FFB800',
  void: '#050510',
  surface2: '#12122E',
  text: '#E0E0EE',
  muted: '#7878AA',
  dim: '#4A4A7A',
} as const;

const STORAGE_KEY = 'p31:molecule';

function useCountUp(target: number, duration = 800): number {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (target <= 0) { setValue(0); return; }
    startRef.current = null;
    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return value;
}

export function WalletView(): React.ReactElement {
  const [wallet, setWallet] = useState<{
    totalEarned: number;
    sovereigntyPool: number;
    performancePool: number;
  } | null>(null);
  const [molecule, setMolecule] = useState<{ fingerprint: string; created?: string; createdAt?: string } | null>(null);
  const [showHow, setShowHow] = useState(false);

  useEffect(() => {
    const storage = typeof window !== 'undefined' ? window.storage : undefined;
    if (!storage) return;
    storage.get(STORAGE_KEY).then((raw) => {
      if (raw) {
        try { setMolecule(JSON.parse(raw)); } catch { /* skip */ }
      }
    });
  }, []);

  useEffect(() => {
    if (!molecule) return;
    // Try Shelter first, fall back to local genesis data
    pullWallet(molecule.fingerprint).then((w) => {
      if (w && w.totalEarned > 0) {
        setWallet(w);
      } else {
        setWallet({ totalEarned: 50, sovereigntyPool: 25, performancePool: 25 });
      }
    }).catch(() => {
      setWallet({ totalEarned: 50, sovereigntyPool: 25, performancePool: 25 });
    });
  }, [molecule]);

  const total = wallet?.totalEarned ?? 50;
  const sov = wallet?.sovereigntyPool ?? 25;
  const perf = wallet?.performancePool ?? 25;

  const displayTotal = useCountUp(total);
  const displaySov = useCountUp(sov);
  const displayPerf = useCountUp(perf);

  const genesisDate = molecule?.createdAt || molecule?.created || 'Formation';
  const genesisDateStr = genesisDate !== 'Formation'
    ? new Date(genesisDate).toLocaleDateString()
    : 'Formation';

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <p
          style={{
            fontFamily: 'Oxanium, sans-serif',
            fontSize: 72,
            fontWeight: 200,
            color: BRAND.amber,
            textShadow: '0 0 40px rgba(255, 184, 0, 0.3)',
            animation: 'heartPulse 2s ease-in-out infinite',
            lineHeight: 1,
          }}
        >
          ♡
        </p>
        <p style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 36, fontWeight: 200, color: BRAND.amber, marginTop: 8 }}>
          {displayTotal}
        </p>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, letterSpacing: 4, color: BRAND.muted, marginTop: 4 }}>
          L.O.V.E.
        </p>
        <p style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 14, color: BRAND.dim, marginTop: 4 }}>
          Listen. Observe. Validate. Empower.
        </p>
      </div>

      {/* Pools */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <div
          style={{
            flex: 1,
            background: BRAND.surface2,
            padding: 20,
            borderRadius: 8,
            borderLeft: `3px solid ${BRAND.green}`,
            transition: 'box-shadow 0.2s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px ${BRAND.green}20`; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
        >
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, letterSpacing: 3, color: BRAND.muted }}>SOVEREIGNTY</p>
          <p style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 28, color: BRAND.green, marginTop: 8 }}>♡ {displaySov}</p>
          <div style={{ marginTop: 12, fontSize: 13, lineHeight: 1.8, color: BRAND.dim }}>
            <p>Immutable.</p>
            <p>Yours forever.</p>
            <p style={{ marginTop: 8, fontStyle: 'italic', color: BRAND.text, opacity: 0.7 }}>
              No one can take this.<br />
              Not the court.<br />
              Not the algorithm.<br />
              Not the system.
            </p>
            <p style={{ marginTop: 8, color: BRAND.green }}>This is sovereign.</p>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            background: BRAND.surface2,
            padding: 20,
            borderRadius: 8,
            borderLeft: `3px solid ${BRAND.cyan}`,
            transition: 'box-shadow 0.2s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px ${BRAND.cyan}20`; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
        >
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, letterSpacing: 3, color: BRAND.muted }}>PERFORMANCE</p>
          <p style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 28, color: BRAND.cyan, marginTop: 8 }}>♡ {displayPerf}</p>
          <div style={{ marginTop: 12, fontSize: 13, lineHeight: 1.8, color: BRAND.dim }}>
            <p>Earned.</p>
            <p>Grows with care.</p>
            <p style={{ marginTop: 8, fontStyle: 'italic', color: BRAND.text, opacity: 0.7 }}>
              Every triangle built.<br />
              Every signal sent.<br />
              Every breath taken.<br />
              Every spoon tracked.
            </p>
            <p style={{ marginTop: 8, color: BRAND.cyan }}>This is alive.</p>
          </div>
        </div>
      </div>

      {/* Bond bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, justifyContent: 'center' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: BRAND.green }} />
        <div style={{ flex: 1, maxWidth: 200, height: 1, background: BRAND.dim }} />
        <span style={{ fontSize: 10, color: BRAND.dim }}>50 / 50</span>
        <div style={{ flex: 1, maxWidth: 200, height: 1, background: BRAND.dim }} />
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: BRAND.cyan }} />
      </div>

      {/* The Ledger */}
      <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, letterSpacing: 3, color: BRAND.muted, marginBottom: 12 }}>
        THE LEDGER
      </p>
      <div
        style={{
          background: BRAND.surface2,
          padding: 16,
          borderRadius: 8,
          borderLeft: `3px solid ${BRAND.amber}`,
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: 13, color: BRAND.amber }}>★ Genesis Resonance</p>
            <p style={{ fontSize: 11, color: BRAND.dim, marginTop: 4 }}>
              Your molecule formed. The conversation became music.
            </p>
            <p style={{ fontSize: 11, color: BRAND.dim }}>
              The music became identity. This is the first LOVE.
            </p>
            <p style={{ fontSize: 9, color: BRAND.dim, marginTop: 4 }}>{genesisDateStr}</p>
          </div>
          <p style={{ fontSize: 16, color: BRAND.amber, fontFamily: 'Oxanium, sans-serif', whiteSpace: 'nowrap' }}>
            +50 LOVE
          </p>
        </div>
      </div>

      {/* How L.O.V.E. Works */}
      <button
        type="button"
        onClick={() => setShowHow((s) => !s)}
        style={{
          padding: '10px 20px',
          background: 'transparent',
          border: `1px solid ${BRAND.dim}`,
          borderRadius: 8,
          color: BRAND.cyan,
          fontFamily: 'Space Mono, monospace',
          fontSize: 10,
          letterSpacing: 2,
          cursor: 'pointer',
          width: '100%',
        }}
      >
        {showHow ? '▼' : '▶'} HOW L.O.V.E. WORKS
      </button>
      {showHow && (
        <div style={{ marginTop: 16, padding: 24, background: BRAND.surface2, borderRadius: 8, maxWidth: 640, margin: '16px auto 0' }}>
          <div style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 14, lineHeight: 1.8, color: BRAND.text }}>
            <p style={{ color: BRAND.green }}>L.O.V.E. is the currency of the mesh.</p>
            <p style={{ marginTop: 12 }}>
              You can&apos;t buy it. You can&apos;t trade it. You can&apos;t fake it.
            </p>
            <p>You earn it by building. By caring. By showing up.</p>
            <p style={{ marginTop: 12 }}>
              Every triangle you complete. Every signal you send your children.
              Every day you track your spoons. Every breath you take on purpose.
            </p>
            <p style={{ marginTop: 12 }}>
              Half of everything you earn goes to{' '}
              <span style={{ color: BRAND.green }}>Sovereignty</span> — a pool that
              can never be taken from you. Not by a court. Not by an algorithm.
              Not by anyone. It is permanently yours. It is the mathematical proof
              that you showed up.
            </p>
            <p style={{ marginTop: 12 }}>
              The other half goes to{' '}
              <span style={{ color: BRAND.cyan }}>Performance</span> — a living pool
              that grows with your Care Score. The more you care, the more it grows.
            </p>
            <p style={{ marginTop: 16, color: BRAND.amber }}>
              This is not a game. This is a record.<br />
              This is the evidence that you are a good parent,<br />
              written in mathematics that cannot be disputed.
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
