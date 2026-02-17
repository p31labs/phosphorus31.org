/**
 * P31 Game Integration — Molecule & game client types
 * The molecule IS the player. Stored in browser + pushed to Shelter on formation.
 * Metabolism color and shared vocabulary from @p31/protocol.
 */

import type { MetabolismColor } from '@p31/protocol';

export interface P31Molecule {
  fingerprint: string;
  publicKey: JsonWebKey;
  privateKey: JsonWebKey;
  created: string;

  covenantSig: string;
  covenantAt: string;

  player: {
    familyMemberId: string;
    displayName: string;
    tier: 'seedling' | 'sprout' | 'sapling' | 'oak' | 'sequoia';
    xp: number;
    totalLoveEarned: number;
    completedChallenges: string[];
    badges: string[];
    buildStreak: number;
    structures: string[];
    coherence: number;
  };

  wallet: {
    sovereigntyPool: number;
    performancePool: number;
    totalEarned: number;
    transactions: WalletTransaction[];
  };

  dome: {
    name: string;
    color: string;
    intent: string;
    structureId: string;
  };

  metabolism: {
    spoons: number;
    maxSpoons: number;
    color: MetabolismColor;
    lastSync: string;
  };
}

export interface WalletTransaction {
  type: string;
  love: number;
  desc: string;
  timestamp: string;
  memberId?: string;
}

export interface MetabolismState {
  currentSpoons: number;
  maxSpoons: number;
  color: MetabolismColor;
  recoveryRate?: number;
  lastSync: string | null;
}

export interface BrainState {
  spoons: number;
  maxSpoons: number;
  color: MetabolismColor;
  medsStatus?: string;
  bufferBlocked?: number;
  loveTotal?: number;
  accommodationCount?: number;
  updatedAt?: string;
}

/** Minimal structure for Colyseus/mesh — no THREE dependency */
export interface StructureMesh {
  id: string;
  name: string;
  createdBy: string;
  createdAt: number;
  primitives: Array<{
    id: string;
    type: string;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: number;
    color: string;
    material: string;
    connectedTo: string[];
    connectionPoints: unknown[];
    quantumState?: { coherence: number; entanglement: string[]; phase: number };
  }>;
  vertices: number;
  edges: number;
  isRigid: boolean;
  stabilityScore: number;
  maxLoadBeforeFailure: number;
}

export interface PlayerProgress {
  familyMemberId: string;
  completedChallenges: string[];
  currentChallenge?: string;
  totalLoveEarned: number;
  badges: string[];
  buildStreak: number;
  structures: string[];
  tier: 'seedling' | 'sprout' | 'sapling' | 'oak' | 'sequoia';
  xp: number;
}

export interface WalletState {
  sovereigntyPool: number;
  performancePool: number;
  totalEarned: number;
  transactions: WalletTransaction[];
}

export interface GameClient {
  player: PlayerProgress;
  wallet: WalletState;
  metabolism: MetabolismState;
  structures: StructureMesh[];
  challenges: ChallengeDef[];
  activeChallenge: ChallengeDef | null;
  meshPlayers: MeshPlayer[];
}

export interface MeshPlayer {
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  coherence: number;
  name: string;
  role: string;
}

export interface ChallengeDef {
  id: string;
  tier: 'seedling' | 'sprout' | 'sapling' | 'oak' | 'sequoia';
  title: string;
  description: string;
  objectives: Array<{
    type: string;
    description: string;
    target: number;
    unit?: string;
  }>;
  rewardLove: number;
  rewardBadge?: string;
  timeLimit?: number;
  coopRequired: boolean;
  coopBonus: number;
  prerequisites: string[];
  fullerPrinciple: string;
  realWorldExample: string;
}
