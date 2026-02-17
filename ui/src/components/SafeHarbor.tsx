/**
 * Safe Harbor — "Proof of stability"
 * Medication compliance and sleep tracking.
 * In a custody case, opposing counsel targets "instability."
 * This log is the field that protects.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { haptic } from '../lib/haptics';

const BRAND = {
  green: '#00FF88',
  amber: '#FFB800',
  magenta: '#FF00CC',
  red: '#FF4444',
  void: '#050510',
  surface2: '#12122E',
  text: '#E0E0EE',
  muted: '#7878AA',
  dim: '#4A4A7A',
} as const;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/* ── Medication Card ── */

export interface MedEntry {
  name: string;
  taken: boolean;
  takenAt: string | null;
}

export interface MedDayRecord {
  date: string;
  meds: MedEntry[];
}

const DEFAULT_MEDS = ['Calcitriol AM', 'Calcitriol PM', 'Calcium AM', 'Calcium PM'];

function getMedNames(): string[] {
  try {
    const stored = localStorage.getItem('p31:meds:names');
    if (stored) return JSON.parse(stored) as string[];
  } catch { /* use default */ }
  return DEFAULT_MEDS;
}

export function MedsCard(): React.ReactElement {
  const [meds, setMeds] = useState<MedEntry[]>([]);
  const [date, setDate] = useState(todayKey());

  const loadMeds = useCallback(async () => {
    const today = todayKey();
    setDate(today);
    const storage = typeof window !== 'undefined' ? window.storage : undefined;
    if (!storage) return;

    const raw = await storage.get(`p31:meds:${today}`);
    if (raw) {
      try {
        const record = JSON.parse(raw) as MedDayRecord;
        setMeds(record.meds);
        return;
      } catch { /* fall through */ }
    }

    // Initialize fresh day
    const names = getMedNames();
    const fresh = names.map((name) => ({ name, taken: false, takenAt: null }));
    setMeds(fresh);
  }, []);

  useEffect(() => { loadMeds(); }, [loadMeds]);

  // Check if date changed (midnight reset)
  useEffect(() => {
    const interval = setInterval(() => {
      if (todayKey() !== date) loadMeds();
    }, 30000);
    return () => clearInterval(interval);
  }, [date, loadMeds]);

  const toggleMed = async (index: number) => {
    haptic('tap');
    const next = [...meds];
    const med = next[index];
    if (!med) return;

    if (!med.taken) {
      med.taken = true;
      med.takenAt = new Date().toISOString();
    } else {
      med.taken = false;
      med.takenAt = null;
    }

    setMeds(next);
    const storage = typeof window !== 'undefined' ? window.storage : undefined;
    if (storage) {
      const record: MedDayRecord = { date, meds: next };
      await storage.set(`p31:meds:${date}`, JSON.stringify(record));
    }
  };

  const taken = meds.filter((m) => m.taken).length;
  const total = meds.length;

  return (
    <div
      style={{
        background: BRAND.surface2,
        padding: 12,
        borderRadius: 8,
        flex: 1,
        minWidth: 140,
      }}
    >
      <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, letterSpacing: 3, color: BRAND.muted, marginBottom: 8 }}>
        💊 MEDS
      </p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
        {meds.map((m, i) => (
          <button
            key={m.name}
            type="button"
            onClick={() => toggleMed(i)}
            title={m.name}
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: m.taken ? BRAND.green : 'transparent',
              border: `2px solid ${m.taken ? BRAND.green : BRAND.dim}`,
              cursor: 'pointer',
              fontSize: 10,
              color: m.taken ? BRAND.void : BRAND.dim,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label={`${m.name}: ${m.taken ? 'taken' : 'pending'}`}
          >
            {m.taken ? '●' : '○'}
          </button>
        ))}
      </div>
      <p style={{ fontSize: 10, color: BRAND.muted }}>
        {taken}/{total} taken today
      </p>
      <StreakDots prefix="p31:meds:" />
    </div>
  );
}

/* ── Sleep Card ── */

export interface SleepDayRecord {
  date: string;
  hours: number;
}

