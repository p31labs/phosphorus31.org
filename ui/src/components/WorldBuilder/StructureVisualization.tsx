/**
 * StructureVisualization — R3F lines for user structure (vertices + edges)
 * For large fractals (e.g. Sierpinski depth ≥ 3), vertices are drawn as Points for performance.
 */

import React, { useMemo } from 'react';
import * as THREE from 'three';

/** Above this vertex count we use Points instead of per-vertex sphere meshes (Sierpinski-friendly). */
const POINTS_MODE_THRESHOLD = 64;

interface StructureVisualizationProps {
  vertices: number[];
  edges: number[];
  color?: string;
  /** 0..1 risk from The Oracle; high risk increases emissive and can tint toward red */
  riskLevel?: number;
}

export const StructureVisualization: React.FC<StructureVisualizationProps> = ({
  vertices,
  edges,
  color = '#2ecc71',
  riskLevel,
}) => {
  const materialColor = riskLevel != null && riskLevel > 0.7 ? '#ff4444' : color;
  const emissiveIntensity = riskLevel != null ? 0.3 + riskLevel * 0.5 : 0.3;
  const { segmentGeometry, pointPositions, pointsGeometry, usePointsMode } =
    useMemo(() => {
      const linePoints: number[] = [];
      for (let i = 0; i < edges.length; i += 2) {
        const a = edges[i] * 3;
        const b = edges[i + 1] * 3;
        if (a + 2 < vertices.length && b + 2 < vertices.length) {
          linePoints.push(
            vertices[a],
            vertices[a + 1],
            vertices[a + 2],
            vertices[b],
            vertices[b + 1],
            vertices[b + 2]
          );
        }
      }
      const segmentGeometry =
        linePoints.length > 0
          ? new THREE.BufferGeometry().setAttribute(
              'position',
              new THREE.Float32BufferAttribute(linePoints, 3)
            )
          : null;
      const pointPositions: THREE.Vector3[] = [];
      for (let i = 0; i < vertices.length; i += 3) {
        pointPositions.push(
          new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2])
        );
      }
      const usePointsMode = pointPositions.length > POINTS_MODE_THRESHOLD;
      const pointsGeometry =
        usePointsMode && pointPositions.length > 0
          ? new THREE.BufferGeometry().setAttribute(
              'position',
              new THREE.Float32BufferAttribute(
                pointPositions.flatMap((p) => [p.x, p.y, p.z]),
                3
              )
            )
          : null;
      return {
        segmentGeometry,
        pointPositions,
        pointsGeometry,
        usePointsMode,
      };
    }, [vertices, edges]);

  const hasVertices = pointPositions.length > 0;
  if (!segmentGeometry && !hasVertices) return null;

  return (
    <group>
      {segmentGeometry && (
        <lineSegments geometry={segmentGeometry}>
          <lineBasicMaterial color={materialColor} />
        </lineSegments>
      )}
      {usePointsMode && pointsGeometry ? (
        <points geometry={pointsGeometry}>
          <pointsMaterial
            color={materialColor}
            size={0.12}
            sizeAttenuation
            transparent
            opacity={0.9}
          />
        </points>
      ) : (
        pointPositions.map((pos, i) => (
          <mesh key={i} position={[pos.x, pos.y, pos.z]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial
              color={materialColor}
              emissive={materialColor}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
        ))
      )}
    </group>
  );
};

export default StructureVisualization;
