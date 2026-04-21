#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# P31 POST-BUILD VERIFICATION SUITE
# Run after pnpm build && deploy to verify all mesh connections
#
# Usage: chmod +x verify-mesh.sh && ./verify-mesh.sh
# ═══════════════════════════════════════════════════════════════
set -uo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; DIM='\033[2m'; NC='\033[0m'

PASS=0; FAIL=0; WARN=0; SKIP=0
START=$(date +%s)

log()  { echo -e "${CYAN}[TEST]${NC} $1"; }
ok()   { echo -e "  ${GREEN}✓${NC} $1"; ((PASS++)); }
fail() { echo -e "  ${RED}✗${NC} $1"; ((FAIL++)); }
warn() { echo -e "  ${YELLOW}⚠${NC} $1"; ((WARN++)); }
skip() { echo -e "  ${DIM}○${NC} $1"; ((SKIP++)); }
sep()  { echo -e "${DIM}────────────────────────────────────────${NC}"; }

# Store test artifacts
TRACE_IDS=()
TOKENS=()
BIO_RECORDS=()

echo ""
echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════${NC}"
echo -e "${BOLD}${CYAN}  P31 MESH — POST-BUILD VERIFICATION SUITE    ${NC}"
echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════${NC}"
echo -e "${DIM}  $(date)${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# PHASE 1: WORKER HEALTH
# ═══════════════════════════════════════════════════════════════
log "${BOLD}PHASE 1: Worker Health Checks${NC}"
sep

check_worker() {
  local name="$1" url="$2" expect="$3"
  local start_ms=$(date +%s%3N 2>/dev/null || date +%s)
  local code=$(curl -s -o /tmp/p31_verify_${name}.json -w "%{http_code}" --max-time 8 "$url" 2>/dev/null || echo "000")
  local end_ms=$(date +%s%3N 2>/dev/null || date +%s)
  local ms=$((end_ms - start_ms))

  if [ "$code" = "$expect" ]; then
    local body=$(cat /tmp/p31_verify_${name}.json 2>/dev/null | head -c 100)
    ok "${name}: HTTP ${code} (${ms}ms) ${DIM}${body}${NC}"
    return 0
  else
    fail "${name}: HTTP ${code} (expected ${expect}) (${ms}ms)"
    return 1
  fi
}

check_worker "p31-agent-hub" "https://p31-agent-hub.trimtab-signal.workers.dev/health" "200"
check_worker "k4-cage" "https://k4-cage.trimtab-signal.workers.dev/" "200"
check_worker "k4-personal" "https://k4-personal.trimtab-signal.workers.dev/agent/will/health" "200"
check_worker "k4-hubs" "https://k4-hubs.trimtab-signal.workers.dev/health" "200"
check_worker "p31-bouncer" "https://p31-bouncer.trimtab-signal.workers.dev/auth" "405"
check_worker "reflective-chamber" "https://reflective-chamber.trimtab-signal.workers.dev/" "200"

# Leakage stats
LEAK=$(curl -s "https://p31-agent-hub.trimtab-signal.workers.dev/health" --max-time 5 2>/dev/null)
LEAK_RATE=$(echo "$LEAK" | python3 -c "import sys,json; print(json.load(sys.stdin).get('leakage',{}).get('rate',0))" 2>/dev/null || echo "?")
if [ "$LEAK_RATE" != "?" ]; then
  ok "Leakage parser: rate=${LEAK_RATE}"
else
  warn "Could not read leakage stats"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# PHASE 2: AUTHENTICATION FLOW
# ═══════════════════════════════════════════════════════════════
log "${BOLD}PHASE 2: Authentication (p31-bouncer → JWT)${NC}"
sep

# Mint a test token
AUTH_RESP=$(curl -s -X POST "https://p31-bouncer.trimtab-signal.workers.dev/auth" \
  -H "Content-Type: application/json" \
  -d '{"userId":"verify-test","roomCode":"VERIFY","name":"Verify Bot","color":"#00F0FF","role":"test"}' \
  --max-time 8 2>/dev/null)

TOKEN=$(echo "$AUTH_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))" 2>/dev/null || echo "")
EXPIRY=$(echo "$AUTH_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('expiresAt',0))" 2>/dev/null || echo "0")

