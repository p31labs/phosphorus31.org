import { useState, useEffect, useReducer } from "react";

// ═══════════════════════════════════════════════════════════════
// P31 UNIFIED WALLET — L.O.V.E. ECONOMY
// Ledger of Ontological Volume and Entropy
// One economy. Three surfaces: Game · Brand · Chain.
// Founding Nodes: Bash (S.J.) & Willow (W.J.)
// ═══════════════════════════════════════════════════════════════

// ─── DESIGN TOKENS ───
const C = {
  bg: "#050510", bg2: "#0a0a18", card: "#0c0c1c", cardHover: "#101028",
  green: "#2ecc71", greenDim: "#1b7a5a", greenDeep: "#0d3b2e",
  greenGlow: "rgba(46,204,113,0.12)",
  love: "#e879f9", loveDim: "#a855f7", loveGlow: "rgba(232,121,249,0.12)",
  loveDeep: "#3b1560",
  calcium: "#60a5fa",
  gold: "#fbbf24",
  red: "#ef4444", orange: "#f59e0b",
  text: "#e8e8f0", dim: "#6b7280", muted: "#3a3a52",
  border: "#1a1a2e", borderGlow: "#1b7a5a",
};

// ─── TRANSACTION TYPES (matches game engine exactly) ───
const TX = {
  BLOCK_PLACED:     { id: "BLOCK_PLACED",     love: 1.0,  icon: "🧱", label: "Block Placed",      color: C.green },
  COHERENCE_GIFT:   { id: "COHERENCE_GIFT",   love: 5.0,  icon: "🔮", label: "Coherence Gift",    color: C.love },
  ARTIFACT_CREATED: { id: "ARTIFACT_CREATED", love: 10.0, icon: "⚡", label: "Artifact Created",  color: C.gold },
  CARE_RECEIVED:    { id: "CARE_RECEIVED",    love: 3.0,  icon: "💜", label: "Care Received",     color: C.love },
  CARE_GIVEN:       { id: "CARE_GIVEN",       love: 2.0,  icon: "🤲", label: "Care Given",        color: C.loveDim },
  TETRAHEDRON_BOND: { id: "TETRAHEDRON_BOND", love: 15.0, icon: "🔺", label: "Tetrahedron Bond",  color: C.gold },
  VOLTAGE_CALMED:   { id: "VOLTAGE_CALMED",   love: 2.0,  icon: "🛡️", label: "Voltage Calmed",   color: C.green },
  MILESTONE_REACHED:{ id: "MILESTONE_REACHED",love: 25.0, icon: "🏆", label: "Milestone Reached", color: C.gold },
  DONATION:         { id: "DONATION",         love: 0,    icon: "💎", label: "Crypto Donation",   color: C.calcium },
  PING:             { id: "PING",             love: 1.0,  icon: "📡", label: "Ping Verified",     color: C.green },
};

// ─── NETWORKS ───
const NETWORKS = [
  { id: "base",     name: "Base L2",   icon: "🔵", color: "#0052FF" },
  { id: "ethereum", name: "Ethereum",  icon: "⟠",  color: "#627EEA" },
  { id: "polygon",  name: "Polygon",   icon: "🟣", color: "#8247E5" },
  { id: "arbitrum", name: "Arbitrum",  icon: "🔷", color: "#28A0F0" },
  { id: "optimism", name: "Optimism",  icon: "🔴", color: "#FF0420" },
];

// ─── FOUNDING NODES (nicknames + initials only — no legal names) ───
const FOUNDING_NODES = [
  {
    id: "bash", name: "Bash", initials: "S.J.",
    age: 10, role: "Founding Node #1",
    phase: "TRUST", phaseLabel: "Trust Phase",
    nextMilestone: "Apprenticeship", nextAge: 13,
    emoji: "🎮", color: C.green,
  },
  {
    id: "willow", name: "Willow", initials: "W.J.",
    age: 6, role: "Founding Node #2",
    phase: "TRUST", phaseLabel: "Trust Phase",
    nextMilestone: "Apprenticeship", nextAge: 13,
    emoji: "🌿", color: C.love,
  },
];

// ─── VESTING PHASES ───
const PHASES = [
  { id: "TRUST",          label: "Trust",          ages: "0–12",  pct: 0 },
  { id: "APPRENTICESHIP", label: "Apprenticeship", ages: "13–17", pct: 33 },
  { id: "SOVEREIGNTY",    label: "Sovereignty",    ages: "18+",   pct: 100 },
];

