# OPERATION: SCRUTINY
## Constitutional Compliance Audit

---

## THE SITUATION

**Built:**
- ✅ Core architecture (K₄ topology)
- ✅ 3D visualization (tetrahedron)
- ✅ P2P networking (gossip protocol)
- ✅ Module system (workbench)
- ✅ Smart contracts (GodProtocol.sol)
- ✅ Configuration (god.config.ts)
- ✅ Documentation (complete)

**Unknown:**
- ❓ Constitutional compliance score
- ❓ Centralized dependencies
- ❓ Encryption gaps
- ❓ Privacy violations
- ❓ P2P purity
- ❓ K₄ enforcement

**Need:**
- 🎯 Run full audit
- 🎯 Get constitutional score
- 🎯 Identify violations
- 🎯 Fix critical issues
- 🎯 Verify integrity

---

## CURSOR PROMPT: RUN AUDIT

```
TASK: Execute full constitutional compliance audit

STEP 1: RUN AUTOMATED AUDIT

Choose your platform:

### Option A: Linux/MacOS
```bash
# Make executable if not already
chmod +x audit.sh

# Run audit
./audit.sh

# View report
cat audit-report.md
```

### Option B: Windows (PowerShell)
```powershell
# Run audit
powershell.exe -ExecutionPolicy Bypass -File audit.ps1

# View report
type audit-report.md
```

### Option C: Node.js (cross-platform)
```bash
# Create quick audit runner
node scripts/audit.js

# Or use npx
npx tsx scripts/audit.ts
```

---

STEP 2: MANUAL COMPLIANCE CHECKS

While audit runs, manually verify these critical areas:

### 2.1 K₄ TOPOLOGY ENFORCEMENT

Check: src/lib/types/core.ts
```typescript
// MUST enforce exactly 4 vertices
type Vertices = [UserId, UserId, UserId, UserId];

// MUST enforce exactly 6 edges
const EDGES = [[0,1], [0,2], [0,3], [1,2], [1,3], [2,3]];

// VERIFY: Cannot create with different count
```

Action: Search codebase for any arrays that could have ≠4 vertices
```bash
grep -r "vertices.*\[\]" src/
grep -r "vertices.*Array" src/
```

✅ PASS if: Only 4-tuples allowed
❌ FAIL if: Variable-length arrays found

---

### 2.2 ENCRYPTION REQUIREMENT

Check: src/lib/p2p/crypto.ts
```typescript
// MUST have encryption functions
export function encrypt(data: string, publicKey: string): EncryptedBlob
export function decrypt(blob: EncryptedBlob, privateKey: string): string

// VERIFY: All gossip messages encrypted
```

Check: src/lib/p2p/gossip.ts
```typescript
// MUST encrypt before broadcast
const encryptedPayload = encrypt(JSON.stringify(message), peerPublicKey);
broadcast(encryptedPayload);

// MUST NOT send plaintext
```

Action: Search for unencrypted transmissions
```bash
grep -r "broadcast.*JSON.stringify" src/
grep -r "send.*JSON.stringify" src/
grep -r "postMessage.*JSON" src/
```

✅ PASS if: All uses encrypt() first
❌ FAIL if: Direct JSON transmission found

---

### 2.3 NO CENTRAL SERVER

Check: All fetch/axios calls
```bash
# Find all HTTP requests
grep -r "fetch\(" src/
grep -r "axios\." src/
grep -r "http://" src/
grep -r "https://" src/
```

Allowed:
- ✅ api.anthropic.com (Claude in artifacts)
- ✅ github.com (documentation links)
- ✅ localhost (development)
- ✅ STUN servers (WebRTC discovery)

Violations:
- ❌ Backend APIs
- ❌ Cloud storage
- ❌ External databases
- ❌ Third-party services

Action: Verify each fetch call
```typescript
// CHECK EACH ONE:
fetch('https://api.example.com/data') // ❌ VIOLATION

