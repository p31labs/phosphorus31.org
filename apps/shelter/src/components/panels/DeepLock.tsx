import { useSpoonStore } from "@/stores/spoon-store";

interface DeepLockProps {
  onBreathe: () => void;
}

export default function DeepLock({ onBreathe }: DeepLockProps) {
  const recover = useSpoonStore((s) => s.recover);

  return (
    <div className="text-center p-8 bg-red-500/[0.04] rounded-[10px] border border-red-500/[0.12]">
      <div className="text-[28px] mb-2">🛡️</div>
      <div className="text-[13px] text-red-400 font-semibold mb-1.5">DEEP PROCESSING LOCK</div>
      <div className="text-[10px] text-white/30 leading-relaxed max-w-[300px] mx-auto">
        Energy below 25%. Messages blocked. Use regulation tools or rest.
      </div>
      <div className="flex gap-1.5 justify-center mt-4 flex-wrap">
        <button
          onClick={onBreathe}
          className="bg-phosphor/[0.06] border border-phosphor/15 text-phosphor
            rounded-[5px] px-4 py-2 text-[9px] cursor-pointer font-mono tracking-wider"
        >
          BREATHE (4-2-6)
        </button>
        <button
          onClick={() => recover(2)}
          className="bg-white/[0.03] border border-white/[0.08] text-white/35
            rounded-[5px] px-4 py-2 text-[9px] cursor-pointer font-mono tracking-wider"
        >
          NAP (+2)
        </button>
        <button
          onClick={() => recover(1)}
          className="bg-white/[0.03] border border-white/[0.08] text-white/35
            rounded-[5px] px-4 py-2 text-[9px] cursor-pointer font-mono tracking-wider"
        >
          HEAVY WORK (+1)
        </button>
      </div>
    </div>
  );
}
