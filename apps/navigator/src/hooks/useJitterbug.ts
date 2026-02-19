import { useState, useCallback, useEffect } from "react";

export type JitterbugState = "breathe" | "jitterbug" | "navigate" | "info";

const JITTERBUG_DURATION_MS = 1500;
const BREATHE_HZ = 0.1;
const RPM = 0.5;
const RAD_PER_MS = (Math.PI * 2 * RPM) / 60 / 1000;

export function useJitterbug() {
  const [state, setState] = useState<JitterbugState>("breathe");
  const [transitionT, setTransitionT] = useState(0);
  const [rotationTheta, setRotationTheta] = useState(0);
  const [breatheScale, setBreatheScale] = useState(1);
  const [infoVertex, setInfoVertex] = useState<number | null>(null);

  const startTransition = useCallback(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState("navigate");
      setTransitionT(1);
    } else {
      setState("jitterbug");
      setTransitionT(0);
    }
  }, []);

  const openInfo = useCallback((vertex: number) => {
    setInfoVertex(vertex);
    setState("info");
  }, []);

  const closeInfo = useCallback(() => {
    setInfoVertex(null);
    setState("navigate");
  }, []);

  // Rotation (all states)
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      setRotationTheta(elapsed * RAD_PER_MS);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Breathing scale (breathe state only): 1 → 1.03 → 1 at 0.1 Hz
  useEffect(() => {
    if (state !== "breathe") return;
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const t = ((performance.now() - start) / 1000) * BREATHE_HZ * Math.PI * 2;
      setBreatheScale(1 + 0.015 * (1 + Math.sin(t)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state]);

  // Jitterbug transition progress
  useEffect(() => {
    if (state !== "jitterbug") return;
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      const t = Math.min(1, elapsed / JITTERBUG_DURATION_MS);
      setTransitionT(t);
      if (t >= 1) {
        setState("navigate");
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state]);

  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return {
    state: reducedMotion && state === "breathe" ? "navigate" : state,
    transitionT: reducedMotion ? 1 : transitionT,
    rotationTheta,
    breatheScale,
    infoVertex,
    startTransition,
    openInfo,
    closeInfo,
    reducedMotion,
  };
}
