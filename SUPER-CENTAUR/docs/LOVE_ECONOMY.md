# L.O.V.E. Economy Documentation
**Ledger of Ontological Volume and Entropy**

**Version:** 1.0  
**Last Updated:** 2026-02-14  
**Status:** Active Development

---

## What is L.O.V.E.?

**L.O.V.E.** stands for **Ledger of Ontological Volume and Entropy**. It's a soulbound token economy that rewards genuine care, creativity, and connection. Unlike traditional currencies, LOVE cannot be bought or transferred—it can only be earned through verified actions.

### Core Principle

> **"You can't buy LOVE. You can only earn it."**

This principle ensures that LOVE tokens represent real value created through care, creativity, and connection—not financial speculation or manipulation.

---

## Why Soulbound?

**Soulbound tokens** are permanently bound to the wallet that earned them. They cannot be:
- Transferred between wallets
- Sold or traded
- Used as currency

This design ensures that:
1. **LOVE represents genuine value** — earned through actions, not purchased
2. **No financial speculation** — LOVE cannot be hoarded or manipulated
3. **Focus on care** — the system rewards care, not capital

---

## Transaction Types

There are **10 transaction types** in the L.O.V.E. economy, each with a specific LOVE reward:

| Type | LOVE Amount | Trigger | Example |
|------|-------------|---------|---------|
| **BLOCK_PLACED** | 1.0 | Creative acts | Building a structure in the game |
| **COHERENCE_GIFT** | 5.0 | Sharing quantum state | Sharing a quantum coherence visualization |
| **ARTIFACT_CREATED** | 10.0 | Materialized creations | 3D printing a physical object |
| **CARE_RECEIVED** | 3.0 | Receiving care | Receiving help or support |
| **CARE_GIVEN** | 2.0 | Giving care | Helping someone else |
| **TETRAHEDRON_BOND** | 15.0 | 4-node connections | Forming a bond with 3+ family members |
| **VOLTAGE_CALMED** | 2.0 | Reducing entropy | Calming system stress or voltage |
| **MILESTONE_REACHED** | 25.0 | Major achievements | Completing a major challenge |
| **PING** | 1.0 | Verified contact | Verified contact with another node |
| **DONATION** | 0 (crypto) | External contribution | External crypto donation (no LOVE) |

### Why These Amounts?

- **CARE_RECEIVED (3.0) > CARE_GIVEN (2.0)**: Receiving care requires vulnerability, which is harder than giving care
- **MILESTONE_REACHED (25.0)**: Highest reward for major achievements
- **TETRAHEDRON_BOND (15.0)**: Rewards forming connections with multiple nodes
- **PING (1.0)**: Small reward for maintaining connection

---

## Pool Structure

LOVE tokens are split into **two pools** for each wallet:

### 1. Sovereignty Pool (50%)
- **Purpose**: Belongs to founding nodes (kids)
- **Nature**: Immutable, locked until vesting
- **Access**: Guardian proxy during Trust phase
- **Vesting**: Unlocks at age 18 (Sovereignty phase)

### 2. Performance Pool (50%)
- **Purpose**: Earned through Proof of Care
- **Nature**: Dynamic, based on verified presence + care tasks
- **Access**: Varies by vesting phase
- **Formula**: Based on time proximity, quality resonance, and verified tasks

### Why 50/50?

The 50/50 split ensures that:
- **Kids have a guaranteed pool** (Sovereignty) that grows with every transaction
- **Performance is rewarded** (Performance) based on actual care given
- **Both pools grow together**, creating a balanced economy

---

## Vesting Phases

LOVE tokens are subject to **vesting phases** based on age:

### Trust Phase (Age 0-12)
- **Access**: Read-only wallet view
- **Earning**: Can earn LOVE but cannot spend
- **Approval**: Parent/guardian approval required for all actions
- **Examples**: node one (Bash, age 10), node two (Willow, age 6)

### Apprenticeship Phase (Age 13-17)
- **Access**: Yield access, 10% voting power
- **Earning**: Can earn and propose transactions (with approval)
- **Participation**: Can participate in challenges
- **Restrictions**: Cannot deploy smart contracts

### Sovereignty Phase (Age 18+)
- **Access**: Full wallet control, 100% voting power
- **Earning**: Can earn, spend, and gift LOVE freely
- **Capabilities**: Can deploy contracts, create challenges, full sovereignty

### Phase Transitions

- **Trust → Apprenticeship**:** Automatic on 13th birthday
- **Apprenticeship → Sovereignty**: Automatic on 18th birthday
- **No reverse transitions**: Once in a phase, cannot go back

---

## Proof of Care Formula

The **Proof of Care** formula determines how much LOVE goes to the Performance Pool:

```
Care_Score = Σ(T_prox × Q_res) + Tasks_verified
```

Where:
- **T_prox** = Time proximity (0-1): Recent interaction = higher value
- **Q_res** = Quality resonance (0-1): Deeper engagement = higher value
- **Tasks_verified** = Count of verified care actions

### Components Explained

#### Time Proximity (T_prox)
- Measures how recent an interaction was
- Recent interactions (within 24 hours) = high value
- Old interactions (30+ days) = near-zero value
- Decay function: Half-life of 24 hours

#### Quality Resonance (Q_res)
- Measures depth of engagement
- Components:
  - **HRV sync** (50%): Heart rate variability sync at 0.1 Hz
  - **Duration** (30%): Length of interaction
  - **Engagement depth** (20%): Subjective measure of engagement

#### Tasks Verified
- Discrete care actions confirmed by child's device
- Examples: Helping with homework, playing together, emotional support
- Each verified task adds directly to the score

