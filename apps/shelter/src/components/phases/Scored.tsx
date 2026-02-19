import { GATES, SPOON_COSTS, type GateName } from "@p31labs/buffer-core";
import { useBufferStore } from "@/stores/buffer-store";
import { useSpoonStore } from "@/stores/spoon-store";
import { scoreFawn, shouldShowFawnReview } from "@/lib/fawn";

interface ScoredProps {
  samsonTemp: number;
  onRewrite: () => void;
  onViewOriginal: () => void;
  onDefer: () => void;
  onDone: () => void;
}

export default function Scored({ samsonTemp, onRewrite, onViewOriginal, onDefer, onDone }: ScoredProps) {
  const { score, bluf, aiLoading, input } = useBufferStore();
  const { current, tier } = useSpoonStore();
  const fawnResult = scoreFawn(input);
  const showFawnReview = shouldShowFawnReview(fawnResult);
  if (!score) return null;

  const gc = GATES[score.gate as GateName];
  const bars = [
    { label: "URGENCY", value: score.urgency, color: "#06b6d4" },
    { label: "EMOTION", value: score.emotional, color: "#8b5cf6" },
    { label: "COGNITIVE", value: score.cognitive, color: "#f59e0b" },
  ];

  return (
    <div>
      {/* Voltage header */}
      <div
        className="flex items-center gap-2.5 mb-3.5 px-3.5 py-2.5 rounded-[7px] border"
        style={{ background: gc.bg, borderColor: `${gc.color}33` }}
      >
        <div className="text-[26px] font-bold tabular-nums" style={{ color: gc.color }}>
          {score.voltage}
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-[2px]" style={{ color: gc.color }}>
            {score.gate} — {gc.label}
          </div>
          <div className="text-[8px] text-white/30 mt-0.5">
            U:{score.urgency} · E:{score.emotional} · C:{score.cognitive}
          </div>
        </div>
        <div className="ml-auto text-[8px] text-white/15">AI temp: {samsonTemp}</div>
      </div>

      {/* Score bars */}
      <div className="flex gap-1.5 mb-3.5">
        {bars.map((b) => (
          <div key={b.label} className="flex-1">
            <div className="text-[7px] tracking-[1.5px] text-white/25 mb-[3px]">{b.label}</div>
            <div className="h-[5px] rounded-[3px] bg-white/[0.04] overflow-hidden">
              <div
                className="h-full rounded-[3px] transition-all duration-400"
                style={{ width: `${b.value * 10}%`, background: b.color }}
              />
            </div>
            <div className="text-[9px] font-semibold mt-0.5" style={{ color: b.color }}>
              {b.value}/10
            </div>
          </div>
        ))}
      </div>

      {/* Passive-aggressive */}
      {score.passiveAggressive.length > 0 && (
        <div className="px-3 py-2 rounded-[5px] mb-2.5 bg-purple-500/5 border border-purple-500/[0.12]">
          <div className="text-[8px] tracking-[1.5px] text-purple-400 mb-1 font-semibold">SUBTEXT DETECTED</div>
          {score.passiveAggressive.map((p, i) => (
            <div key={i} className="text-[10px] text-white/45 mb-0.5 leading-relaxed">→ {p.translation}</div>
          ))}
        </div>
      )}

      {/* BLUF */}
      {bluf && (
        <div className="px-3.5 py-2.5 rounded-[5px] mb-2.5 bg-white/[0.015] border border-white/[0.04]">
          <div className="text-[8px] tracking-[1.5px] text-white/25 mb-1 font-semibold">BLUF</div>
          <div className="text-[11px] text-white/60 leading-relaxed">{bluf.summary}</div>
          {bluf.actions.length > 0 && (
            <div className="mt-1.5">
              <div className="text-[8px] tracking-wider text-white/20 mb-[3px]">ACTIONS</div>
              {bluf.actions.slice(0, 3).map((a, i) => (
                <div
                  key={i}
                  className="text-[10px] text-white/45 mb-0.5 pl-2.5"
                  style={{ borderLeft: `2px solid ${gc.color}33` }}
                >
                  {a.substring(0, 100)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Spoon warning */}
      {(tier === "ORANGE" || tier === "RED") && score.voltage > 5 && (
        <div className="px-2.5 py-1.5 rounded mb-2.5 text-[9px] bg-orange-600/[0.06] border border-orange-600/15 text-orange-400 leading-relaxed">
          ⚠ Protective mode. This costs {score.voltage > 7 ? 2 : 1} spoons. You have {current}. Consider deferring.
        </div>
      )}

      {/* Fawn / sovereignty review gate */}
      {showFawnReview && (
        <div className="px-3 py-2.5 rounded-[5px] mb-2.5 bg-amber-500/5 border border-amber-500/20">
          <div className="text-[8px] tracking-[1.5px] text-amber-400 mb-1 font-semibold">SOVEREIGNTY CHECK</div>
          <div className="text-[10px] text-white/50 leading-relaxed mb-2">
            This draft scores high on people-pleasing (fawn {fawnResult.score}/10). Sovereignty {fawnResult.sovereignty}/10. You can send as-is or run a rewrite.
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={onRewrite}
              disabled={aiLoading}
              className="px-2.5 py-1.5 rounded text-[9px] font-semibold bg-amber-500/15 border border-amber-500/25 text-amber-400 hover:bg-amber-500/20"
            >
              {aiLoading ? "REWRITING…" : "SOVEREIGNTY CHECK"}
            </button>
            <span className="text-[9px] text-white/30 self-center">or send anyway</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-1.5 flex-wrap">
        <ActionBtn onClick={onRewrite} disabled={aiLoading} bg="rgba(139,92,246,0.1)" bc="rgba(139,92,246,0.25)" c="#a78bfa">
          {aiLoading ? "REWRITING..." : "AI REWRITE"}
        </ActionBtn>
        {score.gate !== "CRITICAL" && (
          <ActionBtn onClick={onViewOriginal} bg="rgba(255,255,255,0.02)" bc="rgba(255,255,255,0.06)" c="rgba(255,255,255,0.35)">
            ORIGINAL ({SPOON_COSTS.viewOriginal}🥄)
          </ActionBtn>
        )}
        <ActionBtn onClick={onDefer} bg="rgba(255,255,255,0.02)" bc="rgba(255,255,255,0.06)" c="rgba(255,255,255,0.35)">
          DEFER
        </ActionBtn>
        <ActionBtn onClick={onDone} bg="rgba(57,255,20,0.08)" bc="rgba(57,255,20,0.2)" c="#39FF14">
          DONE ✓
        </ActionBtn>
      </div>
    </div>
  );
}

function ActionBtn({ children, onClick, disabled, bg, bc, c }: {
  children: React.ReactNode; onClick: () => void; disabled?: boolean;
  bg: string; bc: string; c: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex-1 min-w-[100px] py-2 rounded-[5px] text-[9px] font-semibold tracking-[1.5px] cursor-pointer font-mono
        disabled:bg-white/[0.03] disabled:border-white/[0.06] disabled:text-white/15 disabled:cursor-default"
      style={disabled ? undefined : { background: bg, border: `1px solid ${bc}`, color: c }}
    >
      {children}
    </button>
  );
}
