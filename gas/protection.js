/**
 * P31 — Protection
 * Rate limiting. Replay prevention.
 * Don't let anyone hammer the mesh.
 */

var RATE = {
  WINDOW: 60000,   // 60 seconds
  LIMIT: 10,       // max requests per window
  STALE: 300000    // 5 minutes = stale packet
};

function checkRate(clientId) {
  var cache = CacheService.getScriptCache();
  var key = "RATE_" + (clientId || "default");
  var data = cache.get(key);

  var now = Date.now();
  var record_;

  if (data) {
    try { record_ = JSON.parse(data); } catch(e) { record_ = { hits: [], first: now }; }
  } else {
    record_ = { hits: [], first: now };
  }

  // Trim old hits outside window
  record_.hits = record_.hits.filter(function(t) { return (now - t) < RATE.WINDOW; });

  if (record_.hits.length >= RATE.LIMIT) {
    return { allowed: false, remaining: 0, reset: Math.ceil(RATE.WINDOW / 1000) + "s" };
  }

  record_.hits.push(now);
  cache.put(key, JSON.stringify(record_), 120);

  return { allowed: true, remaining: RATE.LIMIT - record_.hits.length };
}

function isStale(timestamp) {
  if (!timestamp) return true;
  return Math.abs(Date.now() - timestamp) > RATE.STALE;
}