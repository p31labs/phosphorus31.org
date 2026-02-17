/**
 * Bonding Game Types
 * Turn-based multiplayer molecule builder
 */

export type GameMode = 'LOBBY' | 'GAME' | 'COMPLETE';

export type PingType = 'NICE' | 'HMMMM' | 'LOL' | 'WOW';

export type PingEmoji = '💚' | '🤔' | '😂' | '🔺';

export interface Ping {
  id: string;
  from: string;
  to: string;
  type: PingType;
  emoji: PingEmoji;
  atomId: string;
  timestamp: number;
}

export interface Atom {
  id: string;
  element: string;
  atomicNumber: number;
  x: number;
  y: number;
  playerId: string;
  placedAt: number;
}

export interface Bond {
  id: string;
  atom1Id: string;
  atom2Id: string;
  order: number; // 1 = single, 2 = double, 3 = triple
}

export interface Player {
  id: string;
  name: string;
  color: string;
  atomsPlaced: number;
  pingsSent: number;
}

export interface BondingGame {
  id: string;
  code: string;
  name: string;
  players: Player[];
  atoms: Atom[];
  bonds: Bond[];
  pings: Ping[];
  currentTurn: string; // playerId
  status: 'active' | 'complete';
  createdAt: number;
  lastActivity: number;
  completedAt?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: number;
}

export interface GameStats {
  formula: string;
  mass: number;
  stability: number;
  atomCount: number;
  bondCount: number;
  playerStats: Record<string, { atoms: number; pings: number }>;
}

export interface ElementInfo {
  symbol: string;
  name: string;
  atomicNumber: number;
  category: 'starter' | 'common' | 'metals' | 'special';
  locked: boolean;
  funFact: string;
  frequency: number; // Hz for sound
}
