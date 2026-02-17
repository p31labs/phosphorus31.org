/**
 * P31 structure compiler — parses simple P31 DSL to vertices + edges
 * Used by World Builder code mode. Base tetrahedron, Sierpinski fractal; TODO: translate, scale, etc.
 */

import { generateSierpinski } from '../utils/sierpinski';
import * as THREE from 'three';

export interface CompiledStructure {
  vertices: number[];
  edges: number[];
}

/** Base tetrahedron (unit size) */
const TETRA_VERTICES = [
  [1, 1, 1],
  [1, -1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
];
const TETRA_EDGES = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [1, 3],
  [2, 3],
];

/** Match sierpinski with optional "depth: N" or bare number, e.g. "sierpinski 4" or "sierpinski depth: 4" */
const SIERPINSKI_REGEX = /sierpinski\s+(?:depth\s*:\s*)?(\d+)/i;

/**
 * Compile P31 structure code to vertex and edge arrays.
 * Recognizes: structure tetrahedron | tetrahedron | sierpinski [depth:] N
 */
export function compileP31(code: string): CompiledStructure {
  const lines = code.split('\n');
  const vertices: number[] = [];
  const edges: number[] = [];
  const origin = new THREE.Vector3(0, 0, 0);

  for (const line of lines) {
    const trimmed = line.trim();
    const sierpinskiMatch = trimmed.match(SIERPINSKI_REGEX);

    if (sierpinskiMatch) {
      const depth = parseInt(sierpinskiMatch[1], 10) || 3;
      const { vertices: v, edges: e } = generateSierpinski(depth, 1.0, origin);
      const offset = vertices.length / 3;
      vertices.push(...v);
      edges.push(...e.map((idx) => idx + offset));
      continue;
    }

    if (
      (trimmed.startsWith('structure') && trimmed.includes('tetrahedron')) ||
      trimmed === 'tetrahedron' ||
      /tetrahedron\s*\{\s*\}/.test(trimmed)
    ) {
      const offset = vertices.length / 3;
      for (const v of TETRA_VERTICES) {
        vertices.push(v[0], v[1], v[2]);
      }
      for (const e of TETRA_EDGES) {
        edges.push(e[0] + offset, e[1] + offset);
      }
    }
  }

  return { vertices, edges };
}
