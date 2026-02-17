# P31 Scope

Parent/operator dashboard for the P31 ecosystem. Connects to Shelter via WebSocket and shows real-time Sprout signals, message queue, voltage meter, and accommodation log.

## Setup

From this directory (to avoid root workspace conflicts):

```bash
npm install
```

## Dev

```bash
npm run dev
```

Runs on **port 5175**. Set `VITE_SHELTER_URL=http://localhost:4000` if Shelter is elsewhere.

## Build

```bash
npm run build
```

Output in `dist/`.

## Panels

- **Signal panel** — Last Sprout signal; "I need help" shows triage card (Send calm message, Draft message, Acknowledge).
- **Message queue** — Messages from Shelter `/history`; voltage color-coded; expand for content.
- **Voltage meter** — Current level (green/amber/red/black) and trend (Recharts).
- **Accommodation log** — Table from `/accommodation-log`; Export CSV for evidence.

## WebSocket

Connects to `ws://localhost:4000/ws`, sends `scope:subscribe` on connect, listens for `sprout:signal`, `message:new`, `message:processed`, `voltage:update`, `signal:help`, `signal:status`. Reconnects with exponential backoff.

🔺