// ─── HELPERS ───
const uid = () => Math.random().toString(36).slice(2, 8);
const ts = () => new Date().toISOString();
const fmt = (d: string) => new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// ─── TYPES ───
interface Transaction {
  id: string;
  type: string;
  love: number;
  from: string;
  to: string;
  meta: Record<string, unknown>;
  time: string;
  settled: boolean;
  source: "chain" | "local";
}

interface Donation {
  id: string;
  type: string;
  amount: number;
  currency: string;
  network: string;
  from: string;
  time: string;
  txHash: string | null;
}

interface State {
  transactions: Transaction[];
  loveBalance: number;
  careGiven: number;
  careReceived: number;
  tetraBonds: number;
  sovereigntyPool: number;
  performancePool: number;
  mode: "online" | "offline";
  connectedWallet: string | null;
  network: string;
  cryptoBalances: Record<string, number>;
  donations: Donation[];
  syncQueue: Transaction[];
  lastSync: string | null;
  exchangeRate: number;
}

type Action =
  | { type: "ADD_TX"; txType: string; from?: string; to?: string; amount?: number; meta?: Record<string, unknown> }
  | { type: "ADD_DONATION"; amount: number; currency: string; network: string; from?: string; txHash?: string }
  | { type: "SET_MODE"; mode: "online" | "offline" }
  | { type: "CONNECT_WALLET"; address: string }
  | { type: "DISCONNECT_WALLET" }
  | { type: "SET_NETWORK"; network: string }
  | { type: "SYNC_COMPLETE" };

// ─── REDUCER ───
const initial: State = {
  transactions: [],
  loveBalance: 0,
  careGiven: 0,
  careReceived: 0,
  tetraBonds: 0,
  sovereigntyPool: 0,
  performancePool: 0,
  mode: "offline",
  connectedWallet: null,
  network: "base",
  cryptoBalances: { base: 0, ethereum: 0, polygon: 0, arbitrum: 0, optimism: 0 },
  donations: [],
  syncQueue: [],
  lastSync: null,
  exchangeRate: 0.001,
};

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "ADD_TX": {
      const txDef = TX[a.txType as keyof typeof TX] || TX.BLOCK_PLACED;
      const love = a.amount || txDef.love;
      const tx: Transaction = {
        id: uid(), type: a.txType, love, from: a.from || "system",
        to: a.to || "operator", meta: a.meta || {}, time: ts(),
        settled: s.mode === "online", source: s.mode === "online" ? "chain" : "local",
      };
      const sovAdd = love * 0.5;
      const perfAdd = love * 0.5;
      return {
        ...s,
        loveBalance: s.loveBalance + love,
        sovereigntyPool: s.sovereigntyPool + sovAdd,
        performancePool: s.performancePool + perfAdd,
        transactions: [tx, ...s.transactions].slice(0, 200),
        careGiven: a.txType === "CARE_GIVEN" ? s.careGiven + 1 : s.careGiven,
        careReceived: a.txType === "CARE_RECEIVED" ? s.careReceived + 1 : s.careReceived,
        tetraBonds: a.txType === "TETRAHEDRON_BOND" ? s.tetraBonds + 1 : s.tetraBonds,
        syncQueue: s.mode === "offline" ? [...s.syncQueue, tx] : s.syncQueue,
      };
    }
    case "ADD_DONATION": {
      const donation: Donation = {
        id: uid(), type: "DONATION", amount: a.amount, currency: a.currency,
        network: a.network, from: a.from || "anonymous", time: ts(),
        txHash: a.txHash || null,
      };
      return {
        ...s,
        donations: [donation, ...s.donations].slice(0, 100),
        cryptoBalances: {
          ...s.cryptoBalances,
          [a.network]: (s.cryptoBalances[a.network] || 0) + a.amount,
        },
      };
    }
    case "SET_MODE":
      return { ...s, mode: a.mode };
    case "CONNECT_WALLET":
      return { ...s, connectedWallet: a.address, mode: "online" };
    case "DISCONNECT_WALLET":
      return { ...s, connectedWallet: null, mode: "offline" };
    case "SET_NETWORK":
      return { ...s, network: a.network };
    case "SYNC_COMPLETE":
      return { ...s, syncQueue: [], lastSync: ts() };
    default:
      return s;
  }
}

// ─── SHARED UI ───
interface GlowBarProps {
  value: number;
  max: number;
  color?: string;
  h?: number;
}

const GlowBar = ({ value, max, color = C.green, h = 6 }: GlowBarProps) => (
  <div style={{ width: "100%", height: h, background: `${color}15`, borderRadius: h / 2, overflow: "hidden" }}>
    <div style={{
      width: `${Math.min(100, (value / Math.max(max, 1)) * 100)}%`, height: "100%",
      background: color, borderRadius: h / 2, transition: "width 0.6s ease",
      boxShadow: `0 0 8px ${color}40`,
    }} />
  </div>
);

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
}

