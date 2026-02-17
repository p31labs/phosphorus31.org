# P31 Labs — The Atom in the Bone

Open-source assistive technology for neurodivergent individuals.

## Architecture

```
phosphorus31.org (Cloudflare Pages)
     │
     ├── Quantum Hello World (AI resonance → molecule formation)
     ├── Resonance Engine (conversation → generative music → identity)
     ├── Game Engine (L.O.V.E. economy, challenges, metabolism gating)
     ├── The Scope (operational dashboard)
     ├── Sprout (4-button child interface)
     ├── The Fold (philosophy + publications)
     └── Identity (cryptographic molecule management)
     │
     └── Shelter (Express + SQLite backend)
          ├── Molecule registration
          ├── Brain state (spoons from GAS)
          ├── L.O.V.E. transactions
          ├── Mesh directory
          └── Sprout signals (WebSocket broadcast)
     │
     └── GAS Brain (Google Apps Script)
          ├── Spoon economy
          ├── Medication tracking
          ├── Email buffer
          └── Pushes brain state → Shelter
```

## Quick start

```bash
# Frontend (optional: set one AI key for conversation, or paste at runtime)
cd ui && npm install && npm run dev

# Backend
cd apps/shelter && npm install && npm run build && npm start

# Full build (output: ui/dist/; base / for web; for ESP32: VITE_BASE_PATH=/web/)
cd ui && npm run build
```

## Environment

```
# AI provider — set ONE (first found wins). Or paste any key in the app (RAM only).
VITE_ANTHROPIC_KEY=       # Anthropic (Claude Sonnet)
VITE_OPENAI_KEY=          # OpenAI (GPT-4o)
VITE_GEMINI_KEY=          # Google (Gemini 2.0 Flash)
VITE_SHELTER_URL=         # Shelter backend URL
VITE_SHELTER_KEY=         # Optional Shelter auth key
```

## AI provider

The phosphorus speaks through any available channel. Set one key in env or paste at runtime:

| Variable | Provider | Model |
|----------|----------|-------|
| VITE_ANTHROPIC_KEY | Anthropic | Claude Sonnet |
| VITE_OPENAI_KEY | OpenAI | GPT-4o |
| VITE_GEMINI_KEY | Google | Gemini 2.0 Flash |

Priority: Anthropic → OpenAI → Gemini. Runtime paste: `sk-ant-` → Claude, `sk-` → GPT, else → Gemini. Key in the input lives in React state only (never stored).

## Structure

- **ui/** — The Scope frontend (React, Vite). Routes: /, /mesh, /scope, /fold, /wallet, /challenges, /sprout, /identity, /dome/:fp
- **apps/shelter/** — P31 Shelter: molecule registration, brain state, L.O.V.E., sprout signals
- **packages/game-integration/** — Game client, genesis, challenges, Shelter bridge
- **packages/protocol/** — Shared P31 Protocol types
- **firmware/** — P31 NodeZero (ESP32-S3)

## Principles

- Local-first: your data stays on your device
- Open source: Apache 2.0 (software), CERN-OHL-S (hardware)
- Kids first: no scary words, no dark patterns
- ADA protected: accommodation evidence where applicable

## License

Software: Apache 2.0 | Hardware: CERN-OHL-S | Publications: CC BY 4.0

It's okay to be a little wonky. 🔺
