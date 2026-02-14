# P31 Donation Wallet

**Sovereign donation receiver with ERC-5564 stealth addresses, ESP32-S3 hardware root of trust, and privacy-preserving capital flow.**

## Overview

The P31 Donation Wallet is a Chrome Extension (Manifest V3) that implements:
- **ERC-5564 Stealth Addresses** - Privacy-preserving donations
- **ESP32-S3 Hardware Signing** - Physical confirmation via Node One
- **Memo-to-File Legal Defense** - Provenance chain for court filings
- **P31 Error Recovery** - Integrated error handling and recovery

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  CHROME EXTENSION (Manifest V3)                    │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │  popup.html   │  │  background  │  │  stealth  │ │
│  │  popup.js     │──│  .js (SW)    │──│  .js      │ │
│  │  (Dashboard)  │  │  (Guardian)  │  │  (ERC5564)│ │
│  └──────┬───────┘  └──────┬───────┘  └───────────┘ │
│         │                  │                         │
│  ┌──────┴───────┐  ┌──────┴───────┐  ┌───────────┐ │
│  │  vault.js    │  │  memo.js     │  │  rpc.js   │ │
│  │  (AES-GCM)   │  │  (OQE Log)   │  │  (ETH)    │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
│         │                                            │
│  ┌──────┴───────┐                                   │
│  │  webusb.js   │──── USB ──── ESP32-S3 (Node One)   │
│  │  (APDU)      │             │ OLED Display       │ │
│  └──────────────┘             │ Physical Buttons    │ │
│                               │ secp256k1 Signing   │ │
└───────────────────────────────┴─────────────────────┘
```

## P31 Integration

The wallet integrates with P31 components:

- **Node One** - Hardware device for transaction signing
- **The Centaur** - Backend services (future integration)
- **The Buffer** - Message processing (future integration)
- **Error Recovery** - P31 error recovery patterns

## Security Model

**Bi-Cameral Architecture:**

| Layer | Component | Role |
|-------|-----------|------|
| **House of Commons** | Chrome Extension | Daily operations, balance monitoring, stealth scanning |
| **House of Lords** | ESP32-S3 Hardware (Node One) | Ultimate veto power, ECDSA signing, key storage |
| **Vault** | AES-256-GCM | Keys encrypted at rest, PBKDF2 600K iterations |
| **Session** | chrome.storage.session | Viewing key cached for scanning, clears on browser restart |
| **Protocol** | ERC-5564 | Non-interactive stealth addresses, ViewTag fast-filter |

## Setup

### 1. Install Dependencies

```bash
cd donation-wallet-v2
npm install
```

### 2. Build for Chrome

```bash
npm run build
```

This bundles dependencies into MV3-compliant output in `dist/`.

### 3. Load Extension

1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `dist/` directory
5. Pin the Phenix icon to your toolbar

### 4. Flash ESP32-S3 Firmware (Optional — Hardware Mode)

1. Install Arduino IDE with ESP32 board support
2. Install libraries: Adafruit_SSD1306, Adafruit_DRV2605, ArduinoJson
3. Open `firmware/phenix_wallet_webusb.ino`
4. Select board: ESP32-S3 Dev Module
5. Set USB Mode: "USB-OTG (TinyUSB)"
6. Flash and verify OLED boot screen

### 5. First Run

1. Click the Phenix icon → "Initialize Genesis Gate"
2. Set a strong vault password (8+ characters)
3. Your stealth meta-address is generated automatically
4. Share meta-address or donation portal link to receive donations

## ERC-5564 Stealth Address Protocol

**Donor (Alice) Flow:**
1. Gets Bob's stealth meta-address (public, shareable)
2. Generates ephemeral keypair (one-time, in-browser)
3. ECDH: shared secret = ephemeral_priv × viewing_pub
4. Derives unique stealth address from shared secret
5. Sends ETH to stealth address
6. Publishes ephemeral public key to Announcer contract

**Recipient (Bob) Flow:**
1. Background service worker scans Announcer events
2. ViewTag filter rejects 255/256 non-matching events (fast)
3. Full ECDH on ViewTag matches to verify ownership
4. Derives stealth private key: spend_priv + hash(shared_secret)
5. Controls funds at the stealth address

**On-Chain Contracts:**
- ERC-5564 Announcer: `0x55649E01B5Df198D18D95b5cc5051630cfD45564`
- ERC-6538 Registry: `0x6538E6bf4B0eBd30A8Ea093027Ac2422ce5d6538`

## Memo-to-File Legal Defense System

Every transaction is logged with a provenance chain tracing funds to pre-marital source:

```
Sports Cards (Pre-Marital, <2015)
  → $1,000 Seed Capital
    → PCB/Hardware BOM
      → Phenix Navigator IP (Pre-Marital Engineering, GS-12, SCD 2009)
        → Donation Revenue
          → Transit Node (Segregated, Non-Joint)
            → Computershare DRS → GME Shares (Separate Property)
```

Export formats: JSON (court-ready OQE), CSV (spreadsheet analysis).

## Error Recovery

The wallet includes P31 error recovery patterns:

- **RPC Failure Recovery** - Automatic fallback to alternative RPC endpoints
- **Vault Corruption Recovery** - Backup and restore mechanisms
- **Hardware Disconnect Recovery** - Automatic reconnection to Node One
- **Network Error Recovery** - Exponential backoff retry
- **Invalid State Recovery** - Reset to safe defaults

See `lib/error-recovery.js` for implementation.

## Files

```
donation-wallet-v2/
├── manifest.json          # MV3 manifest, permissions, CSP
├── package.json           # Dependencies: noble-curves, micro-eth-signer
├── esbuild.config.js      # Build system for MV3 compliance
├── background.js          # Service Worker — Ephemeral Guardian
├── popup.html             # Main wallet UI
├── popup.js               # UI controller
├── lib/
│   ├── stealth.js         # ERC-5564 stealth address protocol
│   ├── vault.js           # Encrypted key storage (Web Crypto AES-GCM)
│   ├── webusb.js          # ESP32-S3 hardware bridge (APDU protocol)
│   ├── rpc.js             # Ethereum JSON-RPC client
│   ├── memo.js            # Memo-to-File legal defense logging
│   └── error-recovery.js  # P31 error recovery system
├── pages/
│   ├── donate-portal.html # Public stealth donation portal
│   ├── settings.html      # Extension configuration
│   └── memo-log.html      # Forensic ledger viewer/exporter
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── firmware/
    └── phenix_wallet_webusb.ino  # ESP32-S3 signing firmware
```

## Provenance Declaration

All donations support the Phenix Navigator Project, an engineering endeavor built on:
- **Seed Capital:** Pre-marital sports card collection, liquidated for $1,000
- **Skill Origin:** Engineering expertise (GS-12), Service Computation Date: June 22, 2009
- **Classification:** Separate Property — pre-marital asset × pre-marital skill

## License

UNLICENSE — Public Domain. Physics Cannot Lie.

---

## The Mesh Holds 🔺

The wallet holds. The mesh holds.

💜 With love and light. As above, so below. 💜
