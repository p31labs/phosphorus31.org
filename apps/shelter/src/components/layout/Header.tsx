import { HEARTBEATS, MARK1, type HeartbeatTier } from "@p31labs/buffer-core";
import { useSpoonStore } from "@/stores/spoon-store";
import { useBufferStore } from "@/stores/buffer-store";

interface HeaderProps {
  samsonH: number;
  onToggleSamson: () => void;
  onToggleQueue: () => void;
}

const tierColors: Record<HeartbeatTier, string> = {
  GREEN: HEARTBEATS.GREEN.color,
  YELLOW: HEARTBEATS.YELLOW.color,
  ORANGE: HEARTBEATS.ORANGE.color,
  RED: HEARTBEATS.RED.color,
};

export default function Header({ samsonH, onToggleSamson, onToggleQueue }: HeaderProps) {
  const { current, max, tier } = useSpoonStore();
  const queue = useBufferStore((s) => s.queue);
  const hbConfig = HEARTBEATS[tier];
  const color = tierColors[tier];
  const hDrifting = Math.abs(samsonH - MARK1) > 0.1;

  return (
    <header
      className="flex items-center justify-between px-4 py-2.5"
      style={{ borderBottom: `1px solid ${color}18` }}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-phosphor">⬡</span>
        <span className="text-[11px] font-bold tracking-[2px] text-phosphor">THE BUFFER</span>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Spoon bars */}
        <div className="flex items-center gap-[3px]">
          {Array.from({ length: max }, (_, i) => (
            <div
              key={i}
              className="w-[3px] h-3 rounded-sm transition-all"
              style={{ background: i < current ? color : "rgba(255,255,255,0.04)" }}
            />
          ))}
          <span className="text-[9px] font-semibold ml-1" style={{ color }}>{current}</span>
        </div>

        {/* H badge */}
        <button
          onClick={onToggleSamson}
          className="px-1.5 py-0.5 rounded text-[8px] tracking-wider font-bold cursor-pointer font-mono border"
          style={{
            background: `${hDrifting ? "#f59e0b" : "#39FF14"}12`,
            color: hDrifting ? "#fbbf24" : "#39FF14",
            borderColor: `${hDrifting ? "#f59e0b" : "#39FF14"}22`,
          }}
        >
          H:{samsonH.toFixed(2)}
        </button>

        {/* Status badge */}
        <div
          className="px-1.5 py-0.5 rounded text-[8px] tracking-[1.5px] font-bold border"
          style={{
            background: `${color}12`,
            color,
            borderColor: `${color}22`,
          }}
        >
          {hbConfig.label}
        </div>

        {/* Queue count */}
        {queue.length > 0 && (
          <button
            onClick={onToggleQueue}
            className="px-1.5 py-0.5 rounded text-[8px] cursor-pointer font-mono
              bg-white/[0.04] border border-white/[0.08] text-white/35"
          >
            {queue.length} queued
          </button>
        )}
      </div>
    </header>
  );
}
