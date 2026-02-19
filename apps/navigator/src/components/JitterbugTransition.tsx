import { useMemo } from "react";
import {
  VE_NORMALIZED,
  TET_NORMALIZED,
  VE_EDGES,
  TET_EDGES,
  VE_TO_TET,
  rotateY,
  project,
  easeInOutCubic,
} from "@/lib/geometry";

interface Props {
  centerX: number;
  centerY: number;
  scale: number;
  rotationTheta: number;
  t: number;
}

export function JitterbugTransition({
  centerX,
  centerY,
  scale,
  rotationTheta,
  t,
}: Props) {
  const eased = easeInOutCubic(t);

  const projectedVertices = useMemo(() => {
    return VE_NORMALIZED.map((ve, i) => {
      const tetIdx = VE_TO_TET[i];
      const tet = TET_NORMALIZED[tetIdx];
      const veRot = rotateY(ve, rotationTheta);
      const tetRot = rotateY(tet, rotationTheta);
      const x = veRot[0] + (tetRot[0] - veRot[0]) * eased;
      const y = veRot[1] + (tetRot[1] - veRot[1]) * eased;
      const z = veRot[2] + (tetRot[2] - veRot[2]) * eased;
      return project([x, y, z], centerX, centerY, scale);
    });
  }, [centerX, centerY, scale, rotationTheta, eased]);

  const tetEdgeOpacity = eased;
  const veEdgeOpacity = 1 - eased;

  const tetEdges = useMemo(
    () =>
      TET_EDGES.map(([a, b]) => {
        const va = TET_NORMALIZED[a];
        const vb = TET_NORMALIZED[b];
        const ra = rotateY(va, rotationTheta);
        const rb = rotateY(vb, rotationTheta);
        const pa = project(ra, centerX, centerY, scale);
        const pb = project(rb, centerX, centerY, scale);
        return { x1: pa.x, y1: pa.y, x2: pb.x, y2: pb.y };
      }),
    [centerX, centerY, scale, rotationTheta]
  );

  return (
    <g>
      {/* Fading VE edges */}
      <g stroke="#39FF14" strokeWidth={1} opacity={veEdgeOpacity * 0.3} fill="none">
        {VE_EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={projectedVertices[a].x}
            y1={projectedVertices[a].y}
            x2={projectedVertices[b].x}
            y2={projectedVertices[b].y}
          />
        ))}
      </g>
      {/* Brightening tet edges */}
      <g stroke="#39FF14" strokeWidth={1} opacity={tetEdgeOpacity} fill="none">
        {tetEdges.map((e, i) => (
          <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} />
        ))}
      </g>
    </g>
  );
}
