/**
 * Optional local Sierpiński rule for the Quantum structure.
 * "If ≥ minNeighbors tetrahedra have centroids at/near a lattice cell, add a scaled tetrahedron at center."
 * Pure functions — no React, no DOM. Used by structure store and swarm.
 */

import * as THREE from 'three';
import { snapToLattice } from './structure-tetra';
import { addTetrahedronAtPosition } from './structure-tetra';

const LATTICE_SPACING = 1.5;

export interface SierpinskiRuleOptions {
  /** Min number of tetrahedron centroids at a lattice cell to add one at center (default 3). */
  minNeighbors?: number;
  /** Scale of the added tetrahedron (default 0.4, smaller than agent-built 0.8). */
  scaledSize?: number;
  /** Min distance from existing vertices to allow placement (default 0.25). */
  minDist?: number;
  /** Lattice spacing for bucketing (default 1.5). */
  latticeSpacing?: number;
}

/**
 * Compute tetrahedron centroids from flat vertex array.
 * Structure store lays out 4 vertices (12 floats) per tetrahedron.
 */
function getTetrahedronCentroids(vertices: number[]): THREE.Vector3[] {
  const centroids: THREE.Vector3[] = [];
  const n = Math.floor(vertices.length / 12) * 12;
  for (let i = 0; i < n; i += 12) {
    const cx =
      ((vertices[i] ?? 0) + (vertices[i + 3] ?? 0) + (vertices[i + 6] ?? 0) + (vertices[i + 9] ?? 0)) /
      4;
    const cy =
      ((vertices[i + 1] ?? 0) +
        (vertices[i + 4] ?? 0) +
        (vertices[i + 7] ?? 0) +
        (vertices[i + 10] ?? 0)) /
      4;
    const cz =
      ((vertices[i + 2] ?? 0) +
        (vertices[i + 5] ?? 0) +
        (vertices[i + 8] ?? 0) +
        (vertices[i + 11] ?? 0)) /
      4;
    centroids.push(new THREE.Vector3(cx, cy, cz));
  }
  return centroids;
}

/**
 * Apply the local Sierpiński rule: for each lattice cell with ≥ minNeighbors
 * tetrahedron centroids, add one scaled tetrahedron at that cell center (if not already present).
 * Returns new vertices and edges; does not mutate inputs.
 */
export function applySierpinskiRule(
  vertices: number[],
  edges: number[],
  options: SierpinskiRuleOptions = {}
): { vertices: number[]; edges: number[] } {
  const {
    minNeighbors = 3,
    scaledSize = 0.4,
    minDist = 0.25,
    latticeSpacing = LATTICE_SPACING,
  } = options;

  if (vertices.length < 12) return { vertices, edges };

  const centroids = getTetrahedronCentroids(vertices);
  const cellCount = new Map<string, number>();
  const cellPosition = new Map<string, THREE.Vector3>();

  for (const c of centroids) {
    const snapped = snapToLattice(c, latticeSpacing);
    const key = `${snapped.x.toFixed(6)},${snapped.y.toFixed(6)},${snapped.z.toFixed(6)}`;
    cellCount.set(key, (cellCount.get(key) ?? 0) + 1);
    if (!cellPosition.has(key)) cellPosition.set(key, snapped.clone());
  }

  const candidateCenters: THREE.Vector3[] = [];
  cellCount.forEach((count, key) => {
    if (count >= minNeighbors) {
      const pos = cellPosition.get(key);
      if (pos) candidateCenters.push(pos);
    }
  });

  let outVertices = vertices;
  let outEdges = edges;
  for (const center of candidateCenters) {
    const result = addTetrahedronAtPosition(outVertices, outEdges, center, {
      size: scaledSize,
      minDist,
    });
    if (result.vertices.length > outVertices.length) {
      outVertices = result.vertices;
      outEdges = result.edges;
    }
  }

  return { vertices: outVertices, edges: outEdges };
}
