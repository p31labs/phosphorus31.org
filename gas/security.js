/**
 * P31 — Security
 * Input sanitization. SHA-256 hashing. Session management.
 * The immune system.
 */

// Override the fallback MD5 hash with SHA-256
function hash(input) {
  var raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input);
  return raw.map(function(b) { return ("0" + (b & 0xFF).toString(16)).slice(-2); }).join("");
}

// ─────────────────────────────────────────────────────────────
// SANITIZE — strip dangerous input
// ─────────────────────────────────────────────────────────────

function clean(input) {
  if (typeof input !== "string") return "";
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/data:/gi, "")
    .trim()
    .substring(0, 10000);
}

function cleanEmail(email) {
  if (!email || typeof email !== "string") return "";
  var match = email.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0].toLowerCase() : "";
}

// ─────────────────────────────────────────────────────────────
// SESSIONS — token-based auth for dashboard
// ─────────────────────────────────────────────────────────────

function createSession() {
  var token = hash(new Date().toISOString() + Math.random().toString());
  var cache = CacheService.getScriptCache();
  cache.put("SESSION_" + token, JSON.stringify({
    created: new Date().toISOString(),
    operator: CONFIG.OPERATOR
  }), 86400); // 24 hours
  return token;
}

function validateSession(token) {
  if (!token) return false;
  var cache = CacheService.getScriptCache();
  var session = cache.get("SESSION_" + token);
  return session !== null;
}

// ─────────────────────────────────────────────────────────────
// DRIVE PERMISSIONS — verify folder access
// ─────────────────────────────────────────────────────────────

function verifyAccess(folderId) {
  try {
    var folder = DriveApp.getFolderById(folderId);
    var access = folder.getAccess(Session.getActiveUser());
    return access !== DriveApp.Permission.NONE;
  } catch(e) {
    return false;
  }
}