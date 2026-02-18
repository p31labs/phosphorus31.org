# P31 MASTER BUILD PROMPT
## Paste this entire file into Cursor Composer (Cmd+I / Ctrl+I)
## Pre-requisite: buffer-core is built and passing (37/37 tests)

---

You are the Lead Engineer for P31 Labs. Read `docs/P31_PROTOCOL_BIBLE.md` and `docs/P31_CURSOR_ALIGNMENT.md` for full context. Read `god.config.ts` for all constants. Read `packages/buffer-core/src/` for the scoring engine you'll import everywhere.

**Your mission:** Build the remaining 3 priorities in sequence. Do NOT skip ahead. Complete each phase, verify it works, then proceed.

---

## PHASE 1: `apps/shelter/` — The Buffer PWA

Convert the existing `apps/shelter/` into a complete React 19 + Vite 6 PWA that imports `@p31labs/buffer-core` for all scoring logic. This is the flagship product.

### 1A: Scaffold

```
apps/shelter/
├── index.html
├── vite.config.ts            # vite-plugin-pwa, path aliases
├── tailwind.config.ts        # dark mode 'class', custom colors from god.config
├── tsconfig.json             # strict: true, paths: { "@/*": ["./src/*"] }
├── package.json              # deps: react, react-dom, @p31labs/buffer-core, zustand, dexie
├── public/
│   ├── manifest.json         # name: "The Buffer", theme_color: "#39FF14", display: "standalone"
│   ├── icon-192.png          # placeholder
│   └── icon-512.png          # placeholder
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css              # @tailwind base/components/utilities + custom properties
    ├── stores/
    │   ├── buffer-store.ts    # Zustand: input, score, ai result, phase, queue
    │   └── spoon-store.ts     # Zustand: spoons, maxSpoons, heartbeat tier, persisted via dexie
    ├── services/
    │   ├── storage.ts         # Dexie.js schema: sessions, queue, preferences
    │   ├── ai-rewrite.ts      # fetch to /rewrite endpoint OR direct Gemini/Claude call
    │   └── persistence.ts     # sync zustand ↔ dexie on state change
    ├── hooks/
    │   ├── useSamson.ts       # wraps SamsonController from buffer-core, returns PID state
    │   ├── useBreathing.ts    # 4-2-6 timer logic, cycle count, spoon recovery
    │   └── useKeyboard.ts     # keyboard shortcuts: Ctrl+Enter=score, Escape=reset
    └── components/
        ├── layout/
        │   ├── Header.tsx
        │   └── Footer.tsx
        ├── phases/
        │   ├── Calibrate.tsx
        │   ├── Input.tsx
        │   ├── Scored.tsx
        │   ├── Rewritten.tsx
        │   └── Original.tsx
        ├── panels/
        │   ├── SamsonPanel.tsx
        │   ├── QueuePanel.tsx
        │   └── DeepLock.tsx
        └── overlays/
            └── Breathe.tsx
```

### 1B: Zustand Stores

**buffer-store.ts:**
```typescript
import { create } from 'zustand';
import { computeVoltage, extractBLUF, type VoltageScore, type BLUFResult } from '@p31labs/buffer-core';

interface BufferState {
  input: string;
  score: VoltageScore | null;
  bluf: BLUFResult | null;
  aiResult: AIRewriteResult | null;
  aiLoading: boolean;
  phase: 'calibrate' | 'input' | 'scored' | 'rewritten' | 'original';
  queue: QueueItem[];
  processedCount: number;
  deferredCount: number;
  scoreHistory: number[];

  setInput: (text: string) => void;
  scoreMessage: () => void;
  setAIResult: (result: AIRewriteResult) => void;
  setPhase: (phase: BufferState['phase']) => void;
  deferMessage: () => void;
  markDone: () => void;
  processFromQueue: (index: number) => void;
  reset: () => void;
}
```

Import `computeVoltage` and `extractBLUF` from `@p31labs/buffer-core`. NEVER reimplement scoring logic — always import from the shared package.

**spoon-store.ts:**
```typescript
import { create } from 'zustand';
import { SpoonTracker, SPOON_COSTS, HEARTBEAT_TIERS } from '@p31labs/buffer-core';

interface SpoonState {
  tracker: SpoonTracker;
  current: number;
  max: number;
  heartbeat: 'green' | 'yellow' | 'orange' | 'red';
  locked: boolean; // true when < 25%

  calibrate: (spoons: number) => void;
  spend: (cost: number) => void;
  recover: (amount: number) => void;
}
```

