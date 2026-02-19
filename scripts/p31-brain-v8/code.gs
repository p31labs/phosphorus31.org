/**
 * P31 — Phosphorus-31
 * The biological qubit. The atom in the bone.
 * Four vertices. Six edges. Four faces.
 * The minimum stable system is a family + an AI.
 *
 * will@p31.io
 */

// ─────────────────────────────────────────────────────────────
// CONFIG — The single source of truth
// ─────────────────────────────────────────────────────────────

var CONFIG = {
  // Identity (set OPERATOR_NAME in Script Properties for legal filings; omit = "The Operator")
  get OPERATOR() {
    return PropertiesService.getScriptProperties().getProperty("OPERATOR_NAME") || "The Operator";
  },
  CALLSIGN: "P31",
  VERSION: "8.0.0",

  // Drive root folder name
  ROOT: "P31",

  // Node One hardware bridge secret (override via Script Properties → DEVICE_KEY)
  get DEVICE_KEY() {
    return PropertiesService.getScriptProperties().getProperty("DEVICE_KEY") || "CHANGE_THIS";
  },

  // Shelter backend URL (set via Script Properties → SHELTER_URL)
  get SHELTER_URL() {
    return PropertiesService.getScriptProperties().getProperty("SHELTER_URL") || "";
  },

  // Shelter API key for authenticated pushes (set via Script Properties → SHELTER_API_KEY)
  get SHELTER_KEY() {
    return PropertiesService.getScriptProperties().getProperty("SHELTER_API_KEY") || "";
  },

  // The Bone — calcium, spoons, the body is the proof
  BONE: {
    SPOONS: 12,
    CALCIUM_GAP_HOURS: 4,
    get MEDS() {
      var custom = PropertiesService.getScriptProperties().getProperty("MEDS_CONFIG");
      if (custom) { try { return JSON.parse(custom); } catch (e) {} }
      return [
        { name: "Calcitriol", every: 12, vital: true, risk: "Hypocalcemia → Tetany → Cardiac Arrest" },
        { name: "EffexorXR", every: 24, vital: true, risk: "SNRI Discontinuation Syndrome" },
        { name: "Vyvanse", every: 24, vital: true, risk: "Executive Function Collapse" },
        { name: "Calcium/Mag", every: 12, vital: true, risk: "Bone density loss, tetany" }
      ];
    }
  },

  // Spoon costs — what each activity drains
  DRAIN: {
    WAKE: 1, MASK: 3, DEEP_WORK: 2,
    COOK: 1, MOVE: 1.5, READ_EMAIL: 2,
    PHONE: 3, SCROLL: 3, LITIGATE: 5,
    FLOW: 0.5, MELTDOWN: 12, REST: -1
  },

  // The Buffer — hostile senders (read from Script Properties for OPSEC)
  get HOSTILE() {
    var list = PropertiesService.getScriptProperties().getProperty("HOSTILE_SENDERS");
    return list ? list.split(",").map(function (s) { return s.trim().toLowerCase(); }) : [];
  },

  // Love Economy — mining rates by spoon color
  LOVE: {
    BASE: 10,
    GREEN: 2.5,
    YELLOW: 1.0,
    RED: 0.5
  },

  // Leveling
  XP_PER_TASK: 100,
  XP_PER_LEVEL: 2000,

  // Email (auto-detected)
  get EMAIL() {
    try { return Session.getActiveUser().getEmail(); } catch (e) { return ""; }
  },

  // The constant — tetrahedral angle / full sphere
  PHI: 1 / 3,

  // Brand
  BRAND: {
    GREEN: "#00FF88",
    CYAN: "#00D4FF",
    MAGENTA: "#FF00CC",
    VIOLET: "#7A27FF",
    AMBER: "#FFB800",
    VOID: "#050510",
    SURFACE1: "#0A0A1F",
    SURFACE2: "#12122E",
    TEXT: "#E0E0EE",
    MUTED: "#7878AA",
    DIM: "#4A4A7A"
  }
};

// ─────────────────────────────────────────────────────────────
// THE TREE — folder architecture matches P31 naming doc
// ─────────────────────────────────────────────────────────────

