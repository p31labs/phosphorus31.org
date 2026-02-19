/**
 * P31 Scope — Main dashboard shell: top bar, octahedral nav, content, spectrum bar.
 * Full viewport, dark void; FIDTransition on view changes; Posner background when home.
 */

import React from 'react';
import { useNavigationStore } from '@/store/useNavigationStore';
import { useSensoryStore } from '@/store/useSensoryStore';
import { OctahedralNav } from '@/organisms/OctahedralNav';
import { PulseIndicator } from '@/components/scope/PulseIndicator';
import { SpectrumBar } from '@/components/scope/SpectrumBar';
import { FIDTransition } from '@/components/scope/FIDTransition';
import { PosnerBackground } from '@/components/scope/PosnerBackground';
import { ScopeMessageQueueSkeleton, ScopeAccommodationLogSkeleton } from '@/components/scope/ScopeSkeleton';
import { ScopeEmptyMessageQueue, ScopeEmptyAccommodationLog } from '@/components/scope/ScopeEmptyStates';
import { ScopeConnectionBanner } from '@/components/scope/ScopeConnectionBanner';
import { FractalZUI, type FractalNode } from '@/quantum/FractalZUI';
import type { PosnerNodeId } from '@/store/useNavigationStore';
import { useScopeBufferData } from '@/hooks/useScopeBufferData';
import { useBufferWebSocket } from '@/hooks/useBufferWebSocket';
import { BuddySpeech } from '@/components/Buddy/BuddySpeech';
import type { ScopeBufferData } from '@/hooks/useScopeBufferData';
import type { HistoryMessage } from '@/services/buffer.service';
import '@/components/scope/scope.css';

/** Build Neural Core fractal nodes from live buffer data (tasks count, health, messages). */
function buildNeuralCoreNodes(buffer: ScopeBufferData): FractalNode[] {
  const heldCritical = buffer.messages.filter((m) => {
    const s = m.triageDecision?.status ?? '';
    return s === 'HELD' || s === 'AUTO_HELD' || s === 'CRITICAL';
  }).length;
  const tasksLabel = buffer.connected
    ? `Tasks${buffer.messages.length > 0 ? ` (${buffer.messages.length})` : ''}`
    : 'Tasks';
  const healthLabel = buffer.accommodationLogAvailable ? 'Health · log ready' : 'Health';
  return [
    {
      id: 'neural-core',
      label: 'Neural Core',
      type: 'cluster',
      children: [
        { id: 'tasks', label: tasksLabel, type: 'file' },
        { id: 'health', label: healthLabel, type: 'file' },
        { id: 'projects', label: 'Projects', type: 'cluster', children: [] },
      ],
    },
    {
      id: 'comm',
      label: `Comm${heldCritical > 0 ? ` · ${heldCritical} held` : ''}`,
      type: 'cluster',
      children: [],
    },
    { id: 'archives', label: 'Archives', type: 'cluster', children: [] },
  ];
}

const SECTION_NAMES: Record<PosnerNodeId, string> = {
  null: 'Home',
  'neural-core': 'Neural Core',
  settings: 'Settings',
  communication: 'Communication',
  archives: 'Archives',
  'project-a': 'Project A',
  'project-b': 'Project B',
};

function ViewHome() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
      <h2 className="text-xl font-medium text-green-400/90">Welcome to P31 Spectrum</h2>
      <p className="max-w-md text-gray-400">
        Your cognitive dashboard. Use the octahedron or the spectrum bar to move between sections.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <QuickActionCard label="Tasks" nodeId="communication" />
        <QuickActionCard label="Health" nodeId="archives" />
        <QuickActionCard label="Projects" nodeId="project-a" />
      </div>
    </div>
  );
}

function QuickActionCard({ label, nodeId }: { label: string; nodeId: PosnerNodeId }) {
  const navigateTo = useNavigationStore((s) => s.navigateTo);
  return (
    <button
      type="button"
      onClick={() => navigateTo(nodeId)}
      className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-gray-300 transition hover:border-green-400/40 hover:bg-white/10"
    >
      {label}
    </button>
  );
}