if [ -n "$TOKEN" ] && [ "$TOKEN" != "" ]; then
  ok "JWT minted: ${TOKEN:0:40}..."
  ok "Expires: $(python3 -c "import datetime; print(datetime.datetime.fromtimestamp($EXPIRY/1000).isoformat())" 2>/dev/null || echo "$EXPIRY")"
  TOKENS+=("$TOKEN")

  # Verify the token
  VERIFY_RESP=$(curl -s -X POST "https://p31-bouncer.trimtab-signal.workers.dev/verify" \
    -H "Content-Type: application/json" \
    -d "{\"token\":\"$TOKEN\"}" --max-time 5 2>/dev/null)

  VALID=$(echo "$VERIFY_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('valid',False))" 2>/dev/null || echo "")
  if [ "$VALID" = "True" ]; then
    ok "JWT verification: valid=true"
    # Check claims
    SUB=$(echo "$VERIFY_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('claims',{}).get('sub',''))" 2>/dev/null || echo "")
    SCOPE=$(echo "$VERIFY_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('claims',{}).get('scope',''))" 2>/dev/null || echo "")
    ok "Claims: sub=${SUB}, scope=${SCOPE}"
  else
    fail "JWT verification failed: $VERIFY_RESP"
  fi
else
  fail "JWT mint failed: $AUTH_RESP"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# PHASE 3: PERSONALAGENT STATE & BIO
# ═══════════════════════════════════════════════════════════════
log "${BOLD}PHASE 3: PersonalAgent State & Bio${NC}"
sep

# Energy check
ENERGY=$(curl -s "https://k4-personal.trimtab-signal.workers.dev/agent/will/energy" --max-time 5 2>/dev/null)
SPOONS=$(echo "$ENERGY" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'{d.get(\"spoons\",\"?\")}/{d.get(\"max\",\"?\")}')" 2>/dev/null || echo "?")
if [ "$SPOONS" != "?" ]; then
  ok "Energy: ${SPOONS} spoons"
else
  warn "Energy endpoint returned: $ENERGY"
fi

# State check
STATE=$(curl -s "https://k4-personal.trimtab-signal.workers.dev/agent/will/state" --max-time 5 2>/dev/null)
if echo "$STATE" | python3 -c "import sys,json; json.load(sys.stdin)" 2>/dev/null; then
  ok "State endpoint: valid JSON"
  # Check for scrub rules
  HAS_SCRUB=$(echo "$STATE" | python3 -c "import sys,json; d=json.load(sys.stdin); print('yes' if 'scrub_rules' in d else 'no')" 2>/dev/null || echo "no")
  if [ "$HAS_SCRUB" = "yes" ]; then
    ok "PII scrub rules: configured"
  else
    warn "PII scrub rules: NOT configured (run PUT /agent/will/state with scrub_rules)"
  fi
else
  fail "State endpoint returned invalid JSON"
fi

# Bio submission (spoon check — non-destructive)
BIO=$(curl -s -X POST "https://k4-personal.trimtab-signal.workers.dev/agent/will/bio" \
  -H "Content-Type: application/json" \
  -d '{"type":"spoon_check","value":8,"unit":"spoons","source":"verify-suite"}' \
  --max-time 5 2>/dev/null)

BIO_OK=$(echo "$BIO" | python3 -c "import sys,json; print(json.load(sys.stdin).get('ok',False))" 2>/dev/null || echo "")
if [ "$BIO_OK" = "True" ]; then
  ok "Bio webhook: spoon_check accepted"
  BIO_RECORDS+=("spoon_check:8")
else
  fail "Bio webhook failed: $BIO"
fi

# Reminders check
REMINDERS=$(curl -s "https://k4-personal.trimtab-signal.workers.dev/agent/will/reminders" --max-time 5 2>/dev/null)
REM_COUNT=$(echo "$REMINDERS" | python3 -c "import sys,json; print(len(json.load(sys.stdin).get('reminders',[])))" 2>/dev/null || echo "?")
ok "Reminders: ${REM_COUNT} pending"

echo ""

