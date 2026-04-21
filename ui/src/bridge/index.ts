// ═══════════════════════════════════════════════════════════════
// BRIDGE LAYER IMPLEMENTATION — Add to ui/src/bridge/
// ═══════════════════════════════════════════════════════════════

// endpoints.ts
export const ENDPOINTS = {
  agentHub: 'https://p31-agent-hub.trimtab-signal.workers.dev',
  cage: 'https://k4-cage.trimtab-signal.workers.dev',
  personal: 'https://k4-personal.trimtab-signal.workers.dev',
  hubs: 'https://k4-hubs.trimtab-signal.workers.dev',
  bouncer: 'https://p31-bouncer.trimtab-signal.workers.dev',
  chamber: 'https://reflective-chamber.trimtab-signal.workers.dev',
  meshPWA: 'https://p31-mesh.pages.dev',
  ws: 'wss://k4-cage.trimtab-signal.workers.dev/ws',
} as const;

// auth.ts
const TOKEN_KEY = 'p31_jwt';
const EXPIRY_KEY = 'p31_jwt_exp';

export function getToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(EXPIRY_KEY);
  if (!token || !expiry) return null;
  if (Date.now() > parseInt(expiry)) {
    clearToken();
    return null;
  }
  return token;
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
}

export async function authenticate(roomCode: string, userId: string, name: string, color: string, role: string) {
  const res = await fetch(`${ENDPOINTS.bouncer}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, roomCode, name, color, role }),
  });
  if (!res.ok) throw new Error(`Auth failed: ${res.status}`);
  const data = await res.json();
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(EXPIRY_KEY, String(data.expiresAt));
  return data;
}

export function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } : { 'Content-Type': 'application/json' };
}

// agent.ts
export async function chat(session: string, message: string, userName?: string) {
  const prefix = userName ? `[${userName}] ` : '';
  const res = await fetch(`${ENDPOINTS.agentHub}/api/chat`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ session, message: `${prefix}${message}` }),
  });
  if (!res.ok) throw new Error(`Agent error: ${res.status}`);
  const data = await res.json();
  // Leakage cleanup
  if (data.reply?.startsWith('{') && data.reply.includes('tool_calls')) data.reply = 'Processing complete.';
  if (data.reply?.includes('<|python_tag|>')) data.reply = data.reply.replace(/<\|[^|]+\|>/g, '').trim() || 'Done.';
  return data;
}

// personal.ts
export async function getEnergy(userId: string) {
  const res = await fetch(`${ENDPOINTS.personal}/agent/${userId}/energy`);
  if (!res.ok) throw new Error(`Energy fetch failed: ${res.status}`);
  return res.json();
}

export async function setEnergy(userId: string, spoons: number) {
  const res = await fetch(`${ENDPOINTS.personal}/agent/${userId}/energy`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ spoons }),
  });
  return res.json();
}

export async function submitBio(userId: string, type: string, value: number, unit: string, source = 'p31ca') {
  const res = await fetch(`${ENDPOINTS.personal}/agent/${userId}/bio`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ type, value, unit, source }),
  });
  return res.json();
}

// mesh.ts
export async function getRoomStats(roomId: string) {
  const res = await fetch(`${ENDPOINTS.cage}/room-stats/${roomId}`);
  return res.json();
}

export function connectWebSocket(roomId: string, nodeId: string, handlers: any) {
  const ws = new WebSocket(`${ENDPOINTS.ws}/${roomId}?node=${nodeId}`);
  ws.onopen = () => handlers.onOpen?.();
  ws.onmessage = (e) => {
    try { handlers.onMessage?.(JSON.parse(e.data)); } catch {}
  };
  ws.onclose = () => handlers.onClose?.();
  ws.onerror = (e) => handlers.onError?.(e);
  return ws;
}

// health.ts
const WORKER_LIST = [
  { id: 'p31-agent-hub', name: 'Agent Hub', path: '/health' },
  { id: 'k4-cage', name: 'K₄ Cage', path: '/' },
  { id: 'k4-personal', name: 'Personal Agent', path: '/agent/will/health' },
  { id: 'k4-hubs', name: 'Hub Router', path: '/health' },
  { id: 'p31-bouncer', name: 'Bouncer', path: '/' },
  { id: 'reflective-chamber', name: 'Reflective Chamber', path: '/' },
];

export async function checkAllWorkers() {
  return Promise.all(WORKER_LIST.map(async (w) => {
    const start = performance.now();
    try {
      const res = await fetch(`https://${w.id}.trimtab-signal.workers.dev${w.path}`, {
        mode: 'cors', signal: AbortSignal.timeout(5000)
      });
      const ms = Math.round(performance.now() - start);
      if (res.ok) {
        const body = await res.json().catch(() => ({}));
        return { id: w.id, name: w.name, status: 'ok', responseMs: ms, leakage: body.leakage };
      }
      return { id: w.id, name: w.name, status: 'error', responseMs: ms };
    } catch {
      return { id: w.id, name: w.name, status: 'error', responseMs: Math.round(performance.now() - start) };
    }
  }));
}

