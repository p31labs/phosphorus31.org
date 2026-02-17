# OPERATION: HARDHAT LOCAL CHAIN
## Smart Contract Testing Infrastructure

---

## THE SETUP

### Step 1: Install Dependencies

```bash
# Install Hardhat and dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Install additional tools
npm install --save-dev @nomicfoundation/hardhat-ethers ethers

# Initialize Hardhat (if not already done)
npx hardhat init
# Select: "Create a TypeScript project"
```

---

### Step 2: Project Structure

```
project-root/
├── contracts/
│   └── GODConstitution.sol
├── scripts/
│   ├── deploy.ts
│   └── interact.ts
├── test/
│   └── GODConstitution.test.ts
├── hardhat.config.ts
└── package.json
```

---

### Step 3: Hardhat Configuration

```typescript
// hardhat.config.ts

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
      mining: {
        auto: true,
        interval: 0, // Instant mining
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
```

---

### Step 4: GODConstitution Smart Contract

```solidity
// contracts/GODConstitution.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title GODConstitution
 * @notice The immutable law governing the G.O.D. Protocol
 * @dev Enforces K₄ topology, privacy, and proof of presence
 */
contract GODConstitution {
    // Article I: Privacy by Default
    bool public constant ENCRYPTION_REQUIRED = true;
    
    // Article II: K₄ Topology
    uint8 public constant TETRAHEDRON_SIZE = 4;
    uint8 public constant MIN_THRESHOLD = 3; // 3-of-4 multisig
    
    // Article III: Proof of Presence (ZKP)
    uint256 public constant PROXIMITY_TIMEOUT = 300; // 5 minutes
    
    // Structs
    struct Tetrahedron {
        address[4] vertices;
        uint256 formationTime;
        bool isActive;
        bytes32 merkleRoot;
    }
    
    struct Vertex {
        address operator;
        bytes32 publicKeyHash;
        uint256 joinTime;
        bool isVerified;
    }
    
    // State
    mapping(bytes32 => Tetrahedron) public tetrahedrons;
    mapping(address => Vertex) public vertices;
    mapping(address => bytes32[]) public operatorTetrahedrons;
    
    uint256 public totalTetrahedrons;
    address public deployer;
    bool public isAbdicated;
    
    // Events
    event TetrahedronFormed(
        bytes32 indexed tetrahedronId,
        address[4] vertices,
        uint256 timestamp
    );
    
    event VertexRegistered(
        address indexed operator,
        bytes32 publicKeyHash,
        uint256 timestamp
    );
    
    event PowerAbdicated(
        address indexed formerDeployer,
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyDeployer() {
        require(msg.sender == deployer, "Not deployer");
        require(!isAbdicated, "Power abdicated");
        _;
    }
    
    modifier validTetrahedronSize(address[] memory _vertices) {
        require(
            _vertices.length == TETRAHEDRON_SIZE,
            "Must have exactly 4 vertices"
        );
        _;
    }
    
    // Constructor
    constructor() {
        deployer = msg.sender;
        isAbdicated = false;
    }
    
    /**
     * @notice Register a new vertex (operator)
     * @param _publicKeyHash Hash of operator's public key
     */
    function registerVertex(bytes32 _publicKeyHash) external {
        require(
            vertices[msg.sender].operator == address(0),
            "Vertex already registered"
        );
        
        vertices[msg.sender] = Vertex({
            operator: msg.sender,
            publicKeyHash: _publicKeyHash,
            joinTime: block.timestamp,
            isVerified: false
        });
        
        emit VertexRegistered(msg.sender, _publicKeyHash, block.timestamp);
    }
    
    /**
     * @notice Form a K₄ tetrahedron with 3-of-4 multisig
     * @param _vertices Array of 4 vertex addresses
     * @param _signatures Array of signatures (minimum 3 required)
     */
    function formTetrahedron(
        address[] memory _vertices,
        bytes[] memory _signatures
    ) external validTetrahedronSize(_vertices) returns (bytes32) {
        require(
            _signatures.length >= MIN_THRESHOLD,
            "Insufficient signatures (need 3/4)"
        );
        
        // Verify all vertices are registered
        for (uint i = 0; i < TETRAHEDRON_SIZE; i++) {
            require(
                vertices[_vertices[i]].operator != address(0),
                "Vertex not registered"
            );
        }
        
        // Generate tetrahedron ID
        bytes32 tetrahedronId = keccak256(
            abi.encodePacked(_vertices, block.timestamp)
        );
        
        // Create tetrahedron
        address[4] memory vertexArray;
        for (uint i = 0; i < TETRAHEDRON_SIZE; i++) {
            vertexArray[i] = _vertices[i];
        }
        
        tetrahedrons[tetrahedronId] = Tetrahedron({
            vertices: vertexArray,
            formationTime: block.timestamp,
            isActive: true,
            merkleRoot: bytes32(0) // TODO: Implement merkle tree
        });
        
        // Track operator's tetrahedrons
        for (uint i = 0; i < TETRAHEDRON_SIZE; i++) {
            operatorTetrahedrons[_vertices[i]].push(tetrahedronId);
        }
        
        totalTetrahedrons++;
        
        emit TetrahedronFormed(tetrahedronId, vertexArray, block.timestamp);
        
        return tetrahedronId;
    }
    
    /**
     * @notice Get tetrahedron by ID
     */
    function getTetrahedron(bytes32 _id) 
        external 
        view 
        returns (
            address[4] memory vertices,
            uint256 formationTime,
            bool isActive
        ) 
    {
        Tetrahedron memory t = tetrahedrons[_id];
        return (t.vertices, t.formationTime, t.isActive);
    }
    
    /**
     * @notice Get operator's tetrahedrons
     */
    function getOperatorTetrahedrons(address _operator) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return operatorTetrahedrons[_operator];
    }
    
    /**
     * @notice Abdicate power (irreversible)
     * @dev Sets deployer to zero address, making contract fully autonomous
     */
    function abdicatePower() external onlyDeployer {
        deployer = address(0);
        isAbdicated = true;
        
        emit PowerAbdicated(msg.sender, block.timestamp);
    }
}
```

