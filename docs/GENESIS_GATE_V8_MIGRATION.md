# GENESIS_GATE v8.0 MIGRATION GUIDE
## From SIMPLEX v7 → P31 Entangle v8
## For: Gemini agent executing in Google Apps Script editor

---

## OVERVIEW

This is NOT a full rewrite. SIMPLEX v7 works. v8 is a naming alignment + governance automation layer. Apply these changes surgically.

---

## STEP 1: CONFIG UPDATE (Code.gs, lines 45-116)

Replace the CONFIG object. Changes marked with `// CHANGED`:

```javascript
const CONFIG = {
  OPERATOR: "William R. Johnson",
  TITLE: "Founder & CEO",                              // CHANGED from "Incorporator & CEO"
  SYSTEM_ID: "P31-LABS-001",                            // CHANGED from "P31-LABS-INC-001"
  CODENAME: "GEODESIC_OPERATOR",
  VERSION: "8.0.0",                                     // CHANGED from "7.0.0"
  ROOT_NAME: "P31_OPERATIONS_ROOT",

  // LEGAL ENTITY — NEW BLOCK
  ENTITY: {
    LEGAL_NAME: "P31 Labs, Inc.",
    TYPE: "Georgia 501(c)(3) Nonprofit Corporation",
    STATUS: "IN_FORMATION",                             // Change to "ACTIVE" after IRS determination
    EIN: "PENDING",                                     // Update when received
    GA_CONTROL_NUMBER: "PENDING",                       // Update after SOS filing
    FISCAL_SPONSOR: "Hack Club HCB",                    // Or "NONE" after 501(c)(3) approved
    REGISTERED_AGENT: "William R. Johnson",
    FORMATION_DATE: "2026-02-27"                        // Target
  },

  // GOVERNANCE — NEW BLOCK
  BOARD: [
    { seat: 1, name: "William R. Johnson", role: "CEO & Director", email: "will@p31ca.org", status: "ACTIVE" },
    { seat: 2, name: "Mama", role: "Director (CMO)", email: "", status: "PROPOSED" },
    { seat: 3, name: "Ashley", role: "Secretary & Director", email: "", status: "PROPOSED" },
    { seat: 4, name: "OPEN", role: "Independent Director", email: "", status: "RECRUITING" }
  ],
  OFFICERS: {
    CEO: "William R. Johnson",
    SECRETARY: "Ashley",
    TREASURER: "Carrie"
  },
  ADVISORY: [
    { name: "Katen", domain: "Culture & Community", status: "PROPOSED" },
    { name: "Hunter McFeron", domain: "AT Ecosystem (Tools for Life)", status: "PROPOSED" }
  ],

  // NEXT CRITICAL DEADLINE
  TARGET_DATE: new Date("2026-02-27T17:00:00-05:00"),

  // SECURITY (unchanged)
  SECURITY: {
    DEVICE_SECRET: "CHANGE_THIS_TO_YOUR_ESP32_KEY",
    SAFE_MODE_TRIGGER: 2
  },

  // AI NEXUS (unchanged)
  AI_NEXUS: {
    PROJECT_ID: "p31-labs-vertex-001",
    LOCATION: "us-central1",
    MODEL_ID: "gemini-2.0-flash"
  },

  // MEDICAL (unchanged)
  MEDICATIONS: [
    { name: "Calcitriol", intervalHours: 12, critical: true, consequence: "Hypocalcemia → Tetany → Cardiac Arrest" },
    { name: "EffexorXR", intervalHours: 24, critical: true, consequence: "SNRI Discontinuation Syndrome" },
    { name: "Vyvanse", intervalHours: 24, critical: true, consequence: "ADHD Executive Function Collapse" },
    { name: "Calcium/Magnesium", intervalHours: 12, critical: true, consequence: "Bone density loss, tetany risk" }
  ],

  // BIOLOGICAL SUBSTRATE (unchanged)
  BIO_PHYSICS: { MAX_SPOONS: 12, CALCIUM_ABSORPTION_WINDOW: 4 },
  DAILY_SPOONS: 12,
  SPOON_COSTS: {
    "WAKE_UP": 1, "MASKING": 3, "DEEP_WORK": 2, "MEDITATION": -1,
    "COOKING": 1, "EXERCISE": 1.5, "EMAIL": 2, "PHONE_CALL": 3,
    "SOCIAL_MEDIA": 3, "LITIGATION": 5, "CREATIVE_FLOW": 0.5,
    "MELTDOWN": 12, "BOARD_MEETING": 4
  },

  // BUFFER (renamed from TOMOGRAPH)
  HOSTILE_SENDERS: [
    "jenn@mcghanlaw.com",
    "c.e.francis11@gmail.com",
    "opposing_counsel_firm.com"
  ],

  // L.O.V.E. ECONOMY (unchanged)
  MINING: { BASE_RATE: 10, GREEN_MULTIPLIER: 2.5, YELLOW_MULTIPLIER: 1.0, RED_MULTIPLIER: 0.5 },

  // GAMIFICATION (unchanged)
  XP_PER_TASK: 100,
  XP_PER_LEVEL: 2000,

  // NOTIFICATION
  get NOTIFICATION_EMAIL() {
    try { return Session.getActiveUser().getEmail(); } catch(e) { return "will@p31ca.org"; }  // CHANGED
  },

  PHI: 1/3
};
```

