/**
 * GeodesicHeatmap — stress overlay on structure edges
 * Colors edges by stress (green = low, red = high); highlights weak-point vertices.
 */

import React, { useMemo } from 'react';
import * as THREE from 'three';
import type { StructureAnalysisResult } from '../../engine/structure-analysis';

function stressToColor(t: number): string {
  if (t <= 0) return '#2ecc71';
  if (t >= 1) return '#e74c3c';
  const r = Math.round(46 + (231 - 46) * t);
  const g = Math.round(204 - 204 * t);
  const b = Math.round(113 - 113 * t);
  return `rgb(${r},${g},${b})`;
}

interface GeodesicHeatmapProps {
  vertices: number[];
  edges: number[];
  analysis: StructureAnalysisResult | null;
  /** Opacity of edge lines. */
  opacity?: number;
}

export const GeodesicHeatmap: React.FC<GeodesicHeatmapProps> = ({
  vertices,
  edges,
  analysis,
  opacity = 0.9,
}) => {
  const { lineSegments, weakPointPositions } = useMemo(() => {
    const linePoints: number[] = [];
    const lineColors: number[] = [];
    const weakSet = new Set(analysis?.weakPoints ?? []);
    const stress = analysis?.stress ?? [];

    for (let i = 0; i < edges.length; i += 2) {
      const a = edges[i] * 3;
      const b = edges[i + 1] * 3;
      if (a + 2 >= vertices.length || b + 2 >= vertices.length) continue;
      linePoints.push(
        vertices[a],
        vertices[a + 1],
        vertices[a + 2],
        vertices[b],
        vertices[b + 1],
        vertices[b + 2]
      );
      const edgeIndex = i / 2;
      const t = stress[edgeIndex] ?? 0;
      const hex = stressToColor(t);
      const c = new THREE.Color(hex);
      lineColors.push(c.r, c.g, c.b, c.r, c.g, c.b);
    }

    const segmentGeometry =
      linePoints.length > 0
        ? new THREE.BufferGeometry().setAttribute(
            'position',
            new THREE.Float32BufferAttribute(linePoints, 3)
          )
        : null;
    if (segmentGeometry && lineColors.length === linePoints.length) {
      segmentGeometry.setAttribute(
        'color',
        new THREE.Float32BufferAttribute(lineColors, 3)
      );
    }

    const weakPointPositions: [number, number, number][] = [];
    weakSet.forEach((idx) => {
      const i = idx * 3;
      if (i + 2 < vertices.length) {
        weakPointPositions.push([
          vertices[i],
          vertices[i + 1],
          vertices[i + 2],
        ]);
      }
    });

    return {
      lineSegments: segmentGeometry,
      weakPointPositions,
    };
  }, [vertices, edges, analysis]);

  if (!lineSegments || (vertices.length === 0 && edges.length === 0)) {
    return null;
  }

  return (
    <group>
      <lineSegments geometry={lineSegments}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={opacity}
          linewidth={2}
        />
      </lineSegments>
      {weakPointPositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.15, 16, 12]} />
          <meshBasicMaterial
            color="#e74c3c"
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

export default GeodesicHeatmap;
