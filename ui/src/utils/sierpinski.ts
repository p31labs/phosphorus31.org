/**
 * Sierpinski tetrahedron — recursive fractal geometry for the P31 Quantum Geodesic Platform.
 * Each tetrahedron births four smaller ones; 4^depth tetrahedra at given depth.
 */

import * as THREE from 'three';

export interface SierpinskiResult {
  vertices: number[];
  edges: number[];
  /** Number of tetrahedra (4^depth). */
  tetraCount: number;
}

/**
 * Generate a Sierpinski tetrahedron recursively.
 * @param depth - Recursion depth (0 = base tetrahedron only)
 * @param scale - Size factor
 * @param origin - Center of base tetrahedron
 * @returns Flat vertex and edge arrays for Three.js BufferGeometry
 */
export function generateSierpinski(
  depth: number,
  scale: number = 1,
  origin: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
): SierpinskiResult {
  const safeDepth = Math.max(0, Math.min(depth, 7)); // Cap to avoid OOM
  const a = Math.sqrt(8 / 9); // height factor for regular tetrahedron
  const baseVerts = [
    new THREE.Vector3(0, a * scale, 0),
    new THREE.Vector3(-scale * Math.sqrt(2 / 3), (-a / 2) * scale, -scale / Math.sqrt(3)),
    new THREE.Vector3(scale * Math.sqrt(2 / 3), (-a / 2) * scale, -scale / Math.sqrt(3)),
    new THREE.Vector3(0, (-a / 2) * scale, (2 * scale) / Math.sqrt(3)),
  ].map((v) => v.clone().add(origin));

  const vertices: THREE.Vector3[] = [];
  const edges: [number, number][] = [];

  function recurse(
    v0: THREE.Vector3,
    v1: THREE.Vector3,
    v2: THREE.Vector3,
    v3: THREE.Vector3,
    d: number
  ): void {
    if (d === 0) {
      const idx = vertices.length;
      vertices.push(v0.clone(), v1.clone(), v2.clone(), v3.clone());
      edges.push(
        [idx, idx + 1],
        [idx, idx + 2],
        [idx, idx + 3],
        [idx + 1, idx + 2],
        [idx + 1, idx + 3],
        [idx + 2, idx + 3]
      );
      return;
    }

    const m01 = new THREE.Vector3().addVectors(v0, v1).multiplyScalar(0.5);
    const m02 = new THREE.Vector3().addVectors(v0, v2).multiplyScalar(0.5);
    const m03 = new THREE.Vector3().addVectors(v0, v3).multiplyScalar(0.5);
    const m12 = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
    const m13 = new THREE.Vector3().addVectors(v1, v3).multiplyScalar(0.5);
    const m23 = new THREE.Vector3().addVectors(v2, v3).multiplyScalar(0.5);

    recurse(v0, m01, m02, m03, d - 1);
    recurse(v1, m01, m12, m13, d - 1);
    recurse(v2, m02, m12, m23, d - 1);
    recurse(v3, m03, m13, m23, d - 1);
  }

  recurse(baseVerts[0], baseVerts[1], baseVerts[2], baseVerts[3], safeDepth);

  const flatVerts = vertices.flatMap((v) => [v.x, v.y, v.z]);
  const flatEdges = edges.flat();
  const tetraCount = Math.pow(4, safeDepth);

  return { vertices: flatVerts, edges: flatEdges, tetraCount };
}

/** Max depth before we warn (e.g. > 1M edges). */
export const SIERPINSKI_EDGE_WARN_THRESHOLD = 1_000_000;

/** Approximate edge count for a given depth (6 * 4^depth). */
export function sierpinskiEdgeCount(depth: number): number {
  return 6 * Math.pow(4, Math.max(0, depth));
}
