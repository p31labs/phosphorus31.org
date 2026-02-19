import { VERTEX_LABELS, SHELTER_URL } from "@/lib/constants";
import { getSpoons } from "@/lib/bus-stub";

interface Props {
  index: number;
  x: number;
  y: number;
  color: string;
  label: string;
  sublabel: string;
  status: string;
  onTap: () => void;
}

export function Vertex({ index, x, y, color, label, sublabel, status, onTap }: Props) {
  const isShelter = index === 0;
  let opacity = 1;
  let displayColor = color;
  if (isShelter) {
    const spoons = getSpoons();
    if (spoons <= 3) {
      displayColor = "#ef4444";
      opacity = 0.8;
    } else if (spoons <= 9) {
      opacity = 0.4 + (spoons / 12) * 0.6;
    }
  }

  const ariaLabel = isShelter
    ? `Shelter, ${status.toLowerCase()}, ${getSpoons()} spoons`
    : `${label}, ${status.toLowerCase()}`;

  const handleActivate = () => {
    if (index === 0) {
      window.location.href = SHELTER_URL;
    } else {
      onTap();
    }
  };

  return (
    <g
      className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508] focus-visible:ring-phosphor"
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleActivate();
        }
      }}
      style={{ cursor: "pointer" }}
    >
      <circle r={16} cx={x} cy={y} fill={displayColor} opacity={0.15} filter="url(#blur)" />
      <circle r={8} cx={x} cy={y} fill={displayColor} opacity={opacity} />
      <text
        x={x}
        y={y - 14}
        textAnchor="middle"
        fill={displayColor}
        fontSize={9}
        fontFamily="monospace"
        letterSpacing={2}
        className="uppercase pointer-events-none select-none"
      >
        {label}
      </text>
      <text
        x={x}
        y={y + 22}
        textAnchor="middle"
        fill="#666680"
        fontSize={7}
        fontFamily="monospace"
        className="pointer-events-none select-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {sublabel}
      </text>
    </g>
  );
}
