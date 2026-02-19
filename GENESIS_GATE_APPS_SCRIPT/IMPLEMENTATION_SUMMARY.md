# P31 Entangle — Apps Script Backend

## What It Is

P31 Entangle is the Google Apps Script backend for the P31 ecosystem. It provides:

- **L.O.V.E. Economy Engine** — Love Points (LP) earned through verified care activities
- **Drive Sync** — Mirrors the P31 mesh structure to Google Drive
- **Heartbeat Dashboard** — Web-based system monitoring
- **Scheduled Heartbeat** — Daily digest email with system coherence status

## Architecture

```
GENESIS_GATE_APPS_SCRIPT/
├── Code.gs                    # doGet/doPost handlers, heartbeat function
├── Core/
│   └── LoveEconomy.gs        # LP calculation, ledger, coherence state
├── Utilities/
│   └── DriveSync.gs          # Drive folder sync, triggers
├── Index.html                # Heartbeat Dashboard (P31 visual identity)
├── README.md
├── DEPLOYMENT.md
└── IMPLEMENTATION_SUMMARY.md
```

## Drive Structure

```
P31_ROOT/                      (legacy: PHENIX_NAVIGATOR_ROOT)
├── ZONE_ALPHA_BACKBONE/       # Immutable archives
│   ├── core/
│   └── docs/
├── ZONE_BETA_CONTROL_CENTER/  # Live operations
│   ├── mesh/
│   ├── agent/
│   └── bridge/
└── ZONE_GAMMA_FABRICATION/    # Creative sandbox
    ├── world/
    ├── cortex/
    ├── ui/
    ├── firmware/
    └── hardware/
```

## L.O.V.E. Economy — Activity Categories

| Category | Activities | Base LP |
|----------|-----------|---------|
| Medical | Medication (50), Appointment (100), Monitoring (25), Therapy (100) |
| Parenting | Quality Time (100), Homework (75), Bedtime (60), Transport (50), Meals (40) |
| Legal | Legal Document (150), Court Appearance (200) |
| Financial | Financial Task (75) |
| Technical | System Maintenance (50) |
| Self-Care | Spoon Recovery (30), Executive Function (25) |

**Coherence multiplier:** GREEN state = 2.5x, RED state = 0.5x

## API Endpoints (via doPost)

| Action | Description |
|--------|-------------|
| `getSystemStatus` | XP, level, tasks, sync status |
| `recordActivity` | Record a care activity, earn LP |
| `syncDrive` | Start Drive sync |
| `getSyncStatus` | Check sync health |

## How to Go Live

1. Go to [script.google.com](https://script.google.com/) → New Project → "P31 Entangle"
2. Upload `Code.gs`, `Core/LoveEconomy.gs`, `Utilities/DriveSync.gs`, `Index.html`
3. Run `initP31Entangle()` from the editor
4. Go Live → New version → Run as: Me → Access: Anyone
5. Add trigger: `heartbeat` → Time-driven → Day timer → 7am

The web app URL is your Heartbeat Dashboard.

## Ecosystem Links

- **phosphorus31.org** — Landing page
- **p31ca.org** — P31 Shelter PWA
- **p31-spectrum.pages.dev** — Spectrum (full experience)
- **thegeodesicself.substack.com** — The Geodesic Self (writing)
- **github.com/p31labs** — Source code

## Version History

- **v2.0.0** — P31 naming, heartbeat function, modernized dashboard, OPSEC fix
- **v1.0.0** — Initial release (GENESIS_GATE naming)

The mesh holds. 🔺
