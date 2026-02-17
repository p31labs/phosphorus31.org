/**
 * Mesh Status Component
 * Network/device status display for Node C (Context)
 * Wired to useMeshConnection (Buffer/WebSocket), genesis (NODE ONE, mesh peers), floatingNeutral (topology).
 */

import { useMeshConnection } from '../../hooks/useMeshConnection';
import { useGenesisStore } from '../../stores/genesis';
import { useFloatingNeutralStore } from '../../stores/floatingNeutral.store';

export function MeshStatus() {
  const { connected, reconnecting } = useMeshConnection();
  const phenixConnected = useGenesisStore((s) => s.phenixConnected);
  const isOnline = useGenesisStore((s) => s.isOnline);
  const meshPeers = useGenesisStore((s) => s.meshPeers);
  const { networkTopology, groundReference } = useFloatingNeutralStore();

  const meshLabel = reconnecting
    ? 'Reconnecting…'
    : connected
      ? 'Connected'
      : 'Not connected';
  const meshColor = connected ? '#22c55e' : reconnecting ? '#f59e0b' : '#9ca3af';

  return (
    <div style={{ padding: 16, backgroundColor: '#1f2937', borderRadius: 8 }}>
      <div style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
        Mesh Status
      </div>
      <div style={{ fontSize: 12, color: meshColor }}>Buffer / WebSocket: {meshLabel}</div>
      <div style={{ fontSize: 12, color: phenixConnected ? '#22c55e' : '#9ca3af' }}>
        NODE ONE (LoRa): {phenixConnected ? 'Connected' : 'Not connected'}
      </div>
      <div style={{ fontSize: 12, color: isOnline ? '#22c55e' : '#9ca3af' }}>
        Network: {isOnline ? 'Online' : 'Offline'}
      </div>
      <div style={{ fontSize: 12, color: '#9ca3af' }}>
        Peers: {meshPeers.length} · Topology: {networkTopology} · Ground: {groundReference}
      </div>
    </div>
  );
}