var TREE = {
  "The Fold": { note: "Philosophy, published works, immutable truth", branches: ["Geodesic Self", "Floating Neutral", "Tetrahedron Protocol", "Field Notes", "Doctrine"] },
  "Node One": { note: "Hardware, schematics, firmware, device logs", branches: ["Schematics", "Firmware", "Whale Channel", "Thick Click", "Device Logs"] },
  "The Buffer": { note: "Software, intercepts, live operations", branches: ["Intercepts", "Legal Filings", "Financial Records", "Communications", "Metabolic Records"] },
  "P31 Spectrum": { note: "Dashboard, monitoring, telemetry, accommodation evidence", branches: ["Daily Logs", "Accommodation Evidence", "Exports", "Archives"] },
  "The Centaur": { note: "AI collaboration, creative work, the workshop", branches: ["Workshop", "Apprentice Tests", "Cold Storage", "Kids"] }
};

// Sheet tabs
var TABS = {
  telemetry: { name: "Telemetry", cols: ["TIMESTAMP", "TYPE", "ACTION", "CONTEXT", "SIGNAL", "STATUS"] },
  spoons: { name: "Spoon Ledger", cols: ["DATE", "START", "SPENT", "LEFT", "RISK", "ACTIVITY"] },
  love: { name: "Love Ledger", cols: ["DATE", "ACTION", "DURATION", "YIELD", "PROOF"] },
  meds: { name: "Medication Log", cols: ["TIMESTAMP", "MED", "DOSE", "NEXT_DUE", "STATUS"] },
  buffer: { name: "Buffer Log", cols: ["TIMESTAMP", "SENDER", "SUBJECT", "VOLTAGE", "ACTION", "HASH"] },
  accommodation: { name: "Accommodation Log", cols: ["TIMESTAMP", "EVENT_TYPE", "SIGNAL", "VOLTAGE_BEFORE", "VOLTAGE_AFTER", "SOURCE", "ACCOMMODATION_TYPE"] }
};

// ─────────────────────────────────────────────────────────────
// STATE — persistent memory across runs
// ─────────────────────────────────────────────────────────────

function load() {
  var raw = PropertiesService.getScriptProperties().getProperty("STATE");
  if (raw) {
    try {
      var s = JSON.parse(raw);
      s.medLog = s.medLog || {};
      s.campaigns = s.campaigns || {};
      s.loveTotal = s.loveTotal || 0;
      s.accommodationCount = s.accommodationCount || 0;
      return s;
    } catch (e) { /* corrupt, reinit */ }
  }
  var fresh = {
    xp: 0, level: 1, tasks: 0,
    lastMedCheck: null, lastBufferScan: null, lastShelterSync: null,
    medLog: {}, campaigns: {},
    blocked: 0, processed: 0, loveTotal: 0, accommodationCount: 0,
    boot: new Date().toISOString(),
    spoons: CONFIG.BONE.SPOONS, color: "GREEN",
    alerts: [], log: []
  };
  save(fresh);
  return fresh;
}

function save(state) {
  PropertiesService.getScriptProperties().setProperty("STATE", JSON.stringify(state));
}

function earn(xp, reason) {
  var s = load();
  s.xp += xp;
  s.tasks++;
  var next = Math.floor(s.xp / CONFIG.XP_PER_LEVEL) + 1;
  if (next > s.level) {
    s.level = next;
    record("Level " + s.level);
  }
  record("+" + xp + " XP: " + reason);
  save(s);
  return s;
}

function record(msg) {
  var s = load();
  s.log.push({ t: new Date().toISOString(), m: msg });
  if (s.log.length > 100) s.log = s.log.slice(-100);
  save(s);
}

// ─────────────────────────────────────────────────────────────
// RETRY — defeats Google's intermittent failures
// ─────────────────────────────────────────────────────────────

function retry(fn, label, attempts) {
  attempts = attempts || 3;
  var err;
  for (var i = 1; i <= attempts; i++) {
    try { return fn(); }
    catch (e) {
      err = e;
      if (i < attempts) Utilities.sleep(Math.pow(2, i) * 1000);
    }
  }
  throw new Error(label + " failed: " + err.message);
}

