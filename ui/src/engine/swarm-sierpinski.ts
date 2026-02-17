/**
 * Emergent Sierpiński build-site detection for the agent swarm.
 * Local rules only: each agent looks at nearby tetrahedra and chooses where to build.
 * Pure functions — no React, no DOM.
 */

import * as THREE from 'three';
import { snapToLattice } from './ivm';
import type { TetraInfo } from '../stores/structure.store';

const LATTICE_SPACING = 1.5;

/** IVM basis for neighbor offsets (same as ivm.ts). */
function getIVMBasis(spacing: number) {
  const sqrt3 = Math.sqrt(3);
  const sqrt23 = Math.sqrt(2 / 3);
  const a = new THREE.Vector3(spacing, 0, 0);
  const b = new THREE.Vector3(spacing * 0.5, spacing * (sqrt3 / 2), 0);
  const c = new THREE.Vector3(spacing * 0.5, spacing * (sqrt3 / 6), spacing * sqrt23);
  return { a, b, c };
}

/** Offsets in (i,j,k) that give adjacent lattice points (subset for build-site candidates). */
const IVM_NEIGHBOR_OFFSETS: [number, number, number][] = [
  [1, 0, 0], [0, 1, 0], [0, 0, 1],
  [-1, 0, 0], [0, -1, 0], [0, 0, -1],
  [1, 1, 0], [1, 0, 1], [0, 1, 1],
  [-1, -1, 0], [-1, 0, -1], [0, -1, -1],
];

export interface LocalBuildSite {
  position: THREE.Vector3;
  scale: number;
  /** 1 = Sierpiński apex (Rule 1), 0.7 = adjacent lattice (Rule 2). */
  quality: number;
}

/** Derive centroids and approximate scales from flat vertex array (4 verts × 3 coords per tetra). */
function getTetraMetaFromVertices(vertices: number[]): { center: THREE.Vector3; scale: number }[] {
  const result: { center: THREE.Vector3; scale: number }[] = [];
  const n = Math.floor(vertices.length / 12) * 12;
  for (let i = 0; i < n; i += 12) {
    const cx = ((vertices[i] ?? 0) + (vertices[i + 3] ?? 0) + (vertices[i + 6] ?? 0) + (vertices[i + 9] ?? 0)) / 4;
    const cy = ((vertices[i + 1] ?? 0) + (vertices[i + 4] ?? 0) + (vertices[i + 7] ?? 0) + (vertices[i + 10] ?? 0)) / 4;
    const cz = ((vertices[i + 2] ?? 0) + (vertices[i + 5] ?? 0) + (vertices[i + 8] ?? 0) + (vertices[i + 11] ?? 0)) / 4;
    const center = new THREE.Vector3(cx, cy, cz);
    const e0 = new THREE.Vector3(
      (vertices[i + 3] ?? 0) - (vertices[i] ?? 0),
      (vertices[i + 4] ?? 0) - (vertices[i + 1] ?? 0),
      (vertices[i + 5] ?? 0) - (vertices[i + 2] ?? 0)
    );
    const scale = e0.length() / Math.sqrt(2) || 0.8;
    result.push({ center, scale });
  }
  return result;
}

function distSq(a: THREE.Vector3, b: THREE.Vector3): number {
  const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz;
}

/** Check if position is empty (no vertex within minDist). */
function isEmpty(vertices: number[], position: THREE.Vector3, minDist: number): boolean {
  const minSq = minDist * minDist;
  for (let i = 0; i < vertices.length; i += 3) {
    const vx = vertices[i] ?? 0, vy = vertices[i + 1] ?? 0, vz = vertices[i + 2] ?? 0;
    const dx = position.x - vx, dy = position.y - vy, dz = position.z - vz;
    if (dx * dx + dy * dy + dz * dz < minSq) return false;
  }
  return true;
}