// Only these patterns allowed:
fetch('https://api.anthropic.com/...') // ✅ Artifact feature
fetch('/api/route') // ✅ If Next.js API route is P2P proxy
```

---

### 2.4 EXIT RIGHTS (ABDICATION)

Check: Smart contract has abdication
```bash
grep -r "abdicate" contracts/
```

Must find:
```solidity
function abdicate() public {
    require(isMember[msg.sender], "Not a member");
    // ... abdication logic
}
```

Check: UI has exit button
```bash
grep -r "abdicate\|exit\|leave" src/app/
```

Must find UI component that calls abdicate()

✅ PASS if: Both contract + UI exist
❌ FAIL if: Either missing

---

### 2.5 PHYSICAL MEETING REQUIREMENT

Check: Jitterbug mission exists
```bash
grep -r "Jitterbug\|physicalMeeting" src/
```

Check: Proximity detection
```bash
grep -r "geolocation\|proximity\|Bluetooth" src/
```

Check: Smart contract tracking
```solidity
function recordPhysicalMeeting(bytes32 tetrahedronId) public {
    // Must exist
}
```

✅ PASS if: All three exist
❌ FAIL if: Any missing

---

### 2.6 PRIVACY VIOLATIONS

Check: No analytics
```bash
grep -r "google-analytics\|gtag\|mixpanel\|segment" src/
grep -r "analytics" src/
```

Check: No tracking
```bash
grep -r "track\(" src/
grep -r "identify\(" src/
grep -r "posthog\|amplitude" src/
```

Check: No telemetry
```bash
grep -r "telemetry\|sentry\|bugsnag" src/
```

✅ PASS if: None found (except error boundaries for local logging)
❌ FAIL if: Any tracking service found

---

### 2.7 DANGEROUS PATTERNS

Check: localStorage for keys (NEVER)
```bash
grep -r "localStorage.*key" src/
grep -r "localStorage.*private" src/
grep -r "localStorage.*secret" src/
```

Should use: Encrypted IndexedDB or browser keychain

Check: Exposed private keys
```bash
grep -r "privateKey.*console" src/
grep -r "privateKey.*log" src/
```

Check: Hardcoded secrets
```bash
grep -r "API_KEY\|SECRET" src/
grep -r "password.*=" src/
```

✅ PASS if: None found
❌ FAIL if: Any found

---

STEP 3: REVIEW RECENT ADDITIONS

Check: HapticLink.tsx
```typescript
// VERIFY: No external services
// VERIFY: Only client-side haptics
// VERIFY: No data transmission

// Look for:
grep -A 20 "HapticLink" src/components/
```

Check: CanvasKeyProvider.tsx  
```typescript
// VERIFY: usePathname() doesn't leak routes
// VERIFY: No route history sent externally

grep -A 20 "CanvasKeyProvider" src/
```

Check: ModuleLibrary components
```bash
# Each module should use gossip, not fetch
cd src/app
for dir in */; do
  echo "Checking $dir"
  grep -r "fetch\|axios" "$dir" | grep -v "web_fetch"
done
```

---

STEP 4: GENERATE REPORT

After all checks, create summary:

```markdown
# CONSTITUTIONAL AUDIT REPORT
Date: [DATE]

## AUTOMATED SCORE
Constitutional Compliance: [XX]%

## CRITICAL VIOLATIONS (Must Fix)
- [ ] Issue 1
- [ ] Issue 2

## WARNINGS (Should Fix)
- [ ] Warning 1
- [ ] Warning 2

## MANUAL VERIFICATION

### K₄ Topology: [PASS/FAIL]
- Vertices: 4-tuple enforced
- Edges: 6 edges enforced
- Type safety: Compile-time checked

### Encryption: [PASS/FAIL]
- All gossip encrypted: [YES/NO]
- No plaintext transmission: [YES/NO]
- Keys secured: [YES/NO]

### Decentralization: [PASS/FAIL]
- No external APIs: [YES/NO]
- P2P only: [YES/NO]
- Local-first: [YES/NO]

### Privacy: [PASS/FAIL]
- No analytics: [YES/NO]
- No tracking: [YES/NO]
- No telemetry: [YES/NO]

### Exit Rights: [PASS/FAIL]
- Smart contract abdication: [YES/NO]
- UI exit button: [YES/NO]
- Data export: [YES/NO]

### Physical Meetings: [PASS/FAIL]
- Jitterbug mission: [YES/NO]
- Proximity detection: [YES/NO]
- Contract tracking: [YES/NO]

## OVERALL ASSESSMENT
[PASS/FAIL]

