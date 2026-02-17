/**
 * Quantum Sierpinski Agent Swarm — central controller
 * Agents explore, build, and repair the fractal structure; tick drives movement and task assignment.
 * Emergent Sierpiński: attemptBuild uses local rules (findLocalBuildSite) when possible.
 */

import { create } from 'zustand';
import * as THREE from 'three';
import { analyzeStructure } from '../engine/structure-analysis';
import type { StructureAnalysisResult } from '../engine/structure-analysis';
import { snapToLattice } from '../engine/ivm';
import { findLocalBuildSite } from '../engine/swarm-sierpinski';
import { useStructureStore } from './structure.store';
import { useCoherenceStore } from './coherence.store';
import type { Agent, AgentTask, SwarmGoal } from '../types/agent';

export type { SwarmGoal };

const LATTICE_SPACING = 1.5;
const SPAWN_INTERVAL_MS = 2000;
const SIERPINSKI_THROTTLE_MS = 2000;
let lastSpawnTime = 0;
let lastSierpinskiTime = 0;

/** When set (e.g. by WorldBuilder), swarm uses this instead of structure store. */
export interface SwarmStructureAdapter {
  getVertices: () => number[];
  getEdges: () => number[];
  /** Optional size: when provided, build with that scale (for emergent Sierpiński). */
  addTetrahedronAt: (position: THREE.Vector3, size?: number) => void;
}

function pickRandomLatticePoint(radius = 8): THREE.Vector3 {
  const r = Math.random() * radius;
  const theta = Math.acos(2 * Math.random() - 1);
  const phi = Math.random() * Math.PI * 2;
  const pos = new THREE.Vector3(
    r * Math.sin(theta) * Math.cos(phi),
    r * Math.sin(theta) * Math.sin(phi),
    r * Math.cos(theta)
  );
  return snapToLattice(pos, LATTICE_SPACING);
}

interface SwarmState {
  agents: Map<string, Agent>;
  maxAgents: number;
  targetDepth: number;
  running: boolean;
  structureAdapter: SwarmStructureAdapter | null;
  /** When true, agents use local Sierpiński rules to choose build position/scale. */
  emergentSierpinski: boolean;
  /** When set, biases task assignment toward this goal (top-down instruction). */
  goal: SwarmGoal | null;
  spawnAgent: () => void;
  assignTask: (agentId: string, task: AgentTask, taskData?: Agent['taskData']) => void;
  updateAgent: (agentId: string, updates: Partial<Agent>) => void;
  removeAgent: (agentId: string) => void;
  tick: (delta: number) => void;
  setRunning: (running: boolean) => void;
  setTargetDepth: (depth: number) => void;
  setEmergentSierpinski: (enabled: boolean) => void;
  setStructureAdapter: (adapter: SwarmStructureAdapter | null) => void;
  setGoal: (goal: SwarmGoal | null) => void;
  clearAgents: () => void;
}

function attemptBuild(agentId: string): void {
  const state = useSwarmStore.getState();
  const agent = state.agents.get(agentId);
  if (!agent) return;
  const adapter = state.structureAdapter;
  const effectiveDepth =
    state.goal?.type === 'sierpinski' ? state.goal.depth : state.targetDepth;
  const emergentSierpinski = state.emergentSierpinski;

  let buildPosition: THREE.Vector3;
  let buildScale: number;
  let buildSiteQuality = 0;

  // If agent was sent to build at a specific scale (e.g. Sierpiński apex), use it
  const taskScale = agent.taskData?.scale;
  if (typeof taskScale === 'number' && taskScale > 0) {
    buildPosition = agent.position.clone();
    buildScale = taskScale;
  } else if (emergentSierpinski) {
    const vertices = adapter ? adapter.getVertices() : useStructureStore.getState().vertices;
    const edges = adapter ? adapter.getEdges() : useStructureStore.getState().edges;
    const tetraInfos = adapter ? null : useStructureStore.getState().tetraInfos;
    const site = findLocalBuildSite(agent.position, vertices, edges, tetraInfos, {
      targetDepth: effectiveDepth,
      baseScale: 0.8,
      radius: 2.5,
      minDist: 0.25,
    });
    if (site) {
      buildPosition = site.position;
      buildScale = site.scale;
      buildSiteQuality = site.quality;
    } else {
      buildPosition = agent.position.clone();
      buildScale = 0.8;
    }
  } else {
    buildPosition = agent.position.clone();
    buildScale = 0.8;
  }

  if (adapter) {
    adapter.addTetrahedronAt(buildPosition, buildScale);
  } else {
    useStructureStore.getState().addTetrahedronAt(buildPosition, buildScale);
  }

  state.assignTask(agentId, 'explore', buildSiteQuality > 0 ? { buildSiteQuality } : undefined);
}

