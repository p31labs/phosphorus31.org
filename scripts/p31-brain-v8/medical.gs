/**
 * P31 — Medical / spoons
 * drainSpoons, refillSpoons, triggerMeltdown.
 * Each pushes brain state to Shelter so the game engine respects the body.
 */

function drainSpoons(cost, activity) {
  var s = load();
  s.spoons = Math.max(0, s.spoons - cost);

  var pct = s.spoons / CONFIG.BONE.SPOONS;
  if (pct > 0.5) s.color = "GREEN";
  else if (pct > 0.2) s.color = "YELLOW";
  else s.color = "RED";

  save(s);

  try {
    var sheet = getTelemetry().getSheetByName(TABS.spoons.name);
    if (sheet) {
      var risk = Math.round((1 - pct) * 100) + "%";
      sheet.appendRow([new Date(), CONFIG.BONE.SPOONS, cost, s.spoons, risk, activity || "unknown"]);
    }
  } catch (e) {}

  if (typeof pushBrainState === "function") pushBrainState();

  if (s.color === "RED" && s.spoons <= 0) {
    triggerMeltdown();
  }

  if (typeof logAccommodation === "function") {
    logAccommodation("spoon_drain", null, (s.spoons + cost).toString(), s.spoons.toString(), activity, "sensory_regulation");
  }
}

function refillSpoons() {
  var s = load();
  s.spoons = CONFIG.BONE.SPOONS;
  s.color = "GREEN";
  save(s);

  try {
    var sheet = getTelemetry().getSheetByName(TABS.spoons.name);
    if (sheet) {
      sheet.appendRow([new Date(), CONFIG.BONE.SPOONS, 0, CONFIG.BONE.SPOONS, "0%", "DAILY_REFILL"]);
    }
  } catch (e) {}

  if (typeof pushBrainState === "function") pushBrainState();

  record("Spoons refilled to " + CONFIG.BONE.SPOONS);
}

function triggerMeltdown() {
  var s = load();
  s.spoons = 0;
  s.color = "RED";
  save(s);

  if (typeof pushBrainState === "function") pushBrainState();

  if (typeof logAccommodation === "function") {
    logAccommodation("meltdown", null, "0", "0", "brain", "crisis_protocol");
  }
  if (typeof notify === "function") {
    notify("MELTDOWN PROTOCOL", "Spoons depleted. All systems in rest mode.");
  }
  record("MELTDOWN — spoons at 0");
}
