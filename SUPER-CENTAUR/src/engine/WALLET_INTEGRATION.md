# Wallet Integration

**LOVE token economy integrated into the game engine**

## Overview

The game engine now fully integrates with the wallet system, allowing players to earn and transfer LOVE tokens through gameplay.

## Features

### 💰 LOVE Token Rewards

Players earn LOVE tokens for:
- **Challenge Completion**: Earn rewardLove amount when completing challenges
- **Building Structures**: Earn 1 LOVE per piece placed
- **Achievements**: Earn tokens for unlocking achievements
- **Daily Bonuses**: Earn tokens for daily login/play
- **Special Bonuses**: Earn tokens for special events

### 🔄 Token Transfers

Players can transfer LOVE tokens to other family members:
- Transfer between any two family wallets
- Transaction history tracking
- Balance validation before transfer

### 📊 Wallet Tracking

- Real-time balance updates
- Transaction history
- Reward history by source
- Total rewards tracking

## Usage

### Reward LOVE Tokens

```typescript
// Reward for challenge completion
gameEngine.rewardLoveTokens(memberId, 100, 'Challenge: Build a Bridge', 'challenge');

// Reward for building
gameEngine.rewardLoveTokens(memberId, 1, 'Building structure', 'build');

// Reward for achievement
gameEngine.rewardLoveTokens(memberId, 50, 'Achievement: Master Builder', 'achievement');
```

### Get Balance

```typescript
const balance = gameEngine.getPlayerWalletBalance(memberId);
console.log(`Player has ${balance} LOVE tokens`);
```

### Transfer Tokens

```typescript
const success = gameEngine.transferLoveTokens(
  'from_member_id',
  'to_member_id',
  50,
  'Gift for helping with challenge'
);
```

### Get Wallet Integration

```typescript
const walletIntegration = gameEngine.getWalletIntegration();

// Get reward history
const history = walletIntegration.getRewardHistory(memberId);

// Get total rewards by source
const challengeRewards = walletIntegration.getTotalRewards(memberId, 'challenge');
const buildRewards = walletIntegration.getTotalRewards(memberId, 'build');

// Get transactions
const transactions = walletIntegration.getTransactions(memberId, 20);
```

## Automatic Rewards

The game engine automatically rewards LOVE tokens for:

1. **Challenge Completion**: When `completeChallenge()` is called and succeeds
2. **Building**: When pieces are placed in build mode

## Integration Points

- **Challenge Engine**: Rewards LOVE on challenge completion
- **Build Mode**: Rewards LOVE for building structures
- **Player Progress**: Tracks total LOVE earned
- **Wallet Manager**: Handles all wallet operations
- **DataStore**: Persists wallet balances and transactions

## Transaction Types

- `reward`: System rewards to players
- `transfer`: Player-to-player transfers
- `mining`: Future mining rewards (not yet implemented)

## The Mesh Holds 🔺

Built with love and light. As above, so below. 💜
