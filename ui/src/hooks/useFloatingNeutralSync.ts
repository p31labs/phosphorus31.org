/**
 * useFloatingNeutralSync — Pushes coherence, room, and hardware state into the Floating Neutral store.
 * Call once from a component that has access to GeodesicRoomContext (e.g. FloatingNeutralIndicator in WorldBuilder).
 */

import { useEffect } from 'react';
import { useFloatingNeutralStore } from '../stores/floatingNeutral.store';
import { useCoherenceStore } from '../stores/coherence.store';
import { useGeodesicRoom } from '../contexts/GeodesicRoomContext';
import { useHardware } from './useHardware';

export function useFloatingNeutralSync(): void {
  const playerCoherence = useCoherenceStore((s) => s.playerCoherence);
  const { room } = useGeodesicRoom();
  const { connected: hardwareConnected } = useHardware();
  const setSources = useFloatingNeutralStore((s) => s.setSources);

  useEffect(() => {
    setSources({
      playerCoherence,
      roomConnected: room != null,
      hardwareConnected,
      hasWebRTCPeers: false, // TODO: when WebRTC data channels are added
    });
  }, [playerCoherence, room, hardwareConnected, setSources]);
}