function ViewTasks({ bufferData }: { bufferData: ScopeBufferData }) {
  const {
    connected,
    messages,
    accommodationLogAvailable,
    accommodationLogError,
    connectionInterrupted,
    loading,
    refetch,
  } = bufferData;

  const triageLabel = (status: string) => {
    if (status === 'PASSED' || status === 'RELEASED') return { label: 'Passed', className: 'text-green-400' };
    if (status === 'HELD' || status === 'AUTO_HELD') return { label: 'Held', className: 'text-amber-400' };
    if (status === 'CRITICAL') return { label: 'Critical', className: 'text-red-400' };
    return { label: status, className: 'text-gray-400' };
  };

  return (
    <div className="p-6">
      {connectionInterrupted && (
        <ScopeConnectionBanner message="Connection interrupted · Retrying..." />
      )}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-medium text-white">Tasks</h2>
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-2 w-2 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-500'}`}
            aria-hidden
          />
          <span className="text-xs text-gray-500">
            {connected ? 'Buffer connected' : 'Buffer not connected'}
          </span>
          {(connected || connectionInterrupted) && (
            <button
              type="button"
              onClick={() => refetch()}
              disabled={loading}
              className="text-xs text-green-400/80 hover:text-green-400 disabled:opacity-50"
            >
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
          )}
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-4">
        Items from the P31 Buffer, triaged by voltage. High-voltage messages are held for review; low-voltage pass through. Verified care actions feed the accommodation log.
      </p>
      <div className="space-y-3">
        <section className="rounded-lg border border-white/10 bg-white/5 p-4">
          <h3 className="text-sm font-medium text-green-400/90 mb-2">Today</h3>
          {loading && <ScopeMessageQueueSkeleton />}
          {!loading && !connected && !connectionInterrupted && (
            <p className="text-gray-500 text-sm">Start the P31 Shelter backend (port 4000) to see triaged items here.</p>
          )}
          {!loading && (connected || connectionInterrupted) && messages.length === 0 && (
            <ScopeEmptyMessageQueue />
          )}
          {!loading && messages.length > 0 && (
            <ul className="space-y-2" aria-label="Today’s triaged messages">
              {messages.slice(0, 15).map((msg) => {
                const { label, className } = triageLabel(msg.triageDecision?.status ?? '');
                return (
                  <li
                    key={msg.id}
                    className="flex flex-wrap items-baseline justify-between gap-2 rounded border border-white/5 bg-black/20 px-3 py-2 text-sm"
                  >
                    <span className="min-w-0 flex-1 truncate text-gray-300" title={msg.text}>
                      {msg.text.slice(0, 80)}{msg.text.length > 80 ? '…' : ''}
                    </span>
                    <span className="shrink-0 text-xs text-gray-500">V{msg.voltageResult?.voltage ?? '—'}</span>
                    <span className={`shrink-0 text-xs ${className}`}>{label}</span>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="mt-2 text-xs text-gray-600">Capture → Triage (0–10 voltage) → Pass / Hold / Critical → Accommodation log</p>
        </section>
        <section className="rounded-lg border border-white/10 bg-white/5 p-4">
          <h3 className="text-sm font-medium text-green-400/90 mb-2">Accommodation log</h3>
          {loading && <ScopeAccommodationLogSkeleton />}
          {!loading && !accommodationLogAvailable && accommodationLogError !== 'Not yet implemented' && (
            <ScopeEmptyAccommodationLog />
          )}
          {!loading && (accommodationLogAvailable || accommodationLogError === 'Not yet implemented') && (
            <p className="text-gray-500 text-sm">
              {accommodationLogAvailable
                ? 'Immutable evidence chain for SSA and legal use. Export from P31 Buffer when needed.'
                : 'Export not yet implemented on backend. Coming soon.'}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

const GROUND_THRESHOLD = 3.5; // Sparks — below this, Rest Protocol (quiet mode) is recommended

function ViewHealth({ bufferData }: { bufferData: ScopeBufferData }) {
  const { connected, messages } = bufferData;

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-medium text-white">Health</h2>
        {connected && (
          <span className="text-xs text-gray-500">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500 align-middle" aria-hidden /> Buffer live · {messages.length} triaged today
          </span>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-4">
        Energy (Sparks), medication timing, and coherence. Below {GROUND_THRESHOLD} Sparks, consider Rest Protocol — no obligation, just support.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <section className="rounded-lg border border-white/10 bg-white/5 p-4">
          <h3 className="text-sm font-medium text-green-400/90 mb-2">Energy</h3>
          <p className="text-gray-500 text-sm">Spoon/Spark level from P31 Governor. Connect the P31 Buffer or P31 Spectrum backend for live readout. Ground threshold: {GROUND_THRESHOLD}.</p>
        </section>
        <section className="rounded-lg border border-white/10 bg-white/5 p-4">
          <h3 className="text-sm font-medium text-green-400/90 mb-2">Medication</h3>
          <p className="text-gray-500 text-sm">Calcitriol, Calcium, Vyvanse, Magnesium. Reminders and 4-hour Ca²⁺↔Vyvanse gap are in the full P31 Spectrum sheet; summary will sync here when connected.</p>
        </section>
      </div>
      <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-amber-200/90">
        <strong>Rest Protocol:</strong> When energy is low, quiet mode and reduced demand are available. The mesh holds.
      </div>
    </div>
  );
}

function ViewNeuralCore() {
  return (
    <div className="p-4 h-full min-h-[400px]">
      <h2 className="mb-2 text-sm font-medium text-gray-400">Neural Core — Fractal view</h2>
      <FractalZUI data={NEURAL_CORE_SEED} className="h-[min(60vh,520px)] rounded-lg border border-white/10" />
    </div>
  );
}

/** P31 Stack — 4+1 from the Codex. Projects view. */
const P31_STACK = [
  { id: 'compass', name: 'P31 Compass', role: 'Direction · coherence, environment', color: 'text-green-400' },
  { id: 'hearth', name: 'P31 Hearth', role: 'Energy · Sparks, L.O.V.E. Protocol', color: 'text-amber-400' },
  { id: 'greenhouse', name: 'P31 Greenhouse', role: 'Growth · learning, Clearing game', color: 'text-emerald-400' },
  { id: 'studio', name: 'P31 Studio', role: 'Creation · output, art, communication', color: 'text-blue-400' },
  { id: 'sync', name: 'P31 Sync', role: 'Backend · entangle all nodes', color: 'text-gray-400' },
];

function ViewProjects() {
  return (
    <div className="p-6">
      <h2 className="mb-4 text-lg font-medium text-white">Projects</h2>
      <p className="text-gray-400 text-sm mb-4">
        The P31 Stack — four nodes plus one sync layer. Each vertex holds part of the whole.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {P31_STACK.map((p) => (
          <div
            key={p.id}
            className="rounded-lg border border-white/10 bg-white/5 p-4 transition hover:border-white/20"
          >
            <h3 className={`font-medium ${p.color}`}>{p.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{p.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ViewSettings() {
  const { mode, setMode, hapticEnabled, toggleHaptic } = useSensoryStore();
  return (
    <div className="p-6">
      <h2 className="mb-4 text-lg font-medium text-white">Settings</h2>
      <div className="space-y-4">
        <div>
          <span className="text-sm text-gray-400">Sensory mode</span>
          <div className="mt-2 flex gap-2">
            {(['full', 'calm', 'quiet'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded px-3 py-1.5 text-sm capitalize ${
                  mode === m ? 'bg-green-500/30 text-green-300' : 'bg-white/10 text-gray-400'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-400">
          <input
            type="checkbox"
            checked={hapticEnabled}
            onChange={toggleHaptic}
            className="rounded border-gray-600 bg-gray-800 text-green-500"
          />
          Haptic feedback
        </label>
      </div>
    </div>
  );
}

function renderView(
  activeNode: PosnerNodeId,
  bufferData: ScopeBufferData,
  neuralCoreNodes: FractalNode[]
) {
  switch (activeNode) {
    case 'neural-core':
      return <ViewNeuralCore neuralCoreNodes={neuralCoreNodes} />;
    case 'communication':
      return <ViewTasks bufferData={bufferData} />;
    case 'archives':
      return <ViewHealth bufferData={bufferData} />;
    case 'project-a':
    case 'project-b':
      return <ViewProjects />;
    case 'settings':
      return <ViewSettings />;
    case null:
    default:
      return <ViewHome />;
  }
}

function heldCriticalCount(messages: HistoryMessage[]): number {
  return messages.filter((m) => {
    const s = m.triageDecision?.status ?? '';
    return s === 'HELD' || s === 'AUTO_HELD' || s === 'CRITICAL';
  }).length;
}

export function ScopeDashboard() {
  const activeNode = useNavigationStore((s) => s.activeNode);
  const sectionName = SECTION_NAMES[activeNode ?? 'null'];
  const bufferData = useScopeBufferData();
  useBufferWebSocket({ onInvalidate: bufferData.refetch, enabled: true });

  const commAlert = heldCriticalCount(bufferData.messages);
  const neuralCoreNodes = buildNeuralCoreNodes(bufferData);

  const [toast, setToast] = React.useState<{ message: string } | null>(null);
  const prevConnected = React.useRef<boolean | null>(null);
  const prevInterrupted = React.useRef(false);

  React.useEffect(() => {
    const connected = bufferData.connected;
    const interrupted = bufferData.connectionInterrupted;
    if (prevConnected.current === null) {
      prevConnected.current = connected;
      prevInterrupted.current = interrupted;
      return;
    }
    if (interrupted && !prevInterrupted.current) {
      setToast({ message: 'Connection interrupted. Retrying…' });
    } else if (connected && prevInterrupted.current) {
      setToast({ message: 'Buffer connected.' });
    }
    prevConnected.current = connected;
    prevInterrupted.current = interrupted;
  }, [bufferData.connected, bufferData.connectionInterrupted]);

  return (
    <div className="scope-dashboard flex h-screen w-screen flex-col overflow-hidden bg-[#050510] text-white">
      {/* Top bar */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-white/10 bg-black/40 px-4">
        <span className="scope-logo-p31 font-mono text-lg tracking-wider">
          P31
        </span>
        <span className="text-sm text-gray-500">{sectionName}</span>
        <PulseIndicator />
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Left: OctahedralNav or sidebar */}
        <aside className="hidden w-52 shrink-0 items-start justify-center border-r border-white/10 p-4 lg:flex">
          <OctahedralNav />
        </aside>

        {/* Center: main content */}
        <main className="relative flex-1 overflow-auto">
          {activeNode === null && <PosnerBackground />}
          <FIDTransition viewKey={activeNode ?? 'home'} className="relative z-10 min-h-full">
            {renderView(activeNode, bufferData, neuralCoreNodes)}
          </FIDTransition>
        </main>

        {/* Right: optional nav for large screens (same as left or empty) */}
        <aside className="hidden w-32 shrink-0 border-l border-white/10 lg:block" aria-hidden />
      </div>

      {/* Buddy status toasts (Buffer connected / interrupted) */}
      {toast && (
        <div className="fixed bottom-20 left-4 z-30">
          <BuddySpeech
            message={toast.message}
            speak={false}
            autoHideMs={3000}
            onDismiss={() => setToast(null)}
          />
        </div>
      )}

      {/* Mobile: 2D nav in sidebar when not using spectrum */}
      <div className="lg:hidden absolute left-2 top-14 z-20">
        <OctahedralNav force2D />
      </div>

      {/* Bottom: SpectrumBar (³¹P nav) + Comm badge when held/critical */}
      <SpectrumBar mode="nav" commAlertCount={commAlert} />
    </div>
  );
}

