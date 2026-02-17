/**
 * useRoom — Colyseus room hook for P31 Quantum Geodesic Platform
 * Connects to geodesic_world room; syncs players and structures.
 * Install colyseus.js and set VITE_COLYSEUS_URL for multiplayer.
 */
import { useEffect, useState, useCallback, useRef } from 'react';

type RoomState = {
  players: Map<string, { coherence?: number; name?: string; [key: string]: unknown }>;
  structures: Map<
    string,
    { id: string; ownerId?: string; vertices: number[]; edges: number[]; [key: string]: unknown }
  >;
  globalCoherence?: number;
};

const defaultUrl = 'ws://localhost:2567';

export function useRoom(roomName: string, options?: { name?: string; role?: string }) {
  const [room, setRoom] = useState<{
    send: (type: string, data?: unknown) => void;
    leave: () => void;
    sessionId: string;
    state: RoomState;
    onMessage?: (type: string, callback: (data: unknown) => void) => void;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<
    Map<string, { coherence?: number; name?: string; [key: string]: unknown }>
  >(new Map());
  const [structures, setStructures] = useState<
    Map<string, { id: string; ownerId?: string; vertices: number[]; edges: number[] }>
  >(new Map());
  const roomRef = useRef<typeof room>(null);

  const join = useCallback(async () => {
    let Client: new (url: string) => {
      joinOrCreate: (name: string, opts?: object) => Promise<{
        onStateChange: (cb: () => void) => void;
        send: (type: string, data?: unknown) => void;
        leave: () => void;
        sessionId: string;
        state: RoomState;
      }>;
    };
    try {
      const mod = await import('colyseus.js');
      Client = mod.Client as typeof Client;
    } catch {
      setError('Colyseus client not available (install colyseus.js for multiplayer)');
      return;
    }
    const url = import.meta.env.VITE_COLYSEUS_URL ?? defaultUrl;
    const client = new Client(url);
    setError(null);
    try {
      const joinedRoom = await client.joinOrCreate(roomName, options ?? {});
      roomRef.current = joinedRoom as typeof room;
      setRoom(joinedRoom as typeof room);

      const syncMaps = () => {
        const s = joinedRoom.state as unknown as RoomState;
        if (s.players) {
          const pm = new Map<string, { coherence?: number; name?: string; [key: string]: unknown }>();
          s.players.forEach((p: { coherence?: number; name?: string }, k: string) => {
            pm.set(k, { coherence: p.coherence, name: p.name, ...p });
          });
          setPlayers(pm);
        }
        if (s.structures) {
          const sm = new Map<
            string,
            { id: string; ownerId?: string; vertices: number[]; edges: number[] }
          >();
          s.structures.forEach(
            (
              st: { id: string; ownerId?: string; vertices: number[]; edges: number[] },
              k: string
            ) => {
              sm.set(k, {
                id: st.id,
                ownerId: st.ownerId,
                vertices: st.vertices ?? [],
                edges: st.edges ?? [],
              });
            }
          );
          setStructures(sm);
        }
      };

      joinedRoom.onStateChange(() => syncMaps());
      syncMaps();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setRoom(null);
      setPlayers(new Map());
      setStructures(new Map());
    }
  }, [roomName, options?.name, options?.role]);

  const leave = useCallback(() => {
    const r = roomRef.current;
    if (r) {
      try {
        r.leave();
      } catch (_) {
        // ignore
      }
      roomRef.current = null;
      setRoom(null);
      setPlayers(new Map());
      setStructures(new Map());
    }
  }, []);

  const send = useCallback(
    (type: string, data?: unknown) => {
      room?.send(type, data);
    },
    [room]
  );

  useEffect(() => {
    join();
    return () => {
      const r = roomRef.current;
      if (r) {
        try {
          r.leave();
        } catch (_) {
          // ignore
        }
        roomRef.current = null;
      }
      setRoom(null);
      setPlayers(new Map());
      setStructures(new Map());
    };
  }, [roomName]);

  return { room, error, players, structures, send, leave };
}
