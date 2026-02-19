/**
 * P31 — Narrative
 * Daily briefing. Campaign tracking. Recruitment.
 * The story of what you did and what comes next.
 */

// ─────────────────────────────────────────────────────────────
// CAMPAIGNS — track ongoing missions
// ─────────────────────────────────────────────────────────────

function startCampaign(name, desc) {
  var s = load();
  s.campaigns[name] = {
    started: new Date().toISOString(),
    description: desc || "",
    xpEarned: 0,
    status: "ACTIVE"
  };
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

// ─────────────────────────────────────────────────────────────
// DAILY BRIEFING — sent at 6am via ping()
// ─────────────────────────────────────────────────────────────

function briefing(c, s) {
  var pct = Math.round((s.spoons / CONFIG.BONE.SPOONS) * 100);
  var color = s.color === "GREEN" ? "#00ff41" : s.color === "YELLOW" ? "#f0c040" : "#ff3333";

  // Active campaigns
  var campaignList = "";
  var names = Object.keys(s.campaigns);
  var active = names.filter(function(n) { return s.campaigns[n].status === "ACTIVE"; });
  if (active.length > 0) {
    campaignList = active.map(function(n) {
      var camp = s.campaigns[n];
      return "<li><b>" + n + "</b> — " + camp.xpEarned + " XP earned</li>";
    }).join("");
    campaignList = "<h3 style='color:#00ff41'>Active Campaigns</h3><ul>" + campaignList + "</ul>";
  }

  // Recent log
  var recentLog = s.log.slice(-5).reverse().map(function(entry) {
    return "<li style='color:#999'>" + entry.m + "</li>";
  }).join("");

  var html =
    "<div style='background:#0a0a0a;color:#e0e0e0;padding:24px;font-family:monospace;max-width:600px'>" +
      "<h1 style='color:#00ff41;margin:0;letter-spacing:2px;font-size:24px'>P31</h1>" +
      "<p style='color:#666;margin:4px 0 20px'>Phosphorus-31 — Daily Briefing</p>" +

      "<div style='display:flex;gap:20px;margin:16px 0'>" +
        "<div style='text-align:center'>" +
          "<div style='font-size:32px;color:" + color + "'>" + s.spoons + "/" + CONFIG.BONE.SPOONS + "</div>" +
          "<div style='color:#666;font-size:11px'>SPOONS</div>" +
        "</div>" +
        "<div style='text-align:center'>" +
          "<div style='font-size:32px;color:#00ff41'>" + s.level + "</div>" +
          "<div style='color:#666;font-size:11px'>LEVEL</div>" +
        "</div>" +
        "<div style='text-align:center'>" +
          "<div style='font-size:32px;color:#f0c040'>" + s.loveTotal + "</div>" +
          "<div style='color:#666;font-size:11px'>LOVE</div>" +
        "</div>" +
        "<div style='text-align:center'>" +
          "<div style='font-size:32px;color:#ff3333'>" + s.blocked + "</div>" +
          "<div style='color:#666;font-size:11px'>BUFFERED</div>" +
        "</div>" +
      "</div>" +

      "<div style='background:#111;padding:12px;border-left:3px solid " + color + ";margin:16px 0'>" +
        "<p style='margin:0;color:" + color + "'>" +
          c.days + "d " + c.hours + "h " + c.mins + "m to abdication" +
        "</p>" +
      "</div>" +

      campaignList +

      (recentLog ? "<h3 style='color:#666'>Recent</h3><ul style='list-style:none;padding:0'>" + recentLog + "</ul>" : "") +

      "<p style='color:#333;font-size:10px;margin-top:24px'>The mesh holds. 🔺</p>" +
    "</div>";

  notify("Briefing — " + s.spoons + " spoons, Level " + s.level, html);
}

// ─────────────────────────────────────────────────────────────
// RECRUITMENT — commission engine for onboarding allies
// ─────────────────────────────────────────────────────────────

function recruit(email, name) {
  if (!email) return { error: "Need an email" };

  var html =
    "<div style='background:#0a0a0a;color:#e0e0e0;padding:24px;font-family:monospace;max-width:500px'>" +
      "<h1 style='color:#00ff41;letter-spacing:2px'>P31</h1>" +
      "<p>Hi " + (name || "there") + ",</p>" +
      "<p>You've been identified as a structural asset. " +
      "We're formally requesting your commission into the P31 mesh.</p>" +
      "<p>What is P31? Phosphorus-31 — the biological qubit. " +
      "We're building assistive technology for neurodivergent minds. " +
      "The minimum stable system is a family + an AI.</p>" +
      "<p>Interested? Reply to this email.</p>" +
      "<p style='color:#666'>— Will</p>" +
      "<p style='color:#333;font-size:10px'>The mesh holds. 🔺</p>" +
    "</div>";

  try {
    MailApp.sendEmail({ to: email, subject: "[P31] You've been recruited", htmlBody: html });
    earn(200, "Recruited: " + (name || email));
    log("NARRATIVE", "RECRUIT", name || email, "GREEN");
    return { status: "sent", to: email };
  } catch(e) {
    return { error: e.message };
  }
}