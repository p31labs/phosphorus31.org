/**
 * P31 — Shelter Bridge
 * Bidirectional sync between the Brain (GAS) and the Body (Shelter API).
 * GAS pushes: spoon state, buffer intercepts, accommodation events, med status.
 * GAS pulls: Sprout signals, message stats, accommodation summary.
 */

// ─────────────────────────────────────────────────────────────
// PUSH — send data TO Shelter
// ─────────────────────────────────────────────────────────────

function shelterPush(type, data) {
  var url = CONFIG.SHELTER_URL;
  if (!url) return;

  try {
    var payload = {
      type: "brain:" + type,
      data: data,
      timestamp: new Date().toISOString(),
      source: "gas"
    };

    UrlFetchApp.fetch(url + "/brain/sync", {
      method: "post",
      contentType: "application/json",
      headers: { "X-P31-Key": CONFIG.SHELTER_KEY },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
  } catch (e) {
    // Silent fail — Shelter may not be up yet.
  }
}

// ─────────────────────────────────────────────────────────────
// PULL — fetch data FROM Shelter
// ─────────────────────────────────────────────────────────────

function shelterPull(endpoint) {
  var url = CONFIG.SHELTER_URL;
  if (!url) return null;

  try {
    var res = UrlFetchApp.fetch(url + endpoint, {
      method: "get",
      headers: { "X-P31-Key": CONFIG.SHELTER_KEY },
      muteHttpExceptions: true
    });

    if (res.getResponseCode() === 200) {
      return JSON.parse(res.getContentText());
    }
  } catch (e) {}
  return null;
}

// ─────────────────────────────────────────────────────────────
// PUSH SPOON STATE — feeds the game engine's metabolism gate
// Called by shelterSync(), drainSpoons(), refillSpoons(), triggerMeltdown()
// ─────────────────────────────────────────────────────────────

function pushBrainState() {
  var url = CONFIG.SHELTER_URL;
  if (!url) return;

  var s = load();

  try {
    UrlFetchApp.fetch(url + "/api/game/brain/state", {
      method: "post",
      contentType: "application/json",
      headers: { "X-P31-Key": CONFIG.SHELTER_KEY },
      payload: JSON.stringify({
        spoons: s.spoons,
        maxSpoons: CONFIG.BONE.SPOONS,
        color: s.color
      }),
      muteHttpExceptions: true
    });
  } catch (e) {
    // Silent fail. Shelter may be down. GAS keeps running independently.
  }
}

// ─────────────────────────────────────────────────────────────
// SYNC — hourly bidirectional sync
// ─────────────────────────────────────────────────────────────

function shelterSync() {
  var s = load();
  var url = CONFIG.SHELTER_URL;
  if (!url) return;

  shelterPush("state", {
    spoons: s.spoons,
    maxSpoons: CONFIG.BONE.SPOONS,
    color: s.color,
    level: s.level,
    xp: s.xp,
    loveTotal: s.loveTotal,
    blocked: s.blocked,
    accommodationCount: s.accommodationCount,
    lastMedCheck: s.lastMedCheck,
    medLog: s.medLog
  });

  pushBrainState();

  var health = shelterPull("/health");
  if (health) {
    record("Shelter: " + (health.status === "ok" ? "UP" : "DOWN") +
      " · " + (health.websocket ? health.websocket.connections + " connected" : ""));
    s.lastShelterSync = new Date().toISOString();
    s.shelterStatus = health;
    save(s);
  }

  var from = new Date(Date.now() - 86400000).toISOString();
  var signals = shelterPull("/accommodation-log?from=" + from + "&type=sprout_signal&limit=50");
  if (signals && signals.length > 0) {
    s.recentSproutSignals = Array.isArray(signals) ? signals : (signals.events || signals.items || []);
    save(s);
  }
}

// ─────────────────────────────────────────────────────────────
// SHELTER HEALTH CHECK — for the morning briefing
// ─────────────────────────────────────────────────────────────

function getShelterStatus() {
  var s = load();
  if (s.shelterStatus) return s.shelterStatus;

  var health = shelterPull("/health");
  return health || { status: "disconnected" };
}
