/**
 * Identity — fingerprint, public key, covenant, dome, vesting, dissolve, export key.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClient } from '../lib/game-client';
import { generateExhibitA } from '../lib/exhibit-a';
import { haptic } from '../lib/haptics';

const BRAND = {
  green: '#00FF88',
  void: '#050510',
  surface2: '#12122E',
  text: '#E0E0EE',
  muted: '#7878AA',
  dim: '#4A4A7A',
  magenta: '#FF00CC',
} as const;

const STORAGE_KEY = 'p31:molecule';

export function IdentityView(): React.ReactElement {
  const navigate = useNavigate();
  const [molecule, setMolecule] = useState<{
    fingerprint: string;
    publicKey: JsonWebKey;
    covenantSig: string;
    covenantAt: string;
    dome: { name: string; color: string; intent: string };
    created: string;
  } | null>(null);
  const [expandKey, setExpandKey] = useState(false);
  const [dissolveConfirm, setDissolveConfirm] = useState(false);

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

  const handleDissolve = () => {
    if (!dissolveConfirm) {
      setDissolveConfirm(true);
      return;
    }
    const storage = window.storage;
    if (molecule && storage) {
      storage.remove(STORAGE_KEY);
      storage.remove(`p31:dome:${molecule.fingerprint}`);
      storage.remove(`p31:dir:${molecule.fingerprint}`);
    }
    setMolecule(null);
    navigate('/', { replace: true });
  };

  const copyKey = () => {
    if (molecule?.publicKey) {
      navigator.clipboard.writeText(JSON.stringify(molecule.publicKey));
    }
  };

  const client = getClient();
  const tier = client?.player.tier ?? 'seedling';
  const xp = client?.player.xp ?? 0;

  if (!molecule) return <div style={{ color: BRAND.muted }}>Loading…</div>;

  const keyStr = JSON.stringify(molecule.publicKey);
  const keyPreview = keyStr.slice(0, 32) + '…';

  return (
    <div>
      <h1 style={{ fontSize: 14, letterSpacing: 4, color: BRAND.muted, marginBottom: 24 }}>
        IDENTITY
      </h1>

      <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 24, letterSpacing: 4, textAlign: 'center', marginBottom: 8 }}>
        FINGERPRINT
      </p>
      <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 14, letterSpacing: 2, color: BRAND.text, textAlign: 'center', marginBottom: 24 }}>
        {molecule.fingerprint}
      </p>

      <p style={{ fontSize: 10, color: BRAND.muted, marginBottom: 4 }}>PUBLIC KEY</p>
      <button
        type="button"
        onClick={() => setExpandKey((e) => !e)}
        style={{
          display: 'block',
          width: '100%',
          padding: 12,
          background: BRAND.surface2,
          border: `1px solid ${BRAND.dim}`,
          borderRadius: 8,
          color: BRAND.text,
          fontFamily: 'Space Mono, monospace',
          fontSize: 10,
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        {expandKey ? keyStr : keyPreview}
      </button>

      <p style={{ fontSize: 10, color: BRAND.muted, marginTop: 16, marginBottom: 4 }}>COVENANT</p>
      <p style={{ fontSize: 14, color: molecule.covenantSig ? BRAND.green : BRAND.magenta }}>
        {molecule.covenantSig ? 'SIGNED ●' : 'UNSIGNED ●'} {molecule.covenantAt ? new Date(molecule.covenantAt).toLocaleDateString() : ''}
      </p>

      <p style={{ fontSize: 10, color: BRAND.muted, marginTop: 16, marginBottom: 4 }}>DOME</p>
      <p style={{ color: molecule.dome.color || BRAND.green }}>{molecule.dome.name}</p>
      <p style={{ fontSize: 11, color: BRAND.dim }}>{molecule.dome.intent}</p>
      <p style={{ fontSize: 10, color: BRAND.dim }}>Created {new Date(molecule.created).toLocaleDateString()}</p>

      <p style={{ fontSize: 10, color: BRAND.muted, marginTop: 16, marginBottom: 4 }}>VESTING</p>
      <p style={{ fontSize: 12 }}>Sovereignty (adults default)</p>

      <p style={{ fontSize: 10, color: BRAND.muted, marginTop: 16, marginBottom: 4 }}>ACCESS LEVEL</p>
      <p style={{ fontSize: 12 }}>BUILDER</p>

      <p style={{ fontSize: 10, color: BRAND.muted, marginTop: 16, marginBottom: 4 }}>TIER & XP</p>
      <p style={{ fontSize: 12 }}>{tier} · {xp} XP</p>

      <button
        type="button"
        onClick={copyKey}
        style={{
          marginTop: 24,
          padding: '10px 20px',
          background: BRAND.surface2,
          border: `1px solid ${BRAND.dim}`,
          borderRadius: 8,
          color: BRAND.text,
          fontFamily: 'Oxanium, sans-serif',
          cursor: 'pointer',
        }}
      >
        EXPORT KEY (copy JWK)
      </button>
      <p style={{ fontSize: 9, color: BRAND.dim, marginTop: 8 }}>Your private key never leaves this browser.</p>

      {/* Exhibit A — court-ready report */}
      <div style={{ marginTop: 24, padding: 16, border: `1px solid ${BRAND.dim}`, borderRadius: 8 }}>
        <button
          type="button"
          onClick={() => { haptic('success'); generateExhibitA(); }}
          style={{
            display: 'block',
            width: '100%',
            padding: '12px 16px',
            background: 'transparent',
            border: `1px solid #FFB800`,
            borderRadius: 8,
            color: '#FFB800',
            fontFamily: 'Oxanium, sans-serif',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          📄 GENERATE EXHIBIT A
        </button>
        <p style={{ fontSize: 10, color: BRAND.dim, marginTop: 6 }}>
          Compile 30-day report — spoons, friction, signals, LOVE
        </p>
      </div>

      <div style={{ marginTop: 32, padding: 16, border: `1px solid ${BRAND.dim}`, borderRadius: 8 }}>
        <p style={{ fontSize: 11, color: BRAND.magenta }}>DISSOLVE MOLECULE</p>
        <button
          type="button"
          onClick={handleDissolve}
          style={{
            marginTop: 8,
            padding: '8px 16px',
            background: 'transparent',
            border: `1px solid ${BRAND.magenta}`,
            borderRadius: 8,
            color: BRAND.magenta,
            fontFamily: 'Oxanium, sans-serif',
            cursor: 'pointer',
          }}
        >
          {dissolveConfirm ? 'Tap again to confirm' : 'This will permanently destroy your molecule. Tap again.'}
        </button>
      </div>
    </div>
  );
}