/** Minimum scale allowed at a given Sierpiński depth: 0.8 / 2^depth. */
function getMinScaleForDepth(depth: number): number {
  return 0.8 / Math.pow(2, depth);
}

/**
 * Assign a new task to an agent based on current goal and structure analysis.
 * When goal is set, biases toward repair (weak points), sierpinski (triangle apex build), or build.
 */
function assignNewTask(
  agentId: string,
  goal: SwarmGoal | null,
  analysis: StructureAnalysisResult,
  vertices: number[]
): void {
  const store = useSwarmStore.getState();
  const agent = store.agents.get(agentId);
  if (!agent) return;

  const { targetDepth, emergentSierpinski, structureAdapter, assignTask, updateAgent } = store;
  const effectiveDepth = goal?.type === 'sierpinski' ? goal.depth : targetDepth;

  // Goal: repair — send agent to first weak point if any
  if (goal?.type === 'repair' && analysis.weakPoints.length > 0) {
    const weakIdx = analysis.weakPoints[0];
    const target = new THREE.Vector3(
      vertices[weakIdx * 3],
      vertices[weakIdx * 3 + 1],
      vertices[weakIdx * 3 + 2]
    );
    if (import.meta.env?.DEV) console.log('[swarm] assignNewTask: goal=repair, agent=', agentId, '→ weak point', weakIdx);
    assignTask(agentId, 'repair', { targetPos: target, vertexIdx: weakIdx });
    updateAgent(agentId, { targetPosition: target });
    return;
  }

  // Goal: sierpinski — try findLocalBuildSite first, then triangle-apex build
  if (goal?.type === 'sierpinski' && emergentSierpinski) {
    const edges = structureAdapter
      ? structureAdapter.getEdges()
      : useStructureStore.getState().edges;
    const tetraInfos = structureAdapter ? null : useStructureStore.getState().tetraInfos;
    const site = findLocalBuildSite(agent.position, vertices, edges, tetraInfos, {
      targetDepth: effectiveDepth,
      baseScale: 0.8,
      radius: 2.5,
      minDist: 0.25,
    });
    if (site) {
      if (import.meta.env?.DEV) console.log('[swarm] assignNewTask: goal=sierpinski (local site), agent=', agentId);
      updateAgent(agentId, { targetPosition: site.position.clone() });
      assignTask(agentId, 'build', { buildSiteQuality: site.quality });
      return;
    }
  }

  // Goal: sierpinski (or emergent) — try building at triangle apex when no adapter
  if ((goal?.type === 'sierpinski' || emergentSierpinski) && !structureAdapter) {
    const struct = useStructureStore.getState();
    const { findTriangles, findTetrasInRadius, addTetrahedronAt } = struct;
    const triangles = struct.findTriangles();
    const minScale = getMinScaleForDepth(effectiveDepth);

    for (const tri of triangles) {
      if (tri.scale < minScale * 2) continue;
      const height = tri.scale * Math.sqrt(2 / 3);
      const apex = tri.center.clone().add(tri.normal.clone().multiplyScalar(height));
      if (findTetrasInRadius(apex, 0.3).length > 0) continue;
      if (import.meta.env?.DEV) console.log('[swarm] assignNewTask: goal=sierpinski (apex), agent=', agentId, 'scale=', tri.scale / 2);
      assignTask(agentId, 'build', { scale: tri.scale / 2 });
      updateAgent(agentId, { targetPosition: apex });
      return;
    }
  }

  // Goal: build — build at current position
  if (goal?.type === 'build') {
    if (import.meta.env?.DEV) console.log('[swarm] assignNewTask: goal=build, agent=', agentId);
    assignTask(agentId, 'build');
    attemptBuild(agentId);
    return;
  }

  // Fallback: explore (random lattice) or random build
  if (import.meta.env?.DEV) console.log('[swarm] assignNewTask: fallback explore/build, agent=', agentId, 'goal=', goal?.type ?? 'null');
  const r = Math.random();
  if (r < 0.3) {
    const pos = pickRandomLatticePoint();
    store.updateAgent(agentId, { targetPosition: pos });
  } else {
    attemptBuild(agentId);
  }
}

