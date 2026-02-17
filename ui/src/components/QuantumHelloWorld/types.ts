/**
 * Quantum Hello World — stored molecule and phase types.
 */

export type QuantumPhase =
  | 'boot'
  | 'void'
  | 'converse'
  | 'covenant'
  | 'forming'
  | 'born'
  | 'mesh'
  | 'returning';

export interface StoredMolecule {
  fingerprint: string;
  publicKey: JsonWebKey;
  privateKey: JsonWebKey;
  created: string;
  covenantSig: string;
  covenantAt: string;
  dome: { name: string; color: string; intent: string };
  coherence: number;
  metabolism?: { spoons: number; maxSpoons: number; color: string; lastSync: string };
  resonanceSignature?: string;
  noteCount?: number;
  resonanceHistory?: Array<{ freq: number; duration: number; velocity: number; word?: string; mood?: string; role?: string }>;
}

export interface ConverseMessage {
  role: 'user' | 'assistant';
  content: string;
  coherence?: number;
}
