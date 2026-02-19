/**
 * P31 — The Buffer
 * Communication buffer between the world and the operator.
 * Intercepts hostile email. Assesses voltage. Protects the signal.
 *
 * Voltage scale: 1 (dead calm) to 10 (cardiac event)
 * Named after what it does: it buffers.
 */

function bufferScan() {
  var s = load();
  var cutoff = s.lastBufferScan ? new Date(s.lastBufferScan) : daysAgo(1);
  var threads = GmailApp.search("is:unread after:" + dateStr(cutoff), 0, 50);

  if (threads.length === 0) return;

  // Get or create the label
  var label = GmailApp.getUserLabelByName("P31 Buffer");
  if (!label) label = GmailApp.createLabel("P31 Buffer");

  var intercepted = 0;

  for (var i = 0; i < threads.length; i++) {
    var msgs = threads[i].getMessages();
    for (var j = 0; j < msgs.length; j++) {
      var msg = msgs[j];
      if (!msg.isUnread()) continue;

      var from = msg.getFrom().toLowerCase();
      var subject = msg.getSubject() || "(no subject)";
      var body = msg.getPlainBody() || "";
      var voltage = assess(from, subject, body);

      if (voltage >= 6) {
        threads[i].addLabel(label);
        msg.markRead();
        intercepted++;

        // Log it
        try {
          var sheet = getTelemetry().getSheetByName(TABS.buffer.name);
          if (sheet) sheet.appendRow([new Date(), from, subject.substring(0,100), voltage, "BUFFERED", hash(from + subject)]);
        } catch(e) {}

        // Drain spoons proportionally
        var drain = voltage >= 9 ? 5 : voltage >= 7 ? 3 : 2;
        drainSpoons(drain, "HOSTILE_EMAIL");

        // Notify if critical
        if (voltage >= 8) {
          notify("Buffer: Voltage " + voltage,
            "<p>Sender: <b>" + from + "</b></p>" +
            "<p>Subject: " + subject + "</p>" +
            "<p>Voltage: <b>" + voltage + "/10</b></p>" +
            "<p>This message has been buffered. Read it when you're ready.</p>" +
            "<p>Label: <code>P31 Buffer</code></p>"
          );
        }
      }
    }
  }

  s.lastBufferScan = new Date().toISOString();
  s.blocked += intercepted;
  save(s);

  if (intercepted > 0) {
    log("BUFFER", "SCAN", intercepted + " intercepted", intercepted > 2 ? "RED" : "YELLOW");
    console.log("Buffer: " + intercepted + " intercepted");
  }
}

// ─────────────────────────────────────────────────────────────
// VOLTAGE ASSESSMENT — how dangerous is this message?
// ─────────────────────────────────────────────────────────────

function assess(from, subject, body) {
  var v = 1;
  var text = (subject + " " + body).toLowerCase();

  // Known hostile sender = floor of 6
  for (var i = 0; i < CONFIG.HOSTILE.length; i++) {
    if (from.indexOf(CONFIG.HOSTILE[i]) >= 0) { v = 6; break; }
  }

  // Trauma patterns — FAWN / FREEZE / FIGHT
  var fawn = /just trying to|for the children|i only want|you know i love/i;
  var freeze = /no choice|comply immediately|you must|required to|within \d+ (hours?|days?)/i;
  var fight = /warned you|consequences|contempt|court will|sanctions|emergency/i;

  if (fawn.test(text))   v = Math.max(v, 5);
  if (freeze.test(text)) v = Math.max(v, 7);
  if (fight.test(text))  v = Math.max(v, 8);

  // Adversarial tactics
  var tactics = [
    { pattern: /emergency|immediate|urgent/i,               name: "URGENCY",              add: 2 },
    { pattern: /child(ren)?.*safe|safe.*child|protect.*child/i, name: "CHILD_WEAPONIZATION",  add: 3 },
    { pattern: /disab|condition|mental|autis|adhd|medic/i,  name: "DISABILITY_WEAPONIZATION", add: 2 },
    { pattern: /court.*order|order.*court|violat|noncomplian/i, name: "LEGAL_THREAT",         add: 2 },
    { pattern: /police|sheriff|arrest|criminal/i,           name: "AUTHORITY_THREAT",      add: 2 },
    { pattern: /everyone knows|family thinks|people say/i,  name: "ISOLATION",             add: 1 }
  ];

  for (var t = 0; t < tactics.length; t++) {
    if (tactics[t].pattern.test(text)) v += tactics[t].add;
  }

  // Cap at 10
  return Math.min(v, 10);
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function daysAgo(n) {
  var d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function dateStr(d) {
  return Utilities.formatDate(d, "America/New_York", "yyyy/MM/dd");
}