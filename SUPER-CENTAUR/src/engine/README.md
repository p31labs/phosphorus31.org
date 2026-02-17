# L.O.V.E. Economy — Game Engine Module
**Ledger of Ontological Volume and Entropy**

---

## Overview

The L.O.V.E. economy is a soulbound token system that rewards genuine care, creativity, and connection. LOVE tokens cannot be bought or transferred—they can only be earned through verified actions.

**Core Principle:** *"You can't buy LOVE. You can only earn it."*

---

## Quick Start

```typescript
import { GameEngine } from './core/GameEngine';

// Initialize
const gameEngine = new GameEngine();
await gameEngine.init();

// Reward LOVE for game action
gameEngine.rewardLoveForAction('BLOCK_PLACED', { pieceId: 'piece_123' });

// Check balance
const pools = gameEngine.getWalletIntegration().getPools('node_one');
console.log(`Sovereignty: ${pools.sovereigntyPool}, Performance: ${pools.performancePool}`);
```

---

## Features

### ✅ Pool Allocation (50/50 Split)
Every LOVE reward splits:
- **50% to Sovereignty Pool** (immutable, kids, locked until age 18)
- **50% to Performance Pool** (dynamic, earned, adjusted by Care Score)

### ✅ All 10 Transaction Types
- BLOCK_PLACED (1.0 LOVE)
- COHERENCE_GIFT (5.0 LOVE)
- ARTIFACT_CREATED (10.0 LOVE)
- CARE_RECEIVED (3.0 LOVE)
- CARE_GIVEN (2.0 LOVE)
- TETRAHEDRON_BOND (15.0 LOVE)
- VOLTAGE_CALMED (2.0 LOVE)
- MILESTONE_REACHED (25.0 LOVE)
- PING (1.0 LOVE)
- DONATION (0 crypto value)

### ✅ Vesting Phases
- **Trust (0-12)**: Read-only, guardian approval required
- **Apprenticeship (13-17)**: Can propose, 10% voting, guardian approval
- **Sovereignty (18+)**: Full access, 100% voting

### ✅ Proof of Care Formula
**Formula:** `Care_Score = Σ(T_prox × Q_res) + Tasks_verified`

- **T_prox**: Time proximity (recent = higher)
- **Q_res**: Quality resonance (HRV sync + duration + engagement)
- **Tasks_verified**: Verified care actions

---

## Documentation

- **[Integration Guide](./INTEGRATION_GUIDE.md)** — Complete usage guide with examples
- **[Final Status](./FINAL_STATUS.md)** — Implementation status
- **[LOVE Economy Docs](../../docs/LOVE_ECONOMY.md)** — User-facing documentation
- **[Contract Spec](./LOVE_TOKEN_CONTRACT_SPEC.md)** — Smart contract specification

---

## Examples

See [`examples/love-economy-demo.ts`](./examples/love-economy-demo.ts) for a complete working example.

---

## Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- LoveTransactionTypes
npm test -- VestingPhases
npm test -- ProofOfCare
npm test -- SafetySystems
```

---

## Architecture

```
GameEngine
├── WalletIntegration (50/50 pool allocation)
├── VestingManager (age-based access control)
├── ProofOfCareManager (care score calculation)
└── WalletManager (multi-wallet system)
```

---

## API Reference

### GameEngine

```typescript
// Transaction types
rewardLoveForAction(action, metadata): void
recordPing(targetMemberId?): void
recordDonation(cryptoValue, currency): void

// Vesting
getVestingStatus(memberId): VestingStatus
canPerformAction(memberId, action, guardianApproved): boolean

// Proof of Care
recordCareInteraction(data): CareMetrics
verifyCareTask(memberId, taskId, description): boolean

// Wallet
getWalletIntegration(): WalletIntegration
getVestingManager(): VestingManager
getProofOfCareManager(): ProofOfCareManager
```

### WalletIntegration

```typescript
rewardLove(memberId, amount, description, source): boolean
getBalance(memberId): number
getSovereigntyPool(memberId): number
getPerformancePool(memberId): number
getPools(memberId): WalletPools
```

### VestingManager

```typescript
registerMember(config): void
calculateAge(birthdate): number
getVestingPhase(age): VestingPhase
getVestingStatus(memberId): VestingStatus
canPerformAction(memberId, action, guardianApproved): boolean
```

### ProofOfCareManager

```typescript
calculateTimeProximity(interactionTime): number
calculateQualityResonance(hrvSync, duration, engagement): number
calculateCareScore(metrics): CareScore
recordInteraction(data): CareMetrics
getCareScore(memberId): CareScore
verifyTask(memberId, taskId, description): boolean
getBondStrength(memberIds): number
```

---

## Founding Nodes

The system automatically initializes:
- **node one** (Bash, S.J.) — Born March 10, 2016, Age 10, Trust phase
- **node two** (Willow, W.J.) — Born August 8, 2019, Age 6, Trust phase

---

## Status

✅ **Production Ready**

All core features implemented:
- ✅ Pool allocation (50/50 split)
- ✅ All 10 transaction types
- ✅ Vesting phases
- ✅ Proof of Care formula
- ✅ Comprehensive tests
- ✅ Complete documentation

---

## License

AGPLv3 License

---

**💜 With love and light. As above, so below. 💜**
