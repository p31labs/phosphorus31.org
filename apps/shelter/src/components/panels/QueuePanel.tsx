import { GATES, type GateName } from "@p31labs/buffer-core";
import { useBufferStore } from "@/stores/buffer-store";

export default function QueuePanel() {
  const { queue, processFromQueue } = useBufferStore();

  return (
    <div className="px-4 py-3 bg-white/[0.015] border-b border-white/[0.04] max-h-40 overflow-y-auto">
      <div className="text-[8px] tracking-[2px] text-white/25 mb-1.5 font-semibold">DEFERRED</div>
      {queue.length === 0 && (
        <div className="text-[9px] text-white/15 py-2">No deferred messages. Queue is clear.</div>
      )}
      {queue.map((q, i) => {
        const gc = GATES[q.gate as GateName] || GATES.GREEN;
        return (
          <div
            key={q.id}
            className="flex justify-between items-center px-2 py-1 mb-[3px] rounded-[3px] border"
            style={{ background: gc.bg, borderColor: `${gc.color}22` }}
          >
            <span className="text-[9px] font-semibold" style={{ color: gc.color }}>
              {q.gate} {q.voltage}V
            </span>
            <span className="text-[8px] text-white/25 flex-1 ml-2 overflow-hidden whitespace-nowrap text-ellipsis">
              {q.text}
            </span>
            <button
              onClick={() => processFromQueue(i)}
              className="ml-1.5 flex-shrink-0 px-2 py-0.5 rounded-[3px] text-[8px] cursor-pointer font-mono"
              style={{
                background: `${gc.color}15`,
                border: `1px solid ${gc.color}33`,
                color: gc.color,
              }}
            >
              Open
            </button>
          </div>
        );
      })}
    </div>
  );
}
