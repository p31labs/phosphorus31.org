/**
 * Sierpinski tetrahedron generation — recursive 4-vertex subdivision.
 */
import type { Vector3 } from '../p31/types.js';

export function generateSierpinski(
  depth: number,
  scale = 1,
  origin: Vector3 = { x: 0, y: 0, z: 0 }
): { vertices: number[]; edges: number[] } {
  const a = Math.sqrt(8 / 9);
  const baseVerts: Vector3[] = [
    { x: 0, y: a * scale, z: 0 },
    {
      x: -scale * Math.sqrt(2 / 3),
      y: (-a / 2) * scale,
      z: -scale / Math.sqrt(3),
    },
    {
      x: scale * Math.sqrt(2 / 3),
      y: (-a / 2) * scale,
      z: -scale / Math.sqrt(3),
    },
    {
      x: 0,
      y: (-a / 2) * scale,
      z: (2 * scale) / Math.sqrt(3),
    },
  ].map((v) => ({
    x: v.x + origin.x,
    y: v.y + origin.y,
    z: v.z + origin.z,
  }));

  const vertices: Vector3[] = [];
  const edges: [number, number][] = [];

  function recurse(
    v0: Vector3,
    v1: Vector3,
    v2: Vector3,
    v3: Vector3,
    d: number
  ) {
    if (d === 0) {
      const idx = vertices.length;
      vertices.push(v0, v1, v2, v3);
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
    const m01 = { x: (v0.x + v1.x) / 2, y: (v0.y + v1.y) / 2, z: (v0.z + v1.z) / 2 };
    const m02 = { x: (v0.x + v2.x) / 2, y: (v0.y + v2.y) / 2, z: (v0.z + v2.z) / 2 };
    const m03 = { x: (v0.x + v3.x) / 2, y: (v0.y + v3.y) / 2, z: (v0.z + v3.z) / 2 };
    const m12 = { x: (v1.x + v2.x) / 2, y: (v1.y + v2.y) / 2, z: (v1.z + v2.z) / 2 };
    const m13 = { x: (v1.x + v3.x) / 2, y: (v1.y + v3.y) / 2, z: (v1.z + v3.z) / 2 };
    const m23 = { x: (v2.x + v3.x) / 2, y: (v2.y + v3.y) / 2, z: (v2.z + v3.z) / 2 };
    recurse(v0, m01, m02, m03, d - 1);
    recurse(v1, m01, m12, m13, d - 1);
    recurse(v2, m02, m12, m23, d - 1);
    recurse(v3, m03, m13, m23, d - 1);
  }

  recurse(baseVerts[0]!, baseVerts[1]!, baseVerts[2]!, baseVerts[3]!, depth);
  const flatVerts = vertices.flatMap((v) => [v.x, v.y, v.z]);
  const flatEdges = edges.flat();
  return { vertices: flatVerts, edges: flatEdges };
}