### Example Calculation

```
Interaction 1:
  T_prox = 0.8 (2 hours ago)
  Q_res = 0.9 (high HRV sync, long duration)
  Tasks_verified = 0
  Score = 0.8 × 0.9 = 0.72

Interaction 2:
  T_prox = 0.5 (12 hours ago)
  Q_res = 0.6 (moderate engagement)
  Tasks_verified = 2
  Score = (0.5 × 0.6) + 2 = 0.3 + 2 = 2.3

Total Care_Score = 0.72 + 2.3 = 3.02
```

---

## Base L2 Integration

LOVE tokens are deployed on **Base L2** (Coinbase's Layer 2 network) for:
- **Low gas costs**: ~$0.01 per transaction
- **Fast transactions**: Fast confirmation times
- **EVM compatibility**: Works with standard Ethereum tooling

### Offline-First Design

The L.O.V.E. economy is **offline-first**:
- All transactions stored locally first
- Blockchain sync is optional
- Works completely offline
- Syncs to Base L2 when online

### Chameleon Mode

The system operates in **"chameleon mode"**:
- **Offline**: Internal ledger (IndexedDB)
- **Online**: Base L2 settlement
- **Seamless transition** between modes

---

## Safety Systems

### Age-Appropriate Content
- **Trust phase**: Strict filtering, no adult content
- **Apprenticeship phase**: Moderate filtering
- **Sovereignty phase**: Minimal filtering

### Spending Limits
- **Daily earning cap**: Prevents grinding
- **Single transaction limit**: Max 100 LOVE per transaction
- **Rate limiting**: Prevents spam (e.g., PING)

### Anti-Abuse
- **No self-awarding**: Cannot award CARE_GIVEN to yourself
- **Duplicate prevention**: Rejects duplicate transactions within time window
- **Proof verification**: All transactions require proof of action

### Data Sovereignty
- **Local-first storage**: All data stored locally first
- **Exportable**: Wallet data can be exported
- **Deletable**: Right to forget (GDPR compliance)

---

## Technical Implementation

### Current Status

**Implemented:**
- ✅ Basic wallet system
- ✅ Transaction types (8/10)
- ✅ Reward system
- ✅ Safety manager

**In Progress:**
- ⚠️ Pool allocation (50/50 split)
- ⚠️ Vesting phases
- ⚠️ Proof of Care formula
- ⚠️ Smart contracts

**Planned:**
- 📋 PING transaction type
- 📋 DONATION transaction type
- 📋 Base L2 integration
- 📋 Offline sync

### Architecture

```
Game Engine
    ↓
Wallet Integration
    ↓
Wallet Manager
    ↓
Data Store (Local)
    ↓
Base L2 (Optional Sync)
```

---

## For Developers

### Adding a New Transaction Type

1. **Add to enum** in `GameEngine.ts`:
```typescript
const LOVE_REWARDS: Record<string, number> = {
  // ... existing types
  NEW_TYPE: 5.0,
};
```

2. **Add to tests** in `LoveTransactionTypes.test.ts`

3. **Update documentation** in this file

4. **Add to smart contract** (when implemented)

### Testing

Run all L.O.V.E. economy tests:
```bash
npm test -- LoveTransactionTypes
npm test -- VestingPhases
npm test -- ProofOfCare
npm test -- SafetySystems
```

---

## For Non-Technical Users

### What This Means for You

1. **Your kids earn LOVE** through playing, creating, and caring
2. **LOVE is split 50/50** between their sovereignty pool (locked) and performance pool (earned)
3. **LOVE cannot be transferred** — it's permanently bound to their wallet
4. **LOVE unlocks at age 18** — full sovereignty over their tokens
5. **LOVE represents real value** — earned through actions, not purchased

### How to Use

1. **Play the game**: Earn LOVE through building, challenges, and care
2. **Check balance**: View LOVE balance in wallet
3. **Track progress**: See how much LOVE is in each pool
4. **Wait for vesting**: LOVE unlocks at age 18

---

## Frequently Asked Questions

### Q: Can I buy LOVE tokens?
**A:** No. LOVE can only be earned through verified actions.

### Q: Can I transfer LOVE to someone else?
**A:** No. LOVE is soulbound and cannot be transferred.

### Q: What happens to LOVE when my child turns 18?
**A:** They gain full sovereignty over their LOVE tokens, including the sovereignty pool.

### Q: How is the 50/50 split calculated?
**A:** Every transaction splits 50% to Sovereignty Pool and 50% to Performance Pool.

### Q: What is Proof of Care?
**A:** A formula that measures care quality based on time proximity, quality resonance, and verified tasks.

### Q: Can LOVE be lost?
**A:** No. LOVE is permanently recorded and cannot be lost or destroyed.

---

## Roadmap

### Phase 1: Core Implementation (Current)
- [x] Basic wallet system
- [x] Transaction types (8/10)
- [x] Reward system
- [ ] Pool allocation
- [ ] Vesting phases

### Phase 2: Advanced Features
- [ ] Proof of Care formula
- [ ] Smart contracts
- [ ] Base L2 integration
- [ ] Offline sync

### Phase 3: Production
- [ ] Full test coverage
- [ ] Security audit
- [ ] Mainnet deployment
- [ ] User documentation

---

## References

- **Recon Report**: `src/engine/LOVE_ENGINE_RECON.md`
- **Contract Spec**: `src/engine/LOVE_TOKEN_CONTRACT_SPEC.md`
- **Test Files**: `src/engine/core/__tests__/`

---

**💜 With love and light. As above, so below. 💜**