export const useSwarmStore = create<SwarmState>((set, get) => ({
  agents: new Map(),
  maxAgents: 10,
  targetDepth: 3,
  running: false,
  structureAdapter: null,
  emergentSierpinski: true,
  goal: null,

  setStructureAdapter: (adapter) => set({ structureAdapter: adapter }),
  setGoal: (g) => set({ goal: g }),
  setTargetDepth: (depth) => set({ targetDepth: Math.max(1, Math.min(6, depth)) }),
  setEmergentSierpinski: (enabled) => set({ emergentSierpinski: enabled }),

  spawnAgent: () => {
    const id = `agent-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const angle = Math.random() * Math.PI * 2;
    const radius = 5;
    const pos = new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.5,
      Math.sin(angle) * radius * 0.3
    );
    const snapped = snapToLattice(pos, LATTICE_SPACING);
    const agent: Agent = {
      id,
      position: snapped.clone(),
      targetPosition: null,
      task: 'explore',
      energy: 1.0,
      speed: 0.5 + Math.random() * 0.5,
      color: new THREE.Color(0x2ecc71),
    };
    set((state) => {
      const newAgents = new Map(state.agents);
      newAgents.set(id, agent);
      return { agents: newAgents };
    });
  },

  assignTask: (agentId, task, taskData) => {
    set((state) => {
      const agent = state.agents.get(agentId);
      if (!agent) return {};
      const updated: Agent = { ...agent, task, taskData };
      const newAgents = new Map(state.agents);
      newAgents.set(agentId, updated);
      return { agents: newAgents };
    });
  },

  updateAgent: (agentId, updates) => {
    set((state) => {
      const agent = state.agents.get(agentId);
      if (!agent) return {};
      const updated: Agent = { ...agent, ...updates };
      const newAgents = new Map(state.agents);
      newAgents.set(agentId, updated);
      return { agents: newAgents };
    });
  },

  removeAgent: (agentId) => {
    set((state) => {
      const newAgents = new Map(state.agents);
      newAgents.delete(agentId);
      return { agents: newAgents };
    });
  },

  setRunning: (running) => set({ running }),

  clearAgents: () => set({ agents: new Map() }),

  tick: (delta: number) => {
    const { agents, assignTask, updateAgent, maxAgents, running, structureAdapter, goal } = get();
    if (!running && agents.size === 0) return;

    const vertices = structureAdapter ? structureAdapter.getVertices() : useStructureStore.getState().vertices;
    const edges = structureAdapter ? structureAdapter.getEdges() : useStructureStore.getState().edges;
    const analysis = analyzeStructure(vertices, edges);
    const globalCoherence = useCoherenceStore.getState().globalCoherence;

    agents.forEach((agent) => {
      if (agent.targetPosition) {
        const direction = agent.targetPosition.clone().sub(agent.position);
        const distance = direction.length();
        const speed = agent.speed * (0.5 + globalCoherence * 0.5);
        if (distance < 0.15) {
          updateAgent(agent.id, { position: agent.targetPosition.clone(), targetPosition: null });
          if (agent.task === 'repair' || agent.task === 'build') {
            attemptBuild(agent.id);
          } else {
            assignNewTask(agent.id, goal, analysis, vertices);
          }
        } else {
          direction.normalize().multiplyScalar(Math.min(distance, speed * delta));
          const newPos = agent.position.clone().add(direction);
          updateAgent(agent.id, { position: newPos });
        }
      } else {
        assignNewTask(agent.id, goal, analysis, vertices);
      }
    });

    if (
      running &&
      agents.size < maxAgents &&
      vertices.length / 12 < 80 &&
      Date.now() - lastSpawnTime > SPAWN_INTERVAL_MS
    ) {
      lastSpawnTime = Date.now();
      get().spawnAgent();
    }

    // When goal is repair (or no goal), send idle agents to weak points first
    const preferRepair = !goal || goal.type === 'repair';
    if (preferRepair && analysis.weakPoints.length > 0) {
      const idleAgents = Array.from(agents.values()).filter(
        (a) => a.task === 'explore' || a.task === 'sleep'
      );
      analysis.weakPoints.slice(0, idleAgents.length).forEach((vertexIdx, idx) => {
        const agent = idleAgents[idx];
        if (!agent) return;
        const pos = new THREE.Vector3(
          vertices[vertexIdx * 3],
          vertices[vertexIdx * 3 + 1],
          vertices[vertexIdx * 3 + 2]
        );
        assignTask(agent.id, 'repair', { targetPos: pos, vertexIdx });
        updateAgent(agent.id, { targetPosition: pos });
      });
    }

    // Optional local Sierpiński rule: if ≥3 neighbors at a lattice cell, add scaled tetrahedron at center
    if (
      !structureAdapter &&
      running &&
      useStructureStore.getState().sierpinskiRuleEnabled &&
      Date.now() - lastSierpinskiTime > SIERPINSKI_THROTTLE_MS
    ) {
      lastSierpinskiTime = Date.now();
      useStructureStore.getState().applySierpinskiRule();
    }
  },
}));
