import { HEARTBEATS, type HeartbeatTier } from "@p31labs/buffer-core";
import { useSpoonStore } from "@/stores/spoon-store";
import { useShelterStore } from "@/stores/shelter-store";
import { useQuantumBrain } from "@/hooks/useQuantumBrain";
import { coherenceColor } from "@/lib/quantum-brain";
import { levelProgress } from "@p31labs/game-engine";

const tierColors: Record<HeartbeatTier, string> = {
  GREEN: HEARTBEATS.GREEN.color,
  YELLOW: HEARTBEATS.YELLOW.color,
  ORANGE: HEARTBEATS.ORANGE.color,
  RED: HEARTBEATS.RED.color,
};

export default function Header() {
  const { current, max, tier } = useSpoonStore();
  const { player, setActiveTab } = useShelterStore();
  const brain = useQuantumBrain();
  const color = tierColors[tier];
  const hbConfig = HEARTBEATS[tier];
  const xpPct = levelProgress(player);
  const qColor = coherenceColor(brain.coherence);

  return (
    <header
      className="flex items-center justify-between px-4 py-2.5"
      style={{ borderBottom: `1px solid ${color}18` }}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-phosphor">⬡</span>
        <span className="text-[11px] font-bold tracking-[2px] text-phosphor">P31 SHELTER</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Spoon bars */}
        <div className="flex items-center gap-[3px]">
          {Array.from({ length: max }, (_, i) => (
            <div
              key={i}
              className="w-[3px] h-3 rounded-sm transition-all"
              style={{ background: i < current ? color : "rgba(255,255,255,0.04)" }}
            />
          ))}
          <span className="text-[9px] font-semibold ml-1" style={{ color }}>
            {current}
          </span>
        </div>

        {/* Coherence badge — tap to go to Brain view */}
        <button
          onClick={() => setActiveTab("brain")}
          className="px-1.5 py-0.5 rounded text-[8px] tracking-wider font-bold cursor-pointer
            font-mono border transition-colors"
          style={{
            background: `${qColor}12`,
            color: qColor,
            borderColor: `${qColor}22`,
          }}
        >
          Q:{(brain.coherence * 100).toFixed(0)}
        </button>

        {/* XP / Level badge */}
        <div className="flex items-center gap-1">
          <span className="text-[8px] font-bold text-violet tracking-wider">
            Lv{player.level}
          </span>
          <div className="w-8 h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-violet transition-all duration-300"
              style={{ width: `${xpPct}%` }}
            />
          </div>
        </div>

        {/* Tier badge */}
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
      </div>
    </header>
  );
}
