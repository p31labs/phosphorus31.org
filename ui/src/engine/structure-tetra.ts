/**
 * Structure helpers for placing tetrahedra on the IVM lattice.
 * Used by the agent swarm and by structure store addTetrahedronAt.
 * Pure functions — no React, no DOM.
 */

import * as THREE from 'three';

const SQRT_8_9 = Math.sqrt(8 / 9);
const SQRT_2_3 = Math.sqrt(2 / 3);
const SQRT_3 = Math.sqrt(3);

/** IVM basis vectors (same as engine/ivm.ts). spacing applied. */
function getIVMBasis(spacing: number) {
  const a = new THREE.Vector3(spacing, 0, 0);
  const b = new THREE.Vector3(spacing * 0.5, spacing * (SQRT_3 / 2), 0);
  const c = new THREE.Vector3(
    spacing * 0.5,
    spacing * (SQRT_3 / 6),
    spacing * Math.sqrt(2 / 3)
  );
  return { a, b, c };
}

/**
 * Snap a world position to the nearest IVM lattice point.
 * Uses same basis as generateIVM in ivm.ts.
 */
export function snapToLattice(
  position: THREE.Vector3,
  spacing: number = 1.5
): THREE.Vector3 {
  const { a, b, c } = getIVMBasis(spacing);
  const px = position.x;
  const py = position.y;
  const pz = position.z;
  const s = spacing;
  const sqrt23 = Math.sqrt(2 / 3);
  const k = pz / (s * sqrt23);
  const j = 2 * (py / (s * SQRT_3) - k / 6);
  const i = px / s - j / 2 - k / 2;
  const ni = Math.round(i);
  const nj = Math.round(j);
  const nk = Math.round(k);
  return new THREE.Vector3()
    .copy(a)
    .multiplyScalar(ni)
    .addScaledVector(b, nj)
    .addScaledVector(c, nk);
}

/** Unit tetrahedron vertices (4 points × 3 coords), same as structure.store. */
const UNIT_TETRA = [
  0,
  SQRT_8_9,
  0,
  -SQRT_2_3,
  -SQRT_8_9 / 2,
  -1 / Math.sqrt(3),
  SQRT_2_3,
  -SQRT_8_9 / 2,
  -1 / Math.sqrt(3),
  0,
  -SQRT_8_9 / 2,
  2 / Math.sqrt(3),
];

/** Centroid of UNIT_TETRA so we can center tetrahedron at position. */
const CENTROID_Y = -SQRT_8_9 / 8;

export interface AddTetrahedronOptions {
  /** Scale of tetrahedron (default 0.8 for agent-built). */
  size?: number;
  /** Min distance from existing vertices to allow placement (default 0.3). */
  minDist?: number;
}

/**
 * Produce new vertices and edges with one tetrahedron added at position.
 * Position is snapped to IVM lattice. Returns unchanged arrays if too close to existing.
 */
export function addTetrahedronAtPosition(
  vertices: number[],
  edges: number[],
  position: THREE.Vector3,
  options: AddTetrahedronOptions = {}
): { vertices: number[]; edges: number[] } {
  const { size = 0.8, minDist = 0.3 } = options;
  const snapped = snapToLattice(position, 1.5);

  for (let i = 0; i < vertices.length; i += 3) {
    const dx = vertices[i] - snapped.x;
    const dy = vertices[i + 1] - snapped.y;
    const dz = vertices[i + 2] - snapped.z;
    if (Math.sqrt(dx * dx + dy * dy + dz * dz) < minDist) {
      return { vertices, edges };
    }
  }

  const offset = vertices.length / 3;
  // Place tetrahedron so its centroid is at snapped (scale then translate).
  const outVerts: number[] = [];
  for (let i = 0; i < 12; i += 3) {
    outVerts.push(
      snapped.x + (UNIT_TETRA[i] ?? 0) * size,
      snapped.y + ((UNIT_TETRA[i + 1] ?? 0) - CENTROID_Y) * size,
      snapped.z + (UNIT_TETRA[i + 2] ?? 0) * size
    );
  }

  const TETRA_EDGES = [0, 1, 0, 2, 0, 3, 1, 2, 1, 3, 2, 3];
  const newEdges = [...edges, ...TETRA_EDGES.map((e) => e + offset)];

  return {
    vertices: [...vertices, ...outVerts],
    edges: newEdges,
  };
}
