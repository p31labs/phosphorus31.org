/**
 * P31 — The Bone
 * Calcium. Spoons. Medication. The body is the proof.
 * Every name traces back to calcium if you pull the thread.
 */

// ─────────────────────────────────────────────────────────────
// SPOON ECONOMY
// ─────────────────────────────────────────────────────────────

function refillSpoons() {
  var s = load();
  s.spoons = CONFIG.BONE.SPOONS;
  s.color = "GREEN";
  save(s);
  log("BONE", "REFILL", CONFIG.BONE.SPOONS + " spoons", "GREEN");

  // Log to spreadsheet
  try {
    var sheet = getTelemetry().getSheetByName(TABS.spoons.name);
    if (sheet) sheet.appendRow([new Date(), CONFIG.BONE.SPOONS, 0, CONFIG.BONE.SPOONS, "0%", "DAILY_REFILL"]);
  } catch(e) {}
}

function drainSpoons(cost, activity) {
  var s = load();
  s.spoons = Math.max(0, s.spoons - cost);

  // Update color
  var pct = s.spoons / CONFIG.BONE.SPOONS;
  if (pct > 0.5)      s.color = "GREEN";
  else if (pct > 0.2) s.color = "YELLOW";
  else                 s.color = "RED";

  save(s);

  // Log to spreadsheet
  try {
    var sheet = getTelemetry().getSheetByName(TABS.spoons.name);
    if (sheet) {
      var risk = Math.round((1 - pct) * 100) + "%";
      sheet.appendRow([new Date(), s.spoons + cost, cost, s.spoons, risk, activity]);
    }
  } catch(e) {}

  // Safe mode
  if (s.spoons <= CONFIG.BONE.SPOONS * 0.15) {
    notify("Low spoons: " + s.spoons,
      "<p>You're at <b>" + s.spoons + " spoons</b>. Safe mode.</p>" +
      "<p>Stop. Rest. Calcium. Water. Dark room if needed.</p>" +
      "<p>Nothing on today's list matters more than tomorrow's capacity.</p>"
    );
    log("BONE", "SAFE_MODE", s.spoons + " spoons remaining", "RED");
  }

  return s;
}

function triggerMeltdown() {
  var s = load();
  s.spoons = 0;
  s.color = "RED";
  save(s);

  notify("Meltdown Protocol",
    "<p>Spoons: <b>0</b>. Full shutdown.</p>" +
    "<p>1. Stop all inputs. Close screens.</p>" +
    "<p>2. Dark room. Weighted blanket. No talking.</p>" +
    "<p>3. Calcium supplement if not taken in last 4 hours.</p>" +
    "<p>4. Set timer for 30 minutes. Nothing until it rings.</p>" +
    "<p>5. When ready: one thing. The smallest thing. Just one.</p>"
  );

  log("BONE", "MELTDOWN", "Full shutdown", "RED");
}

// ─────────────────────────────────────────────────────────────
// MEDICATION TRACKING
// ─────────────────────────────────────────────────────────────

function checkMeds() {
  var s = load();
  var now = new Date();
  var overdue = [];

  for (var i = 0; i < CONFIG.BONE.MEDS.length; i++) {
    var med = CONFIG.BONE.MEDS[i];
    var lastStr = s.medLog[med.name];
    var last = lastStr ? new Date(lastStr) : null;

    if (!last || (now - last) > med.every * 3600000) {
      overdue.push(med);
    }
  }

  if (overdue.length === 0) return;

  // Calcium/Vyvanse gap check
  var calciumLast = s.medLog["Calcium/Mag"] ? new Date(s.medLog["Calcium/Mag"]) : null;
  var vyvanseLast = s.medLog["Vyvanse"] ? new Date(s.medLog["Vyvanse"]) : null;
  var gapWarning = "";

  if (calciumLast && vyvanseLast) {
    var gap = Math.abs(calciumLast - vyvanseLast) / 3600000;
    if (gap < CONFIG.BONE.CALCIUM_GAP_HOURS) {
      gapWarning = "<p style='color:#ff6b6b'><b>Gap warning:</b> Calcium and Vyvanse taken " +
        gap.toFixed(1) + "h apart. Need " + CONFIG.BONE.CALCIUM_GAP_HOURS + "h minimum for absorption.</p>";
    }
  }

  var lines = overdue.map(function(m) {
    return "<li><b>" + m.name + "</b> — Risk: " + m.risk + "</li>";
  });

  notify("Meds overdue: " + overdue.length,
    "<p>The following are overdue:</p><ul>" + lines.join("") + "</ul>" + gapWarning +
    "<p>Take them now. The bone doesn't wait.</p>"
  );

  log("BONE", "MEDS_OVERDUE", overdue.map(function(m){return m.name;}).join(", "), "RED");
}

function logMed(medName) {
  var s = load();
  s.medLog[medName] = new Date().toISOString();
  save(s);

  try {
    var sheet = getTelemetry().getSheetByName(TABS.meds.name);
    if (sheet) {
      var med = CONFIG.BONE.MEDS.find(function(m) { return m.name === medName; });
      var nextDue = med ? new Date(Date.now() + med.every * 3600000).toISOString() : "—";
      sheet.appendRow([new Date(), medName, "Standard", nextDue, "Taken"]);
    }
  } catch(e) {}

  log("BONE", "MED_TAKEN", medName, "GREEN");
}