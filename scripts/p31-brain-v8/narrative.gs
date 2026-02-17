/**
 * P31 — Narrative
 * Daily briefing. Campaign tracking.
 * Integrated with Shelter status + Sprout signals.
 */

function startCampaign(name, desc) {
  var s = load();
  s.campaigns[name] = { started: new Date().toISOString(), description: desc || "", xpEarned: 0, status: "ACTIVE" };
  save(s);
  record("Campaign started: " + name);
  return s.campaigns[name];
}

function advanceCampaign(name, xp, note) {
  var s = load();
  if (!s.campaigns[name]) return null;
  s.campaigns[name].xpEarned += (xp || CONFIG.XP_PER_TASK);
  s.campaigns[name].lastAdvance = new Date().toISOString();
  if (note) s.campaigns[name].lastNote = note;
  save(s);
  earn(xp || CONFIG.XP_PER_TASK, name + ": " + (note || "advanced"));
  return s.campaigns[name];
}

function completeCampaign(name) {
  var s = load();
  if (!s.campaigns[name]) return null;
  s.campaigns[name].status = "COMPLETE";
  s.campaigns[name].completed = new Date().toISOString();
  save(s);
  earn(500, "Campaign complete: " + name);
  return s.campaigns[name];
}

function briefing(s) {
  var B = CONFIG.BRAND;
  var pct = Math.round((s.spoons / CONFIG.BONE.SPOONS) * 100);
  var color = s.color === "GREEN" ? B.GREEN : s.color === "YELLOW" ? B.AMBER : B.MAGENTA;

  var campaignList = "";
  var names = Object.keys(s.campaigns || {});
  var active = [];
  for (var n = 0; n < names.length; n++) {
    if (s.campaigns[names[n]].status === "ACTIVE") active.push(names[n]);
  }
  if (active.length > 0) {
    var items = [];
    for (var a = 0; a < active.length; a++) {
      items.push("<li><b>" + active[a] + "</b> — " + (s.campaigns[active[a]].xpEarned || 0) + " XP</li>");
    }
    campaignList = "<h3 style='color:" + B.GREEN + "'>Active Campaigns</h3><ul>" + items.join("") + "</ul>";
  }

  var shelterLine = "";
  var shelter = getShelterStatus();
  if (shelter.status === "ok") {
    shelterLine = "<div style='color:" + B.GREEN + "'>✓ Shelter UP — " +
      (shelter.websocket ? shelter.websocket.connections + " connections" : "") + "</div>";
  } else if (shelter.status === "disconnected") {
    shelterLine = "<div style='color:" + B.MUTED + "'>○ Shelter not configured</div>";
  } else {
    shelterLine = "<div style='color:" + B.MAGENTA + "'>✗ Shelter DOWN</div>";
  }

  var sproutLine = "";
  if (s.recentSproutSignals && s.recentSproutSignals.length > 0) {
    var helpCount = 0;
    for (var i = 0; i < s.recentSproutSignals.length; i++) {
      if (s.recentSproutSignals[i].signal === "help") helpCount++;
    }
    sproutLine = "<div style='color:" + B.CYAN + "'>Sprout: " + s.recentSproutSignals.length +
      " signals/24h" + (helpCount > 0 ? " (" + helpCount + " help)" : "") + "</div>";
  }

  var recentLog = (s.log || []).slice(-5).reverse();
  var logItems = [];
  for (var j = 0; j < recentLog.length; j++) {
    logItems.push("<li style='color:" + B.MUTED + "'>" + recentLog[j].m + "</li>");
  }
  var recentLogHtml = logItems.length > 0 ? "<h3 style='color:" + B.MUTED + "'>Recent</h3><ul style='list-style:none;padding:0'>" + logItems.join("") + "</ul>" : "";

  var html =
    "<div style='background:" + B.VOID + ";color:" + B.TEXT + ";padding:24px;font-family:monospace;max-width:600px'>" +
      "<h1 style='color:" + B.GREEN + ";margin:0;letter-spacing:2px;font-size:24px'>P³¹</h1>" +
      "<p style='color:" + B.DIM + ";margin:4px 0 20px;font-size:10px;letter-spacing:3px'>PROTECTING FUTURE MINDS — DAILY BRIEFING</p>" +

      "<div style='display:flex;gap:20px;margin:16px 0'>" +
        "<div style='text-align:center'>" +
          "<div style='font-size:32px;color:" + color + "'>" + s.spoons + "/" + CONFIG.BONE.SPOONS + "</div>" +
          "<div style='color:" + B.DIM + ";font-size:10px;letter-spacing:1px'>SPOONS</div>" +
        "</div>" +
        "<div style='text-align:center'>" +
          "<div style='font-size:32px;color:" + B.GREEN + "'>" + s.level + "</div>" +
          "<div style='color:" + B.DIM + ";font-size:10px;letter-spacing:1px'>LEVEL</div>" +
        "</div>" +
        "<div style='text-align:center'>" +
          "<div style='font-size:32px;color:" + B.AMBER + "'>" + s.loveTotal + "</div>" +
          "<div style='color:" + B.DIM + ";font-size:10px;letter-spacing:1px'>LOVE</div>" +
        "</div>" +
        "<div style='text-align:center'>" +
          "<div style='font-size:32px;color:" + B.MAGENTA + "'>" + s.blocked + "</div>" +
          "<div style='color:" + B.DIM + ";font-size:10px;letter-spacing:1px'>BUFFERED</div>" +
        "</div>" +
      "</div>" +

      "<div style='background:" + B.SURFACE1 + ";padding:12px;border-left:3px solid " + B.GREEN + ";margin:16px 0'>" +
        shelterLine + sproutLine +
      "</div>" +

      campaignList +

      recentLogHtml +

      "<p style='color:" + B.DIM + ";font-size:9px;margin-top:24px;letter-spacing:2px'>" +
        "phosphorus31.org · The mesh holds. 🔺</p>" +
    "</div>";

  notify("Briefing — " + s.spoons + " spoons, Level " + s.level, html);
}