/** Rule 1: Three tetrahedra of same scale form a triangle; apex above triangle center is empty → build scaled tetra there. */
function tryRule1(
  agentPos: THREE.Vector3,
  tetras: { center: THREE.Vector3; scale: number }[],
  vertices: number[],
  targetDepth: number,
  baseScale: number,
  radiusSq: number,
  minDist: number
): LocalBuildSite | null {
  const snapped = snapToLattice(agentPos, LATTICE_SPACING);
  const nearby = tetras.filter((t) => distSq(t.center, snapped) <= radiusSq);
  if (nearby.length < 3) return null;

  const scaleTolerance = 0.15;
  for (let i = 0; i < nearby.length; i++) {
    for (let j = i + 1; j < nearby.length; j++) {
      for (let k = j + 1; k < nearby.length; k++) {
        const s = nearby[i].scale;
        if (
          Math.abs(nearby[j].scale - s) > scaleTolerance ||
          Math.abs(nearby[k].scale - s) > scaleTolerance
        ) continue;
        const c1 = nearby[i].center, c2 = nearby[j].center, c3 = nearby[k].center;
        const triCenter = new THREE.Vector3()
          .addVectors(c1, c2)
          .add(c3)
          .multiplyScalar(1 / 3);
        const edge = new THREE.Vector3().subVectors(c2, c1);
        const edgeLen = edge.length();
        if (edgeLen < 0.2) continue;
        const normal = new THREE.Vector3()
          .subVectors(c2, c1)
          .cross(new THREE.Vector3().subVectors(c3, c1));
        normal.normalize();
        const childScale = s * 0.5;
        if (childScale < baseScale * Math.pow(0.5, targetDepth)) continue;
        const apex = triCenter.clone().add(normal.multiplyScalar(childScale * 0.8));
        const apexSnapped = snapToLattice(apex, LATTICE_SPACING * 0.5);
        if (!isEmpty(vertices, apexSnapped, minDist)) continue;
        return { position: apexSnapped, scale: childScale, quality: 1 };
      }
    }
  }
  return null;
}

/** Rule 2: Near an existing tetra, find an empty adjacent lattice point; build same or smaller scale. */
function tryRule2(
  agentPos: THREE.Vector3,
  tetras: { center: THREE.Vector3; scale: number }[],
  vertices: number[],
  targetDepth: number,
  baseScale: number,
  radius: number,
  minDist: number
): LocalBuildSite | null {
  const snapped = snapToLattice(agentPos, LATTICE_SPACING);
  const nearby = tetras.filter((t) => t.center.distanceTo(snapped) <= radius);
  if (nearby.length === 0) return null;

  const { a, b, c } = getIVMBasis(LATTICE_SPACING);
  for (const t of nearby) {
    const tc = snapToLattice(t.center, LATTICE_SPACING);
    for (const [di, dj, dk] of IVM_NEIGHBOR_OFFSETS) {
      const offset = new THREE.Vector3()
        .copy(a).multiplyScalar(di)
        .addScaledVector(b, dj)
        .addScaledVector(c, dk);
      const neighbor = tc.clone().add(offset);
      const neighborSnapped = snapToLattice(neighbor, LATTICE_SPACING);
      if (!isEmpty(vertices, neighborSnapped, minDist)) continue;
      const childScale = Math.min(t.scale, baseScale * Math.pow(0.5, Math.min(targetDepth - 1, 2)));
      if (childScale < baseScale * 0.2) continue;
      return { position: neighborSnapped, scale: childScale, quality: 0.7 };
    }
  }
  return null;
}

export interface FindLocalBuildSiteOptions {
  /** Max depth for recursive Sierpiński (stops scaling below baseScale * 0.5^targetDepth). */
  targetDepth?: number;
  /** Base scale for new tetras (default 0.8). */
  baseScale?: number;
  /** Search radius around agent (default 2.5). */
  radius?: number;
  /** Min distance from existing vertices to allow build (default 0.25). */
  minDist?: number;
  /** Lattice spacing (default 1.5). */
  latticeSpacing?: number;
}

/**
 * Find a local build site from the agent's position using Sierpiński rules.
 * Rule 1: Three same-scale tetras → build scaled tetra at triangle apex.
 * Rule 2: Near existing tetra → build at empty adjacent lattice point.
 * Returns null if no valid site (fallback to building at agent position).
 */
export function findLocalBuildSite(
  agentPosition: THREE.Vector3,
  vertices: number[],
  _edges: number[],
  tetraInfos: TetraInfo[] | null,
  options: FindLocalBuildSiteOptions = {}
): LocalBuildSite | null {
  const {
    targetDepth = 3,
    baseScale = 0.8,
    radius = 2.5,
    minDist = 0.25,
  } = options;

  /* Always derive from vertices so we include rule-added tetras, not just agent-built (tetraInfos). */
  const tetras = getTetraMetaFromVertices(vertices);

  if (tetras.length === 0) return null;

  const radiusSq = radius * radius;

  const r1 = tryRule1(agentPosition, tetras, vertices, targetDepth, baseScale, radiusSq, minDist);
  if (r1) return r1;

  const r2 = tryRule2(agentPosition, tetras, vertices, targetDepth, baseScale, radius, minDist);
  if (r2) return r2;

  return null;
}
