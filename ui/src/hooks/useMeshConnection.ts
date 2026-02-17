/**
 * Mesh connection status for Sprout — amber dot when reconnecting.
 * Listens to p31:mesh:connection (dispatched by WebSocket adapter). No error text.
 */

import { useState, useEffect } from 'react';
import { MESH_CONNECTION_EVENT, type MeshConnectionDetail } from '../services/meshAdapter';

export function useMeshConnection(): { connected: boolean; reconnecting: boolean } {
  const [state, setState] = useState<MeshConnectionDetail>({ connected: false, reconnecting: false });

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<MeshConnectionDetail>).detail;
      if (detail) setState({ connected: detail.connected, reconnecting: detail.reconnecting });
    };
    window.addEventListener(MESH_CONNECTION_EVENT, handler);
    return () => window.removeEventListener(MESH_CONNECTION_EVENT, handler);
  }, []);

  return state;
}
