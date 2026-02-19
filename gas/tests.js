/**
 * P31 — Tests
 * Run: runTests()
 * If it's not green, it's not deployed.
 */

function runTests() {
  console.log("P31 — Test Suite");
  console.log("────────────────────────────────");

  var pass = 0, fail = 0;

  function ok(name, condition) {
    if (condition) {
      pass++;
    } else {
      fail++;
      console.error("FAIL: " + name);
    }
  }

  // ── CONFIG ──
  console.log("\n1. Config");
  ok("CONFIG exists", typeof CONFIG === "object");
  ok("OPERATOR set", CONFIG.OPERATOR === "Will");
  ok("CALLSIGN is P31", CONFIG.CALLSIGN === "P31");
  ok("VERSION is 7.x", CONFIG.VERSION.indexOf("7.") === 0);
  ok("ROOT is P31", CONFIG.ROOT === "P31");
  ok("PHI is 1/3", Math.abs(CONFIG.PHI - 1/3) < 0.001);
  ok("BONE exists", typeof CONFIG.BONE === "object");
  ok("BONE.SPOONS is 12", CONFIG.BONE.SPOONS === 12);
  ok("BONE.MEDS has 4", CONFIG.BONE.MEDS.length === 4);
  ok("BONE.CALCIUM_GAP is 4h", CONFIG.BONE.CALCIUM_GAP_HOURS === 4);
  ok("DRAIN exists", typeof CONFIG.DRAIN === "object");
  ok("DRAIN.MELTDOWN is 12", CONFIG.DRAIN.MELTDOWN === 12);
  ok("HOSTILE has 2 entries", CONFIG.HOSTILE.length === 2);
  ok("LOVE exists", typeof CONFIG.LOVE === "object");
  ok("LOVE.GREEN is 2.5", CONFIG.LOVE.GREEN === 2.5);

  // ── TREE ──
  console.log("\n2. Tree");
  ok("TREE exists", typeof TREE === "object");
  ok("The Fold exists", !!TREE["The Fold"]);
  ok("Node One exists", !!TREE["Node One"]);
  ok("The Buffer exists", !!TREE["The Buffer"]);
  ok("Abdicate exists", !!TREE["Abdicate"]);
  ok("The Centaur exists", !!TREE["The Centaur"]);
  ok("The Fold has branches", TREE["The Fold"].branches.length >= 4);
  ok("Node One has Whale Channel", TREE["Node One"].branches.indexOf("Whale Channel") >= 0);
  ok("Node One has Thick Click", TREE["Node One"].branches.indexOf("Thick Click") >= 0);

  // ── TABS ──
  console.log("\n3. Tabs");
  ok("TABS exists", typeof TABS === "object");
  ok("telemetry tab", !!TABS.telemetry);
  ok("spoons tab", !!TABS.spoons);
  ok("love tab", !!TABS.love);
  ok("meds tab", !!TABS.meds);
  ok("buffer tab", !!TABS.buffer);

  // ── STATE ──
  console.log("\n4. State");
  var s = load();
  ok("load() returns object", typeof s === "object");
  ok("spoons exists", typeof s.spoons === "number");
  ok("color exists", typeof s.color === "string");
  ok("xp exists", typeof s.xp === "number");
  ok("level exists", typeof s.level === "number");
  ok("medLog exists", typeof s.medLog === "object");
  ok("campaigns exists", typeof s.campaigns === "object");
  ok("loveTotal exists", typeof s.loveTotal === "number");

  // ── FUNCTIONS ──
  console.log("\n5. Functions");
  ok("ignite exists", typeof ignite === "function");
  ok("ping exists", typeof ping === "function");
  ok("bufferScan exists", typeof bufferScan === "function");
  ok("checkMeds exists", typeof checkMeds === "function");
  ok("mine exists", typeof mine === "function");
  ok("readScope exists", typeof readScope === "function");
  ok("scopeData exists", typeof scopeData === "function");
  ok("plant exists", typeof plant === "function");
  ok("buildTabs exists", typeof buildTabs === "function");
  ok("refillSpoons exists", typeof refillSpoons === "function");
  ok("drainSpoons exists", typeof drainSpoons === "function");
  ok("triggerMeltdown exists", typeof triggerMeltdown === "function");
  ok("logMed exists", typeof logMed === "function");
  ok("ingest exists", typeof ingest === "function");
  ok("briefing exists", typeof briefing === "function");
  ok("recruit exists", typeof recruit === "function");
  ok("hash exists", typeof hash === "function");
  ok("clean exists", typeof clean === "function");
  ok("checkRate exists", typeof checkRate === "function");
  ok("assess exists", typeof assess === "function");

  // ── VOLTAGE ──
  console.log("\n6. Voltage Assessment");
  ok("Neutral email = low", assess("friend@gmail.com", "Hello", "How are you?") <= 3);
  ok("Hostile sender = 6+", assess("jenn@mcghanlaw.com", "Notice", "Please review") >= 6);
  ok("Fight pattern = 8+", assess("jenn@mcghanlaw.com", "Emergency", "Court will hold you in contempt") >= 8);
  ok("Fawn pattern = 5+", assess("unknown@gmail.com", "Hi", "Just trying to do what's best for the children") >= 5);
  ok("Freeze pattern = 7+", assess("unknown@gmail.com", "Deadline", "You must comply immediately within 2 days") >= 7);
  ok("Child weaponization = high", assess("anyone@email.com", "Safety", "Children are not safe with you") >= 6);
  ok("Max is 10", assess("jenn@mcghanlaw.com", "EMERGENCY", "Court will sanctions contempt children not safe criminal arrest") <= 10);

  // ── SECURITY ──
  console.log("\n7. Security");
  ok("hash returns 64 chars (SHA-256)", hash("test").length === 64);
  ok("hash is deterministic", hash("P31") === hash("P31"));
  ok("hash differs for different input", hash("a") !== hash("b"));
  ok("clean strips tags", clean("<script>alert(1)</script>").indexOf("<") === -1);
  ok("clean caps at 10000", clean("a".repeat(20000)).length === 10000);
  ok("cleanEmail extracts email", cleanEmail("Will <will@p31.io>") === "will@p31.io");
  ok("checkRate returns object", typeof checkRate("test") === "object");
  ok("checkRate allows first request", checkRate("test_" + Date.now()).allowed === true);

  // ── COUNTDOWN ──
  console.log("\n8. Countdown");
  var c = countdown();
  ok("countdown returns object", typeof c === "object");
  ok("countdown has days", typeof c.days === "number");
  ok("countdown has status", typeof c.status === "string");

  // ── SCOPE ──
  console.log("\n9. Scope Data");
  var scope = scopeData();
  ok("scopeData returns object", typeof scope === "object");
  ok("scope has spoons", !!scope.spoons);
  ok("scope has signal", !!scope.signal);
  ok("scope has love", !!scope.love);
  ok("scope has mesh", !!scope.mesh);
  ok("scope has meds", Array.isArray(scope.meds));
  ok("mesh has 4 vertices", Object.keys(scope.mesh.vertices).length === 4);
  ok("mesh has stability", typeof scope.mesh.stability === "string");

  // ── DEAD NAME REGRESSION ──
  console.log("\n10. Dead Names (must NOT exist)");
  ok("No simplexProtocol", typeof simplexProtocol === "undefined");
  ok("No getMasterSheet", typeof getMasterSheet === "undefined");
  ok("No tomographScan (old name)", typeof tomographScan === "undefined");
  ok("No dailyHeartbeat (old name)", typeof dailyHeartbeat === "undefined");
  ok("No runMiningCycle", typeof runMiningCycle === "undefined");
  ok("No getSystemState", typeof getSystemState === "undefined");
  ok("No saveSystemState", typeof saveSystemState === "undefined");
  ok("No getSystemTelemetry", typeof getSystemTelemetry === "undefined");
  ok("No initiateMeltdown", typeof initiateMeltdown === "undefined");
  ok("No checkMedications", typeof checkMedications === "undefined");
  ok("No genesisProtocol", typeof genesisProtocol === "undefined");
  ok("No cognitiveShieldScan", typeof cognitiveShieldScan === "undefined");

  // ── NAMING COMPLIANCE ──
  console.log("\n11. Naming");
  var allCode = [
    "CONFIG", "TREE", "TABS",
    "load", "save", "earn", "record",
    "plant", "getTelemetry", "buildTabs", "log",
    "ignite", "ping", "readScope", "scopeData",
    "bufferScan", "assess",
    "refillSpoons", "drainSpoons", "triggerMeltdown", "checkMeds", "logMed",
    "mine", "ingest", "briefing", "recruit",
    "hash", "clean", "cleanEmail", "checkRate", "isStale"
  ];
  for (var i = 0; i < allCode.length; i++) {
    ok(allCode[i] + " exists", eval("typeof " + allCode[i]) !== "undefined");
  }

  // ── RESULTS ──
  console.log("\n────────────────────────────────");
  console.log("PASS: " + pass + " / " + (pass + fail));
  if (fail > 0) {
    console.error("FAIL: " + fail + " tests failed.");
  } else {
    console.log("All green. The mesh holds.");
  }
  return { pass: pass, fail: fail, total: pass + fail };
}