### 1C: Component Specifications

**Header.tsx:** Horizontal bar. Left: ⬡ THE BUFFER (phosphor green). Right: 12 thin vertical bars showing spoons (colored by heartbeat tier), H badge (click toggles SamsonPanel), status badge (NOMINAL/CONSERVATION/DEFENSIVE/DEEP LOCK), queue count button.

**Calibrate.tsx:** Centered card. "How is your energy right now?" 12 numbered buttons (1-12), colored by selection level. Current selection shown large. BEGIN button (phosphor green). Shown only on first visit or manual reset.

**Input.tsx:** If `locked` (< 25% spoons), render `<DeepLock />` instead. Otherwise: instruction text, textarea (monospace, dark bg, green border on focus), two buttons: BREATHE FIRST (ghost style) and SCORE ▸ (solid green, disabled until input non-empty). Ctrl+Enter shortcut triggers score.

**Scored.tsx:** Voltage header card (score, gate label, U/E/C subscores, AI temp from Samson). Three horizontal score bars (Urgency=cyan, Emotion=purple, Cognitive=amber). If passive-aggressive patterns detected: purple subtext card with translations. BLUF card with summary and extracted actions. If heartbeat is orange/red AND voltage > 5: spoon cost warning. Action buttons row: AI REWRITE, ORIGINAL (shows spoon cost), DEFER, DONE ✓.

**Rewritten.tsx:** Compact voltage header. Green-bordered card: NEUTRAL TRANSLATION. Purple card: EMOTIONAL SUBTEXT. Cyan card: ACTIONS. Gray card: SUGGESTED REPLY (italic). Buttons: ORIGINAL, DEFER, DONE ✓.

**Original.tsx:** Compact voltage header. Raw message in monospace pre-wrap. Buttons: ← BACK, DONE ✓.

**SamsonPanel.tsx:** Collapsible panel below header (toggled by H badge). Shows: H value (green if near 0.349, amber if drifting), P-term state, I-term state, D-term state, AI temperature recommendation, Z-score. Trimtab slider (-5 to +5). Contextual warnings: loop detected, escalating, burnout critical.

**QueuePanel.tsx:** Collapsible panel below header. Lists deferred messages with voltage badge, truncated text, Open button.

**DeepLock.tsx:** Centered card with shield icon. "DEEP PROCESSING LOCK" in red. "Energy below 25%." Three recovery buttons: BREATHE (4-2-6), NAP (+2), HEAVY WORK (+1).

**Breathe.tsx:** Full-screen overlay (z-50). Expanding/contracting circle synchronized to 4-2-6 timing. Labels: BREATHE IN / HOLD / BREATHE OUT. Cycle counter (X/3). Skip button. On 3 cycles complete: auto-dismiss, recover 0.5 spoons.

### 1D: Services

**storage.ts** — Dexie schema:
```typescript
import Dexie from 'dexie';

class BufferDB extends Dexie {
  sessions!: Table<SessionRecord>;
  queue!: Table<QueueItem>;
  preferences!: Table<Preference>;

  constructor() {
    super('p31-buffer');
    this.version(1).stores({
      sessions: '++id, timestamp',
      queue: '++id, voltage, gate, timestamp',
      preferences: 'key',
    });
  }
}
```

