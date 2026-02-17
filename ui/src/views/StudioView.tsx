/**
 * StudioView — The 4th vertex. P31 Studio.
 * Houses the Quantum Clock (Bob & Marge), WorldBuilder, and 3D geodesic canvas.
 * Lazy-loaded — Three.js only arrives when someone clicks STUDIO on the molecule.
 *
 * "Where potential becomes structure."
 */

import React, { useState } from 'react';

const BRAND = {
  green: '#00FF88',
  violet: '#7A27FF',
  void: '#050510',
  surface2: '#12122E',
  text: '#E0E0EE',
  muted: '#7878AA',
  dim: '#4A4A7A',
} as const;

// Lazy-load: React.lazy + dynamic import creates a separate Vite chunk.
// The Three.js/R3F dependency chain lives entirely in StudioCanvas and its imports.
const StudioCanvas = React.lazy(() => import('../components/StudioCanvas'));

type StudioTab = 'clock' | 'world';

export function StudioView(): React.ReactElement {
  const [tab, setTab] = useState<StudioTab>('clock');
  const [worldId] = useState<string>('default');

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{
        fontFamily: 'Space Mono, monospace',
        fontSize: 9,
        letterSpacing: 5,
        color: BRAND.muted,
        marginBottom: 16,
      }}>
        THE STUDIO
      </h1>
      <p style={{ fontSize: 12, color: BRAND.dim, marginBottom: 24 }}>
        Where potential becomes structure. The clock keeps time. The builder makes space.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['clock', 'world'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            style={{
              padding: '8px 16px',
              background: tab === t ? BRAND.surface2 : 'transparent',
              border: `1px solid ${tab === t ? BRAND.violet : BRAND.dim}`,
              borderRadius: 6,
              color: tab === t ? BRAND.violet : BRAND.muted,
              fontFamily: 'Space Mono, monospace',
              fontSize: 9,
              letterSpacing: 2,
              cursor: 'pointer',
            }}
          >
            {t === 'clock' ? 'QUANTUM CLOCK' : 'WORLD BUILDER'}
          </button>
        ))}
      </div>

      <div style={{
        width: '100%', height: '60vh', minHeight: 400,
        background: BRAND.void, borderRadius: 12,
        border: `1px solid ${BRAND.dim}`, overflow: 'hidden',
      }}>
        <React.Suspense fallback={
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100%', color: BRAND.muted, fontFamily: 'Oxanium, sans-serif',
          }}>
            Loading the Studio...
          </div>
        }>
          <StudioCanvas tab={tab} worldId={worldId} />
        </React.Suspense>
      </div>

      {tab === 'clock' && (
        <div style={{ marginTop: 16, padding: 16, background: BRAND.surface2, borderRadius: 8 }}>
          <p style={{ fontSize: 13, color: BRAND.text, lineHeight: 1.8 }}>
            The Quantum Grandfather-Cuckoo Clock. Bob is the pendulum — steady, reliable,
            always swinging. Marge is the cuckoo — playful, surprising, bursting with color.
          </p>
          <p style={{ fontSize: 10, color: BRAND.dim, marginTop: 8, fontStyle: 'italic' }}>
            With love and light. As above, so below.
          </p>
        </div>
      )}

      {tab === 'world' && (
        <div style={{ marginTop: 16, padding: 16, background: BRAND.surface2, borderRadius: 8 }}>
          <p style={{ fontSize: 13, color: BRAND.text, lineHeight: 1.8 }}>
            Build geodesic structures in 3D. Add tetrahedra, generate Sierpinski fractals,
            analyze stability.
          </p>
        </div>
      )}
    </div>
  );
}
