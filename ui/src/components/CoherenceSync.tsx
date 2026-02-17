/**
 * CoherenceSync — syncs Colyseus room state (player + global coherence) into coherence store.
 * Place inside GameEngineProvider when using the geodesic_world room.
 */
import { useEffect } from 'react';
import { useGeodesicRoom } from '../contexts/GeodesicRoomContext';
import { useCoherenceStore } from '../stores/coherence.store';

export const CoherenceSync: React.FC = () => {
  const { players, room } = useGeodesicRoom();
  const setPlayerCoherence = useCoherenceStore((s) => s.updatePlayerCoherence);
  const setGlobalCoherence = useCoherenceStore((s) => s.updateGlobalCoherence);

  useEffect(() => {
    if (!room) return;
    const myId = room.sessionId;
    const myPlayer = players.get(myId);
    if (myPlayer?.coherence !== undefined) {
      setPlayerCoherence(myPlayer.coherence);
    }
    const state = room.state as { globalCoherence?: number };
    if (state?.globalCoherence !== undefined) {
      setGlobalCoherence(state.globalCoherence);
    }
  }, [players, room, setPlayerCoherence, setGlobalCoherence]);

  return null;
}
