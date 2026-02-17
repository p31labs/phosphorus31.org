/**
 * GeodesicRoomContext — single Colyseus connection for geodesic_world room.
 * CoherenceSync and WorldBuilder consume this to avoid duplicate connections.
 */
import React, { createContext, useContext } from 'react';
import { useRoom } from '../hooks/useRoom';

type RoomValue = ReturnType<typeof useRoom>;

const GeodesicRoomContext = createContext<RoomValue | null>(null);

export const GeodesicRoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useRoom('geodesic_world', { name: 'Builder', role: 'builder' });
  return (
    <GeodesicRoomContext.Provider value={value}>{children}</GeodesicRoomContext.Provider>
  );
};

export function useGeodesicRoom(): RoomValue {
  const ctx = useContext(GeodesicRoomContext);
  if (!ctx) {
    return {
      room: null,
      error: null,
      players: new Map(),
      structures: new Map(),
      send: () => {},
      leave: () => {},
    };
  }
  return ctx;
}