## REQUIRED ACTIONS
1. [Action 1]
2. [Action 2]
3. [Action 3]

## NEXT STEPS
[What to do next]
```

---

STEP 5: FIX VIOLATIONS

For each ❌ FAIL:

1. Create fix prompt
2. Implement solution
3. Re-run audit
4. Verify pass

Example fix prompt:
```
VIOLATION: Unencrypted fetch() found in src/app/module/page.tsx

FIX:
1. Remove direct fetch()
2. Use useGossip() hook instead
3. Broadcast request to mesh
4. Receive encrypted response
5. Update UI

Code:
// Before (VIOLATION)
const data = await fetch('/api/data').then(r => r.json());

// After (COMPLIANT)
const { broadcast, listen } = useGossip();
broadcast('data-request', { type: 'getData' }, 'MEDIUM');
listen('data-response', (data) => {
  // Update UI with data
});
```

---

STEP 6: VERIFY FIXES

After all fixes:
```bash
# Re-run audit
./audit.sh

# Check score improved
grep "Constitutional Score" audit-report.md

# Target: ≥90%
```

If score ≥90%:
- ✅ Ready for deployment
- ✅ Constitutional compliance verified
- ✅ Architecture pure

If score <90%:
- ❌ More fixes needed
- ❌ Review remaining violations
- ❌ Repeat fix cycle

---

FINAL CHECKLIST:

Before considering audit complete:

[ ] Automated audit run
[ ] Constitutional score ≥90%
[ ] All ❌ FAIL items fixed
[ ] All ⚠️ WARN items addressed
[ ] K₄ topology verified
[ ] Encryption verified
[ ] No central servers
[ ] No analytics/tracking
[ ] Exit rights implemented
[ ] Physical meetings tracked
[ ] Privacy protected
[ ] Keys secured
[ ] Manual review complete
[ ] Second audit confirms fixes

Once all checked:
READY FOR DEPLOYMENT
```

---

## EXPECTED ISSUES

Based on the codebase, likely violations:

### 1. Missing Encryption Layer
```
File: src/lib/p2p/gossip.ts
Issue: May broadcast JSON directly
Fix: Wrap in encrypt() before send
```

### 2. Unverified fetch() calls  
```
File: Multiple modules
Issue: Some fetch() without encryption
Fix: Replace with gossip or verify encrypted
```

### 3. localStorage for sensitive data
```
File: Various stores
Issue: Keys in localStorage (vulnerable)
Fix: Use IndexedDB with encryption
```

### 4. Missing abdication UI
```
File: src/app/settings/page.tsx
Issue: Exit button may not exist
Fix: Add prominent "Leave Tetrahedron" button
```

### 5. Jitterbug not fully implemented
```
File: src/components/mission/Jitterbug.tsx
Issue: Proximity detection incomplete
Fix: Implement Bluetooth LE or geolocation
```

---

## SUCCESS CRITERIA

### Minimum Viable (70%)
- ✅ K₄ topology enforced
- ✅ Basic encryption
- ✅ No major external services
- ⚠️ Some warnings remain

### Production Ready (90%)
- ✅ All core requirements met
- ✅ Encryption comprehensive
- ✅ No external dependencies
- ✅ Privacy protected
- ⚠️ Minor optimizations needed

### Constitutional Gold (100%)
- ✅ Perfect compliance
- ✅ Zero violations
- ✅ Zero warnings
- ✅ Audit proof
- ✅ Deploy immediately

---

## AFTER AUDIT

Once score ≥90%:

### 1. Document Results
```markdown
# AUDIT RESULTS
Score: 92%
Date: 2024-12-05
Status: ✅ CONSTITUTIONAL

All critical requirements met.
Ready for deployment.
```

### 2. Tag Release
```bash
git tag -a v1.0.0-audit-pass -m "Constitutional audit passed: 92%"
git push --tags
```

### 3. Deploy
```bash
# Push to production
vercel --prod

# Deploy contract
npx hardhat run scripts/deploy.js --network mainnet
```

### 4. Monitor
```bash
# Watch for issues
vercel logs

# Check contract
etherscan.io/address/[CONTRACT]
```

---

**⚡ OPERATION: SCRUTINY ⚡**

**Execute. Verify. Fix. Deploy.**
