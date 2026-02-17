/**
 * Quantum Sierpinski Agent Swarm — agent types
 * Autonomous tetrahedron agents that build and repair the fractal structure.
 */

import type * as THREE from 'three';

export type AgentTask = 'explore' | 'build' | 'repair' | 'sleep';

export interface Agent {
  id: string;
  position: THREE.Vector3;
  targetPosition: THREE.Vector3 | null;
  task: AgentTask;
  taskData?: { targetPos?: THREE.Vector3; vertexIdx?: number; buildSiteQuality?: number; scale?: number };
  energy: number;
  speed: number;
  color: THREE.Color;
}

/** High-level swarm mission: biases assignNewTask and tick behavior. */
export type SwarmGoal =
  | { type: 'explore' }
  | { type: 'repair'; priority?: number }
  | { type: 'sierpinski'; depth: number }
  | { type: 'build'; shape: 'tetra' | 'cube' }
  | null;
