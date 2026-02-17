# P31 Brain v8 — Google Apps Script

Version-controlled source for the P31 Brain (GAS command center). Copy into your Apps Script project, then follow setup below.

**Script project:** [1TrYuIoHpE2gofb_khQ8MhP0LR6Ba714tU6fvfa_kABpPyyR4EDXCa1Zi](https://script.google.com/home/projects/1TrYuIoHpE2gofb_khQ8MhP0LR6Ba714tU6fvfa_kABpPyyR4EDXCa1Zi/edit)

**Integration:** [phosphorus31.org](https://phosphorus31.org) (Cloudflare Pages) · [Shelter API](https://shelter.p31.io) (when deployed)

---

## File map

| In this folder     | In GAS project | Action |
|--------------------|----------------|--------|
| appsscript.json    | (manifest)     | Update OAuth scopes (add Calendar) via Project Settings if needed |
| code.gs            | code.gs        | **Replace** |
| shelter_bridge.gs  | shelter_bridge.gs | **Create** |
| scope.gs           | scope.gs       | **Create** |
| narrative.gs       | narrative.gs   | **Replace** |
| operations.gs      | operations.gs  | **Replace** |
| Styles.html        | Styles.html    | **Replace** |
| index.html         | index.html     | **Replace** |
| Client.html        | Client.html    | **Replace** |
| tests.gs           | tests.gs       | **Replace** |
| —                  | shield.gs      | **Delete** |
| —                  | visuals.gs     | **Delete** |
| —                  | recruitment_orders.html | **Delete** |
| —                  | router.gs      | **Keep** (no changes) |
| —                  | api.gs         | **Keep** |
| —                  | security.gs   | **Keep** |
| —                  | protection.gs | **Keep** |
| —                  | buffer.gs     | **Keep** + add snippet from BUFFER_MEDICAL_PATCHES.md |
| —                  | medical.gs    | **Keep** + add snippet from BUFFER_MEDICAL_PATCHES.md |

---

## Script Properties

Set in **Project Settings → Script properties** (key/value):

| Key | Value | Notes |
|-----|--------|--------|
| `HOSTILE_SENDERS` | `email1@example.com,email2@example.com` | Comma-separated; no PII in code |
| `DEVICE_KEY` | (random 32-char string) | Node One HMAC auth |
| `SHELTER_URL` | `https://shelter.p31.io` or blank | Blank = Brain runs without Shelter |
| `SHELTER_API_KEY` | (random 32-char string) | Must match Shelter env |
| `OPERATOR_NAME` | (optional) | For legal filings only; omit = "The Operator" |
| `ROOT_ID_MANUAL` | (Drive folder ID) | Only if auto-detect of P31 root fails |
| `MEDS_CONFIG` | (optional JSON array) | Override default meds if needed |

---

## After paste

1. **Delete** shield.gs, visuals.gs, recruitment_orders.html.
2. **Paste** all files from this folder into the correct script/html files in the editor.
3. **Patch** buffer.gs and medical.gs per `BUFFER_MEDICAL_PATCHES.md`.
4. **Set** Script Properties (at least HOSTILE_SENDERS; others as you use Shelter/Node One).
5. **Run** `ignite()` once — creates Drive tree, telemetry sheet, triggers.
6. **Run** `runTests()` — must be all green.
7. **Run** `scope()` — verify returned object has spoons, mesh, meds, recent.
8. **Deploy** web app (Test or Production); open the /exec URL — dashboard should render with P31 brand.

---

## Link from phosphorus31.org

- **Option A:** Add a “Scope” link in the site nav that opens the GAS web app URL in a new tab.
- **Option B:** Add a `/scope` page that iframes the GAS deployment URL (same origin / auth handled by GAS).

GAS web app URL shape:  
`https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec`

---

## Triggers (set by `ignite()`)

- **ping** — daily 6:00 AM (refill, meds, buffer, shelter sync, briefing)
- **bufferScan** — every 15 min
- **checkMeds** — every 6 hours
- **mine** — every 1 hour (Love economy)
- **shelterSync** — every 1 hour (push state, pull health + Sprout signals)

---

## Shelter backend

If **SHELTER_URL** is set, the Brain:

- **Pushes** to `POST /brain/sync`: state (spoons, level, love, accommodation count, med log), buffer intercepts, accommodation events.
- **Pulls** from `GET /health` and `GET /accommodation-log?from=...&type=sprout_signal&limit=50`.

Shelter must implement `/brain/sync` (and optionally validate `X-P31-Key`). Until then, leave SHELTER_URL blank; the Brain runs standalone.

---

*The mesh holds. 🔺*
