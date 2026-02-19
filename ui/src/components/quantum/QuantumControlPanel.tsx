/**
 * @license
 * Copyright 2026 P31 Labs
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                    QUANTUM CONTROL PANEL                                       ║
 * ║         Interactive quantum state manipulation                                  ║
 * ║                                                                                 ║
 * ║  "In quantum mechanics, the observer is part of the system.                    ║
 * ║   Your choices collapse reality."                                              ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import { useQuantumStore, useGlobalCoherence, useSuperpositionCount, useBellState } from '../../stores/quantum.store';
import { Atom, Zap, RefreshCw, Link2, Unlink } from 'lucide-react';

interface QuantumControlPanelProps {
  className?: string;
}

export function QuantumControlPanel({ className = '' }: QuantumControlPanelProps) {
  const nodes = useQuantumStore((state) => state.nodes);
  const entanglements = useQuantumStore((state) => state.entanglements);
  const globalCoherence = useGlobalCoherence();
  const superpositionCount = useSuperpositionCount();
  const bellStateActive = useBellState();
  const measureNode = useQuantumStore((state) => state.measureNode);
  const createEntanglement = useQuantumStore((state) => state.createEntanglement);
  const breakEntanglement = useQuantumStore((state) => state.breakEntanglement);
  const reset = useQuantumStore((state) => state.reset);
  const updateNode = useQuantumStore((state) => state.updateNode);

  const handleMeasure = (nodeId: string) => {
    measureNode(nodeId);
  };

  const handleEntangle = (nodeA: string, nodeB: string) => {
    createEntanglement(nodeA, nodeB, 0.8);
  };

  const handleBreakEntanglement = (entanglementId: string) => {
    breakEntanglement(entanglementId);
  };

  const handleReset = () => {
    reset();
  };

  const handleRestoreCoherence = (nodeId: string) => {
    updateNode(nodeId, { coherence: 0.95, collapsed: false });
  };

  return (
    <div className={`bg-black/90 border border-purple-500/50 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Atom className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Quantum Control</h3>
      </div>

      {/* Global Status */}
      <div className="mb-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Global Coherence</span>
          <span className="text-lg font-mono text-purple-400">
            {(globalCoherence * 100).toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${globalCoherence * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Superposition: {superpositionCount}/4</span>
          {bellStateActive && (
            <span className="text-yellow-400 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Bell State Active
            </span>
          )}
        </div>
      </div>

      {/* Node Controls */}
      <div className="space-y-2 mb-4">
        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Nodes</h4>
        {nodes.map((node) => (
          <div
            key={node.id}
            className="p-2 bg-gray-900/50 rounded border border-gray-800 flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{node.label}</span>
                <span className="text-xs text-gray-500">
                  ({(node.coherence * 100).toFixed(0)}%)
                </span>
                {node.collapsed && (
                  <span className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded">
                    Collapsed
                  </span>
                )}
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1 mt-1">
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${
                    node.collapsed ? 'bg-gray-600' : 'bg-gradient-to-r from-purple-500 to-cyan-500'
                  }`}
                  style={{ width: `${node.coherence * 100}%` }}
                />
              </div>
            </div>
            <div className="flex gap-1 ml-2">
              {node.collapsed ? (
                <button
                  onClick={() => handleRestoreCoherence(node.id)}
                  className="px-2 py-1 text-xs bg-green-500/20 text-green-400 border border-green-500/30 rounded hover:bg-green-500/30 transition-colors"
                  title="Restore coherence"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              ) : (
                <button
                  onClick={() => handleMeasure(node.id)}
                  className="px-2 py-1 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-colors"
                  title="Measure (collapse wave function)"
                >
                  <Zap className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Entanglements */}
      <div className="space-y-2 mb-4">
        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Entanglements ({entanglements.length})
        </h4>
        {entanglements.length === 0 ? (
          <p className="text-xs text-gray-500">No entanglements</p>
        ) : (
          entanglements.map((ent) => {
            const nodeA = nodes.find((n) => n.id === ent.nodeA);
            const nodeB = nodes.find((n) => n.id === ent.nodeB);
            return (
              <div
                key={ent.id}
                className="p-2 bg-gray-900/50 rounded border border-purple-500/30 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="text-xs text-white">
                    {nodeA?.label} ↔ {nodeB?.label}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-800 rounded-full h-1">
                      <div
                        className="bg-purple-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${ent.strength * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {(ent.strength * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleBreakEntanglement(ent.id)}
                  className="ml-2 px-2 py-1 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-colors"
                  title="Break entanglement"
                >
                  <Unlink className="w-3 h-3" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Quick Actions
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              handleEntangle('node-a', 'node-b');
              handleEntangle('node-a', 'node-c');
              handleEntangle('node-a', 'node-d');
              handleEntangle('node-b', 'node-c');
              handleEntangle('node-b', 'node-d');
              handleEntangle('node-c', 'node-d');
            }}
            className="px-3 py-2 text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-1"
          >
            <Link2 className="w-3 h-3" />
            Create All
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-2 text-xs bg-gray-700/50 text-gray-300 border border-gray-600/30 rounded hover:bg-gray-700/70 transition-colors flex items-center justify-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuantumControlPanel;
