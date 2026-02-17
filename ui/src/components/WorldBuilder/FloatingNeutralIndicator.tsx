/**
 * FloatingNeutralIndicator — Wye/Delta grounding widget for the Geodesic Engine
 *
 * Shows: voltage (0 = grounded, 100% = floating), network topology (star vs mesh),
 * and ground reference (Node One, cloud, or floating). Complements CoherenceHUD.
 */

import React from 'react';
import { useFloatingNeutralStore } from '../../stores/floatingNeutral.store';
import { useFloatingNeutralSync } from '../../hooks/useFloatingNeutralSync';
import type { NetworkTopology, GroundReference } from '../../stores/floatingNeutral.store';

function TopologyIcon({ topology }: { topology: NetworkTopology }) {
  if (topology === 'delta')
    return (
      <span className="text-amber-400" title="Delta (mesh)">
        🔺
      </span>
    );
  if (topology === 'hybrid')
    return (
      <span className="text-cyan-400" title="Hybrid (server + peer)">
        🔄
      </span>
    );
  return (
    <span className="text-blue-400" title="Wye (central server)">
      ⭐
    </span>
  );
}

function GroundLabel({ ground }: { ground: GroundReference }) {
  if (ground === 'hardware')
    return (
      <span className="text-green-400" title="Node One connected">
        🔒 Node One
      </span>
    );
  if (ground === 'server')
    return (
      <span className="text-cyan-400" title="Server connection">
        ☁️ Cloud
      </span>
    );
  return (
    <span className="text-amber-500" title="No ground reference">
      ⚠️ Floating
    </span>
  );
}

export const FloatingNeutralIndicator: React.FC = () => {
  useFloatingNeutralSync();

  const voltage = useFloatingNeutralStore((s) => s.voltage);
  const networkTopology = useFloatingNeutralStore((s) => s.networkTopology);
  const groundReference = useFloatingNeutralStore((s) => s.groundReference);

  const voltagePct = Math.round(voltage * 100);
  const dotColor =
    voltage < 0.3 ? 'bg-green-500' : voltage < 0.7 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div
      className="absolute top-4 right-4 z-10 flex flex-col gap-1 bg-black/70 p-2 rounded-lg border border-cyan-500/30 text-xs"
      role="status"
      aria-label={`Grounding: ${voltagePct}% voltage, ${networkTopology} topology, ${groundReference} ground`}
    >
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} aria-hidden />
        <span className="text-gray-300">Voltage:</span>
        <span className="font-mono text-gray-200">{voltagePct}%</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-400">Topology:</span>
        <TopologyIcon topology={networkTopology} />
        <span className="text-gray-300">
          {networkTopology === 'wye' ? 'Wye' : networkTopology === 'delta' ? 'Delta' : 'Hybrid'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-400">Ground:</span>
        <GroundLabel ground={groundReference} />
      </div>
    </div>
  );
};

export default FloatingNeutralIndicator;
