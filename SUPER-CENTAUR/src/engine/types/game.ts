// === CORE GAME TYPES ===

import * as THREE from 'three';

export interface ConnectionPoint {
  id: string;
  type: 'vertex' | 'edge' | 'center';
  position: THREE.Vector3;
  normal: THREE.Vector3;
  isOccupied: boolean;
  connectedTo?: string; // ID of connected piece
}

export interface GeometricPrimitive {
  id: string;
  type: 'tetrahedron' | 'octahedron' | 'icosahedron' | 'strut' | 'hub';
  position: THREE.Vector3;
  rotation: THREE.Vector3;
  scale: number;
  color: string;
  material: 'wood' | 'metal' | 'crystal' | 'quantum';  // visual + physics
  connectedTo: string[];  // IDs of connected primitives
  connectionPoints: ConnectionPoint[]; // NEW: Connection points for snapping
  quantumState?: {
    coherence: number; // 0.0 to 1.0
    entanglement: string[]; // IDs of entangled pieces
    phase: number; // Phase angle for quantum effects
  };
}

export interface Structure {
  id: string;
  name: string;
  createdBy: string;         // familyMemberId
  createdAt: number;
  primitives: GeometricPrimitive[];
  vertices: number;          // V count
  edges: number;             // E count
  isRigid: boolean;          // Maxwell: E ≥ 3V - 6
  stabilityScore: number;    // 0-100
  maxLoadBeforeFailure: number;
}

export interface Challenge {
  id: string;
  tier: 'seedling' | 'sprout' | 'sapling' | 'oak' | 'sequoia';
  title: string;
  description: string;
  objectives: Objective[];
  rewardLove: number;        // LOVE tokens on completion
  rewardBadge?: string;      // Badge ID if applicable
  timeLimit?: number;        // seconds, optional
  coopRequired: boolean;     // requires family co-op?
  coopBonus: number;         // extra LOVE for co-op completion
  prerequisites: string[];   // challenge IDs that must be completed first
  fullerPrinciple: string;   // "Synergetics" principle taught
  realWorldExample: string;  // "This is how bridges work!"
}

export interface Objective {
  type: 'build' | 'stability' | 'efficiency' | 'creative' | 'coop';
  target: number;
  unit: string;
  description: string;
}

export interface PlayerProgress {
  familyMemberId: string;
  completedChallenges: string[];
  currentChallenge?: string;
  totalLoveEarned: number;
  badges: string[];
  buildStreak: number;       // consecutive days with a build
  structures: string[];      // structure IDs
  tier: 'seedling' | 'sprout' | 'sapling' | 'oak' | 'sequoia';
  xp: number;
}

