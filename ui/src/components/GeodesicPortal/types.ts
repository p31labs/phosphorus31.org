/**
 * Geodesic Portal — types for quantum teleportation between IVM points.
 * Cost ∝ geodesic distance, ∝ 1/local coherence.
 * Future: createPortal(fromId, toId), coherence drain, shimmer ring + particle flow.
 */

export interface GeodesicPortalState {
  id: string;
  fromStructureId: string;
  toStructureId: string;
  /** Geodesic distance (IVM units) */
  distance: number;
  /** Coherence cost to open */
  cost: number;
  /** Coherence drain per second while active */
  drainPerSecond: number;
  active: boolean;
  createdAt: number;
}

export interface CreatePortalPayload {
  fromId: string;
  toId: string;
  /** Caller's current coherence (must be >= cost) */
  playerCoherence: number;
}