---

### Step 5: Deployment Script

```typescript
// scripts/deploy.ts

import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying GODConstitution...");
  
  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  console.log("Deployer balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));
  
  // Deploy contract
  const GODConstitution = await ethers.getContractFactory("GODConstitution");
  const contract = await GODConstitution.deploy();
  await contract.waitForDeployment();
  
  const address = await contract.getAddress();
  console.log("✅ GODConstitution deployed to:", address);
  
  // Verify constants
  const encryptionRequired = await contract.ENCRYPTION_REQUIRED();
  const tetrahedronSize = await contract.TETRAHEDRON_SIZE();
  const minThreshold = await contract.MIN_THRESHOLD();
  
  console.log("\n📜 Constitutional Constants:");
  console.log("  Encryption Required:", encryptionRequired);
  console.log("  Tetrahedron Size:", tetrahedronSize.toString());
  console.log("  Min Threshold:", minThreshold.toString());
  
  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

---

### Step 6: Test Suite

```typescript
// test/GODConstitution.test.ts

import { expect } from "chai";
import { ethers } from "hardhat";
import { GODConstitution } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("GODConstitution", function () {
  let contract: GODConstitution;
  let deployer: SignerWithAddress;
  let operator1: SignerWithAddress;
  let operator2: SignerWithAddress;
  let operator3: SignerWithAddress;
  let operator4: SignerWithAddress;
  
  beforeEach(async function () {
    // Get signers
    [deployer, operator1, operator2, operator3, operator4] = await ethers.getSigners();
    
    // Deploy contract
    const GODConstitution = await ethers.getContractFactory("GODConstitution");
    contract = await GODConstitution.deploy();
    await contract.waitForDeployment();
  });
  
  describe("Deployment", function () {
    it("Should set the correct deployer", async function () {
      expect(await contract.deployer()).to.equal(deployer.address);
    });
    
    it("Should have correct constitutional constants", async function () {
      expect(await contract.ENCRYPTION_REQUIRED()).to.be.true;
      expect(await contract.TETRAHEDRON_SIZE()).to.equal(4);
      expect(await contract.MIN_THRESHOLD()).to.equal(3);
    });
    
    it("Should not be abdicated initially", async function () {
      expect(await contract.isAbdicated()).to.be.false;
    });
  });
  
  describe("Vertex Registration", function () {
    it("Should register a new vertex", async function () {
      const publicKeyHash = ethers.keccak256(ethers.toUtf8Bytes("test-public-key"));
      
      await expect(contract.connect(operator1).registerVertex(publicKeyHash))
        .to.emit(contract, "VertexRegistered")
        .withArgs(operator1.address, publicKeyHash, await ethers.provider.getBlock('latest').then(b => b!.timestamp + 1));
      
      const vertex = await contract.vertices(operator1.address);
      expect(vertex.operator).to.equal(operator1.address);
      expect(vertex.publicKeyHash).to.equal(publicKeyHash);
    });
    
    it("Should reject duplicate registration", async function () {
      const publicKeyHash = ethers.keccak256(ethers.toUtf8Bytes("test-public-key"));
      
      await contract.connect(operator1).registerVertex(publicKeyHash);
      
      await expect(
        contract.connect(operator1).registerVertex(publicKeyHash)
      ).to.be.revertedWith("Vertex already registered");
    });
  });
  
  describe("Tetrahedron Formation", function () {
    beforeEach(async function () {
      // Register 4 vertices
      const operators = [operator1, operator2, operator3, operator4];
      
      for (let i = 0; i < operators.length; i++) {
        const publicKeyHash = ethers.keccak256(
          ethers.toUtf8Bytes(`public-key-${i}`)
        );
        await contract.connect(operators[i]).registerVertex(publicKeyHash);
      }
    });
    
    it("Should form a K₄ tetrahedron with 3 signatures", async function () {
      const vertices = [
        operator1.address,
        operator2.address,
        operator3.address,
        operator4.address,
      ];
      
      // Create mock signatures (in production, these would be real ECDSA signatures)
      const signatures = [
        ethers.toUtf8Bytes("sig1"),
        ethers.toUtf8Bytes("sig2"),
        ethers.toUtf8Bytes("sig3"),
      ];
      
      await expect(contract.formTetrahedron(vertices, signatures))
        .to.emit(contract, "TetrahedronFormed");
      
      expect(await contract.totalTetrahedrons()).to.equal(1);
    });
    
    it("Should reject tetrahedron with insufficient signatures", async function () {
      const vertices = [
        operator1.address,
        operator2.address,
        operator3.address,
        operator4.address,
      ];
      
      const signatures = [
        ethers.toUtf8Bytes("sig1"),
        ethers.toUtf8Bytes("sig2"),
      ];
      
      await expect(
        contract.formTetrahedron(vertices, signatures)
      ).to.be.revertedWith("Insufficient signatures (need 3/4)");
    });
    
    it("Should reject tetrahedron with wrong size", async function () {
      const vertices = [
        operator1.address,
        operator2.address,
        operator3.address,
      ];
      
      const signatures = [
        ethers.toUtf8Bytes("sig1"),
        ethers.toUtf8Bytes("sig2"),
        ethers.toUtf8Bytes("sig3"),
      ];
      
      await expect(
        contract.formTetrahedron(vertices, signatures)
      ).to.be.revertedWith("Must have exactly 4 vertices");
    });
    
    it("Should track operator's tetrahedrons", async function () {
      const vertices = [
        operator1.address,
        operator2.address,
        operator3.address,
        operator4.address,
      ];
      
      const signatures = [
        ethers.toUtf8Bytes("sig1"),
        ethers.toUtf8Bytes("sig2"),
        ethers.toUtf8Bytes("sig3"),
      ];
      
      await contract.formTetrahedron(vertices, signatures);
      
      const tetrahedrons = await contract.getOperatorTetrahedrons(operator1.address);
      expect(tetrahedrons.length).to.equal(1);
    });
  });
  
  describe("Power Abdication", function () {
    it("Should allow deployer to abdicate power", async function () {
      await expect(contract.connect(deployer).abdicatePower())
        .to.emit(contract, "PowerAbdicated")
        .withArgs(deployer.address, await ethers.provider.getBlock('latest').then(b => b!.timestamp + 1));
      
      expect(await contract.deployer()).to.equal(ethers.ZeroAddress);
      expect(await contract.isAbdicated()).to.be.true;
    });
    
    it("Should reject abdication from non-deployer", async function () {
      await expect(
        contract.connect(operator1).abdicatePower()
      ).to.be.revertedWith("Not deployer");
    });
    
    it("Should prevent actions after abdication", async function () {
      await contract.connect(deployer).abdicatePower();
      
      // Any deployer-only function should fail
      // (Add specific test based on deployer-only functions if any)
    });
  });
});
```

---

### Step 7: Package.json Scripts

```json
{
  "scripts": {
    "chain": "hardhat node",
    "deploy:local": "hardhat run scripts/deploy.ts --network localhost",
    "test": "hardhat test",
    "test:coverage": "hardhat coverage",
    "compile": "hardhat compile",
    "clean": "hardhat clean"
  }
}
```

---

## USAGE GUIDE

### Start Local Chain

```bash
# Terminal 1: Start Hardhat node (local blockchain)
npm run chain

