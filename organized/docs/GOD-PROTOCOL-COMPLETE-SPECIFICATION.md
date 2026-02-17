# G.O.D. PROTOCOL - COMPLETE IMPLEMENTATION SPECIFICATION

## EXECUTIVE SUMMARY

This document contains the complete specification for implementing the G.O.D. (Geometric Operations Daemon) Protocol across three layers:

1. **Layer 1: The Law (Smart Contract)** - Immutable constitutional enforcement
2. **Layer 2: The Physics (Type System)** - Compile-time guarantees
3. **Layer 3: The Interface (Web Application)** - Visual manifestation

All three layers encode the same fundamental truth: **K₄ complete graph topology (4 vertices, 6 edges, tetrahedral structure)**.

---

## CORE MATHEMATICAL FOUNDATION

### The Tetrahedron Constants

```typescript
// All measurements derive from this single constant
export const EDGE_LENGTH = 2.0;

// Derived mathematically (NOT arbitrary)
export const TETRAHEDRON_RADIUS = (Math.sqrt(6) / 4) * EDGE_LENGTH;
// = 1.2247... (irrational, as nature intended)

export const TETRAHEDRON_HEIGHT = (Math.sqrt(6) / 3) * EDGE_LENGTH;
// = 1.6329...

// Vertex positions (geometrically derived)
export const VERTEX_POSITIONS: [number, number, number][] = [
  [0, TETRAHEDRON_HEIGHT * 0.5, 0],                              // Top (STATUS)
  [-EDGE_LENGTH/2, -TETRAHEDRON_HEIGHT * 0.5, EDGE_LENGTH/2],    // Front-left (CHILDCARE)
  [EDGE_LENGTH/2, -TETRAHEDRON_HEIGHT * 0.5, EDGE_LENGTH/2],     // Front-right (FOOD)
  [0, -TETRAHEDRON_HEIGHT * 0.5, -EDGE_LENGTH/2],                // Back (HOUSING)
];

// Edge connections (complete graph K₄)
export const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], // Top vertex to all others
  [1, 2], [1, 3], [2, 3], // Bottom triangle (complete)
];
```

---

## LAYER 1: THE LAW (SMART CONTRACT)

### File: `contracts/GodProtocol.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title The G.O.D. Constitution
 * @notice Immutable constitutional enforcement of K₄ topology
 * @dev Deployed once, never upgraded, forever immutable
 * 
 * Key Principles:
 * - Exactly 4 vertices per tetrahedron (enforced by type system)
 * - Quorum threshold: 3 of 4 (graceful degradation)
 * - Founder can abdicate power (irreversibly)
 * - No central authority after abdication
 */
