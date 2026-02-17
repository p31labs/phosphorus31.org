# QA-02: Sprout — Child Safety & Accessibility Audit

**Date:** 2026-02-16  
**App:** apps/sprout/  
**Status:** Fixes applied. Pass/fail table below.

---

## Pass/Fail Table

| Category | Item | Status | Notes |
|----------|------|--------|-------|
| **Layout & Sizing** | Four buttons fill 100vh exactly — no scrolling | ✅ PASS | `.app` min-height 100vh + safe-area; `.grid` flex:1; overflow hidden |
| | 2×2 grid on screens ≥ 600px | ✅ PASS | Breakpoint changed from 480px to 600px |
| | 1-column stack on < 600px, 25vh each | ✅ PASS | grid-template-rows 1fr×4; .sprout-button min-height 25vh |
| | Every button min 120×120px touch target | ✅ PASS | min-height/min-width 120px; on mobile 25vh × full width |
| | No horizontal overflow 320px–1440px | ✅ PASS | max-width 100%, box-sizing, padding with safe-area |
| | Safe area insets (iOS) | ✅ PASS | env(safe-area-inset-*) on .app padding and .status-dot position |
| | No content behind notch/dynamic island | ✅ PASS | top/right use max(0.75rem, env(safe-area-inset-*)) |
| **Colors & Contrast** | Background #050510 | ✅ PASS | :root background in index.css |
| | "I'm okay" #00FF88 | ✅ PASS | --btn-color + box-shadow glow |
| | "I need a break" #FFB800 | ✅ PASS | |
| | "I need a hug" #00D4FF | ✅ PASS | |
| | "I need help" #FF00CC | ✅ PASS | |
| | Glow: 0.3 / 0.15 / 0.05 opacity layers | ✅ PASS | box-shadow triple layer on .sprout-button and .dot |
| | Pressed state scale(0.97) + enhanced glow | ✅ PASS | :active transform scale(0.97); stronger box-shadow |
| **Typography** | Font system-ui (no Oxanium) | ✅ PASS | index.css + .sprout-button font-family |
| | Button text ≥ 24px mobile, 28px+ tablet | ✅ PASS | font-size: clamp(24px, 5vw, 28px) |
| | Font weight 600 | ✅ PASS | font-weight: 600 |
| | Text centered in each button | ✅ PASS | flex center |
| **Interaction** | Haptic navigator.vibrate(30), try/catch | ✅ PASS | haptic() 30ms, try/catch, degrades silently |
| | Visual pulse scale 1 → 0.97 → 1 over 200ms | ✅ PASS | transition 0.2s spring; :active scale(0.97) |
| | "Sent ✓" for exactly 2s then revert | ✅ PASS | CONFIRM_DURATION_MS = 2000 |
| | During "Sent ✓" button non-interactive | ✅ PASS | Buttons replaced by confirmation div |
| | Cooldown 2s between presses | ✅ PASS | Global 2s before buttons show again |
| | Glow intensifies on hover and press | ✅ PASS | hover/active box-shadow enhanced |
| | No long-press, no swipe | ✅ PASS | Click only |
| **Emotional Safety** | Zero error messages on screen | ✅ PASS | No error UI |
| | Connection lost → amber dot + "Reconnecting..." 9px | ✅ PASS | .status-text 9px; color #7878AA |
| | Dot green/amber only, never red/ERROR/FAILED | ✅ PASS | Only connected/reconnecting |
| | No modal/alert on WS fail after retries | ✅ PASS | Dot stays amber, no modal |
| | No loading spinners | ✅ PASS | Buttons always present |
| | Disconnected press still shows "Sent ✓" | ✅ PASS | setConfirming(true) regardless |
| | Queue up to 10, flush on reconnect | ✅ PASS | useShelterWs queueRef, flushQueue on open |
| **Accessibility** | aria-label "Send ... signal" | ✅ PASS | `Send ${label} signal` |
| | role="button" / <button> | ✅ PASS | <button> |
| | Tab + Enter/Space | ✅ PASS | Native button |
| | Focus ring 2px accent, offset 2px | ✅ PASS | outline 2px solid var(--btn-color); offset 2px |
| | prefers-reduced-motion: all animations off | ✅ PASS | App.css media query: transition none, scale(1), no pulse |
| | prefers-contrast: more — stronger text/glow | ✅ PASS | App.css: color #FFF; dot glow stronger |
| | aria-live "Signal sent" on press | ✅ PASS | .confirmation.sent aria-live="polite" aria-label="Signal sent" |
| | Viewport maximum-scale=1, user-scalable=no (Sprout only) | ✅ PASS | index.html meta viewport |
| **WebSocket** | Connect ws://localhost:4000/ws or VITE_WS_URL | ✅ PASS | import.meta.env.VITE_WS_URL with fallback |
| | Send { type: "sprout:signal", signal, timestamp } | ✅ PASS | SproutSignalPayload |
| | Reconnect 1s→2s→4s→8s→16s→30s cap | ✅ PASS | 1000 * 2^attempt, cap 30000 |
| | Listen "scope:response", show confirmation 3s | ✅ PASS | SCOPE_RESPONSE_DURATION_MS = 3000 |
| | Heartbeat ping every 25s | ✅ PASS | setInterval 25000, send { type: 'ping' } |
| | Pong timeout 5s → disconnect, reconnect | ✅ PASS | schedulePongTimeout 5000; on close reconnect |
| **Performance** | Bundle < 50KB gzipped | ✅ VERIFY | No heavy libs; run build and check |
| | No external font (system-ui) | ✅ PASS | No font link |

