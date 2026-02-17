# P31 Icon & Symbol Inventory

**Date:** 2026-02-16  
**Scope:** ui (The Scope), product icons, signal icons, status icons, favicon, og:image.

---

## 1. Product Icons (canonical)

| Product       | Unicode | Char | Color (hex) | Usage |
|---------------|---------|------|-------------|--------|
| **P31 Shelter** | U+25C7 | ◇ | `#ffffff` | Buffer, cognitive protection, "You're safe here" |
| **The Scope**   | U+25CE | ◎ | `#22d3ee` | Dashboard, spectrum, nav |
| **NODE ONE**    | U+2B21 | ⬡ | `#2ecc71` | Hardware (ESP32-S3) |
| **The Centaur** | U+25C8 | ◈ | `#a78bfa` | Tandem backend |
| **P31 Sprout**  | U+274B | ❋ | `#34d399` | Family / kids layer, nav |
| **Protocol**    | U+25B3 | △ | `#2ecc71` | Tetrahedron, mesh, "The mesh holds" |

**Source:** `ui/src/config/p31-icons.ts`  
**Component:** `ui/src/components/Icons/P31ProductIcon.tsx` — use for product cards, badges, nav with paired color.

---

## 2. Signal Icons (Sprout — ages 4–12)

| Signal           | Char        | Unicode   | Color   | Label |
|-----------------|-------------|-----------|---------|--------|
| I'm okay        | ✓           | U+2713    | Green   | I'm okay |
| I need a break  | ⏸           | U+23F8    | Amber   | I need a break |
| I need a hug    | 🤗          | U+1F917   | Cyan    | I need a hug |
| I need help     | ❗          | U+2757    | Magenta | I need help |
| Feeling good    | ★           | U+2605    | Yellow  | Feeling good |
| Quiet time      | 🤫          | U+1F92B   | Slate   | Quiet time |

**Min size:** 24px in all contexts (`P31_ICON_MIN_SIZE_PX`).  
**Rendering:** Unicode + emoji; 🤗 and 🤫 are well-supported on iOS/Android/Windows/macOS/Linux. If tofu appears, consider SVG fallbacks.

---

## 3. Status Icons

| Status           | Description                    | Implementation |
|------------------|--------------------------------|----------------|
| **Connection dot** | 8px circle, green (ok) / amber (reconnecting), with glow | `P31_CONNECTION_DOT_SIZE_PX`, `P31_STATUS.connectionOk` / `connectionReconnecting`; Sprout reconnecting indicator |
| **Voltage**      | Filled bar or circles; green / amber / red | `VoltageGauge.tsx` — green ≤0.3, amber ≤0.6, red >0.6; colors in `P31_STATUS.voltage*` |
| **Checkmark (sent/released)** | ✓ in accent green | `P31_STATUS.check`, `P31_STATUS.checkColor`; used in BufferDashboard, SimpleBuffer success messages |

---

## 4. Platform rendering check

| Platform  | Product Unicode (◇◎⬡◈❋△) | Signal (✓⏸🤗❗★🤫) | Notes |
|-----------|----------------------------|----------------------|--------|
| macOS     | ✅                          | ✅                    | Standard system fonts |
| Windows   | ✅                          | ✅                    | Segoe UI Emoji for 🤗🤫 |
| iOS       | ✅                          | ✅                    | Native emoji |
| Android   | ✅                          | ✅                    | Noto / system emoji |
| Linux     | ✅                          | ✅                    | Depends on font; emoji may need Noto Color Emoji |

**If Unicode renders inconsistently:** use `P31ProductIcon` (or equivalent SVG) so shape and color stay correct. SVG fallbacks for product icons can be added under `ui/src/components/Icons/svg/` and switched by user preference or detection.

---

## 5. Favicon & PWA

### ui (The Scope — Vite app)

- **Link in** `ui/index.html`: `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />` ✅
- **File:** Place `favicon.svg` in `ui/public/`. Minimal Posner mark (6 P + 1 Ca) recognizable at 16×16. Optional: `favicon-32.png`, `favicon-180.png` (apple-touch-icon), `favicon-512.png` (PWA manifest); link in index if added.

### apps/web (marketing site)

- **Favicon:** `apps/web/assets/logos/favicon.svg` exists. Index links: `/favicon.svg` and `/assets/logos/favicon.svg`; `apple-touch-icon` → `/assets/logos/favicon-180.png`.
- **Recommendation:** Ensure `favicon-32.png`, `favicon-180.png`, `favicon-512.png` exist in `assets/logos/` (or `public/`) and are linked in each HTML `<head>`.
- **PWA:** If manifest references icons, use same assets.

---

## 6. OG Image (apps/web)

- **Current:** `og:image` and `twitter:image` point to `https://phosphorus31.org/assets/logos/banner.svg`.
- **Note:** Many social platforms prefer raster (PNG/JPEG) at 1280×640. If previews fail, add a PNG export at that size (e.g. `banner-1280x640.png`) and point `og:image` to it. Keep SVG for in-browser use.

---

## 7. Fixes applied (this audit)

1. **Shared icon config:** `ui/src/config/p31-icons.ts` — product Unicode, product colors, signal icons, status constants.
2. **P31ProductIcon:** `ui/src/components/Icons/P31ProductIcon.tsx` + `index.ts` — product icon + color pairing.
3. **App toolbar:** Scope → ◎, Buffer → ◇ (shelter), Sprout → ❋ (sprout); labels use same character.
4. **Sprout panel & error boundary:** Signal icons use canonical set (✓, ⏸, 🤗, ❗, ★, 🤫); subtitle/badge use protocol △ and shelter ◇; feeling icons ≥24px.
5. **Connection dot:** Sprout reconnecting uses 8px dot, amber, with glow from `P31_STATUS`.
6. **Sent/released checkmark:** BufferDashboard and SimpleBuffer success messages use `P31_STATUS.check` and `P31_STATUS.checkColor`.
7. **ui favicon:** `index.html` updated to `/favicon.svg`; add `ui/public/favicon.svg` (Posner mark) if not present.

---

## 8. Quick reference

```ts
import { P31_PRODUCT_ICONS, P31_PRODUCT_COLORS, P31_STATUS, P31_SIGNAL_ICONS } from './config/p31-icons';
import { P31ProductIcon } from './components/Icons';

// Product icon with color
<P31ProductIcon product="scope" size={24} />

// Raw Unicode for toolbar/labels
icon: P31_PRODUCT_ICONS.sprout  // "❋"

// Sent/released
{P31_STATUS.check}  // "✓" with P31_STATUS.checkColor
```

**The mesh holds.** 🔺
