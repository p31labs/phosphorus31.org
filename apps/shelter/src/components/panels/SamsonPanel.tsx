import { MARK1, type SamsonState } from "@p31labs/buffer-core";
import { useBufferStore } from "@/stores/buffer-store";

interface SamsonPanelProps {
  state: SamsonState;
}

export default function SamsonPanel({ state }: SamsonPanelProps) {
  const { trimtab, setTrimtab } = useBufferStore();

  const stableColor = Math.abs(state.error) < 0.05 ? "#39FF14" : "#f59e0b";
  const driftColor = state.drift === "nominal" ? "#39FF14" : state.drift === "looping" ? "#f59e0b" : "#ef4444";
  const burnoutColor = state.burnout === "ok" ? "#39FF14" : state.burnout === "warning" ? "#f59e0b" : "#ef4444";

  return (
    <div className="px-4 py-3 bg-white/[0.015] border-b border-white/[0.04]">
      <div className="text-[8px] tracking-[2px] text-white/25 mb-2 font-semibold">
        P31 GOVERNOR — PID STATE
      </div>
      <div className="flex gap-4 flex-wrap text-[10px]">
        <div>
          <span className="text-white/30">H: </span>
          <span className="font-semibold" style={{ color: stableColor }}>{state.H.toFixed(3)}</span>
          <span className="text-white/15 ml-1">target {MARK1.toFixed(3)}</span>
        </div>
        <div>
          <span className="text-white/30">P: </span>
          <span style={{ color: state.pTerm === "stable" ? "#39FF14" : "#f59e0b" }}>{state.pTerm}</span>
        </div>
        <div>
          <span className="text-white/30">I: </span>
          <span style={{ color: driftColor }}>{state.drift}</span>
        </div>
        <div>
          <span className="text-white/30">D: </span>
          <span style={{ color: burnoutColor }}>{state.burnout}</span>
        </div>
        <div>
          <span className="text-white/30">AI temp: </span>
          <span className="text-purple-400 font-semibold">{state.aiTemp}</span>
        </div>
        <div>
          <span className="text-white/30">Z: </span>
          <span className="text-white/50">{state.zScore}</span>
        </div>
      </div>

      {/* Trimtab slider */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[8px] text-white/25 tracking-wider">GOVERNOR</span>
        <input
          type="range" min="-5" max="5" value={trimtab}
          onChange={(e) => setTrimtab(Number(e.target.value))}
          className="flex-1 h-1 accent-phosphor"
        />
        <span className="text-[9px] text-phosphor w-5 text-right">
          {trimtab > 0 ? "+" : ""}{trimtab}
        </span>
      </div>

      {/* Contextual warnings */}
      {state.drift === "looping" && (
        <div className="mt-1.5 text-[9px] text-yellow-400 px-2 py-1 rounded-[3px] bg-yellow-500/[0.06] border border-yellow-500/[0.12]">
          ↻ Loop detected. Consider shifting to a different task or taking a break.
        </div>
      )}
      {state.drift === "escalating" && (
        <div className="mt-1.5 text-[9px] text-red-400 px-2 py-1 rounded-[3px] bg-red-500/[0.06] border border-red-500/[0.12]">
          ↑ Message voltage escalating. Governor is lowering AI temperature for precision.
        </div>
      )}
      {state.burnout === "critical" && (
        <div className="mt-1.5 text-[9px] text-red-400 px-2 py-1 rounded-[3px] bg-red-500/[0.06] border border-red-500/[0.12]">
          ⚠ Burnout velocity critical. Defer non-essential messages. Breathe.
        </div>
      )}
    </div>
  );
}
