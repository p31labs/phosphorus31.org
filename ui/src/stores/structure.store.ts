/**
 * Structure store for Quantum MVP
 * Vertices (flat x,y,z) and edges (index pairs); add/clear tetrahedra.
 * Extended for Agent Swarm: addTetrahedronAt, setStructure, snapToLattice.
 * Optional local Sierpiński rule: if ≥3 neighbors at a lattice cell, add scaled tetrahedron at center.
 */

import { create } from 'zustand';
import * as THREE from 'three';
import { snapToLattice } from '../engine/ivm';
import { applySierpinskiRule as applySierpinskiRuleEngine } from '../engine/sierpinski-rule';

/** Metadata for one tetrahedron: center, scale, and vertex indices. */
export interface TetraInfo {
  id: string;
  center: THREE.Vector3;
  scale: number;
  /** Index of first vertex of this tetra in the flat vertices array (4 vertices = 12 floats). */
  vertexStartIndex: number;
  /** Indices of the four vertices in the global vertices array. */
  vertexIndices: [number, number, number, number];
}

/** Triangle formed by three tetra centers (for Sierpiński apex build). */
export interface TetraTriangle {
  points: THREE.Vector3[];
  center: THREE.Vector3;
  normal: THREE.Vector3;
  scale: number;
}

interface StructureState {
  vertices: number[];
  edges: number[];
  /** Per-tetrahedron metadata for emergent Sierpiński rules (agent local build-site detection). */
  tetraInfos: TetraInfo[];
  /** When true, swarm/structure can apply local Sierpiński rule (≥3 neighbors → scaled tetra at center). */
  sierpinskiRuleEnabled: boolean;
  addTetrahedron: () => void;
  /** Returns true if tetra was added, false if too close to existing geometry. */
  addTetrahedronAt: (position: THREE.Vector3, size?: number) => boolean;
  setStructure: (vertices: number[], edges: number[]) => void;
  setSierpinskiRuleEnabled: (enabled: boolean) => void;
  /** Apply local Sierpiński rule once; adds scaled tetrahedra at dense lattice cells. */
  applySierpinskiRule: () => void;
  clear: () => void;
  /** Tetras whose center is within radius of the given point (for local rules). */
  findTetrasInRadius: (center: THREE.Vector3, radius: number) => TetraInfo[];
  /** Triangles of three tetra centers (same scale, ~equilateral) for Sierpiński subdivision. */
  findTriangles: () => TetraTriangle[];
}

/** Unit tetrahedron vertices (4 points × 3 coords). */
const UNIT_TETRA = [
  0,
  Math.sqrt(8 / 9),
  0,
  -Math.sqrt(2 / 3),
  -Math.sqrt(8 / 9) / 2,
  -1 / Math.sqrt(3),
  Math.sqrt(2 / 3),
  -Math.sqrt(8 / 9) / 2,
  -1 / Math.sqrt(3),
  0,
  -Math.sqrt(8 / 9) / 2,
  2 / Math.sqrt(3),
];

/** Six edges of a tetrahedron (index pairs 0..3). */
const TETRA_EDGES = [0, 1, 0, 2, 0, 3, 1, 2, 1, 3, 2, 3];

const LATTICE_SPACING = 1.5;
const MIN_VERTEX_DISTANCE_SQ = 0.3 * 0.3;

/** Scale UNIT_TETRA by size and translate to center; returns flat [x,y,z,...]. */
function tetrahedronAt(center: THREE.Vector3, size: number): number[] {
  const cx = center.x;
  const cy = center.y;
  const cz = center.z;
  const out: number[] = [];
  for (let i = 0; i < UNIT_TETRA.length; i += 3) {
    out.push(UNIT_TETRA[i] * size + cx, UNIT_TETRA[i + 1] * size + cy, UNIT_TETRA[i + 2] * size + cz);
  }
  return out;
}