const Badge = ({ children, color = C.green }: BadgeProps) => (
  <span style={{
    display: "inline-block", padding: "2px 8px", fontSize: 10, fontFamily: "monospace",
    background: `${color}18`, color, border: `1px solid ${color}30`, borderRadius: 3,
    letterSpacing: "0.05em",
  }}>{children}</span>
);

interface CardProps {
  children: React.ReactNode;
  glow?: boolean;
  color?: string;
  style?: React.CSSProperties;
}

const Card = ({ children, glow, color = C.borderGlow, style = {} }: CardProps) => (
  <div style={{
    background: C.card, border: `1px solid ${glow ? color : C.border}`,
    borderRadius: 10, padding: 16, transition: "all 0.3s",
    boxShadow: glow ? `0 0 20px ${color}20` : "none", ...style,
  }}>{children}</div>
);

interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "primary" | "love" | "danger" | "gold";
  small?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const Btn = ({ children, onClick, variant = "default", small, disabled, style = {} }: BtnProps) => {
  const variants = {
    default: { background: "transparent", borderColor: C.border, color: C.dim },
    primary: { background: C.greenDeep, borderColor: C.greenDim, color: C.green },
    love:    { background: C.loveDeep, borderColor: `${C.love}50`, color: C.love },
    danger:  { background: "transparent", borderColor: `${C.red}60`, color: C.red },
    gold:    { background: `${C.gold}15`, borderColor: `${C.gold}40`, color: C.gold },
  };
  const v = variants[variant] || variants.default;
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      padding: small ? "5px 12px" : "9px 18px", fontSize: small ? 11 : 12,
      fontFamily: "monospace", border: "1px solid", borderRadius: 5,
      cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s",
      opacity: disabled ? 0.4 : 1, letterSpacing: "0.04em",
      ...v, ...style,
    }}>{children}</button>
  );
};

// ─── FOUNDING NODE CARD ───
interface FoundingNodeCardProps {
  node: typeof FOUNDING_NODES[0];
  sovereigntyShare: number;
}