---

## STEP 2: FUNCTION RENAMES (Find & Replace)

These are the public function names that need to change. Run find-and-replace across ALL .gs files:

| Old Name | New Name | Files Affected |
|----------|----------|---------------|
| `simplexProtocol()` | `ignite()` | Code.gs |
| `dailyHeartbeat()` | `ping()` | Code.gs, triggers |
| `tomographScan()` | `bufferScan()` | Code.gs, Tomograph.gs, triggers |
| `sendDailyBriefing()` | `sendPing()` | Code.gs, Narrative.gs |
| `Tomograph.gs` | Rename file to `Buffer.gs` | File rename |
| `Tomograph_Log` sheet tab | `Buffer_Log` | Code.gs SHEET_TABS |

**Also update triggers in installTriggers():**
```javascript
function installTriggers() {
  ScriptApp.getProjectTriggers().forEach(function(t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('ping').timeBased().everyDays(1).atHour(6).create();
  ScriptApp.newTrigger('bufferScan').timeBased().everyMinutes(15).create();
  ScriptApp.newTrigger('checkMedications').timeBased().everyHours(6).create();
  ScriptApp.newTrigger('runMiningCycle').timeBased().everyHours(1).create();

  // NEW: Governance triggers
  ScriptApp.newTrigger('weeklyBoardDigest').timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(9).create();
  ScriptApp.newTrigger('monthlyComplianceCheck').timeBased().onMonthDay(1).atHour(10).create();
  console.log("✓ 6 triggers installed");                                        // CHANGED from 4
}
```

---

## STEP 3: ARCHITECTURE UPDATE (Code.gs)

Update folder names in ARCHITECTURE constant:

```javascript
const ARCHITECTURE = {
  "ZONE_ALPHA_BACKBONE": {
    description: "🔷 IMMUTABLE TRUTH — The Archive.",
    children: [
      "00_MASTER_MANIFEST", "01_DOCTRINE_AND_SOPs", "02_ASSET_LIBRARY",
      "03_VERTEX_ONE_TDP", "04_ABDICATE_SOURCE", "05_THEORETICAL_FRAMEWORKS",
      "06_MEDICAL_BIOLOGICAL_TDP", "07_FAMILY_ONBOARDING", "08_VERSION_CONTROL",
      "09_CORPORATE_RECORDS"
    ]
  },
  "ZONE_BETA_CONTROL_CENTER": {
    description: "🔴 LIVE OPERATIONS — The Control Room.",                       // CHANGED from "War Room"
    children: [
      "10_ACTIVE_CAMPAIGNS", "11_LEGAL_FILINGS", "12_FINANCIAL_TELEMETRY",       // CHANGED 11
      "13_HIRING_PIPELINE", "14_COMMUNICATIONS_ARCHIVE", "15_METABOLIC_MONITORING",
      "16_BUFFER_INTERCEPTS", "17_BOARD_ROOM"                                    // CHANGED 16
    ]
  },
  "ZONE_GAMMA_FABRICATION": {
    description: "🟣 CREATIVE SANDBOX — The Workshop.",
    children: [
      "20_DEV_WORKSHOP", "21_APPRENTICE_TESTS", "22_USER_WORKSPACES",
      "23_COLD_STORAGE_ARCHIVE", "24_AI_COLLABORATION", "25_KIDS_COMMAND_CENTER"
    ]
  }
};
```

---

## STEP 4: NEW SHEET TAB

Add to SHEET_TABS:

