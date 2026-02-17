/**
 * Friction Log — "The cost of existing"
 * One-tap incident logger. Records WHY a spoon was lost.
 * Generates the data that proves disability, not capability.
 */

import React, { useState } from 'react';
import { haptic } from '../lib/haptics';

const BRAND = {
  green: '#00FF88',
  amber: '#FFB800',
  magenta: '#FF00CC',
  cyan: '#00D4FF',
  violet: '#7A27FF',
  red: '#FF4444',
  void: '#050510',
  surface2: '#12122E',
  text: '#E0E0EE',
  muted: '#7878AA',
  dim: '#4A4A7A',
} as const;

export interface FrictionEntry {
  id: string;
  timestamp: string;
  categories: string[];
  note: string;
  spoonCost: number;
  severity: 'managed' | 'marked' | 'shutdown';
  spoonsBefore: number;
  spoonsAfter: number;
}

const CATEGORIES = [
  { id: 'sensory_overload', label: 'SENSORY OVERLOAD', sub: 'too loud / bright / texture / smell', color: BRAND.cyan },
  { id: 'executive_paralysis', label: 'EXECUTIVE PARALYSIS', sub: "can't start / can't switch / can't decide", color: BRAND.amber },
  { id: 'communication_spike', label: 'COMMUNICATION SPIKE', sub: 'email / call / text triggered overwhelm', color: BRAND.magenta },
  { id: 'medication_disruption', label: 'MEDICATION DISRUPTION', sub: 'missed dose / timing / side effects', color: BRAND.red },
  { id: 'emotional_flooding', label: 'EMOTIONAL FLOODING', sub: 'rejection sensitivity / shame / anger / grief', color: BRAND.violet },
  { id: 'physical_crash', label: 'PHYSICAL CRASH', sub: 'fatigue / pain / hypoparathyroid symptoms', color: BRAND.amber },
  { id: 'social_demand', label: 'SOCIAL DEMAND', sub: 'unexpected interaction / performance required', color: BRAND.cyan },
  { id: 'routine_break', label: 'ROUTINE BREAK', sub: 'schedule changed / transition / surprise', color: BRAND.violet },
] as const;

const SEVERITIES = [
  { id: 'managed' as const, label: 'Managed it', color: BRAND.green },
  { id: 'marked' as const, label: 'Barely survived', color: BRAND.amber },
  { id: 'shutdown' as const, label: 'Shutdown', color: BRAND.magenta },
];

interface FrictionLogModalProps {
  currentSpoons: number;
  onSave: (entry: FrictionEntry) => void;
  onClose: () => void;
}

