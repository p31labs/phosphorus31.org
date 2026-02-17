/**
 * Inverse Dashboard — "The cost of unassisted existence"
 *
 * Shows what WOULD HAVE HAPPENED without P31.
 * No assistive technology on the market does this.
 * "P31 doesn't just assist — it quantifies the cost of unassisted existence."
 *
 * This analysis is included in Exhibit A, Section 2: Counterfactual.
 */

import React, { useState, useEffect } from 'react';
import { loadFrictionEntries, type FrictionEntry } from './FrictionLog';
import { loadSleepHistory, loadMedsHistory, type SleepDayRecord, type MedDayRecord } from './SafeHarbor';

const BRAND = {
  green: '#00FF88',
  amber: '#FFB800',
  magenta: '#FF00CC',
  red: '#FF4444',
  void: '#0A0808',
  surface2: '#1A1414',
  text: '#E0E0EE',
  muted: '#7878AA',
  dim: '#4A4A7A',
} as const;

interface InverseData {
  frictionEntries: FrictionEntry[];
  sleepRecords: SleepDayRecord[];
  medsRecords: MedDayRecord[];
  bufferedMessages: number;
  overdraftHours: number;
  sproutDaysWithSignals: number;
  totalDays: number;
}

async function gatherInverseData(): Promise<InverseData> {
  const frictionEntries = await loadFrictionEntries();
  const sleepRecords = await loadSleepHistory(7);
  const medsRecords = await loadMedsHistory(7);

  // Approximate buffered messages from storage
  const storage = typeof window !== 'undefined' ? window.storage : undefined;
  let bufferedMessages = 0;
  if (storage) {
    const keys = await storage.list('p31:buffer:held:');
    bufferedMessages = keys.length;
  }

  // Approximate overdraft hours (hours at 0 spoons)
  let overdraftHours = 0;
  const weekFriction = frictionEntries.filter((e) => {
    const diff = Date.now() - new Date(e.timestamp).getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  });
  for (const entry of weekFriction) {
    if (entry.spoonsAfter === 0) overdraftHours += entry.spoonCost;
  }

  // Sprout signal days
  let sproutDaysWithSignals = 0;
  if (storage) {
    const signalKeys = await storage.list('p31:signals:');
    const days = new Set<string>();
    for (const key of signalKeys) {
      const raw = await storage.get(key);
      if (raw) {
        try {
          const sig = JSON.parse(raw) as { timestamp: string };
          days.add(sig.timestamp.slice(0, 10));
        } catch { /* skip */ }
      }
    }
    sproutDaysWithSignals = days.size;
  }

  return {
    frictionEntries: weekFriction,
    sleepRecords,
    medsRecords,
    bufferedMessages,
    overdraftHours,
    sproutDaysWithSignals,
    totalDays: 7,
  };
}

function CounterfactualCard({
  icon,
  title,
  lines,
  severity,
}: {
  icon: string;
  title: string;
  lines: string[];
  severity: 'green' | 'amber' | 'red';
}): React.ReactElement {
  const borderColor = severity === 'green' ? BRAND.green : severity === 'amber' ? BRAND.amber : BRAND.red;

  return (
    <div
      style={{
        background: BRAND.surface2,
        border: `1px solid ${borderColor}30`,
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, letterSpacing: 2, color: borderColor, marginBottom: 8 }}>
        {icon} {title}
      </p>
      {lines.map((line, i) => (
        <p key={i} style={{ fontSize: 12, color: i === 0 ? BRAND.text : BRAND.muted, marginBottom: 4, lineHeight: 1.5 }}>
          {line}
        </p>
      ))}
    </div>
  );
}

