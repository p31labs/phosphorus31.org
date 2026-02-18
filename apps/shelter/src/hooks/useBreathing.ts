import { useState, useEffect, useCallback } from "react";
import { BREATHE } from "@p31labs/buffer-core";

interface BreathingState {
  active: boolean;
  seconds: number;
  cycles: number;
  label: "BREATHE IN" | "HOLD" | "BREATHE OUT";
  progress: number;
  start: () => void;
  stop: () => void;
}

export function useBreathing(onComplete?: () => void): BreathingState {
  const [active, setActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setSeconds((prev) => {
        const next = prev + 1;
        if (next >= BREATHE.TOTAL) {
          setCycles((c) => c + 1);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  useEffect(() => {
    if (cycles >= 3 && active) {
      setActive(false);
      setCycles(0);
      setSeconds(0);
      onComplete?.();
    }
  }, [cycles, active, onComplete]);

  const label = seconds < BREATHE.IN
    ? "BREATHE IN" as const
    : seconds < BREATHE.IN + BREATHE.HOLD
      ? "HOLD" as const
      : "BREATHE OUT" as const;

  const progress = seconds < BREATHE.IN
    ? seconds / BREATHE.IN
    : seconds < BREATHE.IN + BREATHE.HOLD
      ? 1
      : 1 - (seconds - BREATHE.IN - BREATHE.HOLD) / BREATHE.OUT;

  const start = useCallback(() => { setActive(true); setSeconds(0); setCycles(0); }, []);
  const stop = useCallback(() => { setActive(false); setSeconds(0); setCycles(0); }, []);

  return { active, seconds, cycles, label, progress, start, stop };
}