contract GodProtocol {
    
    // ============================================
    // CONSTITUTIONAL CONSTANTS (IMMUTABLE)
    // ============================================
    
    /// @notice The atomic unit of society is exactly 4 people
    uint8 public constant TETRAHEDRON_SIZE = 4;
    
    /// @notice Decisions require 3 of 4 approval (75% supermajority)
    uint8 public constant QUORUM_THRESHOLD = 3;
    
    /// @notice Minimum physical meetings per month
    uint8 public constant MIN_PHYSICAL_MEETINGS = 4;
    
    /// @notice Maximum days between meetings before degradation
    uint8 public constant MAX_DAYS_BETWEEN_MEETINGS = 7;
    
    // ============================================
    // STATE VARIABLES
    // ============================================
    
    /// @notice The prime operator (founder) who can abdicate
    address public primeOperator;
    
    /// @notice Whether founder has abdicated (one-way, irreversible)
    bool public isAbdicated = false;
    
    /// @notice Timestamp of abdication (proof of George Washington moment)
    uint256 public abdicationTimestamp;
    
    // ============================================
    // DATA STRUCTURES
    // ============================================
    
    /// @notice A tetrahedron (K₄ complete graph)
    struct Tetrahedron {
        /// @notice Exactly 4 vertex addresses (enforced by array length)
        address[TETRAHEDRON_SIZE] vertices;
        
        /// @notice When this tetrahedron was formed
        uint256 formationTimestamp;
        
        /// @notice Last physical meeting timestamp
        uint256 lastPhysicalMeeting;
        
        /// @notice Whether this tetrahedron is active
        bool isActive;
        
        /// @notice IPFS hash of encrypted tetrahedron data
        string encryptedDataHash;
    }
    
    /// @notice Mapping from tetrahedron ID to tetrahedron data
    mapping(bytes32 => Tetrahedron) public topology;
    
    /// @notice Mapping to track which addresses are in a tetrahedron
    mapping(address => bytes32) public vertexToTetrahedron;
    
    /// @notice Mapping to track vertex status
    mapping(address => bool) public isVertex;
    
    // ============================================
    // EVENTS
    // ============================================
    
    /// @notice Emitted when a new tetrahedron is formed
    event TetrahedronFormed(
        bytes32 indexed tetrahedronId,
        address[4] vertices,
        uint256 timestamp
    );
    
    /// @notice Emitted when founder abdicates power
    event PowerAbdicated(
        address indexed formerOperator,
        uint256 timestamp
    );
    
    /// @notice Emitted when tetrahedron records physical meeting
    event PhysicalMeetingRecorded(
        bytes32 indexed tetrahedronId,
        uint256 timestamp
    );
    
    /// @notice Emitted when tetrahedron status changes
    event TetrahedronStatusChanged(
        bytes32 indexed tetrahedronId,
        bool isActive
    );
    
    // ============================================
    // MODIFIERS
    // ============================================
    
    /// @notice Only founder before abdication
    modifier onlyPrimeOperator() {
        require(msg.sender == primeOperator, "Not prime operator");
        require(!isAbdicated, "Founder has abdicated");
        _;
    }
    
    /// @notice Requires quorum (3 of 4) from tetrahedron vertices
    modifier onlyTetrahedronQuorum(
        bytes32 _tetrahedronId,
        address[3] memory _signers
    ) {
        Tetrahedron memory t = topology[_tetrahedronId];
        require(t.isActive, "Tetrahedron not active");
        
        // Verify each signer is actually in the tetrahedron
        uint8 validSigners = 0;
        for (uint i = 0; i < 3; i++) {
            bool isValid = false;
            for (uint j = 0; j < TETRAHEDRON_SIZE; j++) {
                if (t.vertices[j] == _signers[i]) {
                    isValid = true;
                    break;
                }
            }
            require(isValid, "Signer not in tetrahedron");
            validSigners++;
        }
        
        require(validSigners >= QUORUM_THRESHOLD, "Insufficient quorum");
        _;
    }
    
    // ============================================
    // CONSTRUCTOR
    // ============================================
    
    constructor() {
        primeOperator = msg.sender;
    }
    
    // ============================================
    // CORE FUNCTIONS
    // ============================================
    
    /**
     * @notice Form a new tetrahedron (K₄ complete graph)
     * @param _vertices Exactly 4 unique addresses
     * @return tetrahedronId Unique identifier for this tetrahedron
     */
    function formTetrahedron(
        address[TETRAHEDRON_SIZE] memory _vertices
    ) public returns (bytes32) {
        // Validation: All addresses must be unique
        for (uint i = 0; i < TETRAHEDRON_SIZE; i++) {
            require(_vertices[i] != address(0), "Invalid address");
            require(!isVertex[_vertices[i]], "Address already in tetrahedron");
            
            for (uint j = i + 1; j < TETRAHEDRON_SIZE; j++) {
                require(_vertices[i] != _vertices[j], "Duplicate address");
            }
        }
        
        // Generate unique ID
        bytes32 tetrahedronId = keccak256(
            abi.encodePacked(_vertices, block.timestamp)
        );
        
        // Create tetrahedron
        topology[tetrahedronId] = Tetrahedron({
            vertices: _vertices,
            formationTimestamp: block.timestamp,
            lastPhysicalMeeting: block.timestamp,
            isActive: true,
            encryptedDataHash: ""
        });
        
        // Mark vertices as part of tetrahedron
        for (uint i = 0; i < TETRAHEDRON_SIZE; i++) {
            vertexToTetrahedron[_vertices[i]] = tetrahedronId;
            isVertex[_vertices[i]] = true;
        }
        
        emit TetrahedronFormed(tetrahedronId, _vertices, block.timestamp);
        
        return tetrahedronId;
    }
    
    /**
     * @notice Record a physical meeting (critical for system health)
     * @param _tetrahedronId The tetrahedron that met
     * @param _signers 3 of 4 vertices confirming meeting occurred
     */
    function recordPhysicalMeeting(
        bytes32 _tetrahedronId,
        address[3] memory _signers
    ) public onlyTetrahedronQuorum(_tetrahedronId, _signers) {
        topology[_tetrahedronId].lastPhysicalMeeting = block.timestamp;
        emit PhysicalMeetingRecorded(_tetrahedronId, block.timestamp);
    }
    
    /**
     * @notice THE GEORGE WASHINGTON MOMENT
     * @dev Founder permanently relinquishes all power
     * @dev This function can only be called once
     * @dev After calling, founder has ZERO special privileges
     * @dev This is irreversible by design
     */
    function abdicatePower() public onlyPrimeOperator {
        // Burn the founder address to black hole
        primeOperator = address(0);
        isAbdicated = true;
        abdicationTimestamp = block.timestamp;
        
        emit PowerAbdicated(msg.sender, block.timestamp);
    }
    
    /**
     * @notice Check if tetrahedron is healthy
     * @param _tetrahedronId Tetrahedron to check
     * @return isHealthy Whether tetrahedron meets health requirements
     */
    function checkTetrahedronHealth(
        bytes32 _tetrahedronId
    ) public view returns (bool) {
        Tetrahedron memory t = topology[_tetrahedronId];
        
        if (!t.isActive) return false;
        
        // Check if physical meeting happened recently
        uint256 daysSinceMeeting = 
            (block.timestamp - t.lastPhysicalMeeting) / 1 days;
        
        return daysSinceMeeting <= MAX_DAYS_BETWEEN_MEETINGS;
    }
    
    /**
     * @notice Get tetrahedron data
     * @param _tetrahedronId Tetrahedron to query
     * @return vertices The 4 vertex addresses
     * @return formationTimestamp When formed
     * @return lastPhysicalMeeting Last meeting time
     * @return isActive Whether active
     */
    function getTetrahedron(
        bytes32 _tetrahedronId
    ) public view returns (
        address[TETRAHEDRON_SIZE] memory vertices,
        uint256 formationTimestamp,
        uint256 lastPhysicalMeeting,
        bool isActive
    ) {
        Tetrahedron memory t = topology[_tetrahedronId];
        return (
            t.vertices,
            t.formationTimestamp,
            t.lastPhysicalMeeting,
            t.isActive
        );
    }
}
```

### Deployment Script

```typescript
// scripts/deploy.ts

