# LOVE Token Contract Specification
**ERC-20 Soulbound Token for L.O.V.E. Economy**

**Status:** Specification (Contracts not yet implemented)  
**Network:** Base L2  
**License:** Apache 2.0  
**Deployer:** P31 Labs multisig

---

## OVERVIEW

The LOVE token is a **soulbound ERC-20 token** that cannot be transferred between wallets. LOVE can only be earned through verified game actions and care interactions. This enforces the principle: **"You can't buy LOVE. You can only earn it."**

---

## CONTRACT SPECIFICATION

### Contract Name
`LoveToken` (ERC-20 Soulbound)

### Key Properties

1. **Soulbound (Non-Transferable)**
   - No `transfer()` function
   - No `transferFrom()` function
   - No `approve()` function
   - Tokens are permanently bound to the wallet that earned them

2. **Mint-Only**
   - Only the verified game engine can mint tokens
   - Minting requires proof of verified action
   - No purchase mechanism

3. **Pool Structure**
   - Each wallet tracks two pools:
     - **Sovereignty Pool (50%)**: Immutable, belongs to founding nodes (kids)
     - **Performance Pool (50%)**: Dynamic, earned through Proof of Care

4. **Uncapped Supply**
   - Inflationary by design
   - Care creates value
   - No maximum supply

---

## SOLIDITY INTERFACE

```solidity
// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LoveToken
 * @dev Soulbound ERC-20 token for L.O.V.E. economy
 * @notice Tokens cannot be transferred - they are permanently bound to the wallet
 */
contract LoveToken is ERC20, Ownable {
    // Game engine address (only can mint)
    address public gameEngine;
    
    // Pool structure
    struct WalletPools {
        uint256 sovereigntyPool;  // 50% - immutable, kids
        uint256 performancePool;  // 50% - dynamic, earned
    }
    
    // Mapping: wallet => pools
    mapping(address => WalletPools) public pools;
    
    // Transaction types
    enum TransactionType {
        BLOCK_PLACED,        // 1.0 LOVE
        COHERENCE_GIFT,      // 5.0 LOVE
        ARTIFACT_CREATED,    // 10.0 LOVE
        CARE_RECEIVED,       // 3.0 LOVE
        CARE_GIVEN,          // 2.0 LOVE
        TETRAHEDRON_BOND,    // 15.0 LOVE
        VOLTAGE_CALMED,      // 2.0 LOVE
        MILESTONE_REACHED,   // 25.0 LOVE
        PING,                // 1.0 LOVE
        DONATION             // 0 (crypto value)
    }
    
    // Transaction type => LOVE amount
    mapping(TransactionType => uint256) public transactionRewards;
    
    // Events
    event LoveMinted(
        address indexed to,
        TransactionType indexed txType,
        uint256 sovereigntyAmount,
        uint256 performanceAmount,
        uint256 totalAmount
    );
    
    event GameEngineUpdated(address indexed oldEngine, address indexed newEngine);
    
    /**
     * @dev Constructor
     * @param _gameEngine Address of the verified game engine
     */
    constructor(address _gameEngine) ERC20("L.O.V.E. Token", "LOVE") Ownable(msg.sender) {
        gameEngine = _gameEngine;
        
        // Initialize transaction rewards (in wei, 1 LOVE = 1e18)
        transactionRewards[TransactionType.BLOCK_PLACED] = 1e18;
        transactionRewards[TransactionType.COHERENCE_GIFT] = 5e18;
        transactionRewards[TransactionType.ARTIFACT_CREATED] = 10e18;
        transactionRewards[TransactionType.CARE_RECEIVED] = 3e18;
        transactionRewards[TransactionType.CARE_GIVEN] = 2e18;
        transactionRewards[TransactionType.TETRAHEDRON_BOND] = 15e18;
        transactionRewards[TransactionType.VOLTAGE_CALMED] = 2e18;
        transactionRewards[TransactionType.MILESTONE_REACHED] = 25e18;
        transactionRewards[TransactionType.PING] = 1e18;
        transactionRewards[TransactionType.DONATION] = 0;
    }
    
    /**
     * @dev Mint LOVE tokens (only game engine)
     * @param to Address to mint to
     * @param txType Transaction type
     * @param proof Proof of verified action (bytes32 hash)
     */
    function mint(
        address to,
        TransactionType txType,
        bytes32 proof
    ) external onlyGameEngine {
        uint256 amount = transactionRewards[txType];
        require(amount > 0, "Invalid transaction type");
        
        // Verify proof (implementation depends on verification system)
        require(verifyProof(txType, proof), "Invalid proof");
        
        // Split 50/50 between pools
        uint256 sovereigntyAmount = amount / 2;
        uint256 performanceAmount = amount / 2;
        
        // Update pools
        pools[to].sovereigntyPool += sovereigntyAmount;
        pools[to].performancePool += performanceAmount;
        
        // Mint total amount
        _mint(to, amount);
        
        emit LoveMinted(to, txType, sovereigntyAmount, performanceAmount, amount);
    }
    
    /**
     * @dev Get total balance (sovereignty + performance)
     */
    function balanceOf(address account) public view override returns (uint256) {
        WalletPools memory walletPools = pools[account];
        return walletPools.sovereigntyPool + walletPools.performancePool;
    }
    
    /**
     * @dev Get sovereignty pool balance
     */
    function sovereigntyPoolOf(address account) public view returns (uint256) {
        return pools[account].sovereigntyPool;
    }
    
    /**
     * @dev Get performance pool balance
     */
    function performancePoolOf(address account) public view returns (uint256) {
        return pools[account].performancePool;
    }
    
    /**
     * @dev Update game engine address (only owner)
     */
    function setGameEngine(address _gameEngine) external onlyOwner {
        address oldEngine = gameEngine;
        gameEngine = _gameEngine;
        emit GameEngineUpdated(oldEngine, _gameEngine);
    }
    
    /**
     * @dev Verify proof of action (implementation depends on verification system)
     */
    function verifyProof(TransactionType txType, bytes32 proof) internal view returns (bool) {
        // TODO: Implement proof verification
        // Could use:
        // - Merkle tree proofs
        // - Signature verification
        // - Oracle verification
        // - Off-chain verification with on-chain commitment
        return true; // Placeholder
    }
    
    /**
     * @dev Modifier: only game engine can mint
     */
    modifier onlyGameEngine() {
        require(msg.sender == gameEngine, "Only game engine can mint");
        _;
    }
    
    // ========== SOULBOUND ENFORCEMENT ==========
    
    /**
     * @dev Override transfer - DISABLED (soulbound)
     */
    function transfer(address, uint256) public pure override returns (bool) {
        revert("LOVE tokens are soulbound and cannot be transferred");
    }
    
    /**
     * @dev Override transferFrom - DISABLED (soulbound)
     */
    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert("LOVE tokens are soulbound and cannot be transferred");
    }
    
    /**
     * @dev Override approve - DISABLED (soulbound)
     */
    function approve(address, uint256) public pure override returns (bool) {
        revert("LOVE tokens are soulbound and cannot be approved");
    }
    
    /**
     * @dev Override allowance - Always returns 0 (soulbound)
     */
    function allowance(address, address) public pure override returns (uint256) {
        return 0;
    }
}
```

