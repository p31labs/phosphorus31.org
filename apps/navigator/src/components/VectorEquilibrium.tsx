import { useMemo } from "react";
import {
  VE_NORMALIZED,
  VE_EDGES,
  rotateY,
  project,
} from "@/lib/geometry";

interface Props {
  centerX: number;
  centerY: number;
  scale: number;
  rotationTheta: number;
  breatheScale: number;
}

export function VectorEquilibrium({
  centerX,
  centerY,
  scale,
  rotationTheta,
  breatheScale,
}: Props) {
  const projected = useMemo(() => {
    const s = scale * breatheScale;
    return VE_NORMALIZED.map((v) => {
      const r = rotateY(v, rotationTheta);
      return project(r, centerX, centerY, s);
    });
  }, [centerX, centerY, scale, rotationTheta, breatheScale]);

  const edges = useMemo(
    () =>
      VE_EDGES.map(([a, b]) => ({
        x1: projected[a].x,
        y1: projected[a].y,
        x2: projected[b].x,
        y2: projected[b].y,
      })),
    [projected]
  );

  return (
    <g stroke="#39FF14" strokeWidth={1} opacity={0.3} fill="none">
      {edges.map((e, i) => (
        <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} />
      ))}
    </g>
  );
}
