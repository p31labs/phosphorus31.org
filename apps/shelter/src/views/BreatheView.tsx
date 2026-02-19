import { useState, useEffect, useRef, useCallback } from "react";
import { useSpoonStore } from "@/stores/spoon-store";
import { useGameAction } from "@/hooks/useGameAction";

type Phase = "idle" | "inhale" | "hold" | "exhale";

const INHALE_MS = 4000;
const HOLD_MS = 4000;
const EXHALE_MS = 6000;
const CYCLE_MS = INHALE_MS + HOLD_MS + EXHALE_MS;
const TARGET_CYCLES = 4;

const PHASE_LABELS: Record<Phase, string> = {
  idle: "Tap to begin",
  inhale: "Breathe in…",
  hold: "Hold…",
  exhale: "Breathe out…",
};

export default function BreatheView() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [cycles, setCycles] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef(0);
  const cyclesRef = useRef(0);
  const activeRef = useRef(false);
  const gameAction = useGameAction();
  const recover = useSpoonStore((s) => s.recover);

  const finish = useCallback((completed: boolean) => {
    cancelAnimationFrame(rafRef.current);
    activeRef.current = false;
    if (completed) {
      gameAction("breathing_completed");
      recover(1);
    }
    setPhase("idle");
    setCycles(0);
    setElapsed(0);
    cyclesRef.current = 0;
  }, [gameAction, recover]);

  useEffect(() => {
    if (phase === "idle" || !activeRef.current) return;

    const tick = () => {
      if (!activeRef.current) return;

      const now = performance.now();
      const dt = now - startRef.current;
      setElapsed(dt);

      const completedCycles = Math.floor(dt / CYCLE_MS);
      setCycles(completedCycles);
      cyclesRef.current = completedCycles;

      if (completedCycles >= TARGET_CYCLES) {
        finish(true);
        return;
      }

      const inCycle = dt % CYCLE_MS;
      if (inCycle < INHALE_MS) setPhase("inhale");
      else if (inCycle < INHALE_MS + HOLD_MS) setPhase("hold");
      else setPhase("exhale");

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase === "idle", finish]);

  const start = () => {
    startRef.current = performance.now();
    cyclesRef.current = 0;
    activeRef.current = true;
    setCycles(0);
    setElapsed(0);
    setPhase("inhale");
  };

  const stopEarly = () => finish(cyclesRef.current >= TARGET_CYCLES);

  const inCycle = elapsed % CYCLE_MS;
  let phasePct = 0;
  if (phase === "inhale") phasePct = inCycle / INHALE_MS;
  else if (phase === "hold") phasePct = 1;
  else if (phase === "exhale") phasePct = 1 - (inCycle - INHALE_MS - HOLD_MS) / EXHALE_MS;

  const orbScale = 0.5 + phasePct * 0.5;

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-5 py-8 gap-8">
      <h2 className="text-[11px] font-bold tracking-[2px] text-phosphor uppercase">
        Breathing Pacer
      </h2>

      <p className="text-[10px] text-txt-muted text-center max-w-xs leading-relaxed -mt-4">
        4 seconds in. 4 seconds hold. 6 seconds out. Four cycles restores 1 energy.
      </p>

      {/* Orb */}
      <button
        onClick={phase === "idle" ? start : stopEarly}
        className="relative w-40 h-40 rounded-full flex items-center justify-center cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-phosphor/50"
        style={{
          background: `radial-gradient(circle, ${
            phase === "idle" ? "rgba(57,255,20,0.08)" : "rgba(57,255,20,0.15)"
          }, transparent 70%)`,
        }}
        aria-label={phase === "idle" ? "Start breathing exercise" : "Stop breathing exercise"}
      >
        <div
          className="w-24 h-24 rounded-full"
          style={{
            transform: `scale(${orbScale})`,
            transition: phase === "idle" ? "transform 300ms" : "transform 100ms",
            background: "radial-gradient(circle, rgba(57,255,20,0.4), rgba(57,255,20,0.05))",
            boxShadow: `0 0 ${30 * phasePct}px rgba(57,255,20,0.3)`,
          }}
        />
      </button>

      {/* Label */}
      <div className="text-center">
        <p className="text-sm text-txt font-medium">{PHASE_LABELS[phase]}</p>
        {phase !== "idle" && (
          <p className="text-[10px] text-txt-muted mt-1">
            Cycle {Math.min(cycles + 1, TARGET_CYCLES)} of {TARGET_CYCLES}
          </p>
        )}
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {Array.from({ length: TARGET_CYCLES }, (_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full border transition-all duration-300"
            style={{
              background: i < cycles ? "#39FF14" : "transparent",
              borderColor: i < cycles ? "#39FF14" : "rgba(255,255,255,0.1)",
            }}
          />
        ))}
      </div>

      {phase !== "idle" && (
        <button
          onClick={stopEarly}
          className="text-[10px] text-txt-muted hover:text-txt transition-colors underline
            bg-transparent border-none cursor-pointer font-mono"
        >
          End early
        </button>
      )}
    </div>
  );
}