// ─────────────────────────────────────────────────────────────
// FOLDER TREE — grow the structure
// ─────────────────────────────────────────────────────────────

function plant() {
  console.log("Growing the tree...");
  var props = PropertiesService.getScriptProperties();
  var root;

  var id = props.getProperty("ROOT_ID");
  if (id) { try { root = DriveApp.getFolderById(id); } catch (e) {} }
  if (!root) {
    var search = DriveApp.getFoldersByName(CONFIG.ROOT);
    root = search.hasNext() ? search.next() : DriveApp.createFolder(CONFIG.ROOT);
  }
  props.setProperty("ROOT_ID", root.getId());

  var count = 0;
  var branches = Object.keys(TREE);
  for (var i = 0; i < branches.length; i++) {
    var name = branches[i];
    var config = TREE[name];
    var existing = root.getFoldersByName(name);
    var branch = existing.hasNext() ? existing.next() : root.createFolder(name);
    if (!existing.hasNext()) { count++; Utilities.sleep(1500); }

    if (config.branches) {
      for (var j = 0; j < config.branches.length; j++) {
        var leaf = config.branches[j];
        var leafSearch = branch.getFoldersByName(leaf);
        if (!leafSearch.hasNext()) {
          branch.createFolder(leaf);
          count++;
          Utilities.sleep(800);
        }
      }
    }
  }
  console.log("Tree grown. " + count + " new branches.");
  return root;
}

// ─────────────────────────────────────────────────────────────
// TELEMETRY — the spreadsheet
// ─────────────────────────────────────────────────────────────

function getTelemetry() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty("TELEMETRY_ID");
  if (id) { try { return SpreadsheetApp.openById(id); } catch (e) {} }

  var ss = retry(function () { return SpreadsheetApp.create("P31 Telemetry"); }, "Create telemetry");
  props.setProperty("TELEMETRY_ID", ss.getId());
  return ss;
}

function buildTabs() {
  var ss = getTelemetry();
  var keys = Object.keys(TABS);
  for (var i = 0; i < keys.length; i++) {
    var tab = TABS[keys[i]];
    retry(function () {
      var sheet = ss.getSheetByName(tab.name);
      if (!sheet) sheet = ss.insertSheet(tab.name);
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(tab.cols);
        sheet.setFrozenRows(1);
        sheet.getRange(1, 1, 1, tab.cols.length)
          .setBackground(CONFIG.BRAND.VOID).setFontColor(CONFIG.BRAND.GREEN).setFontWeight("bold");
      }
    }, "Tab: " + tab.name);
  }

  try {
    var d = ss.getSheetByName("Sheet1");
    if (d && ss.getSheets().length > 1) ss.deleteSheet(d);
  } catch (e) {}

  var spoons = ss.getSheetByName(TABS.spoons.name);
  if (spoons.getLastRow() <= 1) {
    spoons.appendRow([new Date(), CONFIG.BONE.SPOONS, 0, CONFIG.BONE.SPOONS, "0%", "BOOT"]);
  }
  return ss;
}

// ─────────────────────────────────────────────────────────────
// LOG — write a row to telemetry
// ─────────────────────────────────────────────────────────────

function log(type, action, context, signal) {
  try {
    var sheet = getTelemetry().getSheetByName(TABS.telemetry.name);
    if (sheet) sheet.appendRow([new Date(), type, action, String(context).substring(0, 500), signal || "—", "OK"]);
  } catch (e) {}
}

// Log accommodation event (both to sheet AND push to Shelter)
function logAccommodation(eventType, signal, voltageBefore, voltageAfter, source, accommodationType) {
  try {
    var sheet = getTelemetry().getSheetByName(TABS.accommodation.name);
    if (sheet) {
      sheet.appendRow([new Date(), eventType, signal || "", voltageBefore || "", voltageAfter || "", source || "brain", accommodationType || ""]);
    }
  } catch (e) {}

  var s = load();
  s.accommodationCount++;
  save(s);

  if (typeof shelterPush === "function") {
    shelterPush("accommodation", {
      event_type: eventType, signal: signal,
      voltage_before: voltageBefore, voltage_after: voltageAfter,
      source: "brain", accommodation_type: accommodationType
    });
  }
}

