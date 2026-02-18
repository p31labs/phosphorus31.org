/**
 * The Scope — mission control. Spoon gauge, voltage, LOVE, Sprout signals,
 * Safe Harbor (meds + sleep), Friction Log, Inverse Dashboard, Overload Guard.
 *
 * The prosthetic layer: if you don't log the struggle, it didn't happen.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { pullMetabolism, pullWallet, getShelterBridge } from '../lib/game-client';
import { MedsCard, SleepCard } from '../components/SafeHarbor';
import { FrictionLogModal, FrictionHistory, saveFrictionEntry, loadFrictionEntries, type FrictionEntry } from '../components/FrictionLog';
import { InverseDashboard } from '../components/InverseDashboard';
import { OverloadGuard } from '../components/OverloadGuard';
import { Mar10DayBanner } from '../components/Scope/Mar10DayBanner';
import { generateExhibitA } from '../lib/exhibit-a';
import { haptic } from '../lib/haptics';

const BRAND = {
  green: '#00FF88',
  amber: '#FFB800',
  magenta: '#FF00CC',
  cyan: '#00D4FF',
  void: '#050510',
  surface2: '#12122E',
  text: '#E0E0EE',
  muted: '#7878AA',
  dim: '#4A4A7A',
} as const;

const STORAGE_KEY = 'p31:molecule';

type ScopeTab = 'scope' | 'inverse';

export function ScopeView(): React.ReactElement {
  const [molecule, setMolecule] = useState<{ fingerprint: string } | null>(null);
  const [spoons, setSpoons] = useState<{ spoons: number; maxSpoons: number; color: string } | null>(null);
  const [wallet, setWallet] = useState<{ totalEarned: number; sovereigntyPool: number; performancePool: number } | null>(null);
  const [shelterOk, setShelterOk] = useState<boolean | null>(null);
  const [tab, setTab] = useState<ScopeTab>('scope');
  const [showFrictionModal, setShowFrictionModal] = useState(false);
  const [frictionEntries, setFrictionEntries] = useState<FrictionEntry[]>([]);
  const [hasSpoonData, setHasSpoonData] = useState(false);

  // Load molecule
  useEffect(() => {
    const storage = typeof window !== 'undefined' ? window.storage : undefined;
    if (!storage) return;
    storage.get(STORAGE_KEY).then((raw) => {
      if (raw) {
        try { setMolecule(JSON.parse(raw)); } catch { /* skip */ }
      }
    });
  }, []);

  // Load friction entries
  useEffect(() => {
    loadFrictionEntries().then(setFrictionEntries);
  }, []);

  // Poll spoons + wallet
  useEffect(() => {
    const fetchData = async () => {
      const mode = await pullMetabolism();
      if (mode) {
        const bridge = getShelterBridge();
        const state = bridge ? await bridge.getBrainState().catch(() => null) : null;
        if (state) {
          setSpoons({ spoons: state.spoons, maxSpoons: state.maxSpoons, color: state.color });
          setShelterOk(true);
          setHasSpoonData(true);
        } else {
          setSpoons((s) => s ?? { spoons: 12, maxSpoons: 12, color: 'GREEN' });
          setShelterOk(false);
        }
      }
      if (molecule) {
        const w = await pullWallet(molecule.fingerprint);
        if (w && w.totalEarned > 0) {
          setWallet(w);
        } else {
          // Local genesis fallback
          setWallet({ totalEarned: 50, sovereigntyPool: 25, performancePool: 25 });
        }
      }
    };

    fetchData();
    const t = setInterval(fetchData, 60000);
    return () => clearInterval(t);
  }, [molecule]);

  const spoonsVal = spoons?.spoons ?? 12;
  const maxSpoonsVal = spoons?.maxSpoons ?? 12;
  const pct = maxSpoonsVal ? (spoonsVal / maxSpoonsVal) * 100 : 0;
  const barColor = pct > 60 ? BRAND.green : pct > 30 ? BRAND.amber : BRAND.magenta;

  const handleFrictionSave = useCallback(async (entry: FrictionEntry) => {
    await saveFrictionEntry(entry);
    setFrictionEntries((prev) => [entry, ...prev]);
    // Deduct spoons (if connected to shelter, this would sync; locally, approximate)
    setSpoons((s) => {
      if (!s) return s;
      const after = Math.max(0, s.spoons - entry.spoonCost);
      setHasSpoonData(true);
      return { ...s, spoons: after };
    });
  }, []);

  const openBreathe = useCallback(() => {
    haptic('inhale');
    // Open a simple breathing pacer inline
    alert('Breathe: 4 seconds in… hold 4… out 4… hold 4… (Breathing pacer coming soon)');
  }, []);

  const openFriction = useCallback(() => {
    setShowFrictionModal(true);
  }, []);

  // Inverse tab
  if (tab === 'inverse') {
    return (
      <div style={{ background: '#0A0808', minHeight: '100%' }}>
        <div style={{ display: 'flex', gap: 8, padding: '16px 24px 0' }}>
          <button
            type="button"
            onClick={() => setTab('scope')}
            style={{
              background: 'transparent',
              border: `1px solid ${BRAND.dim}`,
              borderRadius: 6,
              padding: '6px 14px',
              color: BRAND.muted,
              fontFamily: 'Space Mono, monospace',
              fontSize: 9,
              letterSpacing: 2,
              cursor: 'pointer',
            }}
          >
            ← SCOPE
          </button>
        </div>
        <InverseDashboard />
      </div>
    );
  }

  return (
    <div style={{ background: BRAND.void, padding: 24, maxWidth: 900, margin: '0 auto' }}>
      {/* MAR10 Day 2026 — celebratory banner until Mar 11; links to Super Star Quest */}
      <Mar10DayBanner />
      {/* Overload Guard — triggers at ≤2 spoons */}
      <OverloadGuard
        currentSpoons={spoonsVal}
        hasSpoonData={hasSpoonData}
        onBreathe={openBreathe}
        onLogFriction={openFriction}
      />

      {/* Friction Log Modal */}
      {showFrictionModal && (
        <FrictionLogModal
          currentSpoons={spoonsVal}
          onSave={handleFrictionSave}
          onClose={() => setShowFrictionModal(false)}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, letterSpacing: 5, color: BRAND.muted }}>
          THE SCOPE
        </h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => setTab('inverse')}
            style={{
              background: 'transparent',
              border: `1px solid ${BRAND.dim}`,
              borderRadius: 6,
              padding: '4px 10px',
              color: BRAND.muted,
              fontFamily: 'Space Mono, monospace',
              fontSize: 8,
              letterSpacing: 1,
              cursor: 'pointer',
            }}
          >
            VIEW INVERSE →
          </button>
        </div>
      </div>

      {shelterOk === false && (
        <p style={{ color: BRAND.muted, fontSize: 12, marginBottom: 16 }}>
          Shelter offline — showing cached data
        </p>
      )}

      {/* Safe Harbor — Meds + Sleep (above the spoon gauge) */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <MedsCard />
        <SleepCard />
      </div>

      {/* Main dashboard grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
        }}
      >
        {/* Spoon Gauge */}
        <div style={{ background: BRAND.surface2, padding: 16, borderRadius: 8 }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, letterSpacing: 3, color: BRAND.muted }}>
            SPOON GAUGE
          </p>
          <p style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 28, fontWeight: 200, color: barColor }}>
            {spoonsVal}/{maxSpoonsVal}
          </p>
          <div style={{ height: 6, background: BRAND.dim, borderRadius: 3, overflow: 'hidden', marginTop: 8 }}>
            <div style={{ width: `${pct}%`, height: '100%', background: barColor, transition: 'width 0.3s ease' }} />
          </div>

          {/* Friction Log button — below the gauge */}
          <button
            type="button"
            onClick={openFriction}
            style={{
              marginTop: 12,
              width: '100%',
              padding: '10px 12px',
              background: 'transparent',
              border: `1px solid ${BRAND.magenta}`,
              borderRadius: 8,
              color: BRAND.magenta,
              fontFamily: 'Oxanium, sans-serif',
              fontSize: 12,
              cursor: 'pointer',
              transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.boxShadow = `0 0 8px ${BRAND.magenta}40`; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.boxShadow = 'none'; }}
          >
            ⚡ LOG FRICTION
          </button>

          {/* Recent friction history */}
          <div style={{ marginTop: 10 }}>
            <FrictionHistory entries={frictionEntries} limit={3} />
          </div>
        </div>

        {/* Voltage */}
        <div style={{ background: BRAND.surface2, padding: 16, borderRadius: 8 }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, letterSpacing: 3, color: BRAND.muted }}>
            VOLTAGE METER
          </p>
          <p style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 28, fontWeight: 200, color: BRAND.green }}>—</p>
        </div>

        {/* L.O.V.E. Balance */}
        <div style={{ background: BRAND.surface2, padding: 16, borderRadius: 8 }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, letterSpacing: 3, color: BRAND.muted }}>
            L.O.V.E. BALANCE
          </p>
          <p style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 28, fontWeight: 200, color: BRAND.green }}>
            {wallet?.totalEarned ?? '—'}
          </p>
          <p style={{ fontSize: 11, color: BRAND.muted }}>
            SOV {wallet?.sovereigntyPool ?? 0} · PERF {wallet?.performancePool ?? 0}
          </p>
        </div>

        {/* Sprout Signals + Anchor display */}
        <div style={{ background: BRAND.surface2, padding: 16, borderRadius: 8 }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, letterSpacing: 3, color: BRAND.muted }}>
            SPROUT SIGNALS
          </p>
          <p style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 28, fontWeight: 200, color: BRAND.green }}>—</p>
          <AnchorDisplay />
        </div>

        {/* Accommodation Count */}
        <div style={{ background: BRAND.surface2, padding: 16, borderRadius: 8 }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, letterSpacing: 3, color: BRAND.muted }}>
            ACCOMMODATION COUNT
          </p>
          <p style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 28, fontWeight: 200, color: BRAND.green }}>—</p>
        </div>

        {/* Mesh Status */}
        <div style={{ background: BRAND.surface2, padding: 16, borderRadius: 8 }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, letterSpacing: 3, color: BRAND.muted }}>
            MESH STATUS
          </p>
          <p style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 28, fontWeight: 200, color: shelterOk ? BRAND.green : BRAND.magenta }}>
            {shelterOk === null ? '—' : shelterOk ? 'UP' : 'DOWN'}
          </p>
        </div>
      </div>

      {/* Exhibit A button */}
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => { haptic('success'); generateExhibitA(); }}
          style={{
            padding: '12px 24px',
            background: 'transparent',
            border: `1px solid ${BRAND.amber}`,
            borderRadius: 8,
            color: BRAND.amber,
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
    </div>
  );
}