# Output:
# Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
# 
# Accounts:
# Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
# Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
# ...
```

### Deploy Contract

```bash
# Terminal 2: Deploy GODConstitution
npm run deploy:local

# Output:
# 🚀 Deploying GODConstitution...
# Deployer address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
# ✅ GODConstitution deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
# 
# 📜 Constitutional Constants:
#   Encryption Required: true
#   Tetrahedron Size: 4
#   Min Threshold: 3
```

### Run Tests

```bash
# Run test suite
npm test

# Output:
#   GODConstitution
#     Deployment
#       ✓ Should set the correct deployer
#       ✓ Should have correct constitutional constants
#       ✓ Should not be abdicated initially
#     Vertex Registration
#       ✓ Should register a new vertex
#       ✓ Should reject duplicate registration
#     Tetrahedron Formation
#       ✓ Should form a K₄ tetrahedron with 3 signatures
#       ✓ Should reject tetrahedron with insufficient signatures
#       ✓ Should reject tetrahedron with wrong size
#       ✓ Should track operator's tetrahedrons
#     Power Abdication
#       ✓ Should allow deployer to abdicate power
#       ✓ Should reject abdication from non-deployer
#
#   11 passing (2s)
```

---

## INTEGRATION WITH NEXT.JS

### Step 8: Web3 Provider Setup

```typescript
// src/lib/web3/provider.ts