**ai-rewrite.ts:**
```typescript
export async function rewriteMessage(
  text: string,
  score: VoltageScore,
  temperature: number
): Promise<AIRewriteResult> {
  // Try buffer-api first, fall back to direct Gemini call
  const endpoint = import.meta.env.VITE_API_URL || 'http://localhost:8787';
  const res = await fetch(`${endpoint}/rewrite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, score, temperature }),
  });
  return res.json();
}
```

**persistence.ts** — Subscribe to zustand stores, write to Dexie on change. On app init, hydrate stores from Dexie.

### 1E: PWA Config

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'The Buffer',
        short_name: 'Buffer',
        description: 'Voltage-gated communication bridge',
        theme_color: '#39FF14',
        background_color: '#0a0a0f',
        display: 'standalone',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

### 1F: Verify

Run `pnpm --filter @p31labs/shelter dev`. Verify:
- [ ] Calibrate screen appears on first load
- [ ] Setting spoons transitions to input phase
- [ ] Scoring a message shows voltage, gate color, subscores
- [ ] Passive-aggressive detection works ("per my last email" → subtext card)
- [ ] BLUF extraction shows actions
- [ ] AI Rewrite button calls the endpoint (will 404 for now — that's fine, handle gracefully)
- [ ] Spoon bar decrements on actions
- [ ] Deep Processing Lock triggers at < 25%
- [ ] Breathing overlay runs 3 cycles and recovers spoons
- [ ] Deferred messages appear in queue
- [ ] Samson panel shows PID state
- [ ] State persists after page reload (Dexie)
- [ ] `pnpm build` produces a deployable dist/

**Do not proceed to Phase 2 until `pnpm dev` runs clean and all checkboxes above work.**

---

## PHASE 2: `apps/buffer-extension/` — Chrome Extension

### 2A: Structure

```
apps/buffer-extension/
├── manifest.json
├── tsconfig.json
├── vite.config.ts            # multi-entry: background, content, sidepanel, popup
├── package.json              # deps: @p31labs/buffer-core, react, react-dom
├── src/
│   ├── background/
│   │   └── service-worker.ts  # Chrome service worker, state sync
│   ├── content/
│   │   ├── gmail.ts           # Gmail thread row injection
│   │   └── slack.ts           # Slack message interception
│   ├── sidepanel/
│   │   ├── index.html
│   │   ├── main.tsx
│   │   └── App.tsx            # Lightweight Buffer dashboard
│   └── popup/
│       ├── index.html
│       ├── main.tsx
│       └── Popup.tsx          # Quick status: spoons + last voltage
└── icons/
    ├── icon-16.png
    ├── icon-48.png
    └── icon-128.png
```

### 2B: manifest.json
```json
{
  "manifest_version": 3,
  "name": "The Buffer",
  "version": "0.1.0",
  "description": "Voltage-gated communication bridge for neurodivergent users",
  "permissions": ["activeTab", "storage", "sidePanel"],
  "background": {
    "service_worker": "src/background/service-worker.js",
    "type": "module"
  },
  "side_panel": {
    "default_path": "src/sidepanel/index.html"
  },
  "action": {
    "default_popup": "src/popup/index.html",
    "default_icon": {
      "16": "icons/icon-16.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png"
    }
  },
  "content_scripts": [
    {
      "matches": ["https://mail.google.com/*"],
      "js": ["src/content/gmail.js"]
    },
    {
      "matches": ["https://app.slack.com/*"],
      "js": ["src/content/slack.js"]
    }
  ]
}
```

### 2C: Gmail Content Script (`content/gmail.ts`)

```typescript
import { computeVoltage, getGateForVoltage, GATE_COLORS } from '@p31labs/buffer-core';

// Wait for Gmail to load thread rows
const observer = new MutationObserver((mutations) => {
  const rows = document.querySelectorAll('tr.zA:not([data-p31-scored])');
  rows.forEach((row) => {
    const subjectEl = row.querySelector('.bog span, .bqe');
    const snippetEl = row.querySelector('.y2');
    if (!subjectEl) return;

    const text = `${subjectEl.textContent || ''} ${snippetEl?.textContent || ''}`;
    const score = computeVoltage(text);
    const gate = getGateForVoltage(score.voltage);

    // Inject voltage badge
    const badge = document.createElement('span');
    badge.textContent = `V:${score.voltage.toFixed(1)}`;
    badge.style.cssText = `
      display: inline-block;
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: 700;
      font-family: monospace;
      margin-left: 6px;
      color: ${GATE_COLORS[gate]};
      background: ${GATE_COLORS[gate]}15;
      border: 1px solid ${GATE_COLORS[gate]}33;
    `;
    subjectEl.parentElement?.appendChild(badge);

    // Color-code row border
    (row as HTMLElement).style.borderLeft = `3px solid ${GATE_COLORS[gate]}`;
    row.setAttribute('data-p31-scored', 'true');
  });
});