// index.ts (barrel export)
export { ENDPOINTS } from './endpoints';
export { getToken, clearToken, authenticate, authHeaders } from './auth';
export { chat } from './agent';
export { getEnergy, setEnergy, submitBio } from './personal';
export { getRoomStats, connectWebSocket } from './mesh';
export { checkAllWorkers } from './health';

// ═══════════════════════════════════════════════════════════════
// UNIFIED FLOW COMPONENTS — Add to ui/src/components/
// ═══════════════════════════════════════════════════════════════

// P31Header.tsx
import React from 'react';

const T = {
  bg: "#0a0e17", border: "#1a2035", text: "#c8d0dd", muted: "#6b7a94", faint: "#2a3550",
  coral: "#ff6b4a", font: "'JetBrains Mono', 'SF Mono', monospace",
};

interface P31HeaderProps {
  current?: string;
}

export function P31Header({ current = "hub" }: P31HeaderProps) {
  const nav = [
    { id: "hub", label: "Hub", path: "/" },
    { id: "scope", label: "Scope", path: "/scope" },
    { id: "portal", label: "Portal", path: "https://phosphorus31.org", external: true },
    { id: "lattice", label: "Lattice", path: "/lattice" },
    { id: "github", label: "GitHub", path: "https://github.com/p31labs", external: true },
  ];

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(10,14,23,0.92)", backdropFilter: "blur(16px)",
      borderBottom: `1px solid ${T.border}`, padding: "0 24px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: T.coral }} />
          <span style={{ fontSize: 14, fontWeight: 800, color: "#e2e8f0", fontFamily: T.font, letterSpacing: 2 }}>P31 Labs</span>
          <span style={{ fontSize: 11, color: T.faint, fontFamily: T.font }}>Technical Hub</span>
        </a>
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {nav.map(n => (
            <a key={n.id} href={n.path} target={n.external ? "_blank" : undefined} rel={n.external ? "noopener" : undefined}
              style={{
                fontSize: 11, fontFamily: T.font, letterSpacing: 1.5, padding: "6px 12px",
                color: current === n.id ? "#e2e8f0" : T.muted, textDecoration: "none",
                borderRadius: 6, background: current === n.id ? `${T.coral}10` : "transparent",
                fontWeight: current === n.id ? 700 : 400,
              }}>{n.label}</a>
          ))}
          <a href="https://phosphorus31.org/donate" target="_blank" rel="noopener"
            style={{
              fontSize: 10, fontFamily: T.font, letterSpacing: 2, padding: "6px 16px",
              color: "#fff", background: T.coral, borderRadius: 20, textDecoration: "none",
              fontWeight: 700, marginLeft: 8,
            }}>Donate</a>
        </nav>
      </div>
    </header>
  );
}