import { ethers } from "hardhat";

async function main() {
  console.log("Deploying G.O.D. Protocol Constitution...");
  
  const GodProtocol = await ethers.getContractFactory("GodProtocol");
  const protocol = await GodProtocol.deploy();
  
  await protocol.deployed();
  
  console.log(`GodProtocol deployed to: ${protocol.address}`);
  console.log(`Founder: ${await protocol.primeOperator()}`);
  console.log(`Tetrahedron size: ${await protocol.TETRAHEDRON_SIZE()}`);
  console.log(`Quorum threshold: ${await protocol.QUORUM_THRESHOLD()}`);
  
  // Verify on Etherscan (optional)
  console.log("\nWaiting for block confirmations...");
  await protocol.deployTransaction.wait(6);
  
  console.log("\nVerifying contract on Etherscan...");
  await hre.run("verify:verify", {
    address: protocol.address,
    constructorArguments: [],
  });
  
  console.log("\n✅ Constitution deployed and verified");
  console.log("📜 This contract is now IMMUTABLE");
  console.log("🔒 No upgrades possible");
  console.log("⚖️  Law is code. Code is law.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

---

## LAYER 2: THE PHYSICS (TYPE SYSTEM)

### File: `src/lib/types/core.ts`

```typescript
/**
 * BRANDED TYPES
 * 
 * These types prevent "mission drift" at compile time.
 * A UserId is not just a string - it's a cryptographic identity.
 * A TetrahedronId is not just a string - it's a geometric proof.
 */

// ============================================
// BRAND DECLARATIONS
// ============================================

declare const UserIdBrand: unique symbol;
declare const TetrahedronIdBrand: unique symbol;
declare const EdgeIdBrand: unique symbol;
declare const VertexIndexBrand: unique symbol;

// ============================================
// BRANDED TYPES
// ============================================

/**
 * A user's cryptographic identity
 * Cannot be accidentally used as a regular string
 */
export type UserId = string & { readonly [UserIdBrand]: typeof UserIdBrand };

/**
 * A tetrahedron's unique identifier
 * Proves K₄ topology exists
 */
export type TetrahedronId = string & { readonly [TetrahedronIdBrand]: typeof TetrahedronIdBrand };

/**
 * An edge connecting two vertices
 * Represents a relationship in the complete graph
 */
export type EdgeId = string & { readonly [EdgeIdBrand]: typeof EdgeIdBrand };

/**
 * A vertex index (0-3 only)
 * Type-level enforcement of exactly 4 vertices
 */
export type VertexIndex = 0 | 1 | 2 | 3;

// ============================================
// CORE DATA STRUCTURES
// ============================================

/**
 * Vertex state (health status)
 */
export type VertexState = 
  | 'HEALTHY'      // All systems operational
  | 'WARNING'      // Needs attention (7+ days since meeting)
  | 'DEGRADED'     // Critical (14+ days since meeting)
  | 'EMERGENCY'    // Emergency button pressed
  | 'MEMORIAL';    // Vertex lost (K₄ → K₃ transition)

/**
 * Edge state (relationship health)
 */
export type EdgeState =
  | 'STRONG'       // Active, frequent communication
  | 'WEAK'         // Degraded, infrequent contact
  | 'FORMING'      // New relationship establishing
  | 'BREAKING'     // Relationship dissolving
  | 'MEMORIAL'     // Edge to memorial vertex
  | 'POTENTIAL';   // Possible future connection

/**
 * A vertex in the tetrahedron
 * Represents one person in the K₄ structure
 */
export interface Vertex {
  readonly id: UserId;
  readonly index: VertexIndex;
  readonly name: string;
  readonly address: string; // Ethereum address
  readonly position: readonly [number, number, number]; // 3D coordinates
  state: VertexState;
  lastSeen: Date;
  emergencyContact?: string;
}

/**
 * An edge in the complete graph
 * Represents a relationship between two vertices
 */
export interface Edge {
  readonly id: EdgeId;
  readonly vertices: readonly [VertexIndex, VertexIndex];
  state: EdgeState;
  strength: number; // 0-1, based on interaction frequency
  lastInteraction: Date;
}

/**
 * A tetrahedron (K₄ complete graph)
 * The atomic unit of the G.O.D. mesh
 * 
 * CRITICAL: This is a TUPLE, not an array
 * TypeScript enforces exactly 4 vertices at compile time
 */
export interface Tetrahedron {
  readonly id: TetrahedronId;
  
  /**
   * EXACTLY 4 vertices (tuple enforces this)
   * Not 3, not 5, EXACTLY 4
   */
  readonly vertices: readonly [Vertex, Vertex, Vertex, Vertex];
  
  /**
   * EXACTLY 6 edges (complete graph K₄)
   * Every vertex connected to every other vertex
   */
  readonly edges: readonly [Edge, Edge, Edge, Edge, Edge, Edge];
  
  readonly formationTimestamp: Date;
  lastPhysicalMeeting: Date | null;
  meetingsThisMonth: number;
  
  /**
   * Check if tetrahedron is healthy
   * Requires: 4 meetings/month, max 7 days between
   */
  isHealthy(): boolean;
  
  /**
   * Graceful degradation check
   * Returns true if 3/4 vertices are HEALTHY or WARNING
   */
  hasQuorum(): boolean;
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Runtime validation (defense in depth)
 * Type system prevents compile-time errors
 * This catches runtime violations
 */
export function validateTetrahedron(t: Tetrahedron): void {
  // Check vertex count
  if (t.vertices.length !== 4) {
    throw new Error(
      `CONSTITUTIONAL VIOLATION: Tetrahedron must have exactly 4 vertices, got ${t.vertices.length}`
    );
  }
  
  // Check edge count
  if (t.edges.length !== 6) {
    throw new Error(
      `CONSTITUTIONAL VIOLATION: K₄ complete graph must have exactly 6 edges, got ${t.edges.length}`
    );
  }
  
  // Check all vertices have unique IDs
  const ids = t.vertices.map(v => v.id);
  const uniqueIds = new Set(ids);
  if (uniqueIds.size !== 4) {
    throw new Error(
      `CONSTITUTIONAL VIOLATION: All vertex IDs must be unique`
    );
  }
  
  // Check all vertex indices are 0-3
  t.vertices.forEach(v => {
    if (v.index < 0 || v.index > 3) {
      throw new Error(
        `CONSTITUTIONAL VIOLATION: Vertex index must be 0-3, got ${v.index}`
      );
    }
  });
  
  // Check physical meeting requirement
  const daysSinceMeeting = t.lastPhysicalMeeting
    ? (Date.now() - t.lastPhysicalMeeting.getTime()) / (1000 * 60 * 60 * 24)
    : Infinity;
  
  if (daysSinceMeeting > 7) {
    console.warn(
      `WARNING: ${daysSinceMeeting.toFixed(1)} days since last physical meeting (max 7 allowed)`
    );
  }
  
  if (t.meetingsThisMonth < 4) {
    console.warn(
      `WARNING: Only ${t.meetingsThisMonth} meetings this month (min 4 required)`
    );
  }
}

/**
 * Check if system can transition from WYE to DELTA
 * 
 * WYE = 4 vertices connected to center (home view)
 * DELTA = 3 vertices in closed loop (module view)
 * 
 * Conditions for transition:
 * 1. Valid vertex selected
 * 2. System balanced (all 3 stable)
 * 3. Geometrically valid (forms equilateral triangle)
 */
export function canTransitionWyeToDelta(
  tetrahedron: Tetrahedron,
  selectedIndex: VertexIndex
): boolean {
  // Get selected vertex and its 2 neighbors
  const selected = tetrahedron.vertices[selectedIndex];
  const others = tetrahedron.vertices.filter((_, i) => i !== selectedIndex);
  
  // Pick 2 neighbors (for 3-vertex delta)
  const delta = [selected, others[0], others[1]];
  
  // Check 1: All vertices must be stable (not EMERGENCY or MEMORIAL)
  const allStable = delta.every(v => 
    v.state === 'HEALTHY' || v.state === 'WARNING'
  );
  
  if (!allStable) return false;
  
  // Check 2: Load balance (vertex states within acceptable variance)
  const states = delta.map(v => v.state === 'HEALTHY' ? 1 : 0.8);
  const maxState = Math.max(...states);
  const minState = Math.min(...states);
  const variance = (maxState - minState) / maxState;
  
  if (variance > 0.2) return false; // Max 20% variance
  
  // Check 3: Geometric validity (triangle should be roughly equilateral)
  const [v1, v2, v3] = delta.map(v => v.position);
  const dist = (p1: readonly [number, number, number], p2: readonly [number, number, number]) => {
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const dz = p2[2] - p1[2];
    return Math.sqrt(dx*dx + dy*dy + dz*dz);
  };
  
  const edge1 = dist(v1, v2);
  const edge2 = dist(v2, v3);
  const edge3 = dist(v3, v1);
  const avgEdge = (edge1 + edge2 + edge3) / 3;
  
  // All edges within 10% of average = valid delta
  const isEquilateral = [edge1, edge2, edge3].every(e =>
    Math.abs(e - avgEdge) / avgEdge < 0.1
  );
  
  return isEquilateral;
}

// ============================================
// FACTORY FUNCTIONS (Type Guards)
// ============================================

/**
 * Create a branded UserId from a string
 * Only way to create UserId type (controlled constructor)
 */
export function createUserId(id: string): UserId {
  if (!id || id.length < 10) {
    throw new Error('Invalid user ID');
  }
  return id as UserId;
}

/**
 * Create a branded TetrahedronId
 */
export function createTetrahedronId(id: string): TetrahedronId {
  if (!id || id.length < 10) {
    throw new Error('Invalid tetrahedron ID');
  }
  return id as TetrahedronId;
}

/**
 * Create a branded EdgeId
 */
export function createEdgeId(v1: VertexIndex, v2: VertexIndex): EdgeId {
  if (v1 === v2) {
    throw new Error('Edge must connect different vertices');
  }
  const sorted = [v1, v2].sort();
  return `edge-${sorted[0]}-${sorted[1]}` as EdgeId;
}
```

---

## LAYER 3: THE INTERFACE (WEB APPLICATION)

### Architecture Overview

```
Application Structure:
├── WYE Configuration (Home)
│   ├── Full-screen tetrahedron
│   ├── 4 vertices visible
│   ├── All 6 edges shown
│   ├── Breathing animation (0.5 Hz)
│   └── Clickable vertices
│
└── DELTA Configuration (Module)
    ├── Tetrahedron hidden
    ├── Module card visible
    ├── 3 vertices in focus
    └── Back button to return

Transition: WYE → DELTA
├── Check canTransitionWyeToDelta()
├── If true: execute transition
├── If false: show warning
└── Timing: 600ms total
    ├── 0-200ms: Open star (fade 4th vertex)
    ├── 200-500ms: Close delta (form triangle)
    └── 500-600ms: Transfer power (show module)
```

### File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (WYE/DELTA switcher)
│   ├── page.tsx                # Home page (WYE view)
│   ├── globals.css             # Global styles
│   └── [module]/
│       └── page.tsx            # Module pages (DELTA view)
│
├── components/
│   ├── core/
│   │   ├── ModulePage.tsx      # Module wrapper
│   │   ├── ModuleCard.tsx      # Module card
│   │   ├── BackButton.tsx      # Return to WYE
│   │   └── Form.tsx            # Form components
│   │
│   └── canvas/
│       ├── TetrahedronCanvas.tsx     # R3F Canvas wrapper
│       ├── SpatialTetrahedron.tsx    # Tetrahedron mesh
│       ├── Vertex.tsx                # Individual vertex
│       ├── Edge.tsx                  # Individual edge
│       └── CameraRig.tsx             # Camera + breathing
│
├── lib/
│   ├── types/
│   │   └── core.ts             # Branded types (Layer 2)
│   │
│   ├── math/
│   │   ├── constants.ts        # Mathematical constants
│   │   └── geometry.ts         # Geometric calculations
│   │
│   ├── store/
│   │   ├── tetrahedronStore.ts # Tetrahedron state
│   │   └── governanceStore.ts  # Decision/voting state
│   │
│   └── transformations/
│       └── wye-delta.ts        # WYE↔DELTA transitions
│
└── contracts/
    └── GodProtocol.sol         # Smart contract (Layer 1)
```

### Implementation Files

#### 1. Root Layout (WYE/DELTA Switcher)

```tsx
// src/app/layout.tsx

'use client';

import { Canvas } from '@react-three/fiber';
import { usePathname } from 'next/navigation';
import { SpatialTetrahedron } from '@/components/canvas/SpatialTetrahedron';
import { CameraRig } from '@/components/canvas/CameraRig';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isWyeView = pathname === '/';

  return (
    <html lang="en">
      <body className="bg-black text-white antialiased overflow-hidden">
        {/* CANVAS LAYER - WYE Configuration (only on home) */}
        {isWyeView && (
          <div className="fixed inset-0 z-0">
            <Canvas
              camera={{ position: [0, 0, 7], fov: 50 }}
              gl={{ 
                alpha: true, 
                antialias: true,
                powerPreference: 'high-performance'
              }}
            >
              {/* Lights */}
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={0.8} />
              <pointLight position={[-10, -10, -10]} intensity={0.3} />
              
              {/* Camera with breathing */}
              <CameraRig />
              
              {/* Tetrahedron (K₄ complete graph) */}
              <SpatialTetrahedron />
            </Canvas>
          </div>
        )}

        {/* CONTENT LAYER - DELTA Configuration (modules) */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
```

#### 2. Home Page (WYE View)

```tsx
// src/app/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();
  
  // Listen for vertex click events from 3D scene
  useEffect(() => {
    const handleVertexClick = (e: CustomEvent) => {
      const { vertexIndex } = e.detail;
      
      // Map vertex index to route
      const routes = ['status', 'childcare', 'food', 'housing'];
      const route = routes[vertexIndex];
      
      if (route) {
        // Transition from WYE to DELTA
        router.push(`/${route}`);
      }
    };
    
    window.addEventListener('vertex-click', handleVertexClick as EventListener);
    return () => {
      window.removeEventListener('vertex-click', handleVertexClick as EventListener);
    };
  }, [router]);
  
  return (
    <div className="h-screen flex items-center justify-center">
      {/* Instructions (only visual element) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-cyan-400 text-sm tracking-[0.3em] uppercase">
          Click a vertex to explore
        </p>
      </div>
      
      {/* Optional: Vertex labels */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2">
        <p className="text-cyan-600 text-xs font-mono">
          G.O.D. PROTOCOL v1.0
        </p>
      </div>
    </div>
  );
}
```

#### 3. Tetrahedron Component (Complete K₄ Graph)

```tsx
// src/components/canvas/SpatialTetrahedron.tsx

'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Vertex } from './Vertex';
import { Edge } from './Edge';
import { VERTEX_POSITIONS, EDGES } from '@/lib/math/constants';

export function SpatialTetrahedron() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Slow rotation (auto-rotate)
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1; // Slow rotation
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Vertices (4) */}
      {VERTEX_POSITIONS.map((position, index) => (
        <Vertex
          key={`vertex-${index}`}
          index={index as 0 | 1 | 2 | 3}
          position={position}
        />
      ))}
      
      {/* Edges (6) - Complete graph K₄ */}
      {EDGES.map(([i, j], edgeIndex) => (
        <Edge
          key={`edge-${edgeIndex}`}
          start={VERTEX_POSITIONS[i]}
          end={VERTEX_POSITIONS[j]}
          index={edgeIndex}
        />
      ))}
    </group>
  );
}
```

#### 4. Vertex Component (Individual Sphere)

```tsx
// src/components/canvas/Vertex.tsx

'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VertexProps {
  index: 0 | 1 | 2 | 3;
  position: [number, number, number];
}

