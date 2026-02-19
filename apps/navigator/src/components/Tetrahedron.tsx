import { useMemo } from "react";
import { TET_NORMALIZED, TET_EDGES, rotateY, project } from "@/lib/geometry";
import { VERTEX_LABELS } from "@/lib/constants";
import { Vertex } from "./Vertex";

interface Props {
  centerX: number;
  centerY: number;
  scale: number;
  rotationTheta: number;
  onVertexTap: (index: number) => void;
}

export function Tetrahedron({
  centerX,
  centerY,
  scale,
  rotationTheta,
  onVertexTap,
}: Props) {
  const projected = useMemo(() => {
    return TET_NORMALIZED.map((v) => {
      const r = rotateY(v, rotationTheta);
      return project(r, centerX, centerY, scale);
    });
  }, [centerX, centerY, scale, rotationTheta]);

  const edges = useMemo(
    () =>
      TET_EDGES.map(([a, b]) => ({
        x1: projected[a].x,
        y1: projected[a].y,
        x2: projected[b].x,
        y2: projected[b].y,
      })),
    [projected]
  );

  return (
    <g className="group">
      <defs>
        <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={4} />
        </filter>
      </defs>
      <g stroke="#39FF14" strokeWidth={1} opacity={1} fill="none">
        {edges.map((e, i) => (
          <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} />
        ))}
      </g>
      {projected.map((p, i) => (
        <Vertex
          key={i}
          index={i}
          x={p.x}
          y={p.y}
          color={VERTEX_LABELS[i].color}
          label={VERTEX_LABELS[i].label}
          sublabel={VERTEX_LABELS[i].sublabel}
          status={VERTEX_LABELS[i].status}
          onTap={() => onVertexTap(i)}
        />
      ))}
    </g>
  );
}
