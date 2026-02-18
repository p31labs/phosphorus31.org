/**
 * Geodesic structure analysis (JS fallback when WASM not loaded).
 * Maxwell rule + simple stability heuristic.
 */
export interface AnalysisResult {
  stability: number;
  maxwellValid: boolean;
  weakPoints?: number[];
  stress?: number[];
  naturalFrequencies?: number[];
  fractalDimension?: number;
  coherenceBonus?: number;
}

export function analyzeStructureJS(vertices: number[], edges: number[]): AnalysisResult {
  const v = vertices.length / 3;
  const e = edges.length / 2;
  const maxwellValid = e >= 3 * v - 6;

  const degree: number[] = new Array(v).fill(0);
  for (let i = 0; i < edges.length; i += 2) {
    const a = edges[i]!;
    const b = edges[i + 1]!;
    if (a < v) degree[a]++;
    if (b < v) degree[b]++;
  }

  let stability = 0.5;
  if (maxwellValid) {
    const avgDegree = degree.reduce((s, d) => s + d, 0) / v;
    const variance =
      degree.reduce((s, d) => s + (d - avgDegree) ** 2, 0) / v;
    stability = 0.6 + 0.3 * (avgDegree / 6) - 0.1 * Math.min(variance / 4, 1);
    stability = Math.max(0, Math.min(1, stability));
  }

  const weakPoints: number[] = [];
  for (let i = 0; i < v; i++) {
    if (degree[i]! < 3) weakPoints.push(i);
  }

  return {
    stability,
    maxwellValid,
    weakPoints,
    coherenceBonus: stability > 0.7 ? 0.08 : 0,
  };
}