export function SleepCard(): React.ReactElement {
  const [hours, setHours] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const target = 7.5;

  useEffect(() => {
    const loadSleep = async () => {
      const storage = typeof window !== 'undefined' ? window.storage : undefined;
      if (!storage) return;
      const raw = await storage.get(`p31:sleep:${todayKey()}`);
      if (raw) {
        try {
          const record = JSON.parse(raw) as SleepDayRecord;
          setHours(record.hours);
        } catch { /* no data */ }
      }
    };
    loadSleep();
  }, []);

  const saveSleep = async (h: number) => {
    setHours(h);
    setEditing(false);
    haptic('tap');
    const storage = typeof window !== 'undefined' ? window.storage : undefined;
    if (storage) {
      const record: SleepDayRecord = { date: todayKey(), hours: h };
      await storage.set(`p31:sleep:${todayKey()}`, JSON.stringify(record));
    }
  };

  const barPct = hours !== null ? Math.min(100, (hours / 12) * 100) : 0;
  const barColor = hours === null ? BRAND.dim : hours >= 7 ? BRAND.green : hours >= 5 ? BRAND.amber : BRAND.red;

  return (
    <div
      style={{
        background: BRAND.surface2,
        padding: 12,
        borderRadius: 8,
        flex: 1,
        minWidth: 140,
      }}
    >
      <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, letterSpacing: 3, color: BRAND.muted, marginBottom: 8 }}>
        😴 SLEEP
      </p>

      {editing ? (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
          {[3, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 9, 10].map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => saveSleep(h)}
              style={{
                padding: '4px 6px',
                fontSize: 10,
                background: BRAND.dim,
                border: 'none',
                borderRadius: 4,
                color: BRAND.text,
                cursor: 'pointer',
              }}
            >
              {h}h
            </button>
          ))}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'block',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
            <span style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 20, fontWeight: 200, color: barColor }}>
              {hours !== null ? `${hours}h` : '—'}
            </span>
          </div>
          <div style={{ height: 4, background: BRAND.dim, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${barPct}%`, height: '100%', background: barColor, transition: 'width 0.3s' }} />
          </div>
          <p style={{ fontSize: 10, color: BRAND.dim, marginTop: 4, textAlign: 'left' }}>target: {target}h</p>
        </button>
      )}
      <StreakDots prefix="p31:sleep:" />
    </div>
  );
}

/* ── 7-day streak dots ── */

function StreakDots({ prefix }: { prefix: string }): React.ReactElement {
  const [streak, setStreak] = useState<boolean[]>([]);

  useEffect(() => {
    const check = async () => {
      const storage = typeof window !== 'undefined' ? window.storage : undefined;
      if (!storage) return;
      const days: boolean[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = `${prefix}${d.toISOString().slice(0, 10)}`;
        const raw = await storage.get(key);
        days.push(raw !== null);
      }
      setStreak(days);
    };
    check();
  }, [prefix]);

  return (
    <div style={{ display: 'flex', gap: 3, marginTop: 6 }}>
      {streak.map((ok, i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: ok ? BRAND.green : BRAND.dim,
          }}
          title={ok ? 'recorded' : 'no data'}
        />
      ))}
    </div>
  );
}

/* ── Storage helpers for Exhibit A ── */

export async function loadMedsHistory(days: number = 30): Promise<MedDayRecord[]> {
  const storage = typeof window !== 'undefined' ? window.storage : undefined;
  if (!storage) return [];
  const records: MedDayRecord[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `p31:meds:${d.toISOString().slice(0, 10)}`;
    const raw = await storage.get(key);
    if (raw) {
      try { records.push(JSON.parse(raw) as MedDayRecord); } catch { /* skip */ }
    }
  }
  return records;
}

export async function loadSleepHistory(days: number = 30): Promise<SleepDayRecord[]> {
  const storage = typeof window !== 'undefined' ? window.storage : undefined;
  if (!storage) return [];
  const records: SleepDayRecord[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `p31:sleep:${d.toISOString().slice(0, 10)}`;
    const raw = await storage.get(key);
    if (raw) {
      try { records.push(JSON.parse(raw) as SleepDayRecord); } catch { /* skip */ }
    }
  }
  return records;
}