```javascript
const SHEET_TABS = {
  telemetry:    { name: "Telemetry_Logs",  headers: ["TIMESTAMP","TYPE","ACTION","CONTEXT","VOLTAGE","STATUS"] },
  spoonBank:    { name: "Spoon_Bank",      headers: ["DATE","START_SPOONS","SPENT","REMAINING","RISK_%","ACTIVITY"] },
  loveLedger:   { name: "LOVE_Ledger",     headers: ["DATE","MINER_ID","ACTION","DURATION","YIELD","PROOF_HASH"] },
  medLog:       { name: "Medication_Log",   headers: ["TIMESTAMP","MEDICATION","DOSE","NEXT_DUE","STATUS"] },
  bufferLog:    { name: "Buffer_Log",       headers: ["TIMESTAMP","SENDER","SUBJECT","VOLTAGE","ACTION","HASH"] },  // RENAMED
  corporateLog: { name: "Corporate_Log",    headers: ["TIMESTAMP","DOCUMENT","FILING_STATUS","NEXT_ACTION","HASH"] },
  boardLog:     { name: "Board_Log",        headers: ["DATE","TYPE","RESOLUTION","VOTE","FILED_BY"] }  // NEW
};
```

---

## STEP 5: NEW FUNCTIONS — Governance.gs (NEW FILE)

Create a new file `Governance.gs`:

```javascript
/**
 * P31 ENTANGLE v8.0 — GOVERNANCE MODULE
 * Board automation, compliance tracking, digest generation.
 */

/**
 * Weekly Board Digest — sent Monday 9 AM to all board members.
 * Summarizes past week's activity.
 */
function weeklyBoardDigest() {
  var board = CONFIG.BOARD.filter(function(m) { return m.status === "ACTIVE" && m.email; });
  if (board.length === 0) {
    console.log("⚠ No active board members with email. Skipping digest.");
    return;
  }

  var state = getSystemState();
  var countdown = getCountdown();

  var html = '<div style="font-family:monospace; background:#0a0a0f; color:#d4d4d4; padding:20px;">';
  html += '<h1 style="color:#39FF14;">P31 LABS — WEEKLY BOARD DIGEST</h1>';
  html += '<p>Week ending: ' + new Date().toLocaleDateString() + '</p>';
  html += '<hr style="border-color:#333;">';

  // Countdown
  html += '<h2 style="color:#ff9f43;">Next Deadline: ' + countdown.days + ' days</h2>';

  // Spoon average
  html += '<p>Operator Status: ' + state.spoons + '/12 spoons</p>';

  // Entity status
  html += '<h2 style="color:#00d4ff;">Entity Status</h2>';
  html += '<p>EIN: ' + CONFIG.ENTITY.EIN + '</p>';
  html += '<p>501(c)(3): ' + CONFIG.ENTITY.STATUS + '</p>';
  html += '<p>Fiscal Sponsor: ' + CONFIG.ENTITY.FISCAL_SPONSOR + '</p>';

  // Recent activity (last 7 days from telemetry)
  html += '<h2 style="color:#39FF14;">Activity Summary</h2>';
  try {
    var ss = getMasterSheet();
    var sheet = ss.getSheetByName("Telemetry_Logs");
    if (sheet) {
      var data = sheet.getDataRange().getValues();
      var weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      var recent = data.filter(function(row) { return new Date(row[0]) >= weekAgo; });
      html += '<p>' + recent.length + ' logged activities this week.</p>';
    }
  } catch(e) {
    html += '<p>Telemetry unavailable.</p>';
  }

  html += '<hr style="border-color:#333;">';
  html += '<p style="font-size:10px; color:#666;">P31 Labs, Inc. | Automated Board Digest | Reply to will@p31ca.org</p>';
  html += '</div>';

  board.forEach(function(member) {
    try {
      MailApp.sendEmail({
        to: member.email,
        subject: "[P31] Weekly Board Digest — " + new Date().toLocaleDateString(),
        htmlBody: html
      });
      console.log("✓ Digest sent to " + member.name);
    } catch(e) {
      console.warn("⚠ Failed to send digest to " + member.name + ": " + e.message);
    }
  });

  logTelemetry("GOVERNANCE", "BOARD_DIGEST", "Sent to " + board.length + " members", "GREEN");
}

/**
 * Monthly Compliance Check — 1st of each month.
 * Checks upcoming filing deadlines and entity status.
 */
function monthlyComplianceCheck() {
  var alerts = [];
  var now = new Date();

  // Check if annual registration is due (Georgia: anniversary of formation)
  if (CONFIG.ENTITY.FORMATION_DATE && CONFIG.ENTITY.STATUS === "ACTIVE") {
    var formDate = new Date(CONFIG.ENTITY.FORMATION_DATE);
    var anniversary = new Date(formDate);
    anniversary.setFullYear(now.getFullYear());
    var daysUntilAnniversary = Math.floor((anniversary - now) / (24 * 60 * 60 * 1000));
    if (daysUntilAnniversary > 0 && daysUntilAnniversary <= 60) {
      alerts.push("⚠ Georgia Annual Registration due in " + daysUntilAnniversary + " days.");
    }
  }

  // Check EIN status
  if (CONFIG.ENTITY.EIN === "PENDING") {
    alerts.push("⚠ EIN still PENDING. File SS-4 after Articles are filed.");
  }

  // Check 501(c)(3) status
  if (CONFIG.ENTITY.STATUS === "IN_FORMATION") {
    alerts.push("⚠ 501(c)(3) status: IN_FORMATION. File Form 1023-EZ after EIN received.");
  }

  if (alerts.length > 0) {
    var body = alerts.join("\n\n");
    sendNotification("Monthly Compliance Check", "<pre>" + body + "</pre>");
    // Notify Secretary
    var secretary = CONFIG.BOARD.find(function(m) { return m.role.indexOf("Secretary") >= 0 && m.email; });
    if (secretary) {
      try {
        MailApp.sendEmail({
          to: secretary.email,
          subject: "[P31] Compliance Alert — " + alerts.length + " items",
          htmlBody: "<pre>" + body + "</pre>"
        });
      } catch(e) { console.warn("Secretary notification failed: " + e.message); }
    }
  }

  logTelemetry("GOVERNANCE", "COMPLIANCE_CHECK", alerts.length + " alerts", alerts.length > 0 ? "YELLOW" : "GREEN");
}

/**
 * Log a board resolution to the Board_Log sheet.
 */
function logBoardResolution(type, resolution, vote, filedBy) {
  try {
    var ss = getMasterSheet();
    var sheet = ss.getSheetByName("Board_Log") || createSheetTab(ss, SHEET_TABS.boardLog);
    sheet.appendRow([new Date(), type, resolution, vote, filedBy]);
    console.log("✓ Board resolution logged: " + type);
  } catch(e) {
    console.error("Board log failed: " + e.message);
  }
}
```

