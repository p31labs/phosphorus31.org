/**
 * Structure analysis for the Quantum Geodesic Platform
 * Maxwell's rule (3D), stability score, and weak point detection.
 * Pure JS — no React, no DOM. Can be replaced by WASM later.
 */

export interface StructureAnalysisResult {
  stability: number;
  maxwellValid: boolean;
  weakPoints: number[];
  /** Stress per edge (0–1); length-weighted when stability < 1. Same length as edges/2. */
  stress: number[];
  /** Natural frequencies (mock or from eigenanalysis). */
  naturalFrequencies: number[];
  /** Optional: +5% stability when structure matches Sierpinski tetrahedron pattern (self-similarity). */
  fractalStabilityBonus?: number;
}

/**
 * Maxwell's rule for 3D pin-jointed structures: e >= 3v - 6
 * for a statically determinate structure (v = vertices, e = edges).
 */
function checkMaxwellRule(vertexCount: number, edgeCount: number): boolean {
  if (vertexCount < 4) return edgeCount >= 0;
  return edgeCount >= 3 * vertexCount - 6;
}

/**
 * Simple stability score from connectivity and Maxwell validity.
 * 0–1 scale; higher = more stable.
 */
function computeStability(
  vertexCount: number,
  edgeCount: number,
  maxwellValid: boolean
): number {
  if (vertexCount === 0) return 0;
  const ratio = edgeCount / Math.max(1, 3 * vertexCount - 6);
  const base = maxwellValid ? 0.7 : 0.3;
  const connectivity = Math.min(1, ratio * 0.4);
  return Math.min(1, Math.max(0, base + connectivity));
}

/**
 * Stub weak point detection — nodes with degree < 3 in 3D are weak.
 * Returns indices of vertices that have fewer than 3 edge connections.
 */
function findWeakPoints(vertexCount: number, edges: number[]): number[] {
  const degree: number[] = new Array(vertexCount).fill(0);
  for (let i = 0; i < edges.length; i += 2) {
    const a = edges[i];
    const b = edges[i + 1];
    if (a < vertexCount) degree[a]++;
    if (b < vertexCount) degree[b]++;
  }
  const weak: number[] = [];
  degree.forEach((d, idx) => {
    if (d < 3) weak.push(idx);
  });
  return weak;
}

/**
 * Per-edge stress: longer edges and low stability increase stress.
 * vertices: [x,y,z, ...], edges: [i,j, ...]
 */
function computeStress(
  vertices: number[],
  edges: number[],
  stability: number
): number[] {
  const stress: number[] = [];
  let maxLen = 0;
  const lengths: number[] = [];
  for (let i = 0; i < edges.length; i += 2) {
    const a = edges[i] * 3;
    const b = edges[i + 1] * 3;
    const dx = vertices[b] - vertices[a];
    const dy = vertices[b + 1] - vertices[a + 1];
    const dz = vertices[b + 2] - vertices[a + 2];
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
    lengths.push(len);
    if (len > maxLen) maxLen = len;
  }
  const scale = maxLen > 0 ? 1 / maxLen : 1;
  for (let i = 0; i < lengths.length; i++) {
    const n = lengths[i] * scale;
    stress.push(n * (1 - stability));
  }
  return stress;
}

/** Mock natural frequencies for visualization/sonification. */
function computeNaturalFrequencies(vertexCount: number, edgeCount: number): number[] {
  if (vertexCount === 0) return [];
  const base = 1 + edgeCount * 0.1;
  return [base, base * 2.3, base * 3.7];
}

/** Sierpinski tetrahedron at depth d has 4*4^d vertices and 6*4^d edges (no vertex dedup). */
const FRACTAL_STABILITY_BONUS = 0.05;

function detectSierpinskiBonus(vertexCount: number, edgeCount: number): number {
  if (vertexCount < 4 || edgeCount < 6) return 0;
  for (let d = 0; d <= 7; d++) {
    const v = 4 * Math.pow(4, d);
    const e = 6 * Math.pow(4, d);
    if (vertexCount === v && edgeCount === e) return FRACTAL_STABILITY_BONUS;
  }
  return 0;
}

/**
 * Analyze a structure (flat vertex and edge arrays).
 * vertices: [x,y,z, x,y,z, ...]
 * edges: [i,j, i,j, ...] index pairs into vertices (3 floats per vertex)
 */
export function analyzeStructure(
  vertices: number[],
  edges: number[]
): StructureAnalysisResult {
  const vertexCount = Math.floor(vertices.length / 3);
  const edgeCount = Math.floor(edges.length / 2);
  const maxwellValid = checkMaxwellRule(vertexCount, edgeCount);
  let stability = computeStability(vertexCount, edgeCount, maxwellValid);
  const fractalBonus = detectSierpinskiBonus(vertexCount, edgeCount);
  stability = Math.min(1, stability + fractalBonus);
  const weakPoints = findWeakPoints(vertexCount, edges);
  const stress = computeStress(vertices, edges, stability);
  const naturalFrequencies = computeNaturalFrequencies(vertexCount, edgeCount);
  return {
    stability,
    maxwellValid,
    weakPoints,
    stress,
    naturalFrequencies,
    ...(fractalBonus > 0 ? { fractalStabilityBonus: fractalBonus } : {}),
  };
}
