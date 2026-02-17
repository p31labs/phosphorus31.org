/**
 * Floating Neutral Store — Wye/Delta grounding state for the Geodesic Engine
 *
 * Tracks network topology (star vs mesh), ground reference (hardware vs server vs none),
 * and a 0–1 "voltage" where 0 = grounded, 1 = floating (Lost Ground).
 *
 * Voltage is derived from: player coherence (low → higher voltage), server connection,
 * and Node One (hardware) connection. The mesh holds when voltage is low.
 */

import { create } from 'zustand';

export type NetworkTopology = 'wye' | 'delta' | 'hybrid';

export type GroundReference = 'hardware' | 'server' | 'none';

export interface FloatingNeutralSources {
  /** 0–1 coherence; high = more grounded */
  playerCoherence: number;
  /** Connected to central server (Colyseus) */
  roomConnected: boolean;
  /** Node One (ESP32-S3) connected via WebUSB */
  hardwareConnected: boolean;
  /** Peer-to-peer WebRTC in use (future) */
  hasWebRTCPeers?: boolean;
}

interface FloatingNeutralState {
  networkTopology: NetworkTopology;
  groundReference: GroundReference;
  /** 0 = grounded, 1 = floating (Lost Ground) */
  voltage: number;
  /** Last time sources were applied (for debugging) */
  lastUpdated: number;

  /** Compute and set state from coherence, room, and hardware. Call from sync hook. */
  setSources: (sources: FloatingNeutralSources) => void;
}

function computeVoltage(sources: FloatingNeutralSources): number {
  // Inverse of coherence: low coherence → higher voltage (more "floating")
  const coherenceFactor = 1 - sources.playerCoherence;
  // No ground reference adds voltage
  const hasHardware = sources.hardwareConnected;
  const hasServer = sources.roomConnected;
  let groundBonus = 0;
  if (!hasHardware && !hasServer) groundBonus = 0.5;
  else if (!hasHardware) groundBonus = 0.15;
  else if (!hasServer) groundBonus = 0.1;
  const v = coherenceFactor * 0.5 + groundBonus;
  return Math.min(1, Math.max(0, v));
}

function computeTopology(sources: FloatingNeutralSources): NetworkTopology {
  if (sources.hasWebRTCPeers && sources.roomConnected) return 'hybrid';
  if (sources.hasWebRTCPeers) return 'delta';
  if (sources.roomConnected) return 'wye';
  return 'wye'; // attempting server; when disconnected we still show wye (no peer path yet)
}

function computeGroundReference(sources: FloatingNeutralSources): GroundReference {
  if (sources.hardwareConnected) return 'hardware';
  if (sources.roomConnected) return 'server';
  return 'none';
}

export const useFloatingNeutralStore = create<FloatingNeutralState>((set) => ({
  networkTopology: 'wye',
  groundReference: 'none',
  voltage: 0.5,
  lastUpdated: 0,

  setSources: (sources) =>
    set({
      networkTopology: computeTopology(sources),
      groundReference: computeGroundReference(sources),
      voltage: computeVoltage(sources),
      lastUpdated: Date.now(),
    }),
}));
