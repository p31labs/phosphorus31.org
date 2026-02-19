import { useMemo } from "react";
import { TET_NORMALIZED, rotateY, project } from "@/lib/geometry";
import { isMAR10Active } from "@/lib/constants";

interface Props {
  centerX: number;
  centerY: number;
  scale: number;
  rotationTheta: number;
}

export function Mar10Star({ centerX, centerY, scale, rotationTheta }: Props) {
  const visible = isMAR10Active();
  const pos = useMemo(() => {
    if (!visible) return null;
    let sx = 0,
      sy = 0;
    for (const v of TET_NORMALIZED) {
      const r = rotateY(v, rotationTheta);
      const p = project(r, centerX, centerY, scale);
      sx += p.x;
      sy += p.y;
    }
    return { x: sx / 4, y: sy / 4 };
  }, [visible, centerX, centerY, scale, rotationTheta]);

  if (!visible || !pos) return null;

  return (
    <g className="animate-pulse">
      <circle
        r={12}
        cx={pos.x}
        cy={pos.y}
        fill="#FFD700"
        opacity={0.9}
      />
      <text
        x={pos.x}
        y={pos.y - 20}
        textAnchor="middle"
        fill="#FFD700"
        fontSize={8}
        fontFamily="monospace"
        className="uppercase"
      >
        MAR10 DAY
      </text>
      <text
        x={pos.x}
        y={pos.y + 28}
        textAnchor="middle"
        fill="#8888a0"
        fontSize={6}
        fontFamily="monospace"
      >
        Build the Super Star Molecule
      </text>
    </g>
  );
}
