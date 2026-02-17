/**
 * SwarmControl — UI panel to start/stop swarm, spawn agents, set goals, adjust params
 */

import React, { useRef, useEffect } from 'react';
import { useSwarmStore, type SwarmGoal } from '../../../stores/swarm.store';

const GOAL_OPTIONS: { value: string; label: string; goal: SwarmGoal | null }[] = [
  { value: '', label: 'No goal (emergent)', goal: null },
  { value: 'explore', label: 'Explore', goal: { type: 'explore' } },
  { value: 'repair', label: 'Repair', goal: { type: 'repair', priority: 10 } },
  { value: 'sierpinski', label: 'Build Sierpiński', goal: { type: 'sierpinski', depth: 3 } },
];

export const SwarmControl: React.FC = () => {
  const agentsSize = useSwarmStore((s) => s.agents.size);
  const maxAgents = useSwarmStore((s) => s.maxAgents);
  const targetDepth = useSwarmStore((s) => s.targetDepth);
  const goal = useSwarmStore((s) => s.goal);
  const running = useSwarmStore((s) => s.running);
  const spawnAgent = useSwarmStore((s) => s.spawnAgent);
  const setRunning = useSwarmStore((s) => s.setRunning);
  const setTargetDepth = useSwarmStore((s) => s.setTargetDepth);
  const setGoal = useSwarmStore((s) => s.setGoal);
  const setEmergentSierpinski = useSwarmStore((s) => s.setEmergentSierpinski);
  const emergentSierpinski = useSwarmStore((s) => s.emergentSierpinski);
  const clearAgents = useSwarmStore((s) => s.clearAgents);
  const autoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);
    };
  }, []);

  const handleAutoSwarm = () => {
    if (autoIntervalRef.current) {
      clearInterval(autoIntervalRef.current);
      autoIntervalRef.current = null;
      return;
    }
    useSwarmStore.getState().setRunning(true);
    autoIntervalRef.current = setInterval(() => {
      const state = useSwarmStore.getState();
      if (state.agents.size < state.maxAgents) {
        state.spawnAgent();
      }
    }, 2000);
  };

  return (
    <div
      className="absolute bottom-4 right-4 bg-black/70 p-4 rounded-lg border text-white text-sm"
      style={{ borderColor: 'rgba(46, 204, 113, 0.5)' }}
    >
      <h3 className="font-bold mb-2">Agent Swarm</h3>
      <div>Agents: {agentsSize} / {maxAgents}</div>
      <div className="mt-1 flex items-center gap-2">
        <label htmlFor="swarm-goal" className="shrink-0">Goal:</label>
        <select
          id="swarm-goal"
          value={
            goal?.type === 'sierpinski'
              ? 'sierpinski'
              : goal?.type === 'repair'
                ? 'repair'
                : goal?.type === 'explore'
                  ? 'explore'
                  : ''
          }
          onChange={(e) => {
            const opt = GOAL_OPTIONS.find((o) => o.value === e.target.value);
            setGoal(opt ? opt.goal : null);
          }}
          className="flex-1 rounded border border-gray-600 bg-gray-800 text-white text-sm px-2 py-1"
          aria-label="Swarm goal"
        >
          {GOAL_OPTIONS.map((opt) => (
            <option key={opt.value || 'none'} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <label htmlFor="swarm-depth" className="shrink-0">Fractal depth:</label>
        <input
          id="swarm-depth"
          type="range"
          min={1}
          max={6}
          value={goal?.type === 'sierpinski' ? goal.depth : targetDepth}
          onChange={(e) => {
            const d = Number(e.target.value);
            setTargetDepth(d);
            if (goal?.type === 'sierpinski') setGoal({ type: 'sierpinski', depth: d });
          }}
          className="flex-1"
        />
        <span className="w-5 text-right">
          {goal?.type === 'sierpinski' ? goal.depth : targetDepth}
        </span>
      </div>
      <label className="mt-1 flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={emergentSierpinski}
          onChange={(e) => setEmergentSierpinski(e.target.checked)}
        />
        <span>Emergent Sierpiński (local rules)</span>
      </label>
      <div className="flex flex-wrap gap-2 mt-2">
        <button
          type="button"
          onClick={() => spawnAgent()}
          className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded"
        >
          Spawn agent
        </button>
        <button
          type="button"
          onClick={() => setRunning(!running)}
          className={`px-3 py-1 rounded ${running ? 'bg-amber-600' : 'bg-blue-600'} hover:opacity-90`}
        >
          {running ? 'Pause' : 'Run'}
        </button>
        <button
          type="button"
          onClick={handleAutoSwarm}
          className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded"
        >
          Auto swarm
        </button>
        <button
          type="button"
          onClick={() => { clearAgents(); setRunning(false); if (autoIntervalRef.current) { clearInterval(autoIntervalRef.current); autoIntervalRef.current = null; } }}
          className="bg-red-900/80 hover:bg-red-800 px-3 py-1 rounded"
        >
          Clear
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Agents build tetrahedra. They follow local rules to form Sierpiński fractals.
      </p>
    </div>
  );
};