---

## SECURITY AUDIT CHECKLIST

### ✅ Reentrancy Protection
- No external calls in mint function
- No state changes after external calls
- Use OpenZeppelin's ReentrancyGuard if needed

### ✅ Integer Overflow Protection
- Solidity ≥0.8.0 has built-in overflow checks
- No manual overflow checks needed

### ✅ Access Control
- `onlyGameEngine` modifier for minting
- `onlyOwner` modifier for game engine updates
- No public minting function

### ✅ Soulbound Enforcement
- `transfer()` reverts
- `transferFrom()` reverts
- `approve()` reverts
- `allowance()` always returns 0

### ✅ Gas Optimization
- Use `uint256` for amounts (native type)
- Pack structs if possible
- Cache storage reads

### ✅ Base L2 Compatibility
- Compatible with Base L2 (EVM-compatible)
- Uses standard ERC-20 interface (minus transfer functions)
- Gas costs: ~$0.01 per transaction

---

## DEPLOYMENT PLAN

### Phase 1: Development
1. Write contract in Solidity
2. Test on local Hardhat network
3. Deploy to Base Sepolia testnet
4. Run comprehensive tests

### Phase 2: Mainnet Deployment
1. Deploy to Base L2 mainnet
2. Verify contract on BaseScan
3. Transfer ownership to P31 Labs multisig
4. Set game engine address

### Phase 3: Integration
1. Connect game engine to contract
2. Implement proof verification system
3. Test end-to-end minting flow
4. Monitor gas costs and optimize

---

## PROOF VERIFICATION SYSTEM

The contract needs a proof verification system to prevent fake mints. Options:

### Option 1: Merkle Tree Proofs
- Game engine maintains Merkle tree of verified actions
- Contract verifies Merkle proofs
- Pros: Efficient, verifiable
- Cons: Requires Merkle tree maintenance

### Option 2: Signature Verification
- Game engine signs verified actions
- Contract verifies signatures
- Pros: Simple, flexible
- Cons: Requires key management

### Option 3: Oracle Verification
- Off-chain oracle verifies actions
- Contract queries oracle
- Pros: Flexible, scalable
- Cons: Requires oracle infrastructure

### Option 4: Off-Chain Commitment
- Game engine commits to batch of actions
- Contract verifies commitment
- Pros: Efficient, batch processing
- Cons: Requires commitment scheme

**Recommendation:** Start with Option 2 (Signature Verification) for simplicity, migrate to Option 1 (Merkle Tree) for efficiency.

---

## GAS COST ESTIMATES

Based on Base L2 gas prices (~$0.01 per transaction):

- **Mint:** ~50,000 gas = ~$0.01
- **Query balance:** ~21,000 gas = ~$0.004
- **Query pools:** ~21,000 gas = ~$0.004

**Total cost per transaction:** ~$0.01 (meets spec requirement)

---

## TESTING REQUIREMENTS

### Unit Tests
- [ ] Mint with valid proof
- [ ] Reject mint with invalid proof
- [ ] Reject mint from non-game-engine
- [ ] Verify 50/50 pool split
- [ ] Verify soulbound (transfer fails)
- [ ] Verify soulbound (approve fails)
- [ ] Verify soulbound (allowance = 0)

### Integration Tests
- [ ] End-to-end minting flow
- [ ] Game engine integration
- [ ] Proof verification
- [ ] Pool tracking

### Security Tests
- [ ] Reentrancy attack
- [ ] Integer overflow
- [ ] Access control bypass
- [ ] Unauthorized minting

---

## OPEN QUESTIONS

1. **Proof Verification:** Which method to use?
2. **Batch Minting:** Should we support batch mints for efficiency?
3. **Pool Spending:** Can pools be spent separately, or only total balance?
4. **Vesting Integration:** How to integrate vesting phases with contract?
5. **Offline Sync:** How to sync offline transactions to blockchain?

---

## NEXT STEPS

1. **Implement contract** in Solidity
2. **Write tests** (Hardhat + Waffle)
3. **Deploy to testnet** (Base Sepolia)
4. **Audit contract** (internal + external)
5. **Deploy to mainnet** (Base L2)
6. **Integrate with game engine**

---

**💜 With love and light. As above, so below. 💜**
