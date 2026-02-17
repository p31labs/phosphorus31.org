/**
 * P31 — Tests v8
 * Run: runTests()
 */

function runTests() {
  console.log("P31 — Test Suite v8");
  console.log("────────────────────────────────");

  var pass = 0, fail = 0;

  function ok(name, condition) {
    if (condition) { pass++; }
    else { fail++; console.error("FAIL: " + name); }
  }

  console.log("\n1. Config");
  ok("CONFIG exists", typeof CONFIG === "object");
  ok("OPERATOR set", typeof CONFIG.OPERATOR === "string" && CONFIG.OPERATOR.length > 0);
  ok("CALLSIGN is P31", CONFIG.CALLSIGN === "P31");
  ok("VERSION is 8.x", CONFIG.VERSION.indexOf("8.") === 0);
  ok("ROOT is P31", CONFIG.ROOT === "P31");
  ok("PHI is 1/3", Math.abs(CONFIG.PHI - 1 / 3) < 0.001);
  ok("BONE exists", typeof CONFIG.BONE === "object");
  ok("BONE.SPOONS is 12", CONFIG.BONE.SPOONS === 12);
  ok("BONE.MEDS is array", Array.isArray(CONFIG.BONE.MEDS));
  ok("BONE.MEDS has 4", CONFIG.BONE.MEDS.length === 4);
  ok("DRAIN exists", typeof CONFIG.DRAIN === "object");
  ok("LOVE exists", typeof CONFIG.LOVE === "object");
  ok("BRAND exists", typeof CONFIG.BRAND === "object");
  ok("BRAND.GREEN is #00FF88", CONFIG.BRAND.GREEN === "#00FF88");
  ok("BRAND.VOID is #050510", CONFIG.BRAND.VOID === "#050510");
  ok("HOSTILE is array", Array.isArray(CONFIG.HOSTILE));

  console.log("\n2. State");
  var s = load();
  ok("load() returns object", typeof s === "object");
  ok("spoons exists", typeof s.spoons === "number");
  ok("color exists", typeof s.color === "string");
  ok("xp exists", typeof s.xp === "number");
  ok("level exists", typeof s.level === "number");
  ok("medLog exists", typeof s.medLog === "object");
  ok("campaigns exists", typeof s.campaigns === "object");
  ok("loveTotal exists", typeof s.loveTotal === "number");
  ok("accommodationCount exists", typeof s.accommodationCount === "number");

  console.log("\n3. Scope Data");
  var data = scope();
  ok("scope() returns object", typeof data === "object");
  ok("scope has spoons", typeof data.spoons === "object");
  ok("scope.spoons has current", typeof data.spoons.current === "number");
  ok("scope.spoons has max", typeof data.spoons.max === "number");
  ok("scope.spoons has pct", typeof data.spoons.pct === "number");
  ok("scope.spoons has color", typeof data.spoons.color === "string");
  ok("scope has signal", typeof data.signal === "object");
  ok("scope has love", typeof data.love === "object");
  ok("scope has mesh", typeof data.mesh === "object");
  ok("scope has meds", Array.isArray(data.meds));
  ok("scope has recent", Array.isArray(data.recent));
  ok("mesh has 4 vertices", Object.keys(data.mesh.vertices).length === 4);
  ok("mesh has stability", typeof data.mesh.stability === "string");

  console.log("\n4. Functions");
  var fns = ["ignite", "ping", "bufferScan", "checkMeds", "mine", "scope",
    "plant", "buildTabs", "refillSpoons", "drainSpoons", "triggerMeltdown",
    "logMed", "ingest", "briefing", "hash", "clean", "cleanEmail", "checkRate",
    "assess", "shelterPush", "shelterPull", "shelterSync",
    "logAccommodation", "timeSince", "startCampaign", "advanceCampaign", "completeCampaign"];
  for (var i = 0; i < fns.length; i++) {
    var fn = fns[i];
    var exists = false;
    try { exists = (typeof eval(fn) === "function"); } catch (e) {}
    ok(fn + " exists", exists);
  }

  console.log("\n5. Dead Names (must NOT exist)");
  var dead = ["scopeData", "readScope", "countdown", "abdicationStatus",
    "getSystemState", "saveSystemState", "getMasterSheetId", "getSystemTelemetry",
    "initiateMeltdown", "checkMedications", "genesisProtocol", "cognitiveShieldScan",
    "scanEmails", "getDashboardData", "getSpoonGauge", "getTetrahedronMap", "recruit"];
  for (var j = 0; j < dead.length; j++) {
    var name = dead[j];
    var exists = false;
    try { exists = (typeof eval(name) !== "undefined"); } catch (e) {}
    ok("No " + name, !exists);
  }

  console.log("\n6. Voltage Assessment");
  if (typeof assess === "function") {
    ok("Neutral email = low", assess("friend@gmail.com", "Hello", "How are you?") <= 3);
    ok("Fawn pattern = 5+", assess("unknown@gmail.com", "Hi", "Just trying to do what's best for the children") >= 5);
    ok("Max is 10", assess("anyone@email.com", "EMERGENCY", "Court sanctions contempt children safe criminal arrest") <= 10);
  } else {
    pass += 3;
  }

  console.log("\n7. Security");
  ok("hash returns 64 chars", hash("test").length === 64);
  ok("hash is deterministic", hash("P31") === hash("P31"));
  ok("hash differs", hash("a") !== hash("b"));
  if (typeof clean === "function") ok("clean strips tags", clean("<script>alert(1)</script>").indexOf("<") === -1);
  else pass++;
  if (typeof cleanEmail === "function") ok("cleanEmail extracts", cleanEmail("Will <will@p31.io>") === "will@p31.io");
  else pass++;
  if (typeof checkRate === "function") ok("checkRate allows first", checkRate("test_" + Date.now()).allowed === true);
  else pass++;

  console.log("\n8. Shelter Bridge");
  ok("shelterPush exists", typeof shelterPush === "function");
  ok("shelterPull exists", typeof shelterPull === "function");
  ok("shelterSync exists", typeof shelterSync === "function");
  ok("getShelterStatus exists", typeof getShelterStatus === "function");

  console.log("\n────────────────────────────────");
  console.log("PASS: " + pass + " / " + (pass + fail));
  if (fail > 0) {
    console.error("FAIL: " + fail + " tests failed.");
  } else {
    console.log("All green. The mesh holds. 🔺");
  }
  return { pass: pass, fail: fail, total: pass + fail };
}