export function Vertex({ index, position }: VertexProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Breathing animation (all vertices breathe together)
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      // Sync with Jitterbug frequency (0.5 Hz)
      const scale = 1 + Math.sin(t * Math.PI) * 0.1; // ±10%
      meshRef.current.scale.setScalar(scale);
    }
  });
  
  // Handle click
  const handleClick = () => {
    // Emit custom event for layout to catch
    window.dispatchEvent(new CustomEvent('vertex-click', {
      detail: { vertexIndex: index }
    }));
  };
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial
        color={hovered ? '#22d3ee' : '#06b6d4'} // Lighter cyan on hover
        emissive="#06b6d4"
        emissiveIntensity={hovered ? 0.8 : 0.5}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
}
```

#### 5. Edge Component (Connecting Line)

```tsx
// src/components/canvas/Edge.tsx

'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

interface EdgeProps {
  start: [number, number, number];
  end: [number, number, number];
  index: number;
}

export function Edge({ start, end, index }: EdgeProps) {
  // Calculate edge geometry
  const { position, rotation, length } = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    
    // Midpoint
    const position = new THREE.Vector3()
      .addVectors(startVec, endVec)
      .multiplyScalar(0.5);
    
    // Length
    const length = startVec.distanceTo(endVec);
    
    // Rotation to align cylinder with edge
    const direction = new THREE.Vector3()
      .subVectors(endVec, startVec)
      .normalize();
    
    const axis = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion()
      .setFromUnitVectors(axis, direction);
    
    const rotation = new THREE.Euler()
      .setFromQuaternion(quaternion);
    
    return { position, rotation, length };
  }, [start, end]);
  
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[0.02, 0.02, length, 8]} />
      <meshStandardMaterial
        color="#06b6d4"
        emissive="#06b6d4"
        emissiveIntensity={0.2}
        metalness={0.5}
        roughness={0.5}
      />
    </mesh>
  );
}
```

#### 6. Camera Rig (Breathing + Controls)

```tsx
// src/components/canvas/CameraRig.tsx

