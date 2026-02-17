/**
 * MeshLayout — shared top bar, nav dots, route guard.
 * Used by all routes except /. No molecule → redirect to /.
 */

import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';

const BRAND = {
  green: '#00FF88',
  cyan: '#00D4FF',
  amber: '#FFB800',
  violet: '#7A27FF',
  magenta: '#FF00CC',
  void: '#050510',
  surface2: '#12122E',
  text: '#E0E0EE',
  muted: '#7878AA',
  dim: '#4A4A7A',
} as const;

const STORAGE_KEY = 'p31:molecule';

const NAV = [
  { path: '/mesh', label: 'mesh', color: BRAND.green },
  { path: '/scope', label: 'scope', color: BRAND.cyan },
  { path: '/fold', label: 'fold', color: BRAND.amber },
  { path: '/wallet', label: 'wallet', color: BRAND.magenta },
  { path: '/challenges', label: 'challenges', color: BRAND.violet },
] as const;

export function MeshLayout(): React.ReactElement {
  const [molecule, setMolecule] = useState<{ fingerprint: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storage = typeof window !== 'undefined' ? window.storage : undefined;
    if (!storage) {
      setLoading(false);
      return;
    }
    storage.get(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const mol = JSON.parse(raw) as { fingerprint: string };
          setMolecule(mol);
        } catch {
          setMolecule(null);
        }
      } else {
        setMolecule(null);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: BRAND.void,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: BRAND.muted,
          fontFamily: 'Oxanium, sans-serif',
        }}
        aria-live="polite"
      >
        Loading…
      </div>
    );
  }

  if (!molecule) {
    return <Navigate to="/" replace />;
  }

  const fp = molecule.fingerprint.slice(0, 6);
  const currentPath = location.pathname;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: BRAND.void,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Oxanium, sans-serif',
        color: BRAND.text,
      }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#00FF88] focus:text-[#050510] focus:rounded focus:font-bold"
      >
        Skip to main content
      </a>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: BRAND.surface2,
          borderBottom: `1px solid ${BRAND.dim}`,
        }}
      >
        <span style={{ fontFamily: 'Space Mono, monospace', fontWeight: 700, color: BRAND.green }}>
          P³¹
        </span>
        <nav
          style={{ display: 'flex', gap: 8, alignItems: 'center' }}
          role="navigation"
          aria-label="Main"
        >
          {NAV.map(({ path, label, color }) => {
            const active = currentPath === path;
            return (
              <button
                key={path}
                type="button"
                onClick={() => navigate(path)}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: active ? color : `${color}66`,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: active ? `0 0 8px ${color}` : undefined,
                  transition: 'all 0.2s ease',
                }}
                aria-label={`Navigate to ${label}`}
                aria-current={active ? 'page' : undefined}
              />
            );
          })}
        </nav>
        <span
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 10,
            color: BRAND.muted,
            letterSpacing: 1,
          }}
        >
          {fp}
        </span>
      </header>
      <main id="main-content" style={{ flex: 1, padding: 24 }}>
        {/* @ts-expect-error TS2786 — React 18 / react-router-dom ReactNode vs ReactElement compatibility */}
        <Outlet />
      </main>
      <footer
        style={{
          padding: 8,
          textAlign: 'center',
          fontSize: 10,
          color: BRAND.dim,
          fontStyle: 'italic',
          opacity: 0.5,
        }}
      >
        It&apos;s okay to be a little wonky. 🔺
      </footer>
    </div>
  );
}
