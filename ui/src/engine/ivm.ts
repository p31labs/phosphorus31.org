/**
 * Isotropic Vector Matrix (IVM) — Fuller's closest-packing lattice
 *
 * Basis vectors (60° geometry):
 *   a = (1, 0, 0)
 *   b = (0.5, √3/2, 0)
 *   c = (0.5, √3/6, √(2/3))
 *
 * Used as spatial scaffold for P31 Quantum Console: qubits, controls,
 * and data live on IVM vertices; coherence appears as symmetry of the lattice.
 */

import * as THREE from 'three';

export interface IVMPoint {
  position: THREE.Vector3;
  index: [number, number, number];
}

export interface IVMLattice {
  points: IVMPoint[];
  edges: [number, number][];
}

const NEIGHBOR_OFFSETS: [number, number, number][] = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
  [-1, 0, 0],
  [0, -1, 0],
  [0, 0, -1],
  [1, 1, 0],
  [1, 0, 1],
  [0, 1, 1],
  [-1, -1, 0],
  [-1, 0, -1],
  [0, -1, -1],
  [1, -1, 0],
  [1, 0, -1],
  [0, 1, -1],
  [-1, 1, 0],
  [-1, 0, 1],
  [0, -1, 1],
];

/**
 * Generates an IVM lattice within a spherical bounding volume.
 * Each point is a potential site for a qubit, control node, or data stream.
 *
 * @param radius - Sphere radius (points outside are culled)
 * @param spacing - Lattice spacing (default 1)
 * @returns Points and edges (pairs of point indices)
 */
export function generateIVM(
  radius: number,
  spacing: number = 1
): IVMLattice {
  const points: IVMPoint[] = [];
  const pointMap = new Map<string, number>();

  const sqrt3 = Math.sqrt(3);
  const sqrt23 = Math.sqrt(2 / 3);
  const a = new THREE.Vector3(spacing, 0, 0);
  const b = new THREE.Vector3(spacing * 0.5, spacing * (sqrt3 / 2), 0);
  const c = new THREE.Vector3(spacing * 0.5, spacing * (sqrt3 / 6), spacing * sqrt23);

  const maxIndex = Math.ceil(radius / spacing);
  for (let i = -maxIndex; i <= maxIndex; i++) {
    for (let j = -maxIndex; j <= maxIndex; j++) {
      for (let k = -maxIndex; k <= maxIndex; k++) {
        const pos = new THREE.Vector3()
          .copy(a)
          .multiplyScalar(i)
          .addScaledVector(b, j)
          .addScaledVector(c, k);
        if (pos.length() <= radius) {
          const key = `${i},${j},${k}`;
          pointMap.set(key, points.length);
          points.push({ position: pos, index: [i, j, k] });
        }
      }
    }
  }

  const edges: [number, number][] = [];
  for (let i = 0; i < points.length; i++) {
    const [ix, jx, kx] = points[i].index;
    for (const [di, dj, dk] of NEIGHBOR_OFFSETS) {
      const key = `${ix + di},${jx + dj},${kx + dk}`;
      const neighborIdx = pointMap.get(key);
      if (neighborIdx !== undefined && neighborIdx > i) {
        edges.push([i, neighborIdx]);
      }
    }
  }

  return { points, edges };
}

/** Default lattice spacing for snap (match typical IVM radius 20, spacing 1.5). */
const DEFAULT_SNAP_SPACING = 1.5;

/**
 * Snap a world position to the nearest IVM lattice point.
 * Uses the same basis vectors as generateIVM.
 *
 * @param position - World position to snap
 * @param spacing - Lattice spacing (default 1.5)
 * @returns Nearest lattice point as Vector3
 */
export function snapToLattice(
  position: THREE.Vector3,
  spacing: number = DEFAULT_SNAP_SPACING
): THREE.Vector3 {
  const sqrt3 = Math.sqrt(3);
  const sqrt23 = Math.sqrt(2 / 3);
  const px = position.x;
  const py = position.y;
  const pz = position.z;
  const s = spacing;
  const k = pz / (s * sqrt23);
  const j = (2 * py) / (s * sqrt3) - k / 3;
  const i = px / s - (j + k) / 2;
  const i0 = Math.round(i);
  const j0 = Math.round(j);
  const k0 = Math.round(k);
  const a = new THREE.Vector3(s, 0, 0);
  const b = new THREE.Vector3(s * 0.5, s * (sqrt3 / 2), 0);
  const c = new THREE.Vector3(s * 0.5, s * (sqrt3 / 6), s * sqrt23);
  return new THREE.Vector3()
    .copy(a)
    .multiplyScalar(i0)
    .addScaledVector(b, j0)
    .addScaledVector(c, k0);
}
