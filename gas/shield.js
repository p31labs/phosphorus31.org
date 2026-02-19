/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE COGNITIVE SHIELD (Shield.gs)
 * SYSTEM COMPONENT: The Thalamus / Email Interceptor / AI Triage
 * Filters hostile communications, logs telemetry, provides AI translation.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════
// EMAIL INTERCEPT — HOSTILE PATTERN DETECTION
// ═══════════════════════════════════════════════════════════════

/**
 * Scan inbox for hostile senders. Label, archive, log.
 * Called every 15 minutes by trigger.
 * NEVER deletes — always preserves for legal discovery.
 */
function scanEmails() {
  console.log("🛡️ COGNITIVE SHIELD SCAN");
  const state = getSystemState();

  let intercepted = 0;
  let archived = 0;
  try {
    const threads = GmailApp.getInboxThreads(0, 50);
    // Ensure intercept label exists
    let label = GmailApp.getUserLabelByName("COGNITIVE_SHIELD_INTERCEPT");
    if (!label) {
      label = GmailApp.createLabel("COGNITIVE_SHIELD_INTERCEPT");
    }

    threads.forEach(thread => {
      const messages = thread.getMessages();
      let isHostile = false;
      let hostileSender = "";

      messages.forEach(msg => {
        const sender = msg.getFrom().toLowerCase();
        // Check against HOSTILE_SENDERS list in Code.gs
        const match = CONFIG.HOSTILE_SENDERS.find(h => sender.includes(h.toLowerCase()));
        if (match) {
          isHostile = true;
          hostileSender = sender;
        }
      });

      if (isHostile) {
        // Label for legal record
        thread.addLabel(label);
        // Archive — remove from inbox but preserve
        thread.moveToArchive();
        intercepted++;

        // Log to Shield_Log spreadsheet
        logShieldEvent(hostileSender, thread.getFirstMessageSubject(), "INTERCEPTED", thread.getId());
     
        logMission(`🛡️ SHIELD: Intercepted from ${hostileSender}`);
      }
    });
  } catch (e) {
    console.error("Shield scan error:", e);
    logTelemetry("SHIELD_ERROR", "SCAN_FAILURE", e.toString().substring(0, 200), "HIGH");
  }

  state.lastEmailScan = new Date().toISOString();
  state.hostileEmailsBlocked += intercepted;
  saveSystemState(state);
  
  if (intercepted > 0) {
    awardXP(intercepted * 50, `Shield intercepted ${intercepted} hostiles`);
    sendNotification(
      `🛡️ Shield: ${intercepted} hostile email(s) intercepted`,
      `<p>${intercepted} email thread(s) from hostile senders moved to archive.</p>
       <p>Label: <code>COGNITIVE_SHIELD_INTERCEPT</code></p>
       <p>All emails preserved for legal discovery.</p>`
    );
  }

  console.log(`  ✓ Scanned. Intercepted: ${intercepted}`);
  return { intercepted: intercepted, scanned: 50 };
}

/**
 * Log a shield event to the Shield_Log spreadsheet.
 */
function logShieldEvent(sender, subject, action, threadId) {
  const ssId = getMasterSheetId();
  if (!ssId) return;
  try {
    const ss = SpreadsheetApp.openById(ssId);
    const sheet = ss.getSheetByName("Shield_Log");
    if (sheet) {
      sheet.appendRow([new Date(), sender, subject || "(no subject)", action, threadId || ""]);
    }
  } catch (e) {
    console.error("Shield log write failed:", e);
  }
}

// ═══════════════════════════════════════════════════════════════
// AI TRIAGE — COMMUNICATION TRANSLATION
// ═══════════════════════════════════════════════════════════════

/**
 * Run raw text through AI for voltage assessment and safe translation.
 * Currently a mock — will activate when GCP billing is connected.
 *
 * When live, this will:
 * 1. Assess emotional voltage (1-10 scale)
 * 2. Detect fawn/freeze/flight/fight patterns
 * 3. Generate BLUF (Bottom Line Up Front)
 * 4. Create "safe version" stripped of emotional triggers
 */
function genSyncTranslate(rawText) {
  // ── MOCK MODE (no billing) ──
  // Basic keyword-based voltage assessment as placeholder
  const hostileKeywords = ["demand", "immediately", "final notice", "consequences", "failure to comply", "court order", "contempt", "emergency", "urgent", "deadline"];
  const calmKeywords = ["please", "thank you", "appreciate", "understand", "whenever convenient"];

  const lower = rawText.toLowerCase();
  let voltage = 5; // neutral baseline

  hostileKeywords.forEach(kw => { if (lower.includes(kw)) voltage = Math.min(10, voltage + 1); });
  calmKeywords.forEach(kw => { if (lower.includes(kw)) voltage = Math.max(1, voltage - 1); });

  const patterns = [];
  // FAWN RESPONSE DETECTION
  if (lower.includes("just") || lower.includes("sorry") || lower.includes("i guess")) patterns.push("FAWN");
  // FREEZE RESPONSE DETECTION
  if (lower.includes("whatever") || lower.includes("fine") || lower.includes("i don't care")) patterns.push("FREEZE");
  // URGENCY FRAMING DETECTION
  if (lower.includes("need to") || lower.includes("have to") || lower.includes("must")) patterns.push("URGENCY_FRAMING");

  return {
    voltage: voltage,
    bluf: `[AI PLACEHOLDER] Input received.\nVoltage: ${voltage}/10. ${patterns.length} patterns detected.`,
    safeVersion: rawText, // Pass-through in mock mode
    patterns: patterns,
    aiActive: false
  };
}

// ═══════════════════════════════════════════════════════════════
// TELEMETRY LOGGER — UNIVERSAL EVENT RECORDER
// ═══════════════════════════════════════════════════════════════

/**
 * Log a telemetry event to the master spreadsheet.
 * This is the universal event sink for the entire system.
 */
function logTelemetry(type, action, context, voltage) {
  try {
    const ssId = getMasterSheetId();
    if (!ssId) {
      console.log(`[TELEM] ${type} | ${action} | ${context} | ${voltage}`);
      return;
    }

    const ss = SpreadsheetApp.openById(ssId);
    const sheet = ss.getSheetByName("Telemetry_Logs");
    if (sheet) {
      sheet.appendRow([new Date(), type, action, String(context).substring(0, 500), voltage, "LOGGED"]);
    }
  } catch (e) {
    console.error("Telemetry write failed:", e);
  }
}