export interface BuildState {
  mode: 'build' | 'test' | 'view';
  selectedPiece: string | null;
  ghostPiece: GeometricPrimitive | null;
  snapEnabled: boolean;
  gridVisible: boolean;
  undoStack: Structure[];
  redoStack: Structure[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  maxwellRatio: number;      // E / (3V - 6)
  stabilityScore: number;    // 0-100
  loadCapacity: number;      // Estimated max load
}

export interface PhysicsResult {
  isStable: boolean;
  deformation: number;       // 0-1, how much it deforms
  failurePoints: string[];   // IDs of pieces that failed
  centerOfMass: THREE.Vector3;
  stressDistribution: number[]; // Stress values for each piece
}

export interface ChallengeResult {
  success: boolean;
  completedObjectives: string[];
  rewardLove: number;
  rewardBadge?: string;
  timeTaken?: number;
  structureRating: number;   // 0-100
  feedback: string[];
}

export interface GameConfig {
  physics: {
    gravity: THREE.Vector3;
    timeStep: number;
    velocityIterations: number;
    positionIterations: number;
  };
  build: {
    snapDistance: number;
    maxUndoSteps: number;
    autoSaveInterval: number; // ms
  };
  audio: {
    volume: number;
    enabled: boolean;
    ambientEnabled: boolean;
  };
  graphics: {
    antialias: boolean;
    shadowQuality: 'low' | 'medium' | 'high';
    renderDistance: number;
  };
}

// === MATERIAL PROPERTIES ===

export interface MaterialProperties {
  density: number;           // kg/m³
  friction: number;          // 0-1
  restitution: number;       // 0-1 (bounciness)
  strength: number;          // Structural integrity
  color: string;
  texture?: string;
}

export const MATERIAL_PROPERTIES: Record<string, MaterialProperties> = {
  wood: {
    density: 500,
    friction: 0.6,
    restitution: 0.2,
    strength: 50,
    color: '#8B4513'
  },
  metal: {
    density: 7800,
    friction: 0.4,
    restitution: 0.1,
    strength: 200,
    color: '#C0C0C0'
  },
  crystal: {
    density: 2650,
    friction: 0.3,
    restitution: 0.8,
    strength: 100,
    color: '#00FFFF'
  },
  quantum: {
    density: 1000,
    friction: 0.1,
    restitution: 0.9,
    strength: 150,
    color: '#FF00FF'
  }
};

// === GEOMETRY CONSTANTS ===

export const GEOMETRY_CONSTANTS = {
  // Tetrahedron properties
  tetrahedron: {
    vertices: 4,
    edges: 6,
    faces: 4,
    edgeLength: 1,
    volume: Math.sqrt(2) / 12,
    radius: Math.sqrt(6) / 4
  },
  
  // Octahedron properties
  octahedron: {
    vertices: 6,
    edges: 12,
    faces: 8,
    edgeLength: 1,
    volume: Math.sqrt(2) / 3,
    radius: Math.sqrt(2) / 2
  },
  
  // Icosahedron properties
  icosahedron: {
    vertices: 12,
    edges: 30,
    faces: 20,
    edgeLength: 1,
    volume: (5 * (3 + Math.sqrt(5))) / 12,
    radius: Math.sqrt(10 + 2 * Math.sqrt(5)) / 4
  }
};

// === CHALLENGE TIER CONSTANTS ===

export const CHALLENGE_TIERS = {
  seedling: { minAge: 4, maxAge: 6, color: '#8BC34A' },
  sprout: { minAge: 6, maxAge: 8, color: '#4CAF50' },
  sapling: { minAge: 8, maxAge: 10, color: '#2E7D32' },
  oak: { minAge: 10, maxAge: 13, color: '#1B5E20' },
  sequoia: { minAge: 13, maxAge: 99, color: '#004D40' }
};

// === AUDIO CONSTANTS ===

export const AUDIO_EVENTS = {
  place_piece: 'place_piece',
  remove_piece: 'remove_piece',
  structure_valid: 'structure_valid',
  structure_invalid: 'structure_invalid',
  test_start: 'test_start',
  test_success: 'test_success',
  test_failure: 'test_failure',
  challenge_complete: 'challenge_complete',
  level_up: 'level_up',
  ambient: 'ambient'
} as const;

// === BUILD MODE CONSTANTS ===

export const BUILD_MODES = {
  BUILD: 'build',
  TEST: 'test',
  VIEW: 'view'
} as const;

export type BuildModeType = typeof BUILD_MODES[keyof typeof BUILD_MODES];

// === VALIDATION CONSTANTS ===

export const VALIDATION_THRESHOLDS = {
  maxwellRatio: 1.0,        // E / (3V - 6) should be >= 1
  stabilityScore: 70,       // Minimum stability score
  loadCapacity: 100,        // Minimum load capacity
  deformationLimit: 0.1     // Maximum acceptable deformation
};

// === STORAGE KEYS ===

export const STORAGE_KEYS = {
  playerProgress: 'wonky_sprout_player_progress',
  structures: 'wonky_sprout_structures',
  challenges: 'wonky_sprout_challenges',
  settings: 'wonky_sprout_settings',
  currentStructure: 'wonky_sprout_current_structure'
};