function FoundingNodeCard({ node, sovereigntyShare }: FoundingNodeCardProps) {
  const progressToNext = (node.age / node.nextAge) * 100;
  const yearsLeft = node.nextAge - node.age;

  return (
    <Card glow color={node.color}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: `${node.color}20`, border: `2px solid ${node.color}50`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
          }}>{node.emoji}</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{node.name}</div>
            <div style={{ fontSize: 10, fontFamily: "monospace", color: C.dim }}>
              {node.initials} · {node.role}
            </div>
          </div>
        </div>
        <Badge color={node.color}>{node.phaseLabel}</Badge>
      </div>

      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div style={{ fontSize: 9, fontFamily: "monospace", color: C.dim, letterSpacing: "0.1em" }}>SOVEREIGNTY SHARE</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.love, fontFamily: "monospace" }}>
            {sovereigntyShare.toFixed(1)} <span style={{ fontSize: 11, color: C.dim }}>LOVE</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 9, fontFamily: "monospace", color: C.dim, letterSpacing: "0.1em" }}>AGE</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: "monospace" }}>{node.age}</div>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 4 }}>
          <span style={{ color: C.dim }}>→ {node.nextMilestone} in {yearsLeft}y</span>
          <span style={{ color: node.color, fontFamily: "monospace" }}>{progressToNext.toFixed(0)}%</span>
        </div>
        <GlowBar value={node.age} max={node.nextAge} color={node.color} h={5} />
      </div>

      <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
        {PHASES.map(p => (
          <div key={p.id} style={{
            flex: 1, padding: "4px 0", textAlign: "center", fontSize: 8, fontFamily: "monospace",
            background: p.id === node.phase ? `${node.color}20` : C.bg,
            border: `1px solid ${p.id === node.phase ? node.color : C.border}30`,
            borderRadius: 3, color: p.id === node.phase ? node.color : C.muted,
            letterSpacing: "0.08em",
          }}>
            {p.label}<br /><span style={{ fontSize: 7 }}>{p.ages}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── DONATION WIDGET ───
interface DonationWidgetProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}

function DonationWidget({ state, dispatch }: DonationWidgetProps) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("ETH");
  const [showAddresses, setShowAddresses] = useState(false);

  const simulateDonation = () => {
    const val = parseFloat(amount);
    if (!val || isNaN(val) || val <= 0) return;
    dispatch({
      type: "ADD_DONATION", amount: val, currency,
      network: state.network, from: state.connectedWallet || "anonymous",
    });
    dispatch({ type: "ADD_TX", txType: "ARTIFACT_CREATED", from: "donor", meta: { currency, amount: val } });
    setAmount("");
  };

  return (
    <Card glow color={C.calcium}>
      <div style={{ fontSize: 10, fontFamily: "monospace", color: C.calcium, letterSpacing: "0.12em", marginBottom: 10 }}>
        DONATE TO P31 LABS
      </div>
      <p style={{ fontSize: 12, color: C.dim, lineHeight: 1.6, margin: "0 0 12px" }}>
        100% funds assistive technology for neurodivergent minds.
        501(c)(3) tax deductible. Crypto treated as property — donate appreciated assets to avoid capital gains.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {["ETH", "USDC", "BTC", "MATIC"].map(c => (
          <Btn key={c} small variant={currency === c ? "primary" : "default"} onClick={() => setCurrency(c)}>{c}</Btn>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder={`Amount in ${currency}...`}
          type="number" step="0.001" min="0"
          style={{
            flex: 1, padding: "9px 12px", fontSize: 13, fontFamily: "monospace",
            background: C.bg, border: `1px solid ${C.border}`, borderRadius: 5,
            color: C.text, outline: "none",
          }}
        />
        <Btn variant="love" onClick={simulateDonation}>DONATE 💎</Btn>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {[0.01, 0.05, 0.1, 0.5, 1.0].map(v => (
          <Btn key={v} small variant="default" onClick={() => setAmount(String(v))}>
            {v} {currency}
          </Btn>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, padding: "10px 0", borderTop: `1px solid ${C.border}` }}>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 9, color: C.dim, letterSpacing: "0.1em", marginBottom: 4 }}>VIA ENGIVEN</div>
          <div style={{ fontSize: 11, color: C.calcium }}>0% setup · 4% fee</div>
          <div style={{ fontSize: 9, color: C.muted }}>95+ cryptocurrencies</div>
        </div>
        <div style={{ width: 1, background: C.border }} />
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 9, color: C.dim, letterSpacing: "0.1em", marginBottom: 4 }}>VIA EVERY.ORG</div>
          <div style={{ fontSize: 11, color: C.calcium }}>0% setup · 1% fee</div>
          <div style={{ fontSize: 9, color: C.muted }}>Tax receipt included</div>
        </div>
        <div style={{ width: 1, background: C.border }} />
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 9, color: C.dim, letterSpacing: "0.1em", marginBottom: 4 }}>DIRECT WALLET</div>
          <Btn small variant="default" onClick={() => setShowAddresses(!showAddresses)} style={{ fontSize: 9 }}>
            {showAddresses ? "HIDE" : "SHOW"} ADDRESS
          </Btn>
        </div>
      </div>

      {showAddresses && (
        <div style={{
          marginTop: 8, padding: 10, background: C.bg, borderRadius: 6,
          border: `1px solid ${C.border}`,
        }}>
          <div style={{ fontSize: 9, color: C.dim, marginBottom: 6, fontFamily: "monospace", letterSpacing: "0.1em" }}>
            BASE L2 DONATION ADDRESS
          </div>
          <div style={{ fontSize: 11, fontFamily: "monospace", color: C.calcium, wordBreak: "break-all", lineHeight: 1.5 }}>
            0x... <span style={{ fontSize: 9, color: C.muted }}>(deploy contract first)</span>
          </div>
          <div style={{ fontSize: 9, color: C.muted, marginTop: 6 }}>
            ERC-5564 stealth addresses coming — donors give privately, P31 still provides tax receipts.
          </div>
        </div>
      )}
    </Card>
  );
}

// ─── LOVE ECONOMY PANEL ───
interface LovePanelProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}

