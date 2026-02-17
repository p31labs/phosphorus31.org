/**
 * SwarmControl — panel to start/stop swarm and adjust parameters
 */

import React, { useRef, useCallback } from 'react';
import { useSwarmStore } from '../../stores/swarm.store';

export const SwarmControl: React.FC = () => {
  const agentCount = useSwarmStore((s) => s.agents.size);
  const maxAgents = useSwarmStore((s) => s.maxAgents);
  const targetDepth = useSwarmStore((s) => s.targetDepth);
  const spawnAgent = useSwarmStore((s) => s.spawnAgent);
  const autoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoSwarm = useCallback(() => {
    if (autoIntervalRef.current) return;
    autoIntervalRef.current = setInterval(() => {
      const state = useSwarmStore.getState();
      if (state.agents.size < state.maxAgents) {
        state.spawnAgent();
      }
    }, 2000);
  }, []);

  const stopAutoSwarm = useCallback(() => {
    if (autoIntervalRef.current) {
      clearInterval(autoIntervalRef.current);
      autoIntervalRef.current = null;
    }
  }, []);

  return (
    <div
      className="absolute bottom-4 right-4 bg-black/70 p-4 rounded-lg text-white border border-[#2ecc71]/30"
      role="group"
      aria-label="Agent Swarm controls"
    >
      <h3 className="font-bold mb-2 text-[#2ecc71]">Agent Swarm</h3>
      <div className="text-sm">
        Agents: {agentCount} / {maxAgents}
      </div>
      <div className="text-sm">Target depth: {targetDepth}</div>
      <div className="flex flex-wrap gap-2 mt-2">
        <button
          type="button"
          onClick={() => spawnAgent()}
          className="bg-[#2ecc71] hover:bg-[#27ae60] text-black px-3 py-1.5 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:ring-offset-1 focus:ring-offset-black"
          aria-label="Spawn one agent"
        >
          Spawn agent
        </button>
        <button
          type="button"
          onClick={startAutoSwarm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 focus:ring-offset-black"
          aria-label="Start auto swarm"
        >
          Auto swarm
        </button>
        <button
          type="button"
          onClick={stopAutoSwarm}
          className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1.5 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 focus:ring-offset-black"
          aria-label="Stop auto swarm"
        >
          Stop auto
        </button>
      </div>
    </div>
  );
};
