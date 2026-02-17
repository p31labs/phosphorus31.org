/**
 * Mesh View — home after formation. Your dome, the mesh, stats.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pullMeshDirectory, pullWallet, getClient } from '../lib/game-client';

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

export function MeshView(): React.ReactElement {
  const navigate = useNavigate();
  const [molecule, setMolecule] = useState<{
    fingerprint: string;
    dome: { name: string; color: string; intent: string };
  } | null>(null);
  const [domes, setDomes] = useState<Array<{ fingerprint: string; dome_name: string; dome_color: string; dome_intent: string; created_at: string }>>([]);
  const [wallet, setWallet] = useState<{ totalEarned: number; sovereigntyPool: number; performancePool: number } | null>(null);

  useEffect(() => {
    const storage = typeof window !== 'undefined' ? window.storage : undefined;
    if (!storage) return;
    storage.get(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setMolecule(JSON.parse(raw));
        } catch {}
      }
    });
  }, []);

  useEffect(() => {
    (async () => {
      const list = await pullMeshDirectory();
      setDomes(list);
      if (molecule) {
        const w = await pullWallet(molecule.fingerprint);
        if (w) setWallet(w);
      }
    })();
  }, [molecule]);

  const client = getClient();
  const tier = client?.player.tier ?? 'seedling';
  const loveTotal = wallet?.totalEarned ?? 50;
  const onlyOne = domes.length <= 1;

  return (
    <div>
      <h1 style={{ fontSize: 14, letterSpacing: 4, color: BRAND.muted, marginBottom: 24 }}>
        THE MESH
      </h1>

      {molecule && (
        <div
          style={{
            background: BRAND.surface2,
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            borderLeft: `4px solid ${molecule.dome.color || BRAND.green}`,
          }}
        >
          <p style={{ color: molecule.dome.color || BRAND.green, fontWeight: 600, marginBottom: 4 }}>
            YOUR DOME
          </p>
          <p style={{ fontSize: 12, color: BRAND.muted }}>{molecule.dome.name}</p>
          <p style={{ fontSize: 10, color: BRAND.dim }}>{molecule.fingerprint.slice(0, 16)}…</p>
          <p style={{ fontSize: 10, color: BRAND.dim, marginTop: 8 }}>Tier: {tier} · {loveTotal} LOVE</p>
          <button
            type="button"
            onClick={() => navigate(`/dome/${molecule.fingerprint}`)}
            style={{
              marginTop: 12,
              padding: '8px 16px',
              background: BRAND.green,
              color: BRAND.void,
              border: 'none',
              borderRadius: 8,
              fontFamily: 'Oxanium, sans-serif',
              cursor: 'pointer',
            }}
          >
            Enter Dome →
          </button>
        </div>
      )}

      <h2 style={{ fontSize: 12, letterSpacing: 2, color: BRAND.muted, marginBottom: 12 }}>
        THE MESH
      </h2>
      {onlyOne ? (
        <p style={{ color: BRAND.dim, fontSize: 14 }}>
          You are the first atom. Others will come.
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {domes.map((d) => (
            <li
              key={d.fingerprint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 0',
                borderBottom: `1px solid ${BRAND.dim}`,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: d.dome_color || BRAND.green,
                }}
              />
              <span>{d.dome_name}</span>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: BRAND.dim }}>
                {d.fingerprint.slice(0, 6)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p style={{ marginTop: 24, fontSize: 11, color: BRAND.dim }}>
        {domes.length} molecule{domes.length !== 1 ? 's' : ''} · You are molecule #{domes.length || 1}
      </p>
    </div>
  );
}