function LovePanel({ state, dispatch }: LovePanelProps) {
  const careRatio = state.careReceived > 0
    ? (state.careGiven / state.careReceived).toFixed(2)
    : state.careGiven > 0 ? "∞" : "—";
  const bondStrength = Math.min(1, state.tetraBonds * 0.15);
  const bondPct = (bondStrength * 100).toFixed(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Big balance */}
      <Card glow color={C.love}>
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <div style={{ fontSize: 9, fontFamily: "monospace", color: C.dim, letterSpacing: "0.15em", marginBottom: 6 }}>
            TOTAL L.O.V.E. BALANCE
          </div>
          <div style={{ fontSize: 44, fontWeight: 200, color: C.love, fontFamily: "monospace", lineHeight: 1 }}>
            {state.loveBalance.toFixed(1)}
          </div>
          <div style={{ fontSize: 11, color: C.dim, marginTop: 4 }}>
            ≈ {(state.loveBalance * state.exchangeRate).toFixed(4)} ETH
          </div>
        </div>
      </Card>

      {/* Pools */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Card>
          <div style={{ fontSize: 9, fontFamily: "monospace", color: C.love, letterSpacing: "0.1em", marginBottom: 6 }}>
            SOVEREIGNTY POOL
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.love, fontFamily: "monospace" }}>
            {state.sovereigntyPool.toFixed(1)}
          </div>
          <div style={{ fontSize: 9, color: C.dim, marginTop: 4 }}>50% · Founding Nodes</div>
          <div style={{ fontSize: 8, color: C.muted, marginTop: 2 }}>Immutable · Vesting locked</div>
        </Card>
        <Card>
          <div style={{ fontSize: 9, fontFamily: "monospace", color: C.green, letterSpacing: "0.1em", marginBottom: 6 }}>
            PERFORMANCE POOL
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.green, fontFamily: "monospace" }}>
            {state.performancePool.toFixed(1)}
          </div>
          <div style={{ fontSize: 9, color: C.dim, marginTop: 4 }}>50% · Proof of Care</div>
          <div style={{ fontSize: 8, color: C.muted, marginTop: 2 }}>Dynamic · Earned by presence</div>
        </Card>
      </div>

      {/* Metrics row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <Card>
          <div style={{ fontSize: 9, fontFamily: "monospace", color: C.dim, letterSpacing: "0.08em" }}>CARE RATIO</div>
          <div style={{
            fontSize: 20, fontWeight: 700, fontFamily: "monospace", marginTop: 4,
            color: careRatio === "—" ? C.muted : parseFloat(careRatio) >= 1 || careRatio === "∞" ? C.green : C.orange,
          }}>{careRatio}</div>
          <div style={{ fontSize: 8, color: C.muted, marginTop: 2 }}>given / received</div>
        </Card>
        <Card>
          <div style={{ fontSize: 9, fontFamily: "monospace", color: C.dim, letterSpacing: "0.08em" }}>BOND STRENGTH</div>
          <div style={{
            fontSize: 20, fontWeight: 700, fontFamily: "monospace", marginTop: 4,
            color: bondStrength > 0.5 ? C.gold : C.dim,
          }}>{bondPct}%</div>
          <GlowBar value={bondStrength} max={1} color={C.gold} h={4} />
        </Card>
        <Card>
          <div style={{ fontSize: 9, fontFamily: "monospace", color: C.dim, letterSpacing: "0.08em" }}>TRANSACTIONS</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: "monospace", marginTop: 4 }}>
            {state.transactions.length}
          </div>
          <div style={{ fontSize: 8, color: C.muted, marginTop: 2 }}>{state.syncQueue.length} unsettled</div>
        </Card>
      </div>

      {/* Quick mine buttons */}
      <Card>
        <div style={{ fontSize: 9, fontFamily: "monospace", color: C.dim, letterSpacing: "0.1em", marginBottom: 8 }}>
          MINE L.O.V.E.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {Object.values(TX).filter(t => t.id !== "DONATION").map(t => (
            <Btn key={t.id} small variant="default"
              onClick={() => dispatch({ type: "ADD_TX", txType: t.id })}
              style={{ borderColor: `${t.color}30` }}>
              {t.icon} {t.label} <span style={{ opacity: 0.5 }}>+{t.love}</span>
            </Btn>
          ))}
        </div>
      </Card>

      {/* Transaction feed */}
      <Card>
        <div style={{ fontSize: 9, fontFamily: "monospace", color: C.dim, letterSpacing: "0.1em", marginBottom: 8 }}>
          RECENT TRANSACTIONS
        </div>
        <div style={{ maxHeight: 200, overflowY: "auto" }}>
          {state.transactions.length === 0 && (
            <div style={{ textAlign: "center", padding: 20, fontSize: 11, color: C.muted }}>
              No transactions yet. Start mining love.
            </div>
          )}
          {state.transactions.slice(0, 20).map(tx => {
            const def = TX[tx.type as keyof typeof TX] || TX.BLOCK_PLACED;
            return (
              <div key={tx.id} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "5px 0",
                borderBottom: `1px solid ${C.border}`,
              }}>
                <span style={{ fontSize: 14 }}>{def.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: C.text }}>{def.label}</div>
                  <div style={{
                    fontSize: 9, color: C.muted, overflow: "hidden",
                    textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{tx.from} → {tx.to}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: def.color, fontFamily: "monospace" }}>
                    +{tx.love}
                  </div>
                  <div style={{ fontSize: 8, color: C.muted }}>{fmt(tx.time)}</div>
                </div>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                  background: tx.settled ? C.green : C.orange,
                }} title={tx.settled ? "Settled on-chain" : "Local only"} />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ─── WALLET PANEL ───
