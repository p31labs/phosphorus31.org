import { useSpoonStore } from "@/stores/spoon-store";
import { HEARTBEATS, type HeartbeatTier } from "@p31labs/buffer-core";

const tierColors: Record<HeartbeatTier, string> = {
  GREEN: HEARTBEATS.GREEN.color,
  YELLOW: HEARTBEATS.YELLOW.color,
  ORANGE: HEARTBEATS.ORANGE.color,
  RED: HEARTBEATS.RED.color,
};

interface SpoonGaugeProps {
  interactive?: boolean;
  onCalibrate?: (value: number) => void;
}

export default function SpoonGauge({ interactive = false, onCalibrate }: SpoonGaugeProps) {
  const { current, max, tier } = useSpoonStore();
  const color = tierColors[tier];
  const pct = max > 0 ? (current / max) * 100 : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-wider text-txt-dim uppercase">
          Energy
        </span>
        <span className="text-[11px] font-mono font-bold" style={{ color }}>
          {current}/{max}
        </span>
      </div>

      <div className="relative h-2 rounded-full bg-white/[0.04] overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>

      {interactive && (
        <input
          type="range"
          min={0}
          max={max}
          step={0.5}
          value={current}
          onChange={(e) => onCalibrate?.(parseFloat(e.target.value))}
          className="w-full accent-phosphor"
          aria-label="Calibrate energy level"
        />
      )}
    </div>
  );
}
