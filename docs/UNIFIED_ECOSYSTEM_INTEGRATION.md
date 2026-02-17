# Unified P31 Ecosystem — Integration Roadmap

**Quantum Geodesic Platform + P31 Donation Wallet + Node One (NODE ONE hardware)**

This document maps the unified vision to the existing codebase and defines phased integration work. The mesh holds your creations; the wallet holds your assets; Node One holds your keys.

---

## 1. Architecture Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                   Quantum Geodesic Platform (p31/ui + SUPER-CENTAUR)  │
│  World Builder │ Marketplace │ Coherence (LOVE/CT) │ Portal Network   │
│         └──────────────────────┬──────────────────────┘               │
│                    Coherence Token (CT) — ERC-20 on L2               │
└─────────────────────────────────┼───────────────────────────────────┘
                                  │
┌─────────────────────────────────┼───────────────────────────────────┐
│            P31 Donation Wallet (Chrome Extension, phenix-donation-*)  │
│  Stealth Addresses │ Memo-to-File │ Hardware Bridge │ RPC / ERC-20    │
└─────────────────────────────────┼───────────────────────────────────┘
                                  │
┌─────────────────────────────────┼───────────────────────────────────┐
│            Node One (ESP32-S3) — firmware in donation-wallet-v2       │
│  Keccak256 │ RLP │ secp256k1 signing │ WebUSB │ DRV2605L haptic       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Naming Alignment

| Concept | Vision Doc | P31 Codex / Codebase | Integration |
|--------|------------|------------------------|-------------|
| In-world reward | Coherence Token (CT) | L.O.V.E. / P31 Spark | **CT** = on-chain ERC-20 representation; 1 CT = 1 LOVE unit for withdrawal/settlement |
| Platform economy | Coherence Tokens | LOVE amounts (BLOCK_PLACED 1.0, etc.) | GameEngine + P31Wallet use LOVE; wallet + chain use CT |
| Hardware device | Node One | NODE ONE (ESP32-S3) | Same; firmware in `phenix-donation-wallet-v2/donation-wallet-v2/firmware/` |
| Donation receiver | Donation Wallet | P31 Donation Wallet | Chrome extension in `phenix-donation-wallet-v2/donation-wallet-v2/` |

---

## 3. Key File Map

### Donation Wallet (phenix-donation-wallet-v2)

| File | Role |
|------|------|
| `lib/rpc.js` | ETH JSON-RPC; **extend for ERC-20** (balanceOf, transfer, getLogs for Transfer) |
| `lib/tokens.js` | **NEW** — CT contract address(es) per chain, ERC-20 helpers |
| `lib/memo.js` | Memo-to-File; **extend** with PLATFORM_SALE / CT_WITHDRAWAL and optional platform context (world, structure_id) |
| `lib/stealth.js` | ERC-5564 stealth; reuse for CT transfers to stealth addresses |
| `lib/vault.js` | Keys; no change for Phase A |
| `background.js` | Stealth scan + message router; **add** CT transfer scan and `chrome.runtime.sendMessage` to platform |
| `pages/donate-portal.html` | Donor stealth address; can be reused as payment portal for marketplace |

### Platform (p31)

| File | Role |
|------|------|
| `ui/src/components/3d/QuantumClock.tsx` | Cuckoo on measurement; **add** WebUSB status, donation/CT received trigger |
| `ui/src/components/Marketplace/Marketplace.tsx` | CT mock API; **add** “Withdraw to Wallet” and real CT balance from extension |
| `ui/src/components/WorldBuilder/WorldBuilder.tsx` | Hosts QuantumClock; passes `lastMeasurementAt`; **extend** for donation/CT event |
| `ui/src/stores/coherence.store.ts` | Coherence state; optional: `lastDonationAt` / `lastCTReceivedAt` for clock |
| `geodesic-platform/src/api/index.ts` | `/api/marketplace`, `/api/marketplace/buy`; **add** withdrawal endpoint that returns signed payload for wallet |
| `SUPER-CENTAUR/src/engine/core/GameEngine.ts` | LOVE rewards; source of truth for “withdrawable” balance (or sync from backend) |

### Node One Firmware

| File | Role |
|------|------|
| `firmware/phenix_wallet_webusb.ino` | WebUSB + APDU; used by extension for signing; platform can use same for auth |

---

## 4. Integration Phases (Concrete)

### Phase A: Wallet ↔ Platform Bridge (~2 weeks)

**Goal:** Platform can withdraw CT to a wallet-controlled address; wallet can hold and display CT; background can scan for CT transfers and notify.

| Step | Where | What |
|------|--------|------|
| A1 | `donation-wallet-v2/lib/rpc.js` | Add `getERC20Balance(rpcUrl, tokenAddress, account)`, `getERC20TransferLogs(rpcUrl, tokenAddress, fromBlock, toBlock)`. |
| A2 | `donation-wallet-v2/lib/tokens.js` | **NEW** — `P31_CT_ADDRESS` (or config per chain), `getCTBalance(rpcUrl, account)`, optional `getCTTransfers`. |
| A3 | `donation-wallet-v2/background.js` | After stealth scan, optionally run CT transfer scan for known stealth addresses; on CT received → `logMemo` (CT type) + `chrome.runtime.sendMessage` to open tabs (platform) with action `P31_CT_RECEIVED`. |
| A4 | Platform UI | “Withdraw to Wallet” in Marketplace or Coherence HUD: call extension (e.g. `chrome.runtime.sendMessage`) to get current stealth/receiving address; platform backend creates withdrawal (treasury → that address); show tx hash. |
| A5 | Platform API | Optional: `POST /api/withdraw-ct` (auth, amount, recipientAddress) — backend holds treasury key or uses relayer; returns tx hash for memo. |