export const useStructureStore = create<StructureState>((set, get) => ({
  vertices: [],
  edges: [],
  tetraInfos: [],
  sierpinskiRuleEnabled: false,

  setSierpinskiRuleEnabled: (enabled) => set({ sierpinskiRuleEnabled: enabled }),

  applySierpinskiRule: () => {
    const { vertices, edges } = get();
    if (vertices.length < 12) return;
    const result = applySierpinskiRuleEngine(vertices, edges, {
      minNeighbors: 3,
      scaledSize: 0.4,
      minDist: 0.25,
    });
    if (result.vertices.length > vertices.length) set({ vertices: result.vertices, edges: result.edges });
  },

  addTetrahedron: () =>
    set((state) => {
      const offset = state.vertices.length / 3;
      const newVerts = [...state.vertices, ...UNIT_TETRA];
      const newEdges = [
        ...state.edges,
        ...TETRA_EDGES.map((i) => i + offset),
      ];
      return { vertices: newVerts, edges: newEdges };
    }),

  setStructure: (vertices, edges) => set({ vertices, edges, tetraInfos: [] }),

  addTetrahedronAt: (position, size = 0.8) => {
    const snapped = snapToLattice(position, LATTICE_SPACING);
    const state = get();
    for (let i = 0; i < state.vertices.length; i += 3) {
      const dx = state.vertices[i] - snapped.x;
      const dy = state.vertices[i + 1] - snapped.y;
      const dz = state.vertices[i + 2] - snapped.z;
      if (dx * dx + dy * dy + dz * dz < MIN_VERTEX_DISTANCE_SQ) return false;
    }
    const offset = state.vertices.length / 3;
    const newVerts = tetrahedronAt(snapped, size);
    const newEdges = TETRA_EDGES.map((i) => i + offset);
    const id = `tetra-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const newTetra: TetraInfo = {
      id,
      center: snapped.clone(),
      scale: size,
      vertexStartIndex: offset,
      vertexIndices: [offset, offset + 1, offset + 2, offset + 3],
    };
    set({
      vertices: [...state.vertices, ...newVerts],
      edges: [...state.edges, ...newEdges],
      tetraInfos: [...state.tetraInfos, newTetra],
    });
    return true;
  },

  clear: () => set({ vertices: [], edges: [], tetraInfos: [] }),

  findTetrasInRadius: (center, radius) => {
    return get().tetraInfos.filter((t) => t.center.distanceTo(center) <= radius);
  },

  findTriangles: () => {
    const tetras = get().tetraInfos;
    const triangles: TetraTriangle[] = [];
    const expectedDistTol = 0.2;
    const scaleTol = 0.01;
    for (let i = 0; i < tetras.length; i++) {
      for (let j = i + 1; j < tetras.length; j++) {
        for (let k = j + 1; k < tetras.length; k++) {
          const a = tetras[i].center;
          const b = tetras[j].center;
          const c = tetras[k].center;
          if (
            Math.abs(tetras[i].scale - tetras[j].scale) > scaleTol ||
            Math.abs(tetras[i].scale - tetras[k].scale) > scaleTol
          )
            continue;
          const scale = tetras[i].scale;
          const d1 = a.distanceTo(b);
          const d2 = b.distanceTo(c);
          const d3 = c.distanceTo(a);
          const expectedDist = scale * 1.2;
          if (
            Math.abs(d1 - expectedDist) > expectedDistTol ||
            Math.abs(d2 - expectedDist) > expectedDistTol ||
            Math.abs(d3 - expectedDist) > expectedDistTol
          )
            continue;
          const centerTri = new THREE.Vector3().addVectors(a, b).add(c).multiplyScalar(1 / 3);
          const normal = new THREE.Vector3()
            .crossVectors(
              new THREE.Vector3().subVectors(b, a),
              new THREE.Vector3().subVectors(c, a)
            )
            .normalize();
          triangles.push({
            points: [a.clone(), b.clone(), c.clone()],
            center: centerTri,
            normal,
            scale,
          });
        }
      }
    }
    return triangles;
  },
}));
