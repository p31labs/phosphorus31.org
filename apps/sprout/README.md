# P31 Sprout

Child-facing interface for the P31 ecosystem. Four buttons — that’s it. When a kid presses one, a WebSocket signal is sent to Shelter, which broadcasts to the parent’s Scope dashboard.

## Run

- **Dev:** `npm run dev` (port 5174)
- **Build:** `npm run build` (static bundle in `dist/`)

## Buttons

| Button           | Signal  | Color   |
|------------------|---------|---------|
| I'm okay         | `ok`    | #00FF88 |
| I need a break   | `break` | #FFB800 |
| I need a hug     | `hug`   | #00D4FF |
| I need help      | `help`  | #FF00CC |

Each press sends `{ type: "sprout:signal", signal, timestamp }` to `ws://localhost:4000/ws`. Start the Shelter backend first.

## Design

- Full screen, no nav. Dark background (#050510).
- 2×2 grid (tablet/desktop), 1 column on phone. Min touch target 120×120px.
- Connection status: green dot = connected, amber = reconnecting (never red).
- After press: “Sent ✓” for 2s, then back to buttons. Optional `scope:response` shows “They saw your signal 💚”.
- Accessibility: aria-labels, keyboard (tab + enter), `prefers-reduced-motion` respected.

The mesh holds. 🔺
