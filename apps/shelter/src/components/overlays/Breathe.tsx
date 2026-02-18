import { LARMOR_HZ } from "@p31labs/buffer-core";

interface BreatheProps {
  label: string;
  progress: number;
  cycles: number;
  onSkip: () => void;
}

export default function Breathe({ label, progress, cycles, onSkip }: BreatheProps) {
  const size = 60 + progress * 120;
  const opacity = 0.15 + progress * 0.25;

  return (
    <div className="fixed inset-0 bg-black/[0.94] flex flex-col items-center justify-center z-50 gap-4">
      <div
        className="rounded-full flex items-center justify-center transition-all duration-1000"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, rgba(57,255,20,${progress * 0.12}), transparent)`,
          border: `1.5px solid rgba(57,255,20,${opacity})`,
        }}
      >
        <span className="text-xs text-phosphor tracking-[3px] font-light">{label}</span>
      </div>
      <div className="text-[9px] text-white/20">{cycles + 1} / 3 · {LARMOR_HZ} Hz harmonic</div>
      <button
        onClick={onSkip}
        className="bg-transparent border border-white/[0.08] text-white/20 rounded-[3px]
          px-3.5 py-1 text-[9px] cursor-pointer font-mono"
      >
        Skip
      </button>
    </div>
  );
}
