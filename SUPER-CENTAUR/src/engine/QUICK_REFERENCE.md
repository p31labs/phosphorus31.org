# L.O.V.E. Economy — Quick Reference Card

---

## 🎮 Common Operations

### Reward LOVE
```typescript
gameEngine.rewardLoveForAction('BLOCK_PLACED', { pieceId: 'piece_123' });
```

### Check Balance
```typescript
const pools = gameEngine.getWalletIntegration().getPools('node_one');
```

### Check Vesting
```typescript
const status = gameEngine.getVestingStatus('node_one');
```

### Record Care
```typescript
gameEngine.recordCareInteraction({
  memberId: 'node_one',
  interactionTime: new Date(),
  hrvSync: 0.8,
  interactionDuration: 30,
  engagementDepth: 0.9,
  tasksVerified: 2,
});
```

---

## 💰 Transaction Types & Rewards

| Type | LOVE | Use Case |
|------|------|----------|
| `BLOCK_PLACED` | 1.0 | Building in game |
| `COHERENCE_GIFT` | 5.0 | Sharing quantum state |
| `ARTIFACT_CREATED` | 10.0 | 3D printing object |
| `CARE_RECEIVED` | 3.0 | Receiving help |
| `CARE_GIVEN` | 2.0 | Helping someone |
| `TETRAHEDRON_BOND` | 15.0 | 4-node connection |
| `VOLTAGE_CALMED` | 2.0 | Reducing stress |
| `MILESTONE_REACHED` | 25.0 | Major achievement |
| `PING` | 1.0 | Verified contact |
| `DONATION` | 0 | External crypto |

---

## 🔒 Vesting Phases

| Phase | Age | Can Earn | Can Spend | Voting |
|-------|-----|----------|-----------|--------|
| **Trust** | 0-12 | ✅ | ❌ | 0% |
| **Apprenticeship** | 13-17 | ✅ | ⚠️ (with approval) | 10% |
| **Sovereignty** | 18+ | ✅ | ✅ | 100% |

---

## 📊 Pool Structure

```
Every Reward (e.g., 10.0 LOVE)
├── Sovereignty Pool: 5.0 LOVE (50%, immutable, kids)
└── Performance Pool: 5.0 LOVE (50%, dynamic, adjusted by Care Score)
```

---

## 💚 Proof of Care Formula

```
Care_Score = Σ(T_prox × Q_res) + Tasks_verified
```

- **T_prox**: Time proximity (recent = higher, 24h decay)
- **Q_res**: Quality resonance (HRV 50% + Duration 30% + Engagement 20%)
- **Tasks_verified**: Count of verified care actions

---

## 🔑 Key Methods

### GameEngine
- `rewardLoveForAction(type, metadata)`
- `recordPing(targetId?)`
- `recordDonation(cryptoValue, currency)`
- `getVestingStatus(memberId)`
- `canPerformAction(memberId, action, approved)`
- `recordCareInteraction(data)`
- `verifyCareTask(memberId, taskId, desc)`

### WalletIntegration
- `rewardLove(memberId, amount, desc, source)`
- `getBalance(memberId)`
- `getSovereigntyPool(memberId)`
- `getPerformancePool(memberId)`
- `getPools(memberId)`

---

## 🎯 Founding Nodes

- **node_one** (Bash) — Age 10, Trust phase
- **node_two** (Willow) — Age 6, Trust phase

---

## 📖 Full Docs

- **Integration Guide**: `INTEGRATION_GUIDE.md`
- **Demo Code**: `examples/love-economy-demo.ts`
- **User Docs**: `../../docs/LOVE_ECONOMY.md`

---

**💜 With love and light. As above, so below. 💜**
