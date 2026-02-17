/**
 * P31 — Love Economy + Operations
 * L.O.V.E. token mining. Yield scales with spoon color.
 */

function mine() {
  var s = load();
  var multiplier = CONFIG.LOVE.GREEN;
  if (s.color === "YELLOW") multiplier = CONFIG.LOVE.YELLOW;
  if (s.color === "RED") multiplier = CONFIG.LOVE.RED;

  var bonus = 0;
  var recentLog = s.log.slice(-10);
  for (var i = 0; i < recentLog.length; i++) {
    var msg = recentLog[i].m.toLowerCase();
    if (msg.indexOf("flow") >= 0 || msg.indexOf("deep_work") >= 0) bonus += 5;
    if (msg.indexOf("med_taken") >= 0) bonus += 2;
    if (msg.indexOf("task") >= 0) bonus += 3;
  }

  var yield_ = Math.round((CONFIG.LOVE.BASE + bonus) * multiplier);
  s.loveTotal += yield_;
  save(s);

  try {
    var sheet = getTelemetry().getSheetByName(TABS.love.name);
    if (sheet) {
      sheet.appendRow([new Date(), "MINE_CYCLE", "1h", yield_, hash(new Date().toISOString() + yield_)]);
    }
  } catch (e) {}

  if (yield_ > CONFIG.LOVE.BASE * CONFIG.LOVE.GREEN) {
    log("LOVE", "BONUS_YIELD", yield_ + " tokens (color: " + s.color + ")", "GREEN");
  }
}

function ingest(text) {
  if (!text || text.trim().length === 0) return { status: "empty" };

  record("Ingested: " + text.substring(0, 100));
  earn(CONFIG.XP_PER_TASK, "Chaos ingested");
  if (typeof drainSpoons === "function") drainSpoons(CONFIG.DRAIN.DEEP_WORK, "CHAOS_INGESTION");

  log("LOVE", "INGEST", text.substring(0, 200), "GREEN");

  return {
    status: "ingested",
    xp: CONFIG.XP_PER_TASK,
    spoons: load().spoons,
    echo: text.substring(0, 50)
  };
}