---

## Fixes Applied

1. **useShelterWs.ts**
   - WS URL from `import.meta.env.VITE_WS_URL` with fallback `ws://localhost:4000/ws`.
   - Queue: when not OPEN, push payload (max 10); on open flush queue.
   - Ping every 25s; pong timeout 5s then close (reconnect via onclose).

2. **App.tsx**
   - Haptic 30ms, wrapped in try/catch.
   - SCOPE_RESPONSE_DURATION_MS = 3000.
   - aria-label on buttons: `Send ${label} signal`.
   - Confirmation divs: aria-live="polite" aria-atomic="true"; sent div aria-label="Signal sent".

3. **App.css**
   - Breakpoint 600px (was 480px) for 2×2 vs 1-column.
   - Safe area: padding and status-dot position with env(safe-area-inset-*).
   - Grid on mobile: 4 rows 1fr each, button min-height 25vh.
   - Glow: triple-layer box-shadow (0.3, 0.15, 0.05) on buttons and dots.
   - Button background tint #0A0A1F (surface1); text #E0E0EE.
   - Font: system-ui stack; font-size clamp(24px, 5vw, 28px); font-weight 600.
   - :active scale(0.97) and stronger glow; transition 0.2s spring.
   - Focus-visible outline 2px, offset 2px.
   - .status-text 9px, color #7878AA.
   - prefers-reduced-motion: no transitions, no scale, no pulse.
   - prefers-contrast: more — white text, stronger dot glow.

4. **index.css**
   - Text color #E0E0EE (was #e0e0e0; normalized).

5. **index.html**
   - Already had viewport maximum-scale=1, user-scalable=no.

---

## Optional / Follow-up

- **Shelter server:** If the backend does not send `{ type: 'pong' }` in response to `{ type: 'ping' }`, the client will close and reconnect every 5s after each ping. Implement pong on the server for stable connection.
- **Bundle size:** Run `npm run build` and confirm gzipped size < 50KB.
- **Contrast:** Optionally add a darker card (#0A0A1F) behind button text if any accent fails 4.5:1 on #050510 (current colors chosen to meet contrast).

---

*The mesh holds. Kids first.* 🔺