interface WalletPanelProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}

function WalletPanel({ state, dispatch }: WalletPanelProps) {
  const totalCrypto = Object.values(state.cryptoBalances).reduce((a, b) => a + b, 0);
  const genAddr = () => "0x" + Array.from({ length: 40 }, () =>
    "0123456789abcdef"[Math.floor(Math.random() * 16)]
  ).join("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Connection status */}
      <Card glow={!!state.connectedWallet} color={state.connectedWallet ? C.green : C.border}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 9, fontFamily: "monospace", color: C.dim, letterSpacing: "0.1em" }}>WALLET</div>
            {state.connectedWallet ? (
              <div style={{ fontSize: 12, fontFamily: "monospace", color: C.green, marginTop: 4 }}>
                {state.connectedWallet.slice(0, 6)}...{state.connectedWallet.slice(-4)}
              </div>
            ) : (
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Not connected</div>
            )}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {state.connectedWallet ? (
              <Btn small variant="danger" onClick={() => dispatch({ type: "DISCONNECT_WALLET" })}>
                Disconnect
              </Btn>
            ) : (
              <>
                <Btn small variant="primary"
                  onClick={() => dispatch({ type: "CONNECT_WALLET", address: genAddr() })}>
                  🦊 MetaMask
                </Btn>
                <Btn small variant="default"
                  onClick={() => dispatch({ type: "CONNECT_WALLET", address: genAddr() })}>
                  Coinbase
                </Btn>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Chameleon mode */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 9, fontFamily: "monospace", color: C.dim, letterSpacing: "0.1em" }}>
              CHAMELEON MODE
            </div>
            <div style={{ fontSize: 12, color: state.mode === "online" ? C.green : C.orange, marginTop: 4 }}>
              {state.mode === "online" ? "🟢 ON-CHAIN — Base L2" : "🟡 OFFLINE — Local Ledger"}
            </div>
          </div>
          <Btn small variant={state.mode === "online" ? "primary" : "gold"}
            onClick={() => dispatch({ type: "SET_MODE", mode: state.mode === "online" ? "offline" : "online" })}>
            {state.mode === "online" ? "Go Offline" : "Go On-Chain"}
          </Btn>
        </div>
        {state.syncQueue.length > 0 && state.mode === "online" && (
          <div style={{
            marginTop: 8, padding: "6px 10px", background: `${C.gold}10`,
            border: `1px solid ${C.gold}30`, borderRadius: 4,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 10, color: C.gold }}>
              {state.syncQueue.length} transactions pending settlement
            </span>
            <Btn small variant="gold" onClick={() => dispatch({ type: "SYNC_COMPLETE" })}>
              SETTLE →
            </Btn>
          </div>
        )}
        {state.lastSync && (
          <div style={{ fontSize: 9, color: C.muted, marginTop: 6 }}>Last sync: {fmt(state.lastSync)}</div>
        )}
      </Card>

      {/* Network balances */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 9, fontFamily: "monospace", color: C.dim, letterSpacing: "0.1em" }}>
            NETWORK BALANCES
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.calcium, fontFamily: "monospace" }}>
            {totalCrypto.toFixed(4)} Ξ
          </div>
        </div>
        {NETWORKS.map(n => (
          <div key={n.id}
            onClick={() => dispatch({ type: "SET_NETWORK", network: n.id })}
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", cursor: "pointer",
              background: state.network === n.id ? `${n.color}10` : "transparent",
              border: `1px solid ${state.network === n.id ? `${n.color}30` : "transparent"}`,
              borderRadius: 6, marginBottom: 4, transition: "all 0.2s",
            }}>
            <span style={{ fontSize: 16 }}>{n.icon}</span>
            <div style={{ flex: 1, fontSize: 12, color: C.text }}>{n.name}</div>
            <div style={{
              fontSize: 12, fontFamily: "monospace",
              color: (state.cryptoBalances[n.id] || 0) > 0 ? C.text : C.muted,
            }}>
              {(state.cryptoBalances[n.id] || 0).toFixed(4)}
            </div>
          </div>
        ))}
      </Card>

      {/* Love ↔ Crypto bridge */}
      <Card>
        <div style={{ fontSize: 9, fontFamily: "monospace", color: C.dim, letterSpacing: "0.1em", marginBottom: 8 }}>
          LOVE ↔ CRYPTO BRIDGE
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.love, fontFamily: "monospace" }}>
              {state.loveBalance.toFixed(0)}
            </div>
            <div style={{ fontSize: 9, color: C.dim }}>LOVE</div>
          </div>
          <div style={{ fontSize: 18, color: C.muted }}>⟷</div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.calcium, fontFamily: "monospace" }}>
              {(state.loveBalance * state.exchangeRate).toFixed(4)}
            </div>
            <div style={{ fontSize: 9, color: C.dim }}>ETH equiv</div>
          </div>
        </div>
        <div style={{ fontSize: 9, color: C.muted, textAlign: "center" }}>
          Rate: 1 LOVE = {state.exchangeRate} ETH · Soulbound (non-transferable)
        </div>
      </Card>

      {/* Donation history */}
      {state.donations.length > 0 && (
        <Card>
          <div style={{ fontSize: 9, fontFamily: "monospace", color: C.dim, letterSpacing: "0.1em", marginBottom: 8 }}>
            DONATION HISTORY
          </div>
          {state.donations.slice(0, 10).map(d => (
            <div key={d.id} style={{
              display: "flex", justifyContent: "space-between", padding: "4px 0",
              borderBottom: `1px solid ${C.border}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span>💎</span>
                <span style={{ fontSize: 11, color: C.text }}>{d.amount} {d.currency}</span>
              </div>
              <div style={{ fontSize: 10, color: C.muted }}>{fmt(d.time)} · {d.network}</div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

// ─── TABS ───
const TABS = [
  { id: "nodes",  icon: "🔺", label: "Founding Nodes" },
  { id: "love",   icon: "💜", label: "L.O.V.E." },
  { id: "wallet", icon: "💎", label: "Wallet" },
  { id: "donate", icon: "🤝", label: "Donate" },
];

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function P31Wallet() {
  const [state, dispatch] = useReducer(reducer, initial);
  const [tab, setTab] = useState("nodes");

  // Seed demo transactions on mount
  useEffect(() => {
    const seeds = [
      { txType: "CARE_GIVEN",       from: "operator", to: "bash" },
      { txType: "CARE_GIVEN",       from: "operator", to: "willow" },
      { txType: "PING",             from: "bash",     to: "operator" },
      { txType: "BLOCK_PLACED",     from: "bash",     to: "game" },
      { txType: "CARE_RECEIVED",    from: "mesh",     to: "operator" },
      { txType: "TETRAHEDRON_BOND", from: "mesh",     to: "family" },
    ];
    seeds.forEach((s, i) => setTimeout(() => dispatch({ type: "ADD_TX", ...s }), i * 120));
  }, []);

  const bashShare = state.sovereigntyPool / 2;
  const willowShare = state.sovereigntyPool / 2;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* ─── HEADER ─── */}
      <div style={{
        borderBottom: `1px solid ${C.border}`, padding: "10px 16px",
        display: "flex", justifyContent: "space-between", alignItems: "center", background: C.card,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>💜</span>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: C.love }}>L.O.V.E.</span>
              <span style={{ fontSize: 11, color: C.dim }}>Ledger of Ontological Volume & Entropy</span>
            </div>
            <div style={{ fontSize: 9, fontFamily: "monospace", color: C.muted }}>P31 Labs · Unified Economy</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.love, fontFamily: "monospace" }}>
              {state.loveBalance.toFixed(1)}
            </div>
            <div style={{ fontSize: 9, color: C.dim }}>LOVE</div>
          </div>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: state.mode === "online" ? C.green : C.orange,
            boxShadow: `0 0 6px ${state.mode === "online" ? C.green : C.orange}40`,
          }} />
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 49px)" }}>
        {/* ─── SIDEBAR ─── */}
        <div style={{
          width: 170, borderRight: `1px solid ${C.border}`,
          padding: "8px 0", background: C.card, flexShrink: 0,
        }}>
          {TABS.map(t => (
            <div key={t.id} onClick={() => setTab(t.id)} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "11px 14px",
              cursor: "pointer", fontSize: 12,
              color: tab === t.id ? C.love : C.dim,
              background: tab === t.id ? C.loveGlow : "transparent",
              borderLeft: tab === t.id ? `2px solid ${C.love}` : "2px solid transparent",
              transition: "all 0.15s",
            }}>
              <span style={{ fontSize: 14 }}>{t.icon}</span>
              <span style={{ fontWeight: tab === t.id ? 600 : 400 }}>{t.label}</span>
            </div>
          ))}

          {/* Sidebar stats */}
          <div style={{ margin: "16px 14px 0", padding: "12px 0", borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 9, fontFamily: "monospace", color: C.muted, lineHeight: 1.8, letterSpacing: "0.04em" }}>
              <span style={{ color: C.love }}>LOVE:</span> {state.loveBalance.toFixed(0)}<br />
              <span style={{ color: C.green }}>SOV:</span> {state.sovereigntyPool.toFixed(0)}<br />
              <span style={{ color: C.gold }}>PERF:</span> {state.performancePool.toFixed(0)}<br />
              <span style={{ color: C.calcium }}>MODE:</span> {state.mode}<br />
              <span style={{ color: C.dim }}>QUEUE:</span> {state.syncQueue.length}
            </div>
            <div style={{ marginTop: 10, fontSize: 8, fontFamily: "monospace", color: C.muted, lineHeight: 1.6 }}>
              TOPOLOGY: DELTA<br />
              TOKEN: SOULBOUND<br />
              CHAIN: BASE L2<br />
              <span style={{ color: C.love }}>THE MESH HOLDS 🔺</span>
            </div>
          </div>
        </div>

        {/* ─── MAIN CONTENT ─── */}
        <div style={{ flex: 1, padding: 16, overflowY: "auto", maxHeight: "calc(100vh - 49px)" }}>

          {/* FOUNDING NODES TAB */}
          {tab === "nodes" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ textAlign: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 9, fontFamily: "monospace", color: C.love, letterSpacing: "0.2em" }}>
                  THE FOUNDING NODES
                </div>
                <div style={{ fontSize: 22, fontWeight: 300, color: C.text, marginTop: 4 }}>
                  Children are assets, not liabilities
                </div>
                <div style={{ fontSize: 11, color: C.dim, marginTop: 4 }}>
                  50% Sovereignty Pool · Immutable · Vesting to full access
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <FoundingNodeCard node={FOUNDING_NODES[0]} sovereigntyShare={bashShare} />
                <FoundingNodeCard node={FOUNDING_NODES[1]} sovereigntyShare={willowShare} />
              </div>

              {/* Proof of Care */}
              <Card>
                <div style={{ fontSize: 9, fontFamily: "monospace", color: C.gold, letterSpacing: "0.12em", marginBottom: 8 }}>
                  PROOF OF CARE CONSENSUS
                </div>
                <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.7 }}>
                  Unlike Proof of Work (computing) or Proof of Stake (capital),
                  Proof of Care validates{" "}
                  <strong style={{ color: C.text }}>time and quality of presence</strong>.
                  Guardians earn LOVE through verified proximity, synchronized heartbeats,
                  and completed care tasks. The more love shown, the more equal the split.
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 12 }}>
                  {[
                    { label: "T_prox", desc: "Time proximity via BLE", icon: "📡" },
                    { label: "Q_res",  desc: "Quality resonance (HRV sync)", icon: "💓" },
                    { label: "Tasks",  desc: "Verified care actions", icon: "✅" },
                  ].map((m, i) => (
                    <div key={i} style={{
                      textAlign: "center", padding: 10, background: C.bg,
                      borderRadius: 6, border: `1px solid ${C.border}`,
                    }}>
                      <div style={{ fontSize: 20 }}>{m.icon}</div>
                      <div style={{ fontSize: 11, fontFamily: "monospace", color: C.gold, marginTop: 4 }}>
                        {m.label}
                      </div>
                      <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>{m.desc}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Care formula */}
              <Card>
                <div style={{ textAlign: "center", padding: "8px 0" }}>
                  <div style={{ fontSize: 15, fontFamily: "monospace", color: C.text, letterSpacing: "0.02em" }}>
                    Care_Score = Σ(
                    <span style={{ color: C.green }}>T<sub>prox</sub></span>
                    {" × "}
                    <span style={{ color: C.love }}>Q<sub>res</sub></span>
                    ) +{" "}
                    <span style={{ color: C.gold }}>Tasks<sub>verified</sub></span>
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 6 }}>
                    Green coherence (0.1 Hz HRV sync) multiplies mining rate 2.5×
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* LOVE TAB */}
          {tab === "love" && <LovePanel state={state} dispatch={dispatch} />}

          {/* WALLET TAB */}
          {tab === "wallet" && <WalletPanel state={state} dispatch={dispatch} />}

          {/* DONATE TAB */}
          {tab === "donate" && <DonationWidget state={state} dispatch={dispatch} />}
        </div>
      </div>
    </div>
  );
}