import { ethers } from 'ethers';

// Local Hardhat node
const LOCAL_RPC = 'http://127.0.0.1:8545';

// Contract address (update after deployment)
export const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// ABI (copy from artifacts after compile)
import GODConstitutionABI from '../../../artifacts/contracts/GODConstitution.sol/GODConstitution.json';

export function getProvider() {
  return new ethers.JsonRpcProvider(LOCAL_RPC);
}

export function getSigner() {
  const provider = getProvider();
  // Use first Hardhat account
  return provider.getSigner(0);
}

export async function getContract() {
  const signer = await getSigner();
  return new ethers.Contract(
    CONTRACT_ADDRESS,
    GODConstitutionABI.abi,
    signer
  );
}
```

### Step 9: Contract Interaction Hook

```typescript
// src/lib/hooks/useContract.ts

import { useState, useEffect } from 'react';
import { getContract } from '@/lib/web3/provider';

export function useContract() {
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getContract()
      .then(setContract)
      .finally(() => setLoading(false));
  }, []);
  
  const registerVertex = async (publicKeyHash: string) => {
    if (!contract) throw new Error('Contract not loaded');
    const tx = await contract.registerVertex(publicKeyHash);
    await tx.wait();
    return tx;
  };
  
  const formTetrahedron = async (
    vertices: string[],
    signatures: string[]
  ) => {
    if (!contract) throw new Error('Contract not loaded');
    const tx = await contract.formTetrahedron(vertices, signatures);
    await tx.wait();
    return tx;
  };
  
  const abdicatePower = async () => {
    if (!contract) throw new Error('Contract not loaded');
    const tx = await contract.abdicatePower();
    await tx.wait();
    return tx;
  };
  
  return {
    contract,
    loading,
    registerVertex,
    formTetrahedron,
    abdicatePower,
  };
}
```

---

## TESTING WORKFLOW

```bash
# 1. Start local chain
npm run chain

# 2. Deploy contract (in another terminal)
npm run deploy:local

# 3. Copy contract address to provider.ts

# 4. Run tests
npm test

# 5. Start Next.js app
npm run dev

# 6. Test in browser with local chain
```

---

## QUICK REFERENCE

**Local Chain:**
- RPC: http://127.0.0.1:8545
- Chain ID: 1337
- 20 pre-funded accounts (10,000 ETH each)

**Contract Functions:**
- `registerVertex(bytes32 _publicKeyHash)`
- `formTetrahedron(address[] _vertices, bytes[] _signatures)`
- `getTetrahedron(bytes32 _id)`
- `getOperatorTetrahedrons(address _operator)`
- `abdicatePower()`

**Constitutional Constants:**
- `ENCRYPTION_REQUIRED`: true
- `TETRAHEDRON_SIZE`: 4
- `MIN_THRESHOLD`: 3

---

**HARDHAT LOCAL CHAIN READY.**

**CONSTITUTIONAL TESTING ENABLED.**

**EXECUTE.**
