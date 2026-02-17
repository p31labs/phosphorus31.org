import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Brain,
  Radio,
  Shield,
  Fingerprint,
  Atom,
  Scale,
  Cpu,
  Activity,
  Zap,
  Heart,
  Eye,
  Lock,
  Unlock,
  Play,
  Pause,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Network,
  Waves,
} from 'lucide-react';

/**
 * OMEGA PROTOCOL - INTEGRATED DASHBOARD
 * =====================================
 * Complete sovereign stack visualization
 *
 * Seven modules unified in one interface:
 * A. Neuro-Mimetic Reality Engine
 * B. Mycelial Gossip Swarm
 * C. Zero-Knowledge Soul-Layer
 * D. Somatic Bridge
 * E. Quantum Decision Kernel
 * F. Ludic Governance
 * G. Neuro-Symbolic Agent
 */

// ─────────────────────────────────────────────────────────────────────────────
// SIMULATED MODULE STATES (In production: import from actual modules)
// ─────────────────────────────────────────────────────────────────────────────

interface ModuleState {
  id: string;
  name: string;
  shortName: string;
  icon: React.ReactNode;
  active: boolean;
  health: number;
  metrics: Record<string, number | string>;
  color: string;
}

const createInitialModules = (): ModuleState[] => [
  {
    id: 'nmre',
    name: 'Neuro-Mimetic Reality Engine',
    shortName: 'NMRE',
    icon: <Brain className="w-5 h-5" />,
    active: true,
    health: 0.95,
    metrics: { protocol: 'flow', arousal: 0.45, coherence: 0.78 },
    color: '#8b5cf6',
  },
  {
    id: 'swarm',
    name: 'Mycelial Gossip Swarm',
    shortName: 'Swarm',
    icon: <Network className="w-5 h-5" />,
    active: true,
    health: 0.88,
    metrics: { peers: 7, modelVersion: 42, memories: 156 },
    color: '#10b981',
  },
  {
    id: 'zk',
    name: 'Zero-Knowledge Soul-Layer',
    shortName: 'ZK Soul',
    icon: <Fingerprint className="w-5 h-5" />,
    active: true,
    health: 1.0,
    metrics: { proofs: 12, careScore: 8, credentialsActive: 3 },
    color: '#06b6d4',
  },
  {
    id: 'haptics',
    name: 'Somatic Bridge',
    shortName: 'Haptics',
    icon: <Waves className="w-5 h-5" />,
    active: true,
    health: 0.92,
    metrics: { patterns: 15, mastery: 0.67, lastSignal: 'heartbeat' },
    color: '#f59e0b',
  },
  {
    id: 'quantum',
    name: 'Quantum Decision Kernel',
    shortName: 'QBDK',
    icon: <Atom className="w-5 h-5" />,
    active: true,
    health: 0.85,
    metrics: { beliefs: 5, entangled: 2, qParameter: 1.5 },
    color: '#ec4899',
  },
  {
    id: 'governance',
    name: 'Ludic Governance',
    shortName: 'Ludic',
    icon: <Scale className="w-5 h-5" />,
    active: true,
    health: 0.9,
    metrics: { contracts: 3, disputes: 0, templates: 4 },
    color: '#ef4444',
  },
  {
    id: 'agent',
    name: 'Neuro-Symbolic Agent',
    shortName: 'Agent',
    icon: <Cpu className="w-5 h-5" />,
    active: true,
    health: 0.93,
    metrics: { entities: 24, rules: 12, actions: 8 },
    color: '#6366f1',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function OmegaProtocolDashboard() {
  const [modules, setModules] = useState<ModuleState[]>(createInitialModules);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [systemHealth, setSystemHealth] = useState(0.92);
  const [isRunning, setIsRunning] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [nmreProtocol, setNmreProtocol] = useState<'soothe' | 'flow' | 'neutral' | 'alert'>('flow');

  // Simulate real-time updates
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setModules((prev) =>
        prev.map((m) => ({
          ...m,
          health: Math.max(0.5, Math.min(1, m.health + (Math.random() - 0.5) * 0.05)),
          metrics: updateMetrics(m),
        }))
      );

      // Update system health
      setSystemHealth((prev) => {
        const modules = createInitialModules();
        const avgHealth = modules.reduce((sum, m) => sum + m.health, 0) / modules.length;
        return avgHealth + (Math.random() - 0.5) * 0.02;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Log generator
  useEffect(() => {
    if (!isRunning) return;

    const logMessages = [
      { module: 'NMRE', message: 'Bio-signal processed, coherence: 0.78' },
      { module: 'Swarm', message: 'Gossip cycle complete, 3 peers updated' },
      { module: 'ZK', message: 'Care log entry encrypted' },
      { module: 'Haptics', message: 'Pattern played: heartbeat-strong' },
      { module: 'QBDK', message: 'Belief updated via quantum rotation' },
      { module: 'Ludic', message: 'Contract clause validated' },
      { module: 'Agent', message: 'Knowledge graph: 2 new relations' },
    ];

    const interval = setInterval(() => {
      const msg = logMessages[Math.floor(Math.random() * logMessages.length)];
      setLogs((prev) => [
        ...prev.slice(-30),
        { ...msg, timestamp: Date.now(), type: Math.random() > 0.9 ? 'warning' : 'info' },
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleModule = useCallback((moduleId: string) => {
    setModules((prev) => prev.map((m) => (m.id === moduleId ? { ...m, active: !m.active } : m)));
  }, []);

  const activeModules = modules.filter((m) => m.active).length;

  return (
    <div
      className="min-h-screen bg-[#030306] text-zinc-100"
      style={{ fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}
    >
      {/* Geometric Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <svg
          className="absolute top-0 right-0 w-[800px] h-[800px] -translate-y-1/4 translate-x-1/4"
          viewBox="0 0 100 100"
        >
          <TetrahedronSVG />
        </svg>
        <svg
          className="absolute bottom-0 left-0 w-[600px] h-[600px] translate-y-1/4 -translate-x-1/4 rotate-180"
          viewBox="0 0 100 100"
        >
          <TetrahedronSVG />
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-zinc-800/50 bg-[#030306]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center">
                <Shield className="w-6 h-6 text-violet-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#030306] animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Omega Protocol</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">
                Sovereign Geodesic Stack
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500">System Health</span>
              <HealthBar value={systemHealth} />
              <span className="text-sm font-medium">{(systemHealth * 100).toFixed(0)}%</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800">
              <div
                className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`}
              />
              <span className="text-xs">{activeModules}/7 modules</span>
            </div>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`p-2 rounded-lg transition-colors ${
                isRunning
                  ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Module Grid */}
        <div className="grid grid-cols-7 gap-3 mb-8">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              isSelected={selectedModule === module.id}
              onSelect={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
              onToggle={() => toggleModule(module.id)}
            />
          ))}
        </div>

        {/* Detail Panel */}
        {selectedModule && (
          <ModuleDetailPanel
            module={modules.find((m) => m.id === selectedModule)!}
            onClose={() => setSelectedModule(null)}
          />
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* NMRE Visualization */}
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-violet-400" />
              <span className="text-xs uppercase tracking-wider text-zinc-500">Bio-State</span>
            </div>
            <NMREVisualization protocol={nmreProtocol} />
            <div className="mt-4 flex gap-2">
              {(['soothe', 'neutral', 'flow', 'alert'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setNmreProtocol(p)}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                    nmreProtocol === p
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                      : 'bg-zinc-800/50 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Swarm Network */}
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Network className="w-4 h-4 text-emerald-400" />
              <span className="text-xs uppercase tracking-wider text-zinc-500">Mesh Network</span>
            </div>
            <SwarmVisualization />
          </div>

          {/* Quantum State */}
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Atom className="w-4 h-4 text-pink-400" />
              <span className="text-xs uppercase tracking-wider text-zinc-500">
                Quantum Beliefs
              </span>
            </div>
            <BlochSphereVisualization />
          </div>
        </div>

        {/* Activity Log */}
        <div className="mt-6 bg-zinc-900/30 border border-zinc-800/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800/50 flex items-center gap-2">
            <Activity className="w-4 h-4 text-zinc-500" />
            <span className="text-xs uppercase tracking-wider text-zinc-500">Activity Stream</span>
          </div>
          <div className="h-40 overflow-y-auto p-4 font-mono text-xs">
            {logs.map((log, i) => (
              <div key={i} className="py-0.5 flex gap-3">
                <span className="text-zinc-600">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span
                  className={`w-16 ${log.type === 'warning' ? 'text-amber-400' : 'text-zinc-500'}`}
                >
                  [{log.module}]
                </span>
                <span className={log.type === 'warning' ? 'text-amber-300' : 'text-zinc-400'}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBCOMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

interface LogEntry {
  module: string;
  message: string;
  timestamp: number;
  type: 'info' | 'warning';
}

function ModuleCard({
  module,
  isSelected,
  onSelect,
  onToggle,
}: {
  module: ModuleState;
  isSelected: boolean;
  onSelect: () => void;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
        isSelected
          ? 'bg-zinc-800/50 border-zinc-600'
          : module.active
            ? 'bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700'
            : 'bg-zinc-900/10 border-zinc-800/30 opacity-50'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div style={{ color: module.color }}>{module.icon}</div>
        <div
          className={`w-2 h-2 rounded-full ${module.active ? 'bg-emerald-500' : 'bg-zinc-600'}`}
          style={{ boxShadow: module.active ? `0 0 8px ${module.color}40` : 'none' }}
        />
      </div>
      <p className="text-xs font-medium truncate">{module.shortName}</p>
      <div className="mt-2 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${module.health * 100}%`,
            backgroundColor: module.color,
          }}
        />
      </div>
    </div>
  );
}

function ModuleDetailPanel({ module, onClose }: { module: ModuleState; onClose: () => void }) {
  return (
    <div className="mb-6 bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${module.color}20` }}>
            {React.cloneElement(module.icon as React.ReactElement, {
              style: { color: module.color },
            })}
          </div>
          <div>
            <h3 className="font-medium">{module.name}</h3>
            <p className="text-xs text-zinc-500">Health: {(module.health * 100).toFixed(0)}%</p>
          </div>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
          ×
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Object.entries(module.metrics).map(([key, value]) => (
          <div key={key} className="bg-zinc-800/30 rounded-lg p-3">
            <p className="text-xs text-zinc-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
            <p className="text-lg font-medium" style={{ color: module.color }}>
              {typeof value === 'number' ? value.toFixed(value < 10 ? 2 : 0) : value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HealthBar({ value }: { value: number }) {
  const color = value > 0.8 ? '#10b981' : value > 0.5 ? '#f59e0b' : '#ef4444';
  return (
    <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${value * 100}%`, backgroundColor: color }}
      />
    </div>
  );
}

function NMREVisualization({ protocol }: { protocol: string }) {
  const colors = {
    soothe: { bg: '#06b6d420', ring: '#06b6d4' },
    neutral: { bg: '#71717a20', ring: '#71717a' },
    flow: { bg: '#8b5cf620', ring: '#8b5cf6' },
    alert: { bg: '#f59e0b20', ring: '#f59e0b' },
  };

  const c = colors[protocol as keyof typeof colors];

  return (
    <div className="relative h-32 flex items-center justify-center">
      <div
        className="absolute w-24 h-24 rounded-full animate-pulse"
        style={{ backgroundColor: c.bg }}
      />
      <div
        className="absolute w-16 h-16 rounded-full border-2"
        style={{ borderColor: c.ring, animation: 'ping 2s infinite' }}
      />
      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: c.ring }} />
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <span className="text-xs text-zinc-500">Protocol: </span>
        <span className="text-xs font-medium" style={{ color: c.ring }}>
          {protocol}
        </span>
      </div>
    </div>
  );
}

function SwarmVisualization() {
  const nodes = [
    { x: 50, y: 30, self: true },
    { x: 20, y: 50 },
    { x: 80, y: 50 },
    { x: 35, y: 70 },
    { x: 65, y: 70 },
    { x: 15, y: 85 },
    { x: 85, y: 85 },
  ];

  return (
    <div className="relative h-32">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Connections */}
        {nodes.slice(1).map((node, i) => (
          <line
            key={i}
            x1={nodes[0].x}
            y1={nodes[0].y}
            x2={node.x}
            y2={node.y}
            stroke="#10b98140"
            strokeWidth="1"
          />
        ))}
        {/* Cross connections */}
        <line x1={20} y1={50} x2={35} y2={70} stroke="#10b98120" strokeWidth="0.5" />
        <line x1={80} y1={50} x2={65} y2={70} stroke="#10b98120" strokeWidth="0.5" />

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={i}>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.self ? 6 : 4}
              fill={node.self ? '#10b981' : '#10b98160'}
            />
            {node.self && (
              <circle
                cx={node.x}
                cy={node.y}
                r="8"
                fill="none"
                stroke="#10b98140"
                strokeWidth="1"
                style={{ animation: 'ping 2s infinite' }}
              />
            )}
          </g>
        ))}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <span className="text-xs text-zinc-500">7 peers • </span>
        <span className="text-xs text-emerald-400">gossip active</span>
      </div>
    </div>
  );
}

function BlochSphereVisualization() {
  const [theta, setTheta] = useState(Math.PI / 4);
  const [phi, setPhi] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhi((p) => (p + 0.05) % (2 * Math.PI));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const x = 50 + 30 * Math.sin(theta) * Math.cos(phi);
  const y = 50 - 30 * Math.cos(theta);

  return (
    <div className="relative h-32">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Sphere outline */}
        <ellipse cx="50" cy="50" rx="30" ry="30" fill="none" stroke="#ec489920" strokeWidth="1" />
        <ellipse cx="50" cy="50" rx="30" ry="10" fill="none" stroke="#ec489910" strokeWidth="0.5" />

        {/* Axes */}
        <line x1="50" y1="15" x2="50" y2="85" stroke="#ec489930" strokeWidth="0.5" />
        <line x1="15" y1="50" x2="85" y2="50" stroke="#ec489930" strokeWidth="0.5" />

        {/* State vector */}
        <line x1="50" y1="50" x2={x} y2={y} stroke="#ec4899" strokeWidth="2" />
        <circle cx={x} cy={y} r="4" fill="#ec4899" />

        {/* Labels */}
        <text x="50" y="12" textAnchor="middle" fill="#ec489960" fontSize="6">
          |0⟩
        </text>
        <text x="50" y="92" textAnchor="middle" fill="#ec489960" fontSize="6">
          |1⟩
        </text>
      </svg>
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <span className="text-xs text-zinc-500">θ: {((theta / Math.PI) * 180).toFixed(0)}° • </span>
        <span className="text-xs text-pink-400">superposition</span>
      </div>
    </div>
  );
}

function TetrahedronSVG() {
  return (
    <g stroke="#8b5cf6" strokeWidth="0.3" fill="none" opacity="0.3">
      <polygon points="50,15 15,75 85,75" />
      <line x1="50" y1="15" x2="50" y2="75" />
      <line x1="15" y1="75" x2="50" y2="45" />
      <line x1="85" y1="75" x2="50" y2="45" />
    </g>
  );
}

function updateMetrics(module: ModuleState): Record<string, number | string> {
  const m = { ...module.metrics };

  switch (module.id) {
    case 'nmre':
      m.arousal = Number(((m.arousal as number) + (Math.random() - 0.5) * 0.1).toFixed(2));
      m.coherence = Number(((m.coherence as number) + (Math.random() - 0.5) * 0.05).toFixed(2));
      break;
    case 'swarm':
      m.modelVersion = (m.modelVersion as number) + (Math.random() > 0.7 ? 1 : 0);
      break;
    case 'zk':
      m.proofs = (m.proofs as number) + (Math.random() > 0.8 ? 1 : 0);
      break;
    case 'quantum':
      m.beliefs = Math.max(1, (m.beliefs as number) + (Math.random() > 0.5 ? 1 : -1));
      break;
    case 'agent':
      m.entities = (m.entities as number) + (Math.random() > 0.6 ? 1 : 0);
      break;
  }

  return m;
}
