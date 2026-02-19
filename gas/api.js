/**
 * P31 — Node One Bridge
 * Receives data from the ESP32 over the Whale Channel.
 * HMAC-SHA256 authentication.
 */

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);

    // Authenticate
    if (!payload.signature || !payload.timestamp) {
      return reply(401, "Missing auth");
    }

    var age = Math.abs(Date.now() - payload.timestamp);
    if (age > 300000) return reply(401, "Stale");

    var expected = Utilities.computeHmacSha256Signature(
      payload.timestamp.toString(), CONFIG.DEVICE_KEY
    );
    var sig = expected.map(function(b) { return ("0" + (b & 0xFF).toString(16)).slice(-2); }).join("");
    if (sig !== payload.signature) return reply(401, "Bad signature");

    // Route by action
    var action = payload.action;
    var result;

    switch(action) {
      case "ping":
        result = { status: "alive", spoons: load().spoons, color: load().color };
        break;

      case "scope":
        result = readScope();
        break;

      case "drain":
        if (payload.activity && CONFIG.DRAIN[payload.activity]) {
          drainSpoons(CONFIG.DRAIN[payload.activity], payload.activity);
          result = { drained: payload.activity, spoons: load().spoons };
        } else {
          result = { error: "Unknown activity" };
        }
        break;

      case "med":
        if (payload.med) {
          logMed(payload.med);
          result = { logged: payload.med };
        } else {
          result = { error: "No med specified" };
        }
        break;

      case "meltdown":
        triggerMeltdown();
        result = { status: "meltdown_active", spoons: 0 };
        break;

      default:
        result = { error: "Unknown action: " + action };
    }

    log("NODE_ONE", action, JSON.stringify(result).substring(0,200), "GREEN");
    return reply(200, result);

  } catch(err) {
    log("NODE_ONE", "ERROR", err.message, "RED");
    return reply(500, err.message);
  }
}

function reply(code, data) {
  return ContentService
    .createTextOutput(JSON.stringify({ code: code, data: data }))
    .setMimeType(ContentService.MimeType.JSON);
}