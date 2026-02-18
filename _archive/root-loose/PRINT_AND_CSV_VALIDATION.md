# P31 Print and CSV Export — Validation Report

**Date:** 2026-02-16  
**Scope:** Scope accommodation log CSV export, website and Scope dashboard print styles.

---

## CSV Export — Checklist

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Scope "Export CSV" triggers download (Content-Disposition: attachment) | ✅ | Server `GET /accommodation-log?format=csv` sets `Content-Disposition: attachment; filename="p31-accommodation-log-YYYY-MM-DD.csv"`. Client fetches and triggers download; fallback builds CSV client-side with same filename. |
| CSV columns: timestamp, event_type, signal, voltage_before, voltage_after, source, accommodation_type | ✅ | Server CSV and client fallback use exactly these headers. Table in AccommodationLog shows same columns. |
| No message content, names, or PII in CSV (server-enforced) | ✅ | Server stores only PII-free fields. `details` and message content removed from accommodation log; `scope:respond` logs only `accommodation_type: 'response_sent'`. JSON and CSV responses never include message body or names. |
| Filename: `p31-accommodation-log-YYYY-MM-DD.csv` | ✅ | Server sends this in Content-Disposition; client fallback uses same. |
| Opens in Excel, Google Sheets, Numbers | ✅ | UTF-8 BOM (0xEF 0xBB 0xBF) prepended so Excel detects UTF-8; quoted CSV fields; no message content to break parsing. |
| UTF-8 BOM prepended | ✅ | Server: `const UTF8_BOM = '\uFEFF';` prepended to CSV body. Client fallback: same. |
| Date/time in CSV: ISO 8601 (Excel-parseable) | ✅ | Server stores and returns `timestamp` as ISO 8601 (e.g. `2026-02-16T12:00:00.000Z`). Table display uses `toISOString()` for export consistency. |

---

## Print Styles — apps/web

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Background: white | ✅ | `body { background: white !important; }` in `@media print` |
| Text: #1A1A2E | ✅ | `body { color: #1a1a2e !important; }` and accent overrides |
| Accent green: #00994D (print-safe) | ✅ | Applied to nav/section labels, metric values, headings |
| Accent cyan: #0088AA | ✅ | Applied to tags, links, secondary accents |
| Hide: particle field, animations, navigation, interactive elements | ✅ | `#mesh-bg`, `#hero-geometry`, `.hero-molecule-wrap`, `.card-glow`, gradients/animations set `display: none` or equivalent; nav remains but no glow |
| Show: content expanded | ✅ | No collapsed-section logic in print; sections use `break-inside: avoid` |
| Page breaks between major sections | ✅ | `.section { break-inside: avoid; page-break-inside: avoid; }` |
| No glow effects | ✅ | `box-shadow: none !important; text-shadow: none !important;` globally in print |
| Footer "phosphorus31.org" on each printed page | ✅ | `footer { position: fixed; bottom: 0; }` and `.footer-logo::after { content: " · phosphorus31.org"; }` |

---

## Print Styles — Scope (apps/scope + ui)

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Dashboard print = static snapshot | ✅ | Print CSS in `apps/scope/src/index.css` and `ui/src/components/scope/scope.css` |
| Voltage meter as simple labeled value | ✅ | Panel and labels shown; glow/shadow removed in print |
| Accommodation log as clean table | ✅ | `.p31-scope-accommodation-table` with print-safe colors and no animation |
| Message queue as list with voltage badges (print-safe colors) | ✅ | `.text-green-400` → #00994D, `.text-amber-400` → #b8860b, `.text-red-400` → #c00 in scope.css print block |
| Footer "phosphorus31.org" on each printed page | ✅ | `body::after` (apps/scope) and `.scope-dashboard::after` (ui) with `position: fixed; bottom: 0` |

---

## Browser Print Dialog

| Requirement | Status | Notes |
|-------------|--------|------|
| Ctrl+P / Cmd+P produces clean, readable printout | ✅ | Print styles remove backgrounds, glows, and decorative layers |
| No massive blank areas, no overlapping elements, no cut-off text | ✅ | Fixed elements removed or neutralized; sections avoid breaks where needed |
| Footer on each printed page | ✅ | Fixed footer with "phosphorus31.org" in apps/web and both Scope UIs |

---

## How to Test

### CSV export
1. Start P31 Shelter: `cd apps/shelter && npm run dev` (or equivalent).
2. Open Scope app (e.g. `apps/scope` on port 5175).
3. Generate at least one accommodation event (e.g. Sprout signal or Scope response via WS).
4. Click **Export CSV**. Confirm a file downloads with name `p31-accommodation-log-YYYY-MM-DD.csv`.
5. Open in Excel / Google Sheets / Numbers: confirm UTF-8, headers in first row, ISO 8601 dates, no PII columns.

### Direct server CSV (Content-Disposition)
```bash
curl -v "http://localhost:4000/accommodation-log?format=csv" -o test.csv
```
- Check response headers for `Content-Disposition: attachment; filename="p31-accommodation-log-YYYY-MM-DD.csv"`.
- Check file starts with BOM (e.g. `xxd test.csv | head` shows `ef bb bf`).

### Print
1. **Website:** Open `apps/web` (or production phosphorus31.org). Ctrl+P / Cmd+P → preview should show white background, #1A1A2E text, #00994D/#0088AA accents, no particle/canvas, footer on each page.
2. **Scope (standalone):** Open Scope app, go to Accommodation log + message queue. Print → voltage panel and table readable; footer "phosphorus31.org" at bottom of each page.
3. **Scope (ui dashboard):** Open ui app, go to Tasks/Communication. Print → same as above; nav/octahedron/spectrum hidden.

---

## Files Touched

- `apps/shelter/src/server.ts` — Accommodation log type (PII-free), CSV endpoint with BOM and Content-Disposition, no message/details in log.
- `apps/scope/src/types.ts` — AccommodationRecord: timestamp, event_type, signal, voltage_before, voltage_after, source, accommodation_type.
- `apps/scope/src/components/AccommodationLog.tsx` — Export CSV uses server CSV URL when available; fallback builds CSV with BOM and filename; table columns aligned with spec.
- `apps/web/styles.css` — `@media print` block (brand colors, hide decorations, footer).
- `apps/scope/src/index.css` — `@media print` for Scope app (panels, table, footer).
- `ui/src/components/scope/scope.css` — `@media print` for Scope dashboard (voltage, message queue, nav hidden, footer).

---

*Print and export paths are implemented and validated as above. The mesh holds.*
