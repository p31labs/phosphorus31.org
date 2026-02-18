import { GATES, SPOON_COSTS, type GateName } from "@p31labs/buffer-core";
import { useBufferStore } from "@/stores/buffer-store";

interface RewrittenProps {
  samsonTemp: number;
  onViewOriginal: () => void;
  onDefer: () => void;
  onDone: () => void;
}

export default function Rewritten({ samsonTemp, onViewOriginal, onDefer, onDone }: RewrittenProps) {
  const { score, aiResult } = useBufferStore();
  if (!score || !aiResult) return null;

  const gc = GATES[score.gate as GateName];

  return (
    <div>
      {/* Compact voltage header */}
      <div
        className="flex items-center gap-1.5 mb-2.5 px-2.5 py-1.5 rounded-[5px] border"
        style={{ background: gc.bg, borderColor: `${gc.color}22` }}
      >
        <span className="text-sm font-bold" style={{ color: gc.color }}>{score.voltage}</span>
        <span className="text-[8px] tracking-[1.5px]" style={{ color: gc.color }}>{score.gate}</span>
        <span className="text-[8px] text-white/20 ml-auto">AI PROCESSED · temp {samsonTemp}</span>
      </div>

      {/* Neutral translation */}
      <div className="px-4 py-3 rounded-[6px] mb-2.5 bg-phosphor/[0.03] border border-phosphor/10">
        <div className="text-[8px] tracking-[1.5px] text-phosphor mb-1.5 font-semibold">NEUTRAL TRANSLATION</div>
        <div className="text-xs text-white/75 leading-relaxed">{aiResult.neutral_rewrite}</div>
      </div>

      {/* Emotional subtext */}
      {aiResult.emotional_subtext && (
        <div className="px-3 py-2 rounded-[5px] mb-2.5 bg-purple-500/[0.04] border border-purple-500/10">
          <div className="text-[8px] tracking-[1.5px] text-purple-400 mb-[3px] font-semibold">EMOTIONAL SUBTEXT</div>
          <div className="text-[10px] text-white/50 leading-relaxed">{aiResult.emotional_subtext}</div>
        </div>
      )}

      {/* Actions */}
      {aiResult.action_items?.length > 0 && (
        <div className="px-3 py-2 rounded-[5px] mb-2.5 bg-cyan-500/[0.04] border border-cyan-500/10">
          <div className="text-[8px] tracking-[1.5px] text-cyan-300 mb-1 font-semibold">ACTIONS</div>
          {aiResult.action_items.map((a, i) => (
            <div key={i} className="text-[10px] text-white/55 mb-0.5 pl-2.5 border-l-2 border-cyan-500/25">
              {a}
            </div>
          ))}
        </div>
      )}

      {/* Suggested reply */}
      {aiResult.suggested_response && (
        <div className="px-3 py-2 rounded-[5px] mb-3.5 bg-white/[0.015] border border-white/[0.04]">
          <div className="text-[8px] tracking-[1.5px] text-white/25 mb-[3px] font-semibold">SUGGESTED REPLY</div>
          <div className="text-[11px] text-white/55 leading-relaxed italic">
            &ldquo;{aiResult.suggested_response}&rdquo;
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-1.5 flex-wrap">
        <Btn onClick={onViewOriginal} c="rgba(255,255,255,0.35)">ORIGINAL ({SPOON_COSTS.viewOriginal}🥄)</Btn>
        <Btn onClick={onDefer} c="rgba(255,255,255,0.35)">DEFER</Btn>
        <Btn onClick={onDone} c="#39FF14" bg="rgba(57,255,20,0.08)" bc="rgba(57,255,20,0.2)">DONE ✓</Btn>
      </div>
    </div>
  );
}

function Btn({ children, onClick, c, bg, bc }: {
  children: React.ReactNode; onClick: () => void;
  c: string; bg?: string; bc?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 min-w-[100px] py-2 rounded-[5px] text-[9px] font-semibold tracking-[1.5px] cursor-pointer font-mono"
      style={{
        background: bg || "rgba(255,255,255,0.02)",
        border: `1px solid ${bc || "rgba(255,255,255,0.06)"}`,
        color: c,
      }}
    >
      {children}
    </button>
  );
}