export function FrictionLogModal({ currentSpoons, onSave, onClose }: FrictionLogModalProps): React.ReactElement {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [note, setNote] = useState('');
  const [spoonCost, setSpoonCost] = useState(2);
  const [severity, setSeverity] = useState<'managed' | 'marked' | 'shutdown'>('marked');
  const [saved, setSaved] = useState(false);

  const toggleCategory = (id: string) => {
    haptic('tap');
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    if (selected.size === 0) return;
    if (severity === 'shutdown') haptic('warning');
    else haptic('success');

    const entry: FrictionEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      categories: Array.from(selected),
      note,
      spoonCost,
      severity,
      spoonsBefore: currentSpoons,
      spoonsAfter: Math.max(0, currentSpoons - spoonCost),
    };

    onSave(entry);
    setSaved(true);
    setTimeout(onClose, 1500);
  };

  if (saved) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(5, 5, 16, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Oxanium, sans-serif',
        }}
      >
        <p style={{ color: BRAND.text, fontSize: 18 }}>Logged. This matters. 🔺</p>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 5, 16, 0.95)',
        overflowY: 'auto',
        padding: 24,
        fontFamily: 'Oxanium, sans-serif',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="friction-title"
    >
      <button
        type="button"
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: 'transparent',
          border: 'none',
          color: BRAND.muted,
          fontSize: 24,
          cursor: 'pointer',
          minHeight: 44,
          minWidth: 44,
        }}
        aria-label="Close"
      >
        ✕
      </button>

      <h2
        id="friction-title"
        style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: 11,
          letterSpacing: 3,
          color: BRAND.magenta,
          marginBottom: 24,
          textAlign: 'center',
          marginTop: 24,
        }}
      >
        WHAT HAPPENED?
      </h2>

      {/* Category buttons — 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 600, margin: '0 auto' }}>
        {CATEGORIES.map((cat) => {
          const isOn = selected.has(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              style={{
                minHeight: 80,
                padding: 12,
                background: isOn ? cat.color : 'transparent',
                border: `1px solid ${cat.color}`,
                borderRadius: 8,
                color: isOn ? BRAND.void : cat.color,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
              aria-pressed={isOn}
            >
              <span style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{cat.label}</span>
              <span style={{ display: 'block', fontSize: 10, opacity: 0.8 }}>{cat.sub}</span>
            </button>
          );
        })}
      </div>

      {/* Optional note */}
      <div style={{ maxWidth: 600, margin: '20px auto' }}>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 280))}
          placeholder="What happened? (optional) — No need to explain. The category is enough."
          maxLength={280}
          style={{
            width: '100%',
            minHeight: 60,
            padding: 12,
            background: BRAND.surface2,
            border: `1px solid ${BRAND.dim}`,
            borderRadius: 8,
            color: BRAND.text,
            fontFamily: 'Oxanium, sans-serif',
            fontSize: 12,
            resize: 'vertical',
          }}
        />
        <p style={{ textAlign: 'right', fontSize: 10, color: BRAND.dim }}>{note.length}/280</p>
      </div>

      {/* Spoon cost */}
      <div style={{ maxWidth: 600, margin: '16px auto', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: BRAND.muted, marginBottom: 8 }}>How many spoons did this cost?</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => { setSpoonCost(n); haptic('tap'); }}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: n <= spoonCost ? BRAND.magenta : BRAND.surface2,
                border: `1px solid ${n <= spoonCost ? BRAND.magenta : BRAND.dim}`,
                color: n <= spoonCost ? BRAND.void : BRAND.muted,
                fontSize: 16,
                cursor: 'pointer',
              }}
              aria-label={`${n} spoon${n > 1 ? 's' : ''}`}
            >
              🥄
            </button>
          ))}
        </div>
        <p style={{ fontSize: 10, color: BRAND.dim, marginTop: 4 }}>{spoonCost} spoon{spoonCost > 1 ? 's' : ''}</p>
      </div>

      {/* Severity */}
      <div style={{ maxWidth: 600, margin: '16px auto' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {SEVERITIES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => { setSeverity(s.id); haptic('tap'); }}
              style={{
                flex: 1,
                padding: '12px 8px',
                background: severity === s.id ? s.color : 'transparent',
                border: `1px solid ${s.color}`,
                borderRadius: 8,
                color: severity === s.id ? BRAND.void : s.color,
                fontSize: 12,
                cursor: 'pointer',
              }}
              aria-pressed={severity === s.id}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Save */}
      <div style={{ maxWidth: 600, margin: '24px auto' }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={selected.size === 0}
          style={{
            width: '100%',
            padding: 16,
            background: selected.size > 0 ? BRAND.magenta : BRAND.dim,
            border: 'none',
            borderRadius: 8,
            color: selected.size > 0 ? BRAND.void : BRAND.muted,
            fontFamily: 'Oxanium, sans-serif',
            fontSize: 16,
            fontWeight: 600,
            cursor: selected.size > 0 ? 'pointer' : 'not-allowed',
          }}
        >
          LOG IT
        </button>
      </div>
    </div>
  );
}

/* ── Friction History (compact, for embedding in ScopeView) ── */

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? 'yesterday' : `${days}d ago`;
}

function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

function categoryColor(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.color ?? BRAND.muted;
}

interface FrictionHistoryProps {
  entries: FrictionEntry[];
  limit?: number;
  onViewAll?: () => void;
}

export function FrictionHistory({ entries, limit = 3, onViewAll }: FrictionHistoryProps): React.ReactElement {
  const sorted = [...entries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const visible = sorted.slice(0, limit);

  if (visible.length === 0) {
    return <p style={{ fontSize: 11, color: BRAND.dim, fontStyle: 'italic' }}>No friction logged yet.</p>;
  }

  return (
    <div>
      {visible.map((e) => (
        <div key={e.id} style={{ marginBottom: 8, fontSize: 11, color: BRAND.text }}>
          <span style={{ color: BRAND.magenta }}>⚡</span>{' '}
          {e.categories.map((c) => (
            <span key={c} style={{ color: categoryColor(c), marginRight: 4 }}>{categoryLabel(c)}</span>
          ))}
          — {e.spoonCost} spoon{e.spoonCost > 1 ? 's' : ''} — {timeAgo(e.timestamp)}
        </div>
      ))}
      {entries.length > limit && onViewAll && (
        <button
          type="button"
          onClick={onViewAll}
          style={{
            background: 'none',
            border: 'none',
            color: BRAND.muted,
            fontSize: 10,
            cursor: 'pointer',
            padding: 0,
            textDecoration: 'underline',
          }}
        >
          View all →
        </button>
      )}
    </div>
  );
}

/* ── Storage helpers ── */

export async function saveFrictionEntry(entry: FrictionEntry): Promise<void> {
  const storage = typeof window !== 'undefined' ? window.storage : undefined;
  if (!storage) return;
  await storage.set(`p31:friction:${entry.id}`, JSON.stringify(entry));
}

export async function loadFrictionEntries(): Promise<FrictionEntry[]> {
  const storage = typeof window !== 'undefined' ? window.storage : undefined;
  if (!storage) return [];
  const keys = await storage.list('p31:friction:');
  const entries: FrictionEntry[] = [];
  for (const key of keys) {
    const raw = await storage.get(key);
    if (raw) {
      try {
        entries.push(JSON.parse(raw) as FrictionEntry);
      } catch {
        // skip corrupted entries
      }
    }
  }
  return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
