# L.O.V.E. Economy Integration Guide
**How to use the L.O.V.E. economy in your code**

---

## Quick Start

### 1. Initialize Game Engine

```typescript
import { GameEngine } from './core/GameEngine';

const gameEngine = new GameEngine();
await gameEngine.init();
```

### 2. Reward LOVE Tokens

```typescript
// Reward for placing a block
gameEngine.rewardLoveForAction('BLOCK_PLACED', { pieceId: 'piece_123' });

// Reward for milestone
gameEngine.rewardLoveForAction('MILESTONE_REACHED', { 
  challengeId: 'challenge_456',
  challengeTitle: 'Build a Bridge'
});

// Record PING (verified contact)
gameEngine.recordPing('target_member_id');

// Record DONATION (external crypto)
gameEngine.recordDonation(0.1, 'ETH'); // 0.1 ETH, no LOVE awarded
```

### 3. Check Wallet Balance

```typescript
const walletIntegration = gameEngine.getWalletIntegration();
const memberId = 'node_one'; // Bash

// Get total balance
const balance = walletIntegration.getBalance(memberId);

// Get pool balances
const sovereigntyPool = walletIntegration.getSovereigntyPool(memberId);
const performancePool = walletIntegration.getPerformancePool(memberId);

// Get both pools
const pools = walletIntegration.getPools(memberId);
console.log(`Sovereignty: ${pools.sovereigntyPool}, Performance: ${pools.performancePool}`);
```

### 4. Check Vesting Status

```typescript
const vestingManager = gameEngine.getVestingManager();

// Get vesting status
const status = vestingManager.getVestingStatus('node_one');
console.log(`Phase: ${status.phase}, Age: ${status.age}`);
console.log(`Can earn: ${status.canEarn}, Can spend: ${status.canSpend}`);

// Check if action is allowed
const canSpend = gameEngine.canPerformAction('node_one', 'spend', false);
if (canSpend) {
  // Allow spending
} else {
  // Require guardian approval
}
```

### 5. Record Care Interactions

```typescript
const proofOfCare = gameEngine.getProofOfCareManager();

// Record a care interaction
const metrics = gameEngine.recordCareInteraction({
  memberId: 'node_one',
  interactionTime: new Date(),
  hrvSync: 0.8,              // HRV sync at 0.1 Hz (0-1)
  interactionDuration: 30,    // Minutes
  engagementDepth: 0.9,      // 0-1, subjective
  tasksVerified: 2           // Count of verified tasks
});

// Verify a care task (called by child's device)
gameEngine.verifyCareTask('node_one', 'task_123', 'Helped with homework');

// Get care score
const careScore = proofOfCare.getCareScore('node_one');
console.log(`Care Score: ${careScore.totalScore}`);
```

---

## Transaction Types

### All 10 Types

```typescript
// 1. BLOCK_PLACED (1.0 LOVE)
gameEngine.rewardLoveForAction('BLOCK_PLACED', { pieceId: 'piece_123' });

// 2. COHERENCE_GIFT (5.0 LOVE)
gameEngine.rewardLoveForAction('COHERENCE_GIFT', { quantumState: '...' });

// 3. ARTIFACT_CREATED (10.0 LOVE)
gameEngine.rewardLoveForAction('ARTIFACT_CREATED', { artifactId: 'artifact_456' });

// 4. CARE_RECEIVED (3.0 LOVE)
gameEngine.rewardLoveForAction('CARE_RECEIVED', { fromMemberId: 'parent' });

// 5. CARE_GIVEN (2.0 LOVE)
gameEngine.rewardLoveForAction('CARE_GIVEN', { toMemberId: 'node_one' });

// 6. TETRAHEDRON_BOND (15.0 LOVE)
gameEngine.rewardLoveForAction('TETRAHEDRON_BOND', { 
  memberIds: ['node_one', 'node_two', 'parent', 'guardian'] 
});

// 7. VOLTAGE_CALMED (2.0 LOVE)
gameEngine.rewardLoveForAction('VOLTAGE_CALMED', { voltageLevel: 6.5 });

// 8. MILESTONE_REACHED (25.0 LOVE)
gameEngine.rewardLoveForAction('MILESTONE_REACHED', { 
  challengeId: 'challenge_789',
  challengeTitle: 'Master Builder'
});

// 9. PING (1.0 LOVE)
gameEngine.recordPing('target_member_id');

// 10. DONATION (0 crypto value)
gameEngine.recordDonation(0.1, 'ETH');
```

