import { MARK1, LARMOR_HZ } from "@p31labs/buffer-core";
import { useSpoonStore } from "@/stores/spoon-store";
import { useBufferStore } from "@/stores/buffer-store";

export default function Calibrate() {
  const { current, calibrate } = useSpoonStore();
  const setPhase = useBufferStore((s) => s.setPhase);

  const begin = () => {
    calibrate(current);
    setPhase("input");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 gap-5">
      <div className="text-[11px] tracking-[4px] text-white/20">P31 LABS</div>
      <div className="text-[28px] text-phosphor font-light tracking-[3px]">THE BUFFER</div>
      <div className="text-[10px] text-white/20 tracking-[2px] -mt-2">
        VOLTAGE-GATED BRIDGE · v2.0
      </div>

      <div className="w-[340px] max-w-[92%] p-6 rounded-[10px] bg-white/[0.015] border border-white/[0.05] mt-3">
        <div className="text-xs text-white/50 mb-3.5 leading-relaxed">
          How is your energy right now?
        </div>
        <div className="flex gap-[5px] justify-center flex-wrap mb-2.5">
          {Array.from({ length: 12 }, (_, i) => {
            const val = i + 1;
            const active = val <= current;
            const bg = active
              ? current <= 3 ? "#dc2626" : current <= 6 ? "#f59e0b" : "#22c55e"
              : "rgba(255,255,255,0.04)";
            return (
              <button
                key={val}
                onClick={() => calibrate(val)}
                className="w-[34px] h-[34px] rounded-[5px] border-none text-[11px] font-semibold cursor-pointer font-mono"
                style={{
                  background: bg,
                  color: active ? "#fff" : "rgba(255,255,255,0.12)",
                }}
              >
                {val}
              </button>
            );
          })}
        </div>
        <div className="text-center">
          <span
            className="text-[22px] font-semibold"
            style={{ color: current <= 3 ? "#f87171" : current <= 6 ? "#fbbf24" : "#4ade80" }}
          >
            {current}
          </span>
          <span className="text-[11px] text-white/25 ml-1.5">spoons</span>
        </div>
        <button
          onClick={begin}
          className="w-full py-2.5 mt-4 rounded-[7px] bg-phosphor text-void border-none
            text-[11px] font-bold tracking-[2px] cursor-pointer font-mono"
        >
          BEGIN
        </button>
      </div>

      <div className="text-[8px] text-white/[0.08] tracking-wider mt-2">
        H ≈ π/9 ≈ {MARK1.toFixed(4)} · ³¹P LARMOR {LARMOR_HZ} Hz · AGPL-3.0
      </div>
    </div>
  );
}