**Phase A foundation (implemented):** `rpc.js` has `getERC20Balance`, `getERC20TransferLogs`; **NEW** `lib/tokens.js` has `P31_CT_BY_CHAIN`, `getCTContractAddress`, `getCTBalance`, `getCTTransfersTo`; `memo.js` has types `CT_RECEIVED`/`CT_WITHDRAWAL`/`PLATFORM_SALE`, optional `world`/`structure_id`/`source`, `logCTReceived`, `logPlatformSale`, and extended provenance. **Remaining:** background CT scan (A3), platform "Withdraw to Wallet" (A4), optional backend withdraw API (A5).

**Deliverables:** ERC-20 in rpc.js + tokens.js; CT scan in background; memo type for CT; platform “Withdraw to Wallet” flow documented and wired.

### Phase B: Node One as Platform Authenticator (~2 weeks)

| Step | Where | What |
|------|--------|------|
| B1 | Platform (ui) | Login flow: “Connect Node One” via WebUSB (reuse extension’s webusb.js or shared lib); send nonce; device signs; verify address. |
| B2 | Platform backend | Store `user_id → eth_address` (from Node One); high-value actions (e.g. world transfer, large CT withdraw) require re-sign with Node One. |
| B3 | Extension | Optional: expose “sign nonce for platform” so extension can use existing WebUSB bridge. |

### Phase C: Clock Integration (~1 week)

| Step | Where | What |
|------|--------|------|
| C1 | `QuantumClock.tsx` | Optional prop `onDonationOrCTReceived` or listen for extension message `P31_CT_RECEIVED` / `P31_DONATION_RECEIVED`; trigger cuckoo + glow. |
| C2 | Same | Optional WebUSB status: if extension exposes “Node One connected”, show “Connected” on or near clock. |
| C3 | `cuckooChirp.ts` | Already used for measurement chime; reuse or add celebratory chirp for donation/CT. |

### Phase D: Enhanced Memo Logging (~1 week)

| Step | Where | What |
|------|--------|------|
| D1 | `donation-wallet-v2/lib/memo.js` | Add memo types: `CT_RECEIVED`, `CT_WITHDRAWAL`, `PLATFORM_SALE`; extend `MemoEntry` with optional `world`, `structure_id`, `source` (e.g. “Sale of Sierpinski Tetrahedron (Depth 4)”); extend `buildProvenanceChain` for these. |
| D2 | Export format | Include platform context in `exportMemoLog()` so legal export has in-world provenance. |
| D3 | Platform | When creating withdrawal or sale, call extension `logMemo` with full platform context. |

---

## 5. Security Model (Reference)

| Asset | Custody | Authorization |
|-------|---------|----------------|
| Platform account | Browser / backend session | Password (low value) |
| CT &lt; 1000 | Extension vault | Vault password |
| CT ≥ 1000 | Node One hardware | Physical button |
| Mainnet ETH | Node One hardware | Physical button |
| Stealth viewing key | Session storage | Auto-clear on close |
| Stealth spending key | Node One | Physical button |

---

## 6. Messaging (Extension ↔ Platform)

- **Platform → Extension**
  - `getMetaAddress` / `generateStealthForDonor` — get receive address for withdrawal.
  - `logMemo` — with platform context (type, world, structure_id, amount, txHash).
  - `getCTBalance` — optional; if extension holds CT balance per address.

- **Extension → Platform**
  - From background: `chrome.runtime.sendMessage` to content script or to a known platform tab (e.g. by URL pattern) with actions:
    - `P31_DONATION_RECEIVED` (existing behavior: notification).
    - `P31_CT_RECEIVED` — new; platform can show glow + cuckoo on QuantumClock.

Platform pages must be loaded in a tab for sendMessage to reach them; alternatively use `chrome.storage.local` and platform polls, or a small listener in the platform origin that the extension injects or that loads from extension.

---

## 7. L.O.V.E. Economy ↔ CT

- **Earn:** World Builder + GameEngine reward LOVE (BLOCK_PLACED, COHERENCE_GIFT, etc.).
- **Store:** LOVE tracked in platform/backend; when “withdrawn”, converted to CT transfer (treasury → user’s stealth/address).
- **Spend:** Marketplace buys in CT (and optionally ETH); payment portal can use donation portal flow (stealth address).
- **Donate:** Existing stealth donation flow; memo traces to pre-marital provenance.
- **Prove:** Memo-to-File with platform context links digital creation to legal defense chain.

---

## 8. Next Steps

1. **Phase A first:** Implement ERC-20 in `rpc.js`, add `tokens.js`, extend memo for CT/platform, then background CT scan and “Withdraw to Wallet” in platform.
2. **CT contract:** Deploy Coherence Token (ERC-20) on Base L2 (or chosen L2); add address to `tokens.js` and wallet config.
3. **Platform backend:** Implement treasury or relayer for CT withdrawals and optional marketplace payment in CT.

The mesh holds. The wallet holds. Node One holds. Forever.