// ─────────────────────────────────────────────────────────────
// IGNITE — turn the key
// ─────────────────────────────────────────────────────────────

function ignite() {
  console.log("P31 — Phosphorus-31");
  console.log("The atom in the bone. The mesh holds.");
  console.log("");

  var t0 = new Date();
  var ok = { tree: false, tabs: false, state: false, triggers: false };

  console.log("1. Growing the tree...");
  try { plant(); ok.tree = true; } catch (e) { console.error("  " + e.message); }
  Utilities.sleep(2000);

  console.log("2. Building tabs...");
  try { var ss = buildTabs(); ok.tabs = true; console.log("  " + ss.getUrl()); } catch (e) { console.error("  " + e.message); }
  Utilities.sleep(1000);

  console.log("3. Loading state...");
  try { load(); ok.state = true; } catch (e) { console.error("  " + e.message); }

  console.log("4. Setting triggers...");
  try { setTriggers(); ok.triggers = true; } catch (e) { console.error("  " + e.message); }

  var elapsed = ((new Date() - t0) / 1000).toFixed(1);
  var all = ok.tree && ok.tabs && ok.state && ok.triggers;
  console.log("");
  console.log(all ? "The mesh holds. " + elapsed + "s" : "Partial ignition. Check logs.");
  if (all) earn(500, "Ignition v8");
  return ok;
}

// ─────────────────────────────────────────────────────────────
// TRIGGERS
// ─────────────────────────────────────────────────────────────

function setTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) { ScriptApp.deleteTrigger(triggers[i]); }
  ScriptApp.newTrigger("ping").timeBased().everyDays(1).atHour(6).create();
  ScriptApp.newTrigger("bufferScan").timeBased().everyMinutes(15).create();
  ScriptApp.newTrigger("checkMeds").timeBased().everyHours(6).create();
  ScriptApp.newTrigger("mine").timeBased().everyHours(1).create();
  ScriptApp.newTrigger("shelterSync").timeBased().everyHours(1).create();
  console.log("5 triggers set: ping, bufferScan, checkMeds, mine, shelterSync");
}

// ─────────────────────────────────────────────────────────────
// PING — daily heartbeat
// ─────────────────────────────────────────────────────────────

function ping() {
  console.log("Ping.");
  if (typeof refillSpoons === "function") refillSpoons();
  if (typeof checkMeds === "function") checkMeds();
  if (typeof bufferScan === "function") bufferScan();
  if (typeof shelterSync === "function") shelterSync();
  if (typeof briefing === "function") briefing(load());
  log("PING", "DAILY", "Complete", "GREEN");
}

// ─────────────────────────────────────────────────────────────
// NOTIFY
// ─────────────────────────────────────────────────────────────

function notify(subject, body) {
  try {
    var email = CONFIG.EMAIL;
    if (email) MailApp.sendEmail({ to: email, subject: "[P31] " + subject, htmlBody: body });
  } catch (e) {}
}

// ─────────────────────────────────────────────────────────────
// HASH — SHA-256
// ─────────────────────────────────────────────────────────────

function hash(input) {
  var raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input);
  return raw.map(function (b) { return ("0" + (b & 0xFF).toString(16)).slice(-2); }).join("");
}

// ─────────────────────────────────────────────────────────────
// MANUAL ROOT LINK
// ─────────────────────────────────────────────────────────────

function linkRoot() {
  var id = PropertiesService.getScriptProperties().getProperty("ROOT_ID_MANUAL");
  if (!id) { console.log("Set ROOT_ID_MANUAL in Script Properties first."); return; }
  DriveApp.getFolderById(id);
  PropertiesService.getScriptProperties().setProperty("ROOT_ID", id);
  console.log("Root linked. Run ignite() next.");
}