observer.observe(document.body, { childList: true, subtree: true });
```

### 2D: Side Panel

The side panel renders a simplified Buffer dashboard. Import components from `apps/shelter/` if possible, or rebuild lightweight versions. Must include: spoon display, message input + scorer, queue, breathing button. Connect to background service worker via `chrome.runtime.sendMessage` for state sync.

### 2E: Verify

- [ ] `pnpm build` in buffer-extension produces a `dist/` loadable via chrome://extensions
- [ ] Gmail thread rows show voltage badges after scoring
- [ ] Badge colors match gate thresholds from buffer-core
- [ ] Side panel opens and shows Buffer dashboard
- [ ] Popup shows current spoon count
- [ ] No console errors

**Do not proceed to Phase 3 until extension loads and Gmail badges render.**

---

## PHASE 3: `apps/buffer-api/` — Cloudflare Workers API

### 3A: Structure

```
apps/buffer-api/
├── src/
│   ├── index.ts               # Hono app, CORS, error handling
│   ├── routes/
│   │   ├── health.ts          # GET /health → { status: "ok", version: "0.1.0" }
│   │   └── rewrite.ts         # POST /rewrite → AI rewrite
│   ├── middleware/
│   │   ├── rate-limit.ts      # Per-IP: 60 req/min
│   │   └── validate.ts        # Zod schema validation
│   └── services/
│       └── gemini.ts          # Gemini 2.0 Flash API client
├── wrangler.toml
├── package.json
└── tsconfig.json
```

### 3B: Rewrite Endpoint

```typescript
// routes/rewrite.ts
import { Hono } from 'hono';
import { z } from 'zod';

const RewriteInput = z.object({
  text: z.string().min(1).max(10000),
  score: z.object({
    urgency: z.number(),
    emotional: z.number(),
    cognitive: z.number(),
    voltage: z.number(),
    gate: z.string(),
  }),
  temperature: z.number().min(0.1).max(1.0).default(0.7),
});

app.post('/rewrite', async (c) => {
  const body = RewriteInput.parse(await c.req.json());

  const systemPrompt = `You are The Buffer — a communication bridge for neurodivergent users.
Rewrite the following message in neutral, clear, actionable language.
Remove passive aggression. Extract the core request. Use active voice, present tense. Be direct.
VOLTAGE: ${body.score.voltage}/10 (U:${body.score.urgency} E:${body.score.emotional} C:${body.score.cognitive}) GATE: ${body.score.gate}
Respond ONLY in JSON (no markdown, no backticks):
{"neutral_rewrite":"...","emotional_subtext":"...","action_items":["..."],"suggested_response":"..."}`;

  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': c.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${systemPrompt}\n\nMESSAGE:\n${body.text}` }] }],
      generationConfig: { temperature: body.temperature, maxOutputTokens: 1000 },
    }),
  });

  const data = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const parsed = JSON.parse(rawText.replace(/```json|```/g, '').trim());

  // ZERO RETENTION: body.text is never logged, never stored, gone after this response
  return c.json(parsed);
});
```

### 3C: wrangler.toml
```toml
name = "p31-buffer-api"
main = "src/index.ts"
compatibility_date = "2024-12-01"

[vars]
ENVIRONMENT = "production"

# GEMINI_API_KEY set via: wrangler secret put GEMINI_API_KEY
```

### 3D: Verify

- [ ] `wrangler dev` starts local server
- [ ] `GET /health` returns `{ status: "ok" }`
- [ ] `POST /rewrite` with test message returns valid JSON with neutral_rewrite, emotional_subtext, action_items, suggested_response
- [ ] No message content appears in any log or console output
- [ ] Response time < 5 seconds
- [ ] Rate limiting rejects > 60 req/min from same IP

**After all 3 phases pass verification, run `pnpm turbo build` from root. All workspaces should build clean.**

---

## FINAL CHECKLIST

After all phases complete:

```bash
# From p31/ root
pnpm turbo build          # All workspaces build
pnpm turbo test           # All tests pass (buffer-core: 37+)
pnpm turbo typecheck      # Zero TS errors

# Verify apps
cd apps/shelter && pnpm dev           # PWA runs at localhost:5173
cd apps/buffer-api && wrangler dev    # API runs at localhost:8787
# Load apps/buffer-extension/dist in chrome://extensions

# Integration test
# 1. Open shelter, calibrate spoons
# 2. Paste: "Per my last email, I need the TPS reports ASAP. Thanks in advance."
# 3. Score → should show: HIGH voltage, passive-aggressive subtext, BLUF with action
# 4. Click Rewrite → should call API → return neutral translation
# 5. Spoons should decrement
# 6. Samson panel should show updated H value
```

Report status on completion with:
```
## BUILD COMPLETE
### Files changed: [count]
### Tests: [pass/fail]
### Blockers: [any]
### Working: shelter ✅/❌ | extension ✅/❌ | api ✅/❌
```

---

*Constants in god.config.ts. Protocol in P31_PROTOCOL_BIBLE.md. Scoring in @p31labs/buffer-core. Everything else is wiring.*
*P31 Labs — IT'S OKAY TO BE A LITTLE WONKY — 🔺*