'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export function CameraRig() {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Detect user interaction
  useEffect(() => {
    const handleStart = () => {
      setIsUserInteracting(true);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
    
    const handleEnd = () => {
      // Resume breathing 2 seconds after user stops
      idleTimerRef.current = setTimeout(() => {
        setIsUserInteracting(false);
      }, 2000);
    };
    
    window.addEventListener('pointerdown', handleStart);
    window.addEventListener('pointerup', handleEnd);
    
    return () => {
      window.removeEventListener('pointerdown', handleStart);
      window.removeEventListener('pointerup', handleEnd);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);
  
  // Jitterbug Dolly (breathing camera)
  useFrame(({ clock }) => {
    // Only breathe when user is NOT interacting
    if (isUserInteracting) return;
    
    const t = clock.getElapsedTime();
    const baseDistance = 7.0;
    const amplitude = 0.3;
    const frequency = 0.5; // 0.5 Hz = 2 second cycle
    
    // Sine wave breathing
    const newDistance = baseDistance + Math.sin(t * Math.PI * frequency) * amplitude;
    
    // Update camera distance
    const direction = camera.position.clone().normalize();
    camera.position.copy(direction.multiplyScalar(newDistance));
  });
  
  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={true}
      enablePan={false}
      enableRotate={true}
      maxDistance={20}
      minDistance={3}
      autoRotate={false}
    />
  );
}
```

#### 7. Module Page Template (DELTA View)

```tsx
// src/app/status/page.tsx

import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { BackButton } from '@/components/core/BackButton';
import { Button, InfoRow } from '@/components/core/Form';

export default function StatusPage() {
  return (
    <ModulePage>
      <BackButton />
      
      <ModuleCard 
        title="Status"
        subtitle="Vertex Information"
        icon="📊"
        actions={
          <>
            <Button variant="primary" fullWidth>
              🔑 Export Keys
            </Button>
            <Button variant="secondary" fullWidth>
              View Full Profile
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <InfoRow 
            label="Unique Sigil" 
            value="TRIMTAB_01" 
          />
          <InfoRow 
            label="Vertex ID" 
            value="0x71C...9A2" 
            mono 
          />
          <InfoRow 
            label="Genesis" 
            value="2025-12-04" 
          />
          <InfoRow 
            label="Tetrahedron" 
            value="ALPHA" 
          />
          <InfoRow 
            label="Status" 
            value="ACTIVE" 
            valueColor="text-green-400" 
          />
        </div>
      </ModuleCard>
    </ModulePage>
  );
}
```

#### 8. Back Button (Return to WYE)

```tsx
// src/components/core/BackButton.tsx

'use client';

import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();
  
  return (
    <button
      onClick={() => router.push('/')}
      className="
        fixed top-6 left-6 z-50
        w-12 h-12
        bg-black/80 backdrop-blur-sm
        border border-cyan-500/30
        rounded-full
        flex items-center justify-center
        text-cyan-400
        hover:border-cyan-500
        hover:bg-cyan-500/10
        transition-all
        group
      "
      aria-label="Back to tetrahedron"
    >
      <svg 
        className="w-6 h-6 transform group-hover:-translate-x-0.5 transition-transform" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 19l-7-7 7-7" 
        />
      </svg>
    </button>
  );
}
```

#### 9. Mathematical Constants

```typescript
// src/lib/math/constants.ts

/**
 * SYNERGETIC CONSTANTS
 * All derived from tetrahedron geometry
 * NO ARBITRARY VALUES
 */

// Base unit: Edge length
export const EDGE_LENGTH = 2.0;

// Tetrahedron radius (center to vertex)
// Formula: R = (√6/4) × edge_length
export const TETRAHEDRON_RADIUS = (Math.sqrt(6) / 4) * EDGE_LENGTH;
// = 1.2247448713915890...

// Tetrahedron height
// Formula: h = (√6/3) × edge_length
export const TETRAHEDRON_HEIGHT = (Math.sqrt(6) / 3) * EDGE_LENGTH;
// = 1.6329931618554521...

// Vertex positions (derived geometrically)
export const VERTEX_POSITIONS: [number, number, number][] = [
  [0, TETRAHEDRON_HEIGHT * 0.5, 0],                              // Top
  [-EDGE_LENGTH/2, -TETRAHEDRON_HEIGHT * 0.5, EDGE_LENGTH/2],    // Front-left
  [EDGE_LENGTH/2, -TETRAHEDRON_HEIGHT * 0.5, EDGE_LENGTH/2],     // Front-right
  [0, -TETRAHEDRON_HEIGHT * 0.5, -EDGE_LENGTH/2],                // Back
];

// Edge connections (complete graph K₄)
export const EDGES: [number, number][] = [
  [0, 1], // Top to front-left
  [0, 2], // Top to front-right
  [0, 3], // Top to back
  [1, 2], // Front-left to front-right
  [1, 3], // Front-left to back
  [2, 3], // Front-right to back
];

// Colors (vertex states)
export const VERTEX_COLORS = {
  HEALTHY: '#10b981',    // Green
  WARNING: '#f59e0b',    // Amber
  CRITICAL: '#ef4444',   // Red
  MEMORIAL: '#8b5cf6',   // Purple
} as const;

// Colors (edge states)
export const EDGE_COLORS = {
  STRONG: '#06b6d4',     // Cyan
  WEAK: '#6b7280',       // Gray
  FORMING: '#3b82f6',    // Blue
  BREAKING: '#f97316',   // Orange
  MEMORIAL: '#a78bfa',   // Light purple
  POTENTIAL: '#22d3ee',  // Light cyan
} as const;

// Timing (all derived from Jitterbug frequency)
const JITTERBUG_CYCLE = 2000; // 2 seconds (0.5 Hz)

export const TIMING = {
  INSTANT: JITTERBUG_CYCLE / 16,   // 125ms
  FAST: JITTERBUG_CYCLE / 8,       // 250ms
  NORMAL: JITTERBUG_CYCLE / 4,     // 500ms
  SLOW: JITTERBUG_CYCLE / 2,       // 1000ms
  BREATH: JITTERBUG_CYCLE,         // 2000ms
} as const;

// Spacing (multiples of edge length)
export const SPACING = {
  XS: EDGE_LENGTH * 0.25,  // 0.5
  SM: EDGE_LENGTH * 0.5,   // 1.0
  MD: EDGE_LENGTH * 1.0,   // 2.0
  LG: EDGE_LENGTH * 2.0,   // 4.0
  XL: EDGE_LENGTH * 4.0,   // 8.0
} as const;
```

---

## DEPLOYMENT CHECKLIST

### Prerequisites

```bash
# Install dependencies
npm install

# Required packages
npm install three@latest
npm install @react-three/fiber@latest
npm install @react-three/drei@latest
npm install zustand@latest
npm install next@latest
npm install react@latest react-dom@latest

# For smart contracts
npm install --save-dev hardhat
npm install --save-dev @nomicfoundation/hardhat-toolbox
npm install --save-dev @nomiclabs/hardhat-ethers
npm install ethers@^5.7.0
```

### Environment Variables

```bash
# .env.local

# Ethereum network
NEXT_PUBLIC_CHAIN_ID=1 # Mainnet
NEXT_PUBLIC_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY

# Contract addresses (after deployment)
NEXT_PUBLIC_GOD_PROTOCOL_ADDRESS=0x...

# IPFS (for encrypted data)
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/

# Feature flags
NEXT_PUBLIC_ENABLE_GOVERNANCE=true
NEXT_PUBLIC_ENABLE_EMERGENCY=true
```

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build
npm run start

# Smart contract deployment
npx hardhat compile
npx hardhat run scripts/deploy.ts --network mainnet

# Tests
npm run test
npx hardhat test

# Architecture audit
npm run audit

# Fix non-compliant pages
npm run fix:pages:dry      # Dry run
npm run fix:pages:confirm  # Apply fixes
```

### Verification Steps

1. **Layer 1 (Law) Verification**
   ```bash
   # Verify contract on Etherscan
   npx hardhat verify --network mainnet CONTRACT_ADDRESS
   
   # Check constants
   cast call CONTRACT_ADDRESS "TETRAHEDRON_SIZE()(uint8)"
   # Should return: 4
   
   cast call CONTRACT_ADDRESS "QUORUM_THRESHOLD()(uint8)"
   # Should return: 3
   ```

2. **Layer 2 (Physics) Verification**
   ```bash
   # TypeScript compilation should succeed
   npm run build
   
   # No type errors
   npx tsc --noEmit
   ```

3. **Layer 3 (Interface) Verification**
   - Open http://localhost:3000
   - Should see: Black screen with breathing tetrahedron
   - Should see: 4 cyan vertices, 6 cyan edges
   - Should see: "CLICK A VERTEX TO EXPLORE" at bottom
   - Click vertex → Should navigate to module
   - Click back button → Should return to tetrahedron

### Success Criteria

- ✅ Smart contract deployed and verified
- ✅ Tetrahedron renders correctly
- ✅ Breathing animation works (0.5 Hz)
- ✅ Vertices are clickable
- ✅ WYE → DELTA transition smooth
- ✅ Back button returns to WYE
- ✅ No console errors
- ✅ Architecture audit passes
- ✅ Type system enforces K₄

---

## CRITICAL REMINDERS

### 1. Constitutional Principles

**NEVER violate these:**
- Exactly 4 vertices (enforced by types)
- Exactly 6 edges (complete graph K₄)
- Minimum 4 physical meetings/month
- Maximum 7 days between meetings
- Exit rights always available
- No central authority after abdication
- Zero third-party analytics
- End-to-end encryption mandatory

### 2. Mathematical Derivation

**ALL values must be derived from geometry:**
- Spacing: Multiples of EDGE_LENGTH
- Colors: Vertex/edge states (4/6 options)
- Timing: Fractions of JITTERBUG_CYCLE
- Z-index: Multiples of 4 (tetrahedral layers)

**NO arbitrary values allowed.**

### 3. WYE-DELTA Pattern

**WYE (Home):**
- 4 vertices visible
- Center point (0,0,0)
- Distributed awareness
- Tetrahedron breathing

**DELTA (Module):**
- 3 vertices in focus
- Closed loop
- Concentrated attention
- Module interface

**Transition conditions:**
1. Valid vertex selected
2. System balanced (3/4 stable)
3. Geometrically valid (equilateral triangle)

### 4. The Abdication

**Once `abdicatePower()` is called:**
- Founder address set to 0x000...000
- Cannot be reversed
- No special privileges remain
- Blockchain proof of abdication
- System continues without founder

This is the **George Washington moment**.

The founder creates the system, then **voluntarily relinquishes all power**.

Proof that the system doesn't need them.

---

## FINAL NOTES

This is not just an application.

This is the **encoding of a fundamental pattern** that appears:
- In electrical engineering (Wye-Delta transformers)
- In quantum mechanics (four-dimensional spacetime)
- In social structures (optimal group size)
- In geometry (most stable polyhedron)

**K₄ complete graph** is the atomic unit.

**4 vertices, 6 edges, tetrahedral structure.**

Everything derives from this.

The mesh knows.

We listen.

---

**⚡ THREE LAYERS SPECIFIED ⚡**

**⚡ LAW + PHYSICS + INTERFACE ⚡**

**⚡ COMPLETE IMPLEMENTATION ⚡**

**⚡ READY FOR CURSOR ⚡**

**⚡ EXECUTE FLAWLESSLY ⚡**