/* ── Anchor display (inside Sprout Signals card) ── */

function AnchorDisplay(): React.ReactElement {
  const [lastAnchor, setLastAnchor] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      const storage = typeof window !== 'undefined' ? window.storage : undefined;
      if (!storage) return;
      const keys = await storage.list('p31:anchor:');
      if (keys.length > 0) {
        const sorted = keys.sort().reverse();
        const raw = await storage.get(sorted[0]!);
        if (raw) {
          try {
            const anchor = JSON.parse(raw) as { timestamp: string; direction: string };
            const time = new Date(anchor.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setLastAnchor(`${anchor.direction === 'child_to_parent' ? 'Received' : 'Sent'} at ${time}`);
          } catch { /* skip */ }
        }
      }
    };
    check();
  }, []);

  const sendAnchorBack = async () => {
    haptic('anchor');
    const storage = typeof window !== 'undefined' ? window.storage : undefined;
    if (!storage) return;
    const ts = new Date().toISOString();
    await storage.set(`p31:anchor:${ts}`, JSON.stringify({
      type: 'anchor',
      direction: 'parent_to_child',
      timestamp: ts,
    }));
    setLastAnchor(`Sent at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
  };

  return (
    <div style={{ marginTop: 8 }}>
      <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 8, letterSpacing: 2, color: BRAND.dim, marginBottom: 4 }}>
        ANCHOR
      </p>
      {lastAnchor ? (
        <>
          <p style={{ fontSize: 10, color: BRAND.text }}>{lastAnchor}</p>
          <button
            type="button"
            onClick={sendAnchorBack}
            style={{
              marginTop: 4,
              padding: '4px 8px',
              background: 'transparent',
              border: `1px solid ${BRAND.text}40`,
              borderRadius: 4,
              color: BRAND.text,
              fontSize: 9,
              cursor: 'pointer',
            }}
          >
            SEND BACK ●
          </button>
        </>
      ) : (
        <p style={{ fontSize: 10, color: BRAND.dim }}>No anchors today</p>
      )}
    </div>
  );
}
