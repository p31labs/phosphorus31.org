/**
 * Dome View — single dome by fingerprint. Reads local storage first, Shelter as fallback.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pullMeshDirectory } from '../lib/game-client';

const BRAND = {
  green: '#00FF88',
  void: '#050510',
  surface2: '#12122E',
  text: '#E0E0EE',
  muted: '#7878AA',
  dim: '#4A4A7A',
} as const;

const STORAGE_KEY = 'p31:molecule';

interface DomeData {
  name: string;
  color: string;
  intent: string;
  fingerprint: string;
  created: string;
  isOwn: boolean;
  noteCount?: number;
  love?: number;
}

export function DomeView(): React.ReactElement {
  const { fp } = useParams<{ fp: string }>();
  const navigate = useNavigate();
  const [dome, setDome] = useState<DomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fp) { setLoading(false); return; }

    const loadDome = async () => {
      const storage = typeof window !== 'undefined' ? window.storage : undefined;

      // Try local storage first
      if (storage) {
        const raw = await storage.get(STORAGE_KEY);
        if (raw) {
          try {
            const mol = JSON.parse(raw) as {
              fingerprint: string;
              dome: { name: string; color: string; intent: string };
              created: string;
              noteCount?: number;
              resonanceSignature?: string;
            };
            if (mol.fingerprint.startsWith(fp) || fp.startsWith(mol.fingerprint.slice(0, fp.length))) {
              setDome({
                name: mol.dome.name,
                color: mol.dome.color,
                intent: mol.dome.intent,
                fingerprint: mol.fingerprint,
                created: mol.created,
                isOwn: true,
                noteCount: mol.noteCount,
                love: 50,
              });
              setLoading(false);
              return;
            }
          } catch { /* fall through */ }
        }
      }

      // Try Shelter as secondary source
      try {
        const list = await pullMeshDirectory();
        const found = list.find((d) => d.fingerprint === fp);
        if (found) {
          setDome({
            name: found.dome_name,
            color: found.dome_color,
            intent: found.dome_intent,
            fingerprint: found.fingerprint,
            created: found.created_at,
            isOwn: false,
          });
        }
      } catch { /* offline, no shelter */ }

      setLoading(false);
    };

    loadDome();
  }, [fp]);

  if (!fp) return <div style={{ color: BRAND.muted }}>No fingerprint.</div>;
  if (loading) return <div style={{ color: BRAND.muted }}>Loading…</div>;
  if (!dome) return <div style={{ color: BRAND.muted }}>Dome not found in local storage.</div>;

  return (
    <div>
      <h1 style={{ fontSize: 14, letterSpacing: 4, color: BRAND.muted, marginBottom: 24 }}>
        DOME
      </h1>
      <div
        style={{
          background: BRAND.surface2,
          padding: 24,
          borderRadius: 12,
          borderLeft: `4px solid ${dome.color || BRAND.green}`,
        }}
      >
        <p style={{ color: dome.color || BRAND.green, fontWeight: 600, fontSize: 18 }}>
          {dome.name}
        </p>
        {dome.intent && (
          <p style={{ fontSize: 12, color: BRAND.text, marginTop: 8, fontStyle: 'italic' }}>
            {dome.intent}
          </p>
        )}
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: BRAND.dim, marginTop: 12 }}>
          {dome.fingerprint}
        </p>
        {dome.created && (
          <p style={{ fontSize: 11, color: BRAND.dim, marginTop: 8 }}>
            Created {new Date(dome.created).toLocaleDateString()}
          </p>
        )}
        {dome.isOwn && (
          <>
            <p style={{ fontSize: 12, color: BRAND.green, marginTop: 12 }}>
              This is your dome.
            </p>
            <p style={{ fontSize: 11, color: BRAND.dim, marginTop: 4 }}>
              Tier: seedling · {dome.love ?? 50} LOVE
            </p>
          </>
        )}
      </div>
      <button
        type="button"
        onClick={() => navigate('/mesh')}
        style={{
          marginTop: 16,
          padding: '8px 16px',
          background: 'transparent',
          border: `1px solid ${BRAND.dim}`,
          borderRadius: 8,
          color: BRAND.muted,
          fontFamily: 'Oxanium, sans-serif',
          fontSize: 11,
          cursor: 'pointer',
        }}
      >
        ← Back to mesh
      </button>
    </div>
  );
}