---

## STEP 6: NOTIFICATION UPDATE

In `sendNotification()` and ALL email functions, change subject prefix:

**Old:** `"[SIMPLEX] "`
**New:** `"[P31] "`

---

## STEP 7: CONSOLE BANNER UPDATE

In `ignite()` (formerly `simplexProtocol()`), update the startup banner:

```javascript
console.log("╔═══════════════════════════════════════════════════════════════╗");
console.log("║   P31 ENTANGLE v8.0                                        ║");
console.log("║   P31 Labs, Inc. — Georgia 501(c)(3)                       ║");
console.log("║   The Mesh Holds. 🔺                                        ║");
console.log("╚═══════════════════════════════════════════════════════════════╝");
```

---

## STEP 8: VERIFY

After applying all changes:

1. Run `runAllTests()` — should still pass 70+ assertions
2. Run `ignite()` — should create any new folders (16_BUFFER_INTERCEPTS, etc.)
3. Check triggers: should show 6 (not 4)
4. Send test `weeklyBoardDigest()` — should email Will (only active member with email)
5. Run `monthlyComplianceCheck()` — should flag EIN and 501(c)(3) as PENDING

---

## FILE MANIFEST (v8.0)

| # | File Name | Lines (est) | Role |
|---|-----------|-------------|------|
| 1 | appsscript.json | 23 | Manifest (unchanged) |
| 2 | Code.gs | ~500 | CONFIG v8, State, Architecture, Triggers, Heartbeat |
| 3 | Router.gs | 23 | Web App Entry (unchanged) |
| 4 | API.gs | 83 | ESP32 Bridge (unchanged) |
| 5 | Buffer.gs | ~170 | Communication Buffer (renamed from Tomograph.gs) |
| 6 | Medical.gs | 166 | Spoon Economy, Meds (unchanged) |
| 7 | Operations.gs | 121 | L.O.V.E. Mining (unchanged) |
| 8 | Narrative.gs | ~230 | Campaigns, Briefing, Commissions (updated email prefix) |
| 9 | Governance.gs | ~120 | **NEW:** Board digest, compliance, resolution logging |
| 10 | Security.gs | 151 | SHA-256, Sessions, Permissions (unchanged) |
| 11 | Protection.gs | 46 | Rate Limiting (unchanged) |
| 12 | Visuals.gs | 125 | Dashboard Data (unchanged) |
| 13 | Tests.gs | ~300 | Integration Tests (add governance tests) |
| 14 | index.html | 90 | Dashboard UI (update title/branding) |
| 15 | Styles.html | 82 | CSS (unchanged) |
| 16 | Client.html | 94 | Neural Link JS (update banner text) |
| 17 | Recruitment_Orders.html | ~80 | Commission Templates (v8 aligned) |

**Total: 17 files, ~2,400 lines**

---

*GENESIS_GATE v8.0 — P31 Entangle — The Mesh Holds. 🔺*
