/**
 * useGeodesicAnalysis — real-time structure analysis for the World Builder
 * Uses structure-analysis (JS); can be swapped for WASM later.
 */

import { useEffect, useState, useMemo } from 'react';
import { analyzeStructure, type StructureAnalysisResult } from '../engine/structure-analysis';

export function useGeodesicAnalysis(
  vertices: number[],
  edges: number[]
): StructureAnalysisResult | null {
  const [result, setResult] = useState<StructureAnalysisResult | null>(null);

  const key = useMemo(
    () => `${vertices.length}-${edges.length}-${vertices.slice(0, 3).join(',')}`,
    [vertices, edges]
  );

  useEffect(() => {
    if (vertices.length === 0 && edges.length === 0) {
      setResult(null);
      return;
    }
    try {
      const analysis = analyzeStructure(vertices, edges);
      setResult(analysis);
    } catch {
      setResult(null);
    }
  }, [key, vertices.length, edges.length]);

  return result;
}