---

## Pool Allocation

### How It Works

Every LOVE reward is automatically split:
- **50% to Sovereignty Pool** (immutable, kids, locked until age 18)
- **50% to Performance Pool** (dynamic, earned, adjusted by Care Score)

### Performance Pool Adjustment

The Performance Pool is adjusted based on Care Score:
- Higher Care Score = Higher Performance Pool contribution
- Formula: `performanceAmount = baseAmount * (0.5 + careScore / 100)`

Example:
- Base reward: 10.0 LOVE
- Base split: 5.0 Sovereignty + 5.0 Performance
- Care Score: 10.0
- Adjusted: 5.0 Sovereignty + 5.5 Performance (10% increase)

---

## Vesting Phases

### Trust Phase (Age 0-12)

```typescript
const status = vestingManager.getVestingStatus('node_one'); // Age 10
// status.phase = 'trust'
// status.canEarn = true
// status.canSpend = false
// status.requiresGuardianApproval = true
// status.votingPower = 0
```

### Apprenticeship Phase (Age 13-17)

```typescript
const status = vestingManager.getVestingStatus('teen_member'); // Age 15
// status.phase = 'apprenticeship'
// status.canEarn = true
// status.canSpend = false (can propose with approval)
// status.requiresGuardianApproval = true
// status.votingPower = 10
```

### Sovereignty Phase (Age 18+)

```typescript
const status = vestingManager.getVestingStatus('adult_member'); // Age 20
// status.phase = 'sovereignty'
// status.canEarn = true
// status.canSpend = true
// status.requiresGuardianApproval = false
// status.votingPower = 100
```

---

## Proof of Care

### Recording Interactions

```typescript
// Record interaction with HRV sync
const metrics = proofOfCare.recordInteraction({
  memberId: 'node_one',
  interactionId: 'interaction_123',
  interactionTime: new Date(),
  hrvSync: 0.8,              // HRV sync at 0.1 Hz
  interactionDuration: 45,   // Minutes
  engagementDepth: 0.9,      // 0-1
  tasksVerified: 3           // Verified tasks
});
```

### Calculating Care Score

```typescript
const careScore = proofOfCare.getCareScore('node_one');
// careScore.totalScore = Σ(T_prox × Q_res) + Tasks_verified
// careScore.interactionScores = [0.72, 0.45, ...]
// careScore.tasksScore = 5
```

### Bond Strength

```typescript
// Check bond strength for tetrahedron bond
const memberIds = ['node_one', 'node_two', 'parent', 'guardian'];
const bondStrength = proofOfCare.getBondStrength(memberIds);
// bondStrength: 0-1 (higher = stronger bond)

// Check if bond has decayed
const hasDecayed = proofOfCare.hasBondDecayed(memberIds);
// hasDecayed: true if no interaction for 30+ days
```

---

## Access Control

### Check Permissions

```typescript
// Check if member can perform action
const canSpend = gameEngine.canPerformAction('node_one', 'spend', false);
if (!canSpend) {
  // Require guardian approval
  const withApproval = gameEngine.canPerformAction('node_one', 'spend', true);
  if (withApproval) {
    // Guardian approved, allow spending
  }
}
```

### Actions

- `'earn'` — Can earn LOVE tokens
- `'spend'` — Can spend LOVE tokens
- `'transfer'` — Can transfer LOVE (soulbound, usually false)
- `'deploy'` — Can deploy smart contracts
- `'create_challenge'` — Can create challenges

---

## Founding Nodes

### Auto-Initialized

The vesting manager automatically initializes:
- **node_one** (Bash, S.J.) — Born March 10, 2016, Age 10, Trust phase
- **node_two** (Willow, W.J.) — Born August 8, 2019, Age 6, Trust phase

### Register Additional Members

```typescript
vestingManager.registerMember({
  memberId: 'new_member',
  memberName: 'New Member',
  birthdate: new Date('2010-01-01'),
});
```

---

## Best Practices

### 1. Always Check Vesting Status

```typescript
const status = gameEngine.getVestingStatus(memberId);
if (!status.canEarn) {
  throw new Error('Member cannot earn LOVE in current phase');
}
```

### 2. Record Care Interactions Regularly

