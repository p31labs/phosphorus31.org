/**
 * Exhibit A — "The paper that wins"
 *
 * Compiles 30 days of data into a sterile, professional, court-ready document.
 * Uses window.print() with @media print styling — no jspdf dependency.
 * Lighter, works offline, produces better results.
 *
 * Judges don't look at websites. GALs don't check GitHub. They check paper files.
 */

import { loadFrictionEntries, type FrictionEntry } from '../components/FrictionLog';
import { loadMedsHistory, loadSleepHistory, type MedDayRecord, type SleepDayRecord } from '../components/SafeHarbor';

interface ExhibitData {
  fingerprint: string;
  periodStart: string;
  periodEnd: string;
  generated: string;
  totalDays: number;
  avgSpoons: number;
  daysAtZero: number;
  frictionEntries: FrictionEntry[];
  topFrictionCategories: string[];
  avgSeverity: string;
  sproutSignalsSent: number;
  sproutSignalsReceived: number;
  loveEarned: number;
  medsRecords: MedDayRecord[];
  medsCompliance: number;
  sleepRecords: SleepDayRecord[];
  avgSleep: number;
  anchorPairs: number;
  avgAnchorResponseTime: string;
  // Inverse (counterfactual)
  bufferedMessages: number;
  overdraftHours: number;
  recoveryDebt: number;
  missedMeds: number;
  sleepDeficit: number;
  capacityReduction: number;
  connectionGaps: number;
}

