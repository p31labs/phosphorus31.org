# P31 Ops Automation (Google Apps Script)

Copy these `.gs` files into your Google Apps Script project so the mesh runs on its own: daily briefs, health pulses, accommodation logs, and backups.

## Project

- **Editor:** https://script.google.com → open project `1TrYuIoHpE2gofb_khQ8MhP0LR6Ba714tU6fvfa_kABpPyyR4EDXCa1Zi`
- Create one script file per `.gs` file here (e.g. `Main`, `DailyOps`, `HealthPulse`, `AccommodationTracker`, `BackupAutomation`, `Utilities`, `Triggers`). Paste the contents of each file into the matching script in the editor.

## Config (Main.gs)

After creating Drive folders and Sheets, fill in:

- `DRIVE_ROOT_ID` — P31 Labs root folder ID (from URL: `/folders/ID`)
- `BACKUP_FOLDER_ID` — P31 Backups folder (or leave blank to auto-create)
- `LEGAL_FOLDER_ID` — Legal docs folder (optional)
- `OPS_LOG_ID` — Spreadsheet ID for ops log (create “Ops Log”, copy ID from URL)
- `ACCOMMODATION_TRACKER_ID` — Spreadsheet ID for accommodation tracker  
  - Create “Accommodation Tracker” with headers:  
    `Timestamp | Event Type | Signal | Voltage Before | Voltage After | Source | Accommodation Type`

## Triggers

1. In the editor: **Run → setupAllTriggers** (once).
2. Authorize when prompted.
3. Confirm under **Triggers** (clock icon):
   - `dailyOps` — 6:00 AM ET daily
   - `healthPulse` — every 15 minutes
   - `weeklyBackup` — Wednesday 3:00 AM ET
   - `syncAccommodationFromShelter` — Sunday 11:00 PM ET

## Manual tests

From the editor you can run: `testHealthPulse`, `testDailyOps`, `testBackup`, `testSync`.

## Drive layout (AUTO-05)

Create under Drive:

- **P31 Labs/** → **Accommodation Logs/**, **Backups/**, **Legal/**, **Branding/**, **Publications/**, **Outreach/**
- **Ops Log** (Sheet)
- **Accommodation Tracker** (Sheet)

Then paste the folder/Sheet IDs into `CONFIG` in `Main.gs`.