```typescript
// Record after meaningful interaction
gameEngine.recordCareInteraction({
  memberId: 'node_one',
  interactionTime: new Date(),
  hrvSync: 0.8,
  interactionDuration: 30,
  engagementDepth: 0.9,
  tasksVerified: 1,
});
```

### 3. Verify Tasks from Child's Device

```typescript
// When child's device confirms task completion
gameEngine.verifyCareTask('node_one', 'task_123', 'Completed homework');
```

### 4. Use Pool Methods for Display

```typescript
// Show both pools separately
const pools = walletIntegration.getPools(memberId);
console.log(`Sovereignty Pool: ${pools.sovereigntyPool} LOVE`);
console.log(`Performance Pool: ${pools.performancePool} LOVE`);
console.log(`Total: ${pools.sovereigntyPool + pools.performancePool} LOVE`);
```

---

## Error Handling

### Wallet Not Found

```typescript
const balance = walletIntegration.getBalance('non_existent');
if (balance === 0) {
  // Member not found or no balance
}
```

### Invalid Transaction

```typescript
const success = walletIntegration.rewardLove(memberId, -10, 'Invalid', 'bonus');
if (!success) {
  // Transaction failed (invalid amount, member not found, etc.)
}
```

### Vesting Restrictions

```typescript
const canSpend = gameEngine.canPerformAction(memberId, 'spend', false);
if (!canSpend) {
  // Member cannot spend in current phase
  // Require guardian approval or wait for phase transition
}
```

---

## Examples

### Complete Example: Reward for Building

```typescript
// 1. Check if member can earn
const status = gameEngine.getVestingStatus('node_one');
if (!status.canEarn) {
  throw new Error('Cannot earn in Trust phase without guardian approval');
}

// 2. Reward LOVE for placing block
gameEngine.rewardLoveForAction('BLOCK_PLACED', { pieceId: 'piece_123' });

// 3. Get updated balance
const pools = gameEngine.getWalletIntegration().getPools('node_one');
console.log(`Sovereignty: ${pools.sovereigntyPool}, Performance: ${pools.performancePool}`);

// 4. Record care interaction
gameEngine.recordCareInteraction({
  memberId: 'node_one',
  interactionTime: new Date(),
  hrvSync: 0.7,
  interactionDuration: 15,
  engagementDepth: 0.8,
  tasksVerified: 0,
});
```

---

## API Reference

### GameEngine Methods

- `rewardLoveForAction(action, metadata)` — Reward LOVE for game action
- `recordPing(targetMemberId?)` — Record PING transaction
- `recordDonation(cryptoValue, currency)` — Record donation
- `getVestingStatus(memberId)` — Get vesting status
- `canPerformAction(memberId, action, guardianApproved)` — Check permissions
- `recordCareInteraction(data)` — Record care interaction
- `verifyCareTask(memberId, taskId, description)` — Verify care task
- `getWalletIntegration()` — Get wallet integration
- `getVestingManager()` — Get vesting manager
- `getProofOfCareManager()` — Get Proof of Care manager

### WalletIntegration Methods

- `rewardLove(memberId, amount, description, source)` — Reward LOVE (splits 50/50)
- `getBalance(memberId)` — Get total balance
- `getSovereigntyPool(memberId)` — Get sovereignty pool
- `getPerformancePool(memberId)` — Get performance pool
- `getPools(memberId)` — Get both pools
- `getProofOfCare()` — Get Proof of Care manager

### VestingManager Methods

- `registerMember(config)` — Register member with birthdate
- `calculateAge(birthdate)` — Calculate age
- `getVestingPhase(age)` — Get phase from age
- `getVestingStatus(memberId)` — Get full vesting status
- `canPerformAction(memberId, action, guardianApproved)` — Check permissions

### ProofOfCareManager Methods

- `calculateTimeProximity(interactionTime)` — Calculate T_prox
- `calculateQualityResonance(hrvSync, duration, engagement)` — Calculate Q_res
- `calculateCareScore(metrics)` — Calculate Care Score
- `recordInteraction(data)` — Record care interaction
- `getCareScore(memberId)` — Get care score
- `verifyTask(memberId, taskId, description)` — Verify task
- `getBondStrength(memberIds)` — Get bond strength
- `hasBondDecayed(memberIds)` — Check bond decay

---

**💜 With love and light. As above, so below. 💜**