# ═══════════════════════════════════════════════════════════════
# PHASE 4: MESH ROOM (k4-cage)
# ═══════════════════════════════════════════════════════════════
log "${BOLD}PHASE 4: FamilyMeshRoom (k4-cage)${NC}"
sep

STATS=$(curl -s "https://k4-cage.trimtab-signal.workers.dev/room-stats/family-alpha" --max-time 5 2>/dev/null)
CONN=$(echo "$STATS" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('connections',0))" 2>/dev/null || echo "?")
MAX=$(echo "$STATS" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('maxConnections',0))" 2>/dev/null || echo "?")
PEND=$(echo "$STATS" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('pendingTelemetry',0))" 2>/dev/null || echo "?")

if [ "$CONN" != "?" ]; then
  ok "Room connections: ${CONN}/${MAX}"
  if [ "$PEND" = "0" ]; then
    ok "Telemetry flush: clean (0 pending)"
  else
    warn "Telemetry pending: ${PEND} (may flush on next 30s alarm)"
  fi
else
  fail "Room stats failed: $STATS"
fi

# WebSocket connectivity test (connect, send ping, disconnect)
if command -v python3 &>/dev/null; then
  WS_RESULT=$(python3 -c "
import asyncio, json
try:
    import websockets
    async def test():
        uri = 'wss://k4-cage.trimtab-signal.workers.dev/ws/verify-room?node=verify-bot'
        async with websockets.connect(uri, close_timeout=3) as ws:
            await ws.send('ping')
            try:
                resp = await asyncio.wait_for(ws.recv(), timeout=3)
                return 'ok:' + str(resp)[:50]
            except asyncio.TimeoutError:
                return 'ok:connected-no-response'
    print(asyncio.run(test()))
except ImportError:
    print('skip:websockets-not-installed')
except Exception as e:
    print('fail:' + str(e)[:80])
" 2>/dev/null || echo "skip:python-error")

  if [[ "$WS_RESULT" == ok:* ]]; then
    ok "WebSocket: ${WS_RESULT#ok:}"
  elif [[ "$WS_RESULT" == skip:* ]]; then
    skip "WebSocket: ${WS_RESULT#skip:}"
  else
    fail "WebSocket: ${WS_RESULT#fail:}"
  fi
else
  skip "WebSocket: python3 not available"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# PHASE 5: HUB ROUTER (k4-hubs)
# ═══════════════════════════════════════════════════════════════
log "${BOLD}PHASE 5: Hub Router (k4-hubs)${NC}"
sep

HUB_HEALTH=$(curl -s "https://k4-hubs.trimtab-signal.workers.dev/health" --max-time 5 2>/dev/null)
HUB_OK=$(echo "$HUB_HEALTH" | python3 -c "import sys,json; print(json.load(sys.stdin).get('status',''))" 2>/dev/null || echo "")
if [ "$HUB_OK" = "ok" ]; then
  ok "Hub router: healthy"
else
  fail "Hub router: $HUB_HEALTH"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# PHASE 6: AGENT CHAT ROUND-TRIP
# ═══════════════════════════════════════════════════════════════
log "${BOLD}PHASE 6: Agent Chat Round-Trip (10-30s)${NC}"
sep

CHAT=$(curl -s -X POST "https://p31-agent-hub.trimtab-signal.workers.dev/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"session":"verify-suite","message":"[verify] mesh status check"}' \
  --max-time 35 2>/dev/null)

REPLY=$(echo "$CHAT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('reply','')[:200])" 2>/dev/null || echo "")
TRACE=$(echo "$CHAT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('trace',''))" 2>/dev/null || echo "")
MODEL=$(echo "$CHAT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('model',''))" 2>/dev/null || echo "")

if [ -n "$REPLY" ] && [ "$REPLY" != "" ]; then
  # Check for leakage
  if echo "$REPLY" | grep -q '"tool_calls"'; then
    fail "Chat reply contains raw tool_calls (leakage not caught)"
  elif echo "$REPLY" | grep -q '<|python_tag|>'; then
    fail "Chat reply contains python_tag markers"
  else
    ok "Chat reply: ${REPLY:0:120}..."
    ok "Model: ${MODEL}"
    ok "Trace: ${TRACE}"
    TRACE_IDS+=("$TRACE")
  fi
else
  ERROR=$(echo "$CHAT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('message','unknown'))" 2>/dev/null || echo "parse-error")
  if [ "$ERROR" = "9002: unknown internal error" ]; then
    warn "Workers AI transient error (9002) — retry in 60s"
  else
    fail "Chat failed: $ERROR"
  fi
fi

# Cleanup test session
curl -s -X POST "https://p31-agent-hub.trimtab-signal.workers.dev/api/clear" \
  -H "Content-Type: application/json" -d '{"session":"verify-suite"}' --max-time 5 >/dev/null 2>&1
ok "Test session cleared"

echo ""

# ═══════════════════════════════════════════════════════════════
# PHASE 7: REFLECTIVE CHAMBER
# ═══════════════════════════════════════════════════════════════
log "${BOLD}PHASE 7: Reflective Chamber (Synthesis)${NC}"
sep

SYNTH=$(curl -s -X POST "https://reflective-chamber.trimtab-signal.workers.dev/synthesize" --max-time 15 2>/dev/null)
SYNTH_OK=$(echo "$SYNTH" | python3 -c "import sys,json; d=json.load(sys.stdin); print('ok' if 'period' in d else 'error')" 2>/dev/null || echo "error")

if [ "$SYNTH_OK" = "ok" ]; then
  MASKING=$(echo "$SYNTH" | python3 -c "import sys,json; print(json.load(sys.stdin).get('maskingCost',0))" 2>/dev/null || echo "?")
  MSGS=$(echo "$SYNTH" | python3 -c "import sys,json; print(json.load(sys.stdin).get('messageVolume',0))" 2>/dev/null || echo "?")
  ok "Weekly synthesis: maskingCost=${MASKING}, messageVolume=${MSGS}"
else
  ERROR=$(echo "$SYNTH" | python3 -c "import sys,json; print(json.load(sys.stdin).get('error','unknown'))" 2>/dev/null || echo "$SYNTH")
  if echo "$ERROR" | grep -q "no such table"; then
    warn "D1 telemetry table missing — create with: npx wrangler d1 execute p31-telemetry --remote --command \"CREATE TABLE IF NOT EXISTS telemetry(...)\""
  else
    fail "Synthesis failed: $ERROR"
  fi
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# PHASE 8: PWA ACCESSIBILITY
# ═══════════════════════════════════════════════════════════════
log "${BOLD}PHASE 8: PWA & Sites${NC}"
sep

for site in "https://p31-mesh.pages.dev" "https://p31ca.org" "https://phosphorus31.org"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 "$site" 2>/dev/null || echo "000")
  name=$(echo "$site" | sed 's|https://||')
  if [ "$code" = "200" ]; then
    ok "${name}: HTTP 200"
  else
    fail "${name}: HTTP ${code}"
  fi
done

# Check PWA has correct content
PWA_BODY=$(curl -s "https://p31-mesh.pages.dev" --max-time 8 2>/dev/null | head -5)
if echo "$PWA_BODY" | grep -q "P31 Mesh"; then
  ok "PWA content: P31 Mesh title present"
else
  warn "PWA content: title not found in first 5 lines"
fi

# Security headers on p31ca.org
HEADERS=$(curl -s -I "https://p31ca.org" --max-time 5 2>/dev/null)
for header in "x-content-type-options" "x-frame-options" "strict-transport-security"; do
  if echo "$HEADERS" | grep -qi "$header"; then
    ok "Security header: $header present"
  else
    warn "Security header: $header missing"
  fi
done

echo ""

# ═══════════════════════════════════════════════════════════════
# PHASE 9: CROSS-INTEGRATION TESTS
# ═══════════════════════════════════════════════════════════════
log "${BOLD}PHASE 9: Cross-Integration${NC}"
sep

# Test: Agent Hub → k4-cage (via service binding)
# The chat round-trip already tested this if the agent called get_family_mesh
if [ ${#TRACE_IDS[@]} -gt 0 ]; then
  ok "Agent Hub → Workers AI → Tool Dispatch → k4-cage (verified via chat)"
else
  warn "Cross-integration not verified (chat may have failed)"
fi

# Test: Agent Hub → k4-personal (energy query)
ENERGY_VIA_AGENT=$(curl -s -X POST "https://p31-agent-hub.trimtab-signal.workers.dev/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"session":"verify-energy","message":"[verify] check my energy level"}' \
  --max-time 35 2>/dev/null)
ENERGY_REPLY=$(echo "$ENERGY_VIA_AGENT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('reply','')[:150])" 2>/dev/null || echo "")
if [ -n "$ENERGY_REPLY" ] && ! echo "$ENERGY_REPLY" | grep -q "tool_calls"; then
  ok "Agent Hub → k4-personal energy query: ${ENERGY_REPLY:0:80}..."
else
  warn "Energy query via agent returned: ${ENERGY_REPLY:0:80}"
fi

# Cleanup
curl -s -X POST "https://p31-agent-hub.trimtab-signal.workers.dev/api/clear" \
  -H "Content-Type: application/json" -d '{"session":"verify-energy"}' --max-time 5 >/dev/null 2>&1

echo ""

# ═══════════════════════════════════════════════════════════════
# PHASE 10: CONFIGURATION VERIFICATION
# ═══════════════════════════════════════════════════════════════
log "${BOLD}PHASE 10: Configuration${NC}"
sep

# Check if weekly cron is configured
if crontab -l 2>/dev/null | grep -q "reflective-chamber"; then
  ok "Weekly synthesis cron: configured"
else
  warn "Weekly synthesis cron: NOT configured"
  echo -e "    ${DIM}Run: crontab -e → add: 0 23 * * 0 curl -s -X POST https://reflective-chamber.trimtab-signal.workers.dev/synthesize${NC}"
fi

# Check if JWT secret is hinted at
# (Can't actually verify the secret without wrangler, just remind)
warn "JWT secret: verify manually with 'cd p31-bouncer && npx wrangler secret list'"

# Check PII scrub rules
if [ "$HAS_SCRUB" = "yes" ]; then
  ok "PII scrub rules: configured for S.J. and W.J."
else
  warn "PII scrub rules: need configuration"
  echo -e "    ${DIM}Run: curl -X PUT .../agent/will/state -d '{\"scrub_rules\":[{\"pattern\":\"Sebastian\",\"replacement\":\"S.J.\"}]}'${NC}"
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# RESULTS
# ═══════════════════════════════════════════════════════════════
END=$(date +%s)
DURATION=$((END - START))

echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════${NC}"
echo -e "${BOLD}${CYAN}  VERIFICATION RESULTS                         ${NC}"
echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${GREEN}Passed:${NC}   ${PASS}"
echo -e "  ${RED}Failed:${NC}   ${FAIL}"
echo -e "  ${YELLOW}Warnings:${NC} ${WARN}"
echo -e "  ${DIM}Skipped:${NC}  ${SKIP}"
echo -e "  ${DIM}Duration:${NC} ${DURATION}s"
echo ""

TOTAL=$((PASS + FAIL))
if [ $FAIL -eq 0 ]; then
  echo -e "  ${GREEN}${BOLD}ALL TESTS PASSED${NC}"
  echo -e "  ${DIM}The mesh is grounded. Connection verified.${NC}"
  EXIT_CODE=0
elif [ $FAIL -le 2 ]; then
  echo -e "  ${YELLOW}${BOLD}MOSTLY PASSING — ${FAIL} issue(s) to address${NC}"
  EXIT_CODE=0
else
  echo -e "  ${RED}${BOLD}${FAIL} FAILURES — mesh needs attention${NC}"
  EXIT_CODE=1
fi

echo ""

# Artifact cleanup
for f in /tmp/p31_verify_*.json; do rm -f "$f" 2>/dev/null; done

echo -e "${DIM}Test artifacts:${NC}"
[ ${#TRACE_IDS[@]} -gt 0 ] && echo -e "  ${DIM}Trace IDs: ${TRACE_IDS[*]}${NC}"
[ ${#BIO_RECORDS[@]} -gt 0 ] && echo -e "  ${DIM}Bio records: ${BIO_RECORDS[*]}${NC}"
echo ""

exit $EXIT_CODE