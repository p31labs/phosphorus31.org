import { useRef, useMemo } from "react";
import { SamsonV2Controller } from "@p31labs/buffer-core";
import { useBufferStore } from "@/stores/buffer-store";
import { useSpoonStore } from "@/stores/spoon-store";

export function useSamson() {
  const controllerRef = useRef(new SamsonV2Controller());
  const { processedCount, deferredCount } = useBufferStore();
  const { current, max } = useSpoonStore();

  const state = useMemo(() => {
    const c = controllerRef.current;
    const totalExpected = processedCount + deferredCount;
    while (totalExpected > 0) {
      const currentTotal = c.serialize().processedCount + c.serialize().deferredCount;
      if (currentTotal >= totalExpected) break;
      if (processedCount > c.serialize().processedCount) c.recordProcessed();
      else if (deferredCount > c.serialize().deferredCount) c.recordDeferred();
      else break;
    }
    c.updateSpoons(current, max);
    return c.state;
  }, [processedCount, deferredCount, current, max]);

  const addScore = (voltage: number) => {
    controllerRef.current.addScore(voltage);
  };

  return { ...state, addScore, controller: controllerRef.current };
}
