import { GATES, type GateName } from "@p31labs/buffer-core";
import { useBufferStore } from "@/stores/buffer-store";

interface OriginalProps {
  onBack: () => void;
  onDone: () => void;
}

export default function Original({ onBack, onDone }: OriginalProps) {
  const { input, score } = useBufferStore();
  if (!score) return null;

  const gc = GATES[score.gate as GateName];

  return (
    <div>
      <div
        className="flex items-center gap-1.5 mb-2.5 px-2.5 py-1.5 rounded-[5px] border"
        style={{ background: gc.bg, borderColor: `${gc.color}22` }}
      >
        <span className="text-sm font-bold" style={{ color: gc.color }}>{score.voltage}</span>
        <span className="text-[8px] tracking-[1.5px]" style={{ color: gc.color }}>{score.gate}</span>
        <span className="text-[8px] text-white/20 ml-auto">ORIGINAL</span>
      </div>

      <div
        className="px-4 py-3 rounded-[6px] mb-3.5 text-xs text-white/60 leading-relaxed whitespace-pre-wrap
          bg-white/[0.015] border"
        style={{ borderColor: `${gc.color}15` }}
      >
        {input}
      </div>

      <div className="flex gap-1.5">
        <button
          onClick={onBack}
          className="flex-1 py-2 rounded-[5px] bg-white/[0.02] border border-white/[0.06]
            text-white/35 text-[9px] font-semibold tracking-[1.5px] cursor-pointer font-mono"
        >
          ← BACK
        </button>
        <button
          onClick={onDone}
          className="flex-1 py-2 rounded-[5px] text-phosphor text-[9px] font-semibold
            tracking-[1.5px] cursor-pointer font-mono"
          style={{ background: "rgba(57,255,20,0.08)", border: "1px solid rgba(57,255,20,0.2)" }}
        >
          DONE ✓
        </button>
      </div>
    </div>
  );
}
