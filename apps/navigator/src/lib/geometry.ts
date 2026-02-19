/**
 * Vector Equilibrium (12 vertices) and Tetrahedron (4 vertices).
 * Y-axis rotation, orthographic projection to 2D.
 */

export const VE_VERTICES: [number, number, number][] = [
  [1, 1, 0],
  [1, -1, 0],
  [-1, 1, 0],
  [-1, -1, 0],
  [1, 0, 1],
  [1, 0, -1],
  [-1, 0, 1],
  [-1, 0, -1],
  [0, 1, 1],
  [0, 1, -1],
  [0, -1, 1],
  [0, -1, -1],
];

/** VE edges: each vertex to 4 neighbors at distance √2. Precomputed. */
export const VE_EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 4],
  [0, 8],
  [1, 3],
  [1, 5],
  [1, 11],
  [2, 3],
  [2, 6],
  [2, 9],
  [3, 7],
  [3, 10],
  [4, 5],
  [4, 6],
  [4, 8],
  [5, 7],
  [5, 11],
  [6, 7],
  [6, 9],
  [7, 10],
  [8, 9],
  [8, 11],
  [9, 10],
  [10, 11],
];

export const TET_VERTICES: [number, number, number][] = [
  [1, 1, 1],
  [1, -1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
];

/** Tetrahedron edges: K4 complete graph */
export const TET_EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [1, 3],
  [2, 3],
];

const RADIUS = Math.sqrt(3);

function normalize(v: [number, number, number], r = RADIUS): [number, number, number] {
  const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) || 1;
  return [(v[0] / len) * r, (v[1] / len) * r, (v[2] / len) * r];
}

export const VE_NORMALIZED = VE_VERTICES.map((v) => normalize(v));
export const TET_NORMALIZED = TET_VERTICES.map((v) => normalize(v));

/** Y-axis rotation: 0.5 RPM = π/60 rad/s */
export function rotateY([x, y, z]: [number, number, number], theta: number): [number, number, number] {
  return [x * Math.cos(theta) + z * Math.sin(theta), y, -x * Math.sin(theta) + z * Math.cos(theta)];
}

/** Orthographic projection to 2D (discard z for position) */
export function project(
  [x, y, _z]: [number, number, number],
  centerX: number,
  centerY: number,
  scale: number
): { x: number; y: number; z: number } {
  return {
    x: centerX + x * scale,
    y: centerY - y * scale,
    z: _z,
  };
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** VE vertex index → tet vertex index (grouping from spec) */
export const VE_TO_TET: number[] = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3];