// FleetStrip.tsx
import React, { useState, useEffect } from 'react';
import { checkAllWorkers } from '@/bridge';

const T = { bg: "#0f1420", border: "#1a2035", text: "#c8d0dd", muted: "#6b7a94", faint: "#2a3550", green: "#34d399", red: "#f06060" };

interface FleetStripProps {
  expanded?: boolean;
}

export function FleetStrip({ expanded = false }: FleetStripProps) {
  const [health, setHealth] = useState<Record<string, boolean>>({});
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkAll = async () => {
    const results = await checkAllWorkers();
    const healthMap: Record<string, boolean> = {};
    results.forEach(r => { healthMap[r.id] = r.status === 'ok'; });
    setHealth(healthMap);
    setLastCheck(new Date());
  };

  useEffect(() => { checkAll(); }, []);

  const upCount = Object.values(health).filter(h => h).length;
  const total = Object.keys(health).length;
  const allUp = upCount === total;

  return (
    <div style={{
      background: T.bg, borderBottom: `1px solid ${T.border}`,
      padding: expanded ? "16px 24px" : "8px 24px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: expanded ? 12 : 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: allUp ? T.green : "#eab308" }} />
            <span style={{ fontSize: 10, color: T.muted, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2 }}>FLEET STATUS</span>
          </div>
          <span style={{ fontSize: 9, color: T.faint, fontFamily: "'JetBrains Mono', monospace" }}>
            {lastCheck ? `Last checked: ${lastCheck.toLocaleTimeString()}` : "Checking..."}
          </span>
        </div>
        {expanded && (
          <>
            <div style={{ fontSize: 8, color: T.faint, letterSpacing: 2, marginBottom: 6, marginTop: 4 }}>WORKERS</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {Object.entries(health).map(([id, up]) => (
                <WorkerDot key={id} worker={id.replace('p31-', '').replace('k4-', '')} status={up} />
              ))}
            </div>
          </>
        )}
        {!expanded && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 6 }}>
            {Object.entries(health).map(([id, up]) => (
              <div key={id} title={id} style={{
                width: 8, height: 8, borderRadius: 2,
                background: up ? T.green : T.red,
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WorkerDot({ worker, status }: { worker: string; status: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6, padding: "4px 10px",
      background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6,
      minWidth: 120,
    }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: status ? T.green : T.red, flexShrink: 0 }} />
      <span style={{ fontSize: 9, color: status ? T.text : T.muted, fontFamily: "'JetBrains Mono', monospace" }}>{worker}</span>
    </div>
  );
}

// ProductAbout.tsx
import React from 'react';

const T = {
  bg: "#02050A", card: "#080c16", border: "#111827", text: "#c8d0dd", muted: "#6b7a94", faint: "#2a3550",
  accent: "#00F0FF", coral: "#ff6b4a", font: "'JetBrains Mono', 'SF Mono', monospace",
};

interface ProductAboutProps {
  product: {
    name: string;
    tagline: string;
    icon: string;
    color: string;
    status: string;
    launchUrl?: string;
    hubUrl?: string;
    description: string;
    features: Array<{ name: string; desc: string }>;
    stack: string[];
  };
}

export function ProductAbout({ product }: ProductAboutProps) {
  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: T.font, color: T.text }}>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>
        {/* Product identity */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{product.icon}</div>
          <h1 style={{
            fontSize: 28, fontWeight: 800, color: "#e2e8f0", letterSpacing: 2, margin: "0 0 8px",
            fontFamily: T.font
          }}>{product.name}</h1>
          <div style={{
            fontSize: 11, color: T.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16
          }}>{product.tagline}</div>
          <p style={{ fontSize: 13, color: T.text, lineHeight: 1.8, maxWidth: 500, margin: "0 auto" }}>
            {product.description}
          </p>
          <div style={{ marginTop: 16 }}>
            <span style={{
              fontSize: 9, letterSpacing: 2, padding: "4px 12px", borderRadius: 12,
              background: product.status === "LIVE" ? `${T.accent}15` : `${T.coral}15`,
              color: product.status === "LIVE" ? T.accent : T.coral, fontWeight: 700,
            }}>{product.status}</span>
          </div>
        </div>

        {/* Launch button */}
        {product.launchUrl && (
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <a href={product.launchUrl} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: product.color, color: "#000", padding: "14px 32px",
              borderRadius: 8, fontSize: 12, fontWeight: 800, letterSpacing: 3,
              textDecoration: "none", fontFamily: T.font,
            }}>
              <span style={{ fontSize: 14 }}>◉</span> Launch {product.name}
            </a>
            <div style={{ marginTop: 12 }}>
              <a href={product.hubUrl || "/"} style={{ fontSize: 10, color: T.muted, textDecoration: "none", fontFamily: T.font }}>
                ← Back to Hub
              </a>
            </div>
          </div>
        )}

        {/* Features */}
        <Section title="FEATURES">
          <div style={{ display: "grid", gap: 8 }}>
            {product.features.map((f, i) => (
              <div key={i} style={{
                display: "flex", gap: 10, padding: "10px 12px",
                background: T.card, borderRadius: 8, border: `1px solid ${T.border}`
              }}>
                <span style={{ color: product.color, fontSize: 11, flexShrink: 0 }}>▸</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#e2e8f0", marginBottom: 2 }}>{f.name}</div>
                  <div style={{ fontSize: 10, color: T.muted, lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Tech stack */}
        <Section title="TECHNICAL STACK">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {product.stack.map((s, i) => (
              <span key={i} style={{
                fontSize: 9, padding: "4px 10px", borderRadius: 4,
                background: `${T.accent}08`, border: `1px solid ${T.border}`,
                color: T.muted, fontFamily: T.font,
              }}>{s}</span>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        fontSize: 9, color: T.faint, letterSpacing: 3, marginBottom: 12, paddingBottom: 8,
        borderBottom: `1px solid ${T.border}`
      }}>{title}</div>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STORE INTEGRATION EXAMPLE
// ═══════════════════════════════════════════════════════════════

/*
// Add to ui/src/stores/meshStore.ts
import { create } from 'zustand';
import { getEnergy, setEnergy, submitBio, getReminders } from '@/bridge';

interface MeshState {
  userId: string;
  spoons: number;
  maxSpoons: number;
  reminders: any[];
  workerHealth: Record<string, 'ok' | 'error' | 'checking'>;
  meshStats: { connections: number; pending: number } | null;
  lastSync: number;

  syncEnergy: () => Promise<void>;
  updateSpoons: (value: number) => Promise<void>;
  logBio: (type: string, value: number, unit: string) => Promise<void>;
  syncReminders: () => Promise<void>;
}

export const useMeshStore = create<MeshState>((set, get) => ({
  userId: 'will',
  spoons: 0,
  maxSpoons: 12,
  reminders: [],
  workerHealth: {},
  meshStats: null,
  lastSync: 0,

  syncEnergy: async () => {
    const { userId } = get();
    const energy = await getEnergy(userId);
    set({ spoons: energy.spoons, maxSpoons: energy.max, lastSync: Date.now() });
  },

  updateSpoons: async (value) => {
    const { userId } = get();
    const energy = await setEnergy(userId, value);
    set({ spoons: energy.spoons, lastSync: Date.now() });
  },

  logBio: async (type, value, unit) => {
    const { userId } = get();
    const result = await submitBio(userId, type, value, unit);
    if (result.alert) {
      console.warn(`[BIO ALERT] ${result.alert.severity}: ${result.alert.message}`);
    }
  },

  syncReminders: async () => {
    const { userId } = get();
    const { reminders } = await getReminders(userId);
    set({ reminders });
  },
}));
*/