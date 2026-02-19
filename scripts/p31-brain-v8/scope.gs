/**
 * P31 — P31 Spectrum
 * Data aggregator for the dashboard.
 * This is the ONE function the frontend calls.
 */

function scope() {
  var s = load();
  var pct = Math.round((s.spoons / CONFIG.BONE.SPOONS) * 100);
  var color = s.color;

  var now = new Date();
  var meds = CONFIG.BONE.MEDS.map(function (med) {
    var lastStr = s.medLog[med.name];
    var last = lastStr ? new Date(lastStr) : null;
    var overdue = !last || (now - last) > med.every * 3600000;
    var lastTaken = last ? timeSince(last) : "never";
    return {
      name: med.name,
      every: med.every,
      vital: med.vital,
      risk: med.risk,
      overdue: overdue,
      lastTaken: lastTaken
    };
  });

  var mesh = {
    vertices: {
      operator: { status: s.spoons > 0 ? "UP" : "DOWN", note: s.spoons + " spoons" },
      shelter: { status: s.shelterStatus && s.shelterStatus.status === "ok" ? "UP" : "SEPARATED", note: s.lastShelterSync ? timeSince(new Date(s.lastShelterSync)) : "no sync" },
      sprout: { status: (s.recentSproutSignals && s.recentSproutSignals.length > 0) ? "UP" : "SEPARATED", note: s.recentSproutSignals ? s.recentSproutSignals.length + " signals/24h" : "quiet" },
      centaur: { status: "UP", note: "v" + CONFIG.VERSION }
    },
    stability: calculateMeshStability_(s),
    capacity: pct + "% spoons"
  };

  var recent = (s.log || []).slice(-8).reverse();

  var love = {
    total: s.loveTotal,
    blocked: s.blocked
  };

  var campaigns = [];
  var names = Object.keys(s.campaigns || {});
  for (var i = 0; i < names.length; i++) {
    if (s.campaigns[names[i]].status === "ACTIVE") {
      campaigns.push({ name: names[i], xp: s.campaigns[names[i]].xpEarned || 0 });
    }
  }

  var sproutSummary = null;
  if (s.recentSproutSignals && s.recentSproutSignals.length > 0) {
    var lastSignal = s.recentSproutSignals[0];
    var helpCount = 0;
    for (var h = 0; h < s.recentSproutSignals.length; h++) {
      if (s.recentSproutSignals[h].signal === "help") helpCount++;
    }
    sproutSummary = {
      last: lastSignal.signal,
      time: lastSignal.timestamp,
      count24h: s.recentSproutSignals.length,
      helpCount: helpCount
    };
  }

  return {
    spoons: { current: s.spoons, max: CONFIG.BONE.SPOONS, pct: pct, color: color },
    signal: {
      level: s.level,
      xp: s.xp,
      xpPct: Math.round((s.xp % CONFIG.XP_PER_LEVEL) / CONFIG.XP_PER_LEVEL * 100)
    },
    love: love,
    meds: meds,
    mesh: mesh,
    recent: recent,
    campaigns: campaigns,
    sprout: sproutSummary,
    accommodationCount: s.accommodationCount,
    state: { version: CONFIG.VERSION, boot: s.boot },
    timestamp: new Date().toISOString()
  };
}

function calculateMeshStability_(s) {
  var vertices = 4;
  var active = 1;
  if (s.shelterStatus && s.shelterStatus.status === "ok") active++;
  if (s.recentSproutSignals && s.recentSproutSignals.length > 0) active++;
  active++;

  var ratio = active / vertices;
  if (ratio >= 0.75) return "RIGID";
  if (ratio >= 0.5) return "DEGRADED";
  return "CRITICAL";
}

function timeSince(date) {
  var sec = Math.floor((new Date() - date) / 1000);
  if (sec < 60) return sec + "s ago";
  if (sec < 3600) return Math.floor(sec / 60) + "m ago";
  if (sec < 86400) return Math.floor(sec / 3600) + "h ago";
  return Math.floor(sec / 86400) + "d ago";
}
