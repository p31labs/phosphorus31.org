/**
 * P31 Unified Dashboard — command center for the P31 Quantum Geodesic Platform.
 * Coherence, structure stats, weak points, fractal dimension, mode switcher,
 * wallet integration, and changelog modal.
 */

import React, { useState } from 'react';
import { useCoherenceStore } from '../../stores/coherence.store';
import { useStructureStore } from '../../stores/structure.store';
import { useSwarmStore } from '../../stores/swarm.store';
import { useModeStore, type AppMode } from '../../stores/mode.store';
import { useWalletStore } from '../../stores/wallet.store';
import { analyzeStructure } from '../../engine/structure-analysis';
import { ChangelogModal } from './ChangelogModal';

/** Rough fractal dimension estimator from vertices/edges (simplified box-counting heuristic). */
function estimateFractalDimension(vertices: number[], edges: number[]): number {
  if (vertices.length < 12) return 1.0;
  const v = vertices.length / 3;
  const e = edges.length / 2;
  return 1.0 + (e / Math.max(1, v)) * 0.5;
}

export const P31Dashboard: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [showChangelog, setShowChangelog] = useState(false);

  const playerCoherence = useCoherenceStore((s) => s.playerCoherence);
  const globalCoherence = useCoherenceStore((s) => s.globalCoherence);

  const vertices = useStructureStore((s) => s.vertices);
  const edges = useStructureStore((s) => s.edges);
  const tetraInfos = useStructureStore((s) => s.tetraInfos);
  const tetrasCount = tetraInfos.length;

  const agentsCount = useSwarmStore((s) => s.agents.size);
  const goal = useSwarmStore((s) => s.goal);
  const setGoal = useSwarmStore((s) => s.setGoal);
  void goal; // reserved for future goal display

  const currentMode = useModeStore((s) => s.currentMode);
  const setMode = useModeStore((s) => s.setMode);

  const { balance, address, isConnected, connect, disconnect, donate } = useWalletStore();

  const analysis = analyzeStructure(vertices, edges);
  const systemStress = Math.round((1 - analysis.stability) * 100);
  const blocksCount = Math.floor(vertices.length / 12);
  const weakPointsCount = analysis.weakPoints.length;
  const fractalDim = estimateFractalDimension(vertices, edges).toFixed(2);

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    if (newMode === 'repair') setGoal({ type: 'repair' });
    else if (newMode === 'sierpinski') setGoal({ type: 'sierpinski', depth: 3 });
    else if (newMode === 'explore') setGoal({ type: 'explore' });
    else if (newMode === 'build') setGoal({ type: 'build', shape: 'tetra' });
    else setGoal(null);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <div
        className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-green-500/30 text-white font-mono text-sm p-4 grid grid-cols-12 gap-4 pointer-events-auto"
        role="region"
        aria-label="P31 system dashboard"
      >
        {/* Left column – Coherence, Mode, Blocks, Weak points */}
        <div className="col-span-3 space-y-2 border-r border-green-500/30 pr-4">
          <div className="flex justify-between">
            <span className="text-green-400">COHERENCE</span>
            <span className="font-bold">{(globalCoherence * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-green-400">MODE</span>
            <select
              value={currentMode}
              onChange={(e) => handleModeChange(e.target.value as AppMode)}
              className="bg-gray-800 text-green-400 border border-green-500 rounded px-2 py-1 text-xs"
              aria-label="Select app mode"
            >
              <option value="slice">SLICE</option>
              <option value="build">BUILD</option>
              <option value="repair">REPAIR</option>
              <option value="sierpinski">SIERPINSKI</option>
              <option value="explore">EXPLORE</option>
            </select>
          </div>
          <div className="flex justify-between">
            <span className="text-green-400">BLOCKS</span>
            <span className="font-bold">{blocksCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-400">WEAK POINTS</span>
            <span className="font-bold text-yellow-400">{weakPointsCount}</span>
          </div>
        </div>

        {/* Middle column – STATISTIC */}
        <div className="col-span-3 space-y-2 border-r border-green-500/30 pr-4">
          <div className="text-green-400 mb-1">STATISTIC</div>
          <div className="flex justify-between">
            <span>Stability</span>
            <span className="font-bold">{(analysis.stability * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Maxwell</span>
            <span className="font-bold">{analysis.maxwellValid ? 'VALID' : 'INVALID'}</span>
          </div>
          <div className="flex justify-between">
            <span>Fractal Dim</span>
            <span className="font-bold">{fractalDim}</span>
          </div>
        </div>

        {/* Right column – CLASSICAL + wallet */}
        <div className="col-span-3 space-y-2 border-r border-green-500/30 pr-4">
          <div className="text-green-400 mb-1">CLASSICAL</div>
          <div className="flex justify-between">
            <span>COHERENCE</span>
            <span className="font-bold">{(playerCoherence * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span>MOLECULES</span>
            <span className="font-bold">{tetrasCount + agentsCount}</span>
          </div>
          <div className="mt-2 pt-2 border-t border-green-500/30">
            <div className="flex justify-between items-center">
              <span className="text-green-400">WALLET</span>
              {isConnected ? (
                <button
                  type="button"
                  onClick={disconnect}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  disconnect
                </button>
              ) : (
                <button
                  type="button"
                  onClick={connect}
                  className="text-xs bg-green-600 px-2 py-0.5 rounded"
                >
                  connect
                </button>
              )}
            </div>
            {isConnected && (
              <>
                <div className="flex justify-between text-xs mt-1">
                  <span>CT balance</span>
                  <span className="font-bold">{balance}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>address</span>
                  <span className="font-mono text-green-300">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => donate(10)}
                  className="mt-2 bg-green-700 hover:bg-green-600 text-xs px-2 py-1 rounded w-full"
                >
                  Donate 10 CT
                </button>
              </>
            )}
          </div>
        </div>

        {/* Rightmost column – Close and changelog */}
        <div className="col-span-3 flex flex-col items-end justify-between">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xs border border-gray-600 px-2 py-1 rounded"
              aria-label="Close dashboard"
            >
              ✕ CLOSE
            </button>
          )}
          <div className="text-right text-xs text-gray-400">
            <div>What&apos;s new in DevTools 145</div>
            <button
              type="button"
              onClick={() => setShowChangelog(true)}
              className="text-green-400 hover:underline"
            >
              See all new features
            </button>
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="col-span-12 flex justify-between items-center mt-2 pt-2 border-t border-green-500/30 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-green-400">SYSTEM STRESS:</span>
            <div className="w-32 h-2 bg-gray-700 rounded">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-red-400 rounded"
                style={{ width: `${systemStress}%` }}
              />
            </div>
            <span>{systemStress}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">QUANTUM FLOW:</span>
            <span>{(globalCoherence * 100).toFixed(0)}%</span>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden />
          </div>
        </div>
      </div>

      {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
    </div>
  );
};

export default P31Dashboard;