async function gatherExhibitData(): Promise<ExhibitData> {
  const storage = typeof window !== 'undefined' ? window.storage : undefined;

  // Molecule fingerprint
  let fingerprint = 'UNKNOWN';
  if (storage) {
    const raw = await storage.get('p31:molecule');
    if (raw) {
      try {
        const mol = JSON.parse(raw) as { fingerprint: string };
        fingerprint = mol.fingerprint.slice(0, 16);
      } catch { /* keep unknown */ }
    }
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const periodStart = thirtyDaysAgo.toISOString().slice(0, 10);
  const periodEnd = now.toISOString().slice(0, 10);

  // Friction
  const allFriction = await loadFrictionEntries();
  const frictionEntries = allFriction.filter((e) => new Date(e.timestamp) >= thirtyDaysAgo);

  // Top categories
  const catCounts: Record<string, number> = {};
  for (const e of frictionEntries) {
    for (const c of e.categories) {
      catCounts[c] = (catCounts[c] ?? 0) + 1;
    }
  }
  const topFrictionCategories = Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([c]) => c.replace(/_/g, ' '));

  // Average severity
  const sevMap = { managed: 1, marked: 2, shutdown: 3 };
  const avgSevNum = frictionEntries.length > 0
    ? frictionEntries.reduce((s, e) => s + (sevMap[e.severity] ?? 2), 0) / frictionEntries.length
    : 1;
  const avgSeverity = avgSevNum < 1.5 ? 'managed' : avgSevNum < 2.5 ? 'marked' : 'shutdown';

  // Meds & sleep
  const medsRecords = await loadMedsHistory(30);
  const sleepRecords = await loadSleepHistory(30);

  const totalMedSlots = medsRecords.reduce((s, r) => s + r.meds.length, 0);
  const takenMeds = medsRecords.reduce((s, r) => s + r.meds.filter((m) => m.taken).length, 0);
  const medsCompliance = totalMedSlots > 0 ? Math.round((takenMeds / totalMedSlots) * 100) : 0;

  const sleepHours = sleepRecords.map((r) => r.hours);
  const avgSleep = sleepHours.length > 0 ? sleepHours.reduce((a, b) => a + b, 0) / sleepHours.length : 0;

  // Signals
  let sproutSignalsSent = 0;
  let sproutSignalsReceived = 0;
  if (storage) {
    const keys = await storage.list('p31:signals:');
    sproutSignalsSent = keys.length;
  }

  // Anchors
  let anchorPairs = 0;
  if (storage) {
    const keys = await storage.list('p31:anchor:');
    anchorPairs = Math.floor(keys.length / 2);
  }

  // LOVE balance
  let loveEarned = 0;
  if (storage) {
    const raw = await storage.get('p31:love:total');
    if (raw) loveEarned = parseFloat(raw) || 0;
  }

  // Spoon data (approximate)
  const daysAtZero = frictionEntries.filter((e) => e.spoonsAfter === 0).length;
  const avgSpoons = frictionEntries.length > 0
    ? frictionEntries.reduce((s, e) => s + e.spoonsBefore, 0) / frictionEntries.length
    : 12;

  // Counterfactual
  const missedMeds = totalMedSlots - takenMeds;
  const sleepDeficit = Math.max(0, (7.5 - avgSleep) * 30);
  const capacityReduction = Math.round(Math.max(0, 7.5 - avgSleep) * 12.5);
  const overdraftHours = frictionEntries.filter((e) => e.spoonsAfter === 0).reduce((s, e) => s + e.spoonCost, 0);
  const recoveryDebt = overdraftHours * 2;
  let bufferedMessages = 0;
  if (storage) {
    const keys = await storage.list('p31:buffer:held:');
    bufferedMessages = keys.length;
  }
  const connectionGaps = 30 - (storage ? (await storage.list('p31:signals:')).length : 0);

  return {
    fingerprint,
    periodStart,
    periodEnd,
    generated: now.toISOString(),
    totalDays: 30,
    avgSpoons: Math.round(avgSpoons * 10) / 10,
    daysAtZero,
    frictionEntries,
    topFrictionCategories,
    avgSeverity,
    sproutSignalsSent,
    sproutSignalsReceived,
    loveEarned,
    medsRecords,
    medsCompliance,
    sleepRecords,
    avgSleep: Math.round(avgSleep * 10) / 10,
    anchorPairs,
    avgAnchorResponseTime: '—',
    bufferedMessages,
    overdraftHours,
    recoveryDebt,
    missedMeds,
    sleepDeficit: Math.round(sleepDeficit * 10) / 10,
    capacityReduction,
    connectionGaps: Math.max(0, connectionGaps),
  };
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateHTML(data: ExhibitData): string {
  const severitySymbol = (s: string) => s === 'managed' ? '✓' : s === 'marked' ? '△' : '✕';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>P31 Labs — Exhibit A — Assistive Technology Report</title>
<style>
  @media print {
    body { background: white; color: black; font-family: 'Times New Roman', serif; font-size: 11pt; margin: 0; padding: 20mm; }
    table { border-collapse: collapse; width: 100%; margin: 8pt 0; }
    td, th { border: 1px solid #ccc; padding: 4px 8px; font-size: 10pt; }
    th { background: #f5f5f5; font-weight: bold; text-align: left; }
    h1 { font-size: 16pt; margin: 0 0 4pt; }
    h2 { font-size: 13pt; margin: 16pt 0 4pt; border-bottom: 1px solid #ccc; padding-bottom: 4pt; }
    h3 { font-size: 11pt; margin: 12pt 0 4pt; }
    p { margin: 4pt 0; line-height: 1.4; }
    .page-break { page-break-after: always; }
    .footer { position: fixed; bottom: 10mm; left: 20mm; right: 20mm; font-size: 8pt; color: #666; text-align: center; border-top: 1px solid #ccc; padding-top: 4pt; }
    @page { margin: 20mm; }
  }
  @media screen {
    body { background: #fafafa; color: #222; font-family: 'Times New Roman', Georgia, serif; font-size: 11pt; max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    table { border-collapse: collapse; width: 100%; margin: 8pt 0; }
    td, th { border: 1px solid #ccc; padding: 4px 8px; font-size: 10pt; }
    th { background: #f5f5f5; font-weight: bold; text-align: left; }
    h1 { font-size: 16pt; }
    h2 { font-size: 13pt; border-bottom: 1px solid #ccc; padding-bottom: 4pt; }
    .page-break { border-top: 2px dashed #ccc; margin: 20pt 0; padding-top: 20pt; }
    .footer { font-size: 8pt; color: #666; text-align: center; margin-top: 20pt; border-top: 1px solid #ccc; padding-top: 4pt; }
  }
  .severity-managed { color: green; }
  .severity-marked { color: #b8860b; }
  .severity-shutdown { color: #cc0000; }
</style>
</head>
<body>

<!-- PAGE 1: COVER -->
<div>
<h1>P31 LABS — ASSISTIVE TECHNOLOGY REPORT</h1>
<br/>
<table>
<tr><th>Subject</th><td>${escapeHtml(data.fingerprint)}</td></tr>
<tr><th>Period</th><td>${escapeHtml(data.periodStart)} to ${escapeHtml(data.periodEnd)}</td></tr>
<tr><th>Generated</th><td>${escapeHtml(new Date(data.generated).toLocaleString())}</td></tr>
</table>
<br/>
<p>This document is a system-generated record of assistive technology usage, cognitive load management, and parental engagement produced by P31 Labs (phosphorus31.org), an open-source assistive technology platform for neurodivergent individuals.</p>
</div>
<div class="page-break"></div>

<!-- PAGE 2: EXECUTIVE SUMMARY -->
<div>
<h2>Executive Summary</h2>
<table>
<tr><td>Total days tracked</td><td>${data.totalDays}</td></tr>
<tr><td>Average spoons per day</td><td>${data.avgSpoons} / 12</td></tr>
<tr><td>Days at zero spoons</td><td>${data.daysAtZero}</td></tr>
<tr><td>Friction events logged</td><td>${data.frictionEntries.length}</td></tr>
<tr><td>Most common friction categories</td><td>${data.topFrictionCategories.join(', ') || 'none'}</td></tr>
<tr><td>Average severity</td><td>${data.avgSeverity}</td></tr>
<tr><td>Sprout signals sent</td><td>${data.sproutSignalsSent}</td></tr>
<tr><td>Sprout signals received</td><td>${data.sproutSignalsReceived}</td></tr>
<tr><td>LOVE earned</td><td>${data.loveEarned}</td></tr>
<tr><td>Medication compliance</td><td>${data.medsCompliance}%</td></tr>
<tr><td>Average sleep</td><td>${data.avgSleep} hours</td></tr>
</table>
</div>
<div class="page-break"></div>

<!-- PAGE 3: FRICTION LOG -->
<div>
<h2>Friction Log — Incident Record</h2>
<table>
<tr><th>Date/Time</th><th>Category</th><th>Severity</th><th>Spoon Cost</th><th>Notes</th></tr>
${data.frictionEntries.map((e) => `<tr>
<td>${new Date(e.timestamp).toLocaleString()}</td>
<td>${e.categories.map((c) => c.replace(/_/g, ' ')).join(', ')}</td>
<td class="severity-${e.severity}">${severitySymbol(e.severity)} ${e.severity}</td>
<td>${e.spoonCost}</td>
<td>${escapeHtml(e.note || '—')}</td>
</tr>`).join('\n')}
${data.frictionEntries.length === 0 ? '<tr><td colspan="5">No friction events recorded in this period.</td></tr>' : ''}
</table>
</div>
<div class="page-break"></div>

<!-- PAGE 4: MEDICATION COMPLIANCE -->
<div>
<h2>Safe Harbor — Medication Compliance</h2>
<table>
<tr><th>Date</th><th>Medications</th><th>Taken</th><th>Compliance</th></tr>
${data.medsRecords.map((r) => {
    const t = r.meds.filter((m) => m.taken).length;
    const total = r.meds.length;
    const pct = total > 0 ? Math.round((t / total) * 100) : 0;
    return `<tr><td>${r.date}</td><td>${r.meds.map((m) => m.name).join(', ')}</td><td>${t}/${total}</td><td>${pct}%</td></tr>`;
  }).join('\n')}
${data.medsRecords.length === 0 ? '<tr><td colspan="4">No medication data recorded.</td></tr>' : ''}
</table>

<h2>Safe Harbor — Sleep Record</h2>
<table>
<tr><th>Date</th><th>Hours</th><th>vs Target (7.5h)</th></tr>
${data.sleepRecords.map((r) => {
    const diff = r.hours - 7.5;
    const cls = diff >= 0 ? 'severity-managed' : diff > -2 ? 'severity-marked' : 'severity-shutdown';
    return `<tr><td>${r.date}</td><td>${r.hours}h</td><td class="${cls}">${diff >= 0 ? '+' : ''}${diff.toFixed(1)}h</td></tr>`;
  }).join('\n')}
${data.sleepRecords.length === 0 ? '<tr><td colspan="3">No sleep data recorded.</td></tr>' : ''}
</table>
</div>
<div class="page-break"></div>

<!-- PAGE 5: PARENTAL ENGAGEMENT -->
<div>
<h2>Parental Engagement — Sprout Signals</h2>
<p>Total signals sent: ${data.sproutSignalsSent}. Total signals received: ${data.sproutSignalsReceived}.</p>
<p>Anchor pairs this period: ${data.anchorPairs}. Average response time: ${data.avgAnchorResponseTime}.</p>
<p>Summary: ${data.sproutSignalsSent} signals sent, ${data.sproutSignalsReceived} signals received across ${data.totalDays} days.</p>
</div>
<div class="page-break"></div>

<!-- PAGE 6: COUNTERFACTUAL ANALYSIS -->
<div>
<h2>Section 2 — Counterfactual Analysis</h2>
<h3>"The Cost of Unassisted Existence"</h3>
<p><em>This section presents what the data indicates would have occurred without assistive technology support.</em></p>

<table>
<tr><th>Metric</th><th>Observed</th><th>Estimated Unassisted Impact</th></tr>
<tr><td>Messages buffered (voltage caught)</td><td>${data.bufferedMessages}</td><td>${data.bufferedMessages * 2} additional spoons spent on damage control</td></tr>
<tr><td>Hours at zero spoons (overdraft)</td><td>${data.overdraftHours}h</td><td>${data.recoveryDebt}h recovery debt. ${Math.max(0, 40 - data.overdraftHours - data.recoveryDebt)}/40 productive work hours.</td></tr>
<tr><td>Medication gaps</td><td>${data.missedMeds} missed</td><td>Invisible without tracking — increased seizure and instability risk</td></tr>
<tr><td>Sleep deficit</td><td>${data.sleepDeficit}h cumulative</td><td>-${data.capacityReduction}% estimated executive function capacity</td></tr>
<tr><td>Connection gaps (no child contact)</td><td>${data.connectionGaps} days</td><td>Undocumented absence without tracking system</td></tr>
</table>

<br/>
<p><strong>Summary:</strong> Without the P31 assistive technology system, the functional limitations documented in this report would not have been tracked, would not have been visible to evaluators, and would not have generated evidence of either the disability or the accommodation. The technology does not eliminate the disability. It makes the disability — and the effort to manage it — visible and quantifiable.</p>
</div>
<div class="page-break"></div>

<!-- PAGE 7: ACCOMMODATION STATEMENT -->
<div>
<h2>Accommodation Statement</h2>
<p>P31 Labs is an assistive technology platform designed to mitigate the functional limitations of Autism Spectrum Disorder and Attention Deficit Hyperactivity Disorder (AuDHD).</p>
<p>Each component addresses a specific deficit:</p>
<table>
<tr><th>Component</th><th>Function</th><th>DSM-5 Reference</th></tr>
<tr><td>Spoon Economy</td><td>Executive Function / Cognitive Load Management</td><td>314.01 (F90.2) Criterion A1-A9 (Inattention)</td></tr>
<tr><td>The Buffer</td><td>Communication Processing / Emotional Regulation</td><td>299.00 (F84.0) Criterion B4 (Hyper-reactivity to sensory input)</td></tr>
<tr><td>Sprout</td><td>Maintaining Social Relationships</td><td>299.00 (F84.0) Criterion A3 (Maintaining relationships)</td></tr>
<tr><td>Friction Log</td><td>Self-Monitoring / Cognitive Load Awareness</td><td>314.01 (F90.2) Criterion B (Hyperactivity-Impulsivity)</td></tr>
<tr><td>Resonance Engine</td><td>Processing Speed / Communication Accommodation</td><td>299.00 (F84.0) Criterion A1 (Social-emotional reciprocity)</td></tr>
</table>
<br/>
<p>This system was developed because no commercially available assistive technology addresses the combined presentation of AuDHD in adults.</p>
</div>

<div class="footer">
P31 Labs — phosphorus31.org — Open Source — Apache 2.0<br/>
This report was generated automatically from locally-stored data.
</div>

</body>
</html>`;
}

export async function generateExhibitA(): Promise<void> {
  const data = await gatherExhibitData();
  const html = generateHTML(data);

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate the report.');
    return;
  }

  printWindow.document.write(html);
  printWindow.document.close();

  // Give the browser a moment to render, then trigger print
  setTimeout(() => {
    printWindow.print();
  }, 500);
}