export function InverseDashboard(): React.ReactElement {
  const [data, setData] = useState<InverseData | null>(null);

  useEffect(() => {
    gatherInverseData().then(setData);
  }, []);

  if (!data) {
    return <p style={{ color: BRAND.muted, fontFamily: 'Oxanium, sans-serif' }}>Loading counterfactual analysis…</p>;
  }

  // Voltage caught
  const voltageCost = data.bufferedMessages * 2;
  const voltageSeverity: 'green' | 'amber' | 'red' = data.bufferedMessages === 0 ? 'green' : data.bufferedMessages < 5 ? 'amber' : 'red';

  // Overdraft hours
  const recoveryDebt = data.overdraftHours * 2;
  const productiveHours = Math.max(0, 40 - (data.overdraftHours + recoveryDebt));
  const overdraftSeverity: 'green' | 'amber' | 'red' = data.overdraftHours === 0 ? 'green' : data.overdraftHours < 4 ? 'amber' : 'red';

  // Medication gaps
  const totalMedSlots = data.medsRecords.reduce((sum, r) => sum + r.meds.length, 0);
  const takenMeds = data.medsRecords.reduce((sum, r) => sum + r.meds.filter((m) => m.taken).length, 0);
  const missedMeds = totalMedSlots - takenMeds;
  const medsSeverity: 'green' | 'amber' | 'red' = missedMeds === 0 ? 'green' : missedMeds < 3 ? 'amber' : 'red';

  // Sleep debt
  const sleepHours = data.sleepRecords.map((r) => r.hours);
  const avgSleep = sleepHours.length > 0 ? sleepHours.reduce((a, b) => a + b, 0) / sleepHours.length : 0;
  const weeklyDeficit = Math.max(0, (7.5 - avgSleep) * 7);
  const capacityReduction = Math.round(weeklyDeficit * 12.5);
  const sleepSeverity: 'green' | 'amber' | 'red' = avgSleep >= 7 ? 'green' : avgSleep >= 5 ? 'amber' : 'red';

  // Connection gaps
  const daysWithout = data.totalDays - data.sproutDaysWithSignals;
  const connectionSeverity: 'green' | 'amber' | 'red' = daysWithout === 0 ? 'green' : daysWithout < 3 ? 'amber' : 'red';

  // Friction cascades
  const cascades: number[] = [];
  let currentCascade = 0;
  const sorted = [...data.frictionEntries].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) { currentCascade = 1; continue; }
    const gap = new Date(sorted[i]!.timestamp).getTime() - new Date(sorted[i - 1]!.timestamp).getTime();
    if (gap < 2 * 60 * 60 * 1000) {
      currentCascade++;
    } else {
      if (currentCascade > 1) cascades.push(currentCascade);
      currentCascade = 1;
    }
  }
  if (currentCascade > 1) cascades.push(currentCascade);
  const avgCascade = cascades.length > 0 ? (cascades.reduce((a, b) => a + b, 0) / cascades.length).toFixed(1) : '0';

  // Most common category
  const catCounts: Record<string, number> = {};
  for (const e of data.frictionEntries) {
    for (const c of e.categories) {
      catCounts[c] = (catCounts[c] ?? 0) + 1;
    }
  }
  const topCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0]?.replace(/_/g, ' ') ?? 'none';
  const frictionSeverity: 'green' | 'amber' | 'red' = data.frictionEntries.length === 0 ? 'green' : data.frictionEntries.length < 5 ? 'amber' : 'red';

  // Overall severity
  const severities = [voltageSeverity, overdraftSeverity, medsSeverity, sleepSeverity, connectionSeverity, frictionSeverity];
  const redCount = severities.filter((s) => s === 'red').length;
  const amberCount = severities.filter((s) => s === 'amber').length;

  let summary: string[];
  if (redCount > 0) {
    const shutdowns = data.frictionEntries.filter((e) => e.severity === 'shutdown').length;
    summary = [
      `This was a hard week. ${shutdowns > 0 ? `${shutdowns} shutdown event${shutdowns > 1 ? 's' : ''} occurred.` : ''}`,
      'Without the Friction Log, Safe Harbor, and Spoon Economy, these events would have been invisible to any evaluator.',
      "The technology didn't prevent the struggle. It made the struggle visible and documented.",
    ];
  } else if (amberCount > 0) {
    const totalFrictionSpoons = data.frictionEntries.reduce((s, e) => s + e.spoonCost, 0);
    summary = [
      `This week cost ${totalFrictionSpoons} spoons more than a neurotypical baseline.`,
      `Without assistive technology, an estimated ${data.overdraftHours + voltageCost} additional hours of executive function would have been lost to unmanaged friction, and ${data.bufferedMessages} communication${data.bufferedMessages !== 1 ? 's' : ''} would have been sent unfiltered.`,
    ];
  } else {
    summary = [
      'This week, the lattice held. The assistive technology worked.',
      'But it required the technology to work.',
    ];
  }

  return (
    <div
      style={{
        background: BRAND.void,
        padding: 24,
        maxWidth: 700,
        margin: '0 auto',
        fontFamily: 'Oxanium, sans-serif',
      }}
    >
      <h2
        style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: 11,
          letterSpacing: 4,
          color: BRAND.muted,
          marginBottom: 4,
        }}
      >
        WITHOUT THE LATTICE
      </h2>
      <p style={{ fontSize: 12, color: BRAND.dim, marginBottom: 24 }}>
        What this week would have cost without assistive technology.
      </p>

      <CounterfactualCard
        icon="⚡"
        title="VOLTAGE CAUGHT"
        severity={voltageSeverity}
        lines={[
          `${data.bufferedMessages} message${data.bufferedMessages !== 1 ? 's were' : ' was'} held by the Buffer this week.`,
          `Without filtering, ${data.bufferedMessages} high-voltage communication${data.bufferedMessages !== 1 ? 's' : ''} would have triggered immediate responses during low-spoon states.`,
          `Estimated cost: ${voltageCost} additional spoons spent on damage control.`,
        ]}
      />

      <CounterfactualCard
        icon="🥄"
        title="OVERDRAFT HOURS"
        severity={overdraftSeverity}
        lines={[
          `You operated at 0 spoons for ~${data.overdraftHours} hour${data.overdraftHours !== 1 ? 's' : ''} this week.`,
          `Each overdraft hour incurs approximately 2 hours of recovery.`,
          `Total recovery debt: ${recoveryDebt} hours.`,
          `In a 40-hour work week, this leaves ${productiveHours} productive hours. (${productiveHours}/40)`,
        ]}
      />

      <CounterfactualCard
        icon="💊"
        title="MEDICATION GAPS"
        severity={medsSeverity}
        lines={[
          `${missedMeds} medication dose${missedMeds !== 1 ? 's were' : ' was'} missed or late this week.`,
          'Each delay increases seizure risk and calcium instability.',
          'Without the medication tracker, these gaps would be invisible until a medical event occurred.',
        ]}
      />

      <CounterfactualCard
        icon="😴"
        title="SLEEP DEBT"
        severity={sleepSeverity}
        lines={[
          `Average sleep: ${avgSleep.toFixed(1)} hours (target: 7.5)`,
          `Cumulative deficit: ${weeklyDeficit.toFixed(1)} hours this week`,
          `Estimated executive function impact: -${capacityReduction}% capacity`,
          'Source: Walker (2017) — each hour below 7 reduces cognitive performance by ~10-15%',
        ]}
      />

      <CounterfactualCard
        icon="📡"
        title="CONNECTION GAPS"
        severity={connectionSeverity}
        lines={[
          `${daysWithout} day${daysWithout !== 1 ? 's' : ''} this week had no Sprout signals from your children.`,
          'Without the Anchor system, these gaps would have no documented explanation.',
          `Days with signals: ${data.sproutDaysWithSignals}/${data.totalDays}. Days without: ${daysWithout}/${data.totalDays}.`,
        ]}
      />

      <CounterfactualCard
        icon="🔥"
        title="FRICTION CASCADE"
        severity={frictionSeverity}
        lines={[
          `${data.frictionEntries.length} friction event${data.frictionEntries.length !== 1 ? 's were' : ' was'} logged this week.`,
          `Most common pattern: ${topCategory}`,
          `Average cascade length: ${avgCascade} events before recovery.`,
          'Without the Friction Log, these patterns would be invisible.',
        ]}
      />

      {/* Summary */}
      <div
        style={{
          marginTop: 24,
          padding: 20,
          background: BRAND.surface2,
          border: `1px solid ${BRAND.dim}`,
          borderRadius: 8,
        }}
      >
        {summary.map((line, i) => (
          <p
            key={i}
            style={{
              fontFamily: i === summary.length - 1 ? "'Georgia', serif" : 'Oxanium, sans-serif',
              fontSize: 13,
              color: BRAND.text,
              marginBottom: 8,
              lineHeight: 1.6,
              fontStyle: i === summary.length - 1 ? 'italic' : 'normal',
            }}
          >
            {line}
          </p>
        ))}
        <p style={{ fontSize: 11, color: BRAND.amber, marginTop: 12, fontStyle: 'italic' }}>
          This analysis is included in Exhibit A, Section 2: Counterfactual.
        </p>
      </div>

      <footer style={{ textAlign: 'center', marginTop: 24, fontSize: 10, color: BRAND.dim, fontStyle: 'italic' }}>
        The lattice holds. Even when it's heavy. 🔺
      </footer>
    </div>
  );
}

/* ── Data export for Exhibit A ── */
export { gatherInverseData };
export type { InverseData };
