import { loadPreference, savePreference } from "./storage";
import { useBufferStore } from "@/stores/buffer-store";
import { useSpoonStore } from "@/stores/spoon-store";

export async function hydrateStores(): Promise<void> {
  const savedSpoons = await loadPreference<number>("spoons", 8);
  const savedPhase = await loadPreference<string>("phase", "calibrate");
  const savedProcessed = await loadPreference<number>("processedCount", 0);
  const savedDeferred = await loadPreference<number>("deferredCount", 0);
  const savedQueue = await loadPreference<[]>("queue", []);

  useSpoonStore.getState().calibrate(savedSpoons);

  if (savedPhase !== "calibrate") {
    useBufferStore.setState({
      phase: savedPhase as "input" | "scored" | "rewritten" | "original",
      processedCount: savedProcessed,
      deferredCount: savedDeferred,
      queue: savedQueue,
    });
  }
}

export function subscribeToPersistence(): () => void {
  const unsubSpoons = useSpoonStore.subscribe((state) => {
    void savePreference("spoons", state.current);
  });

  const unsubBuffer = useBufferStore.subscribe((state) => {
    if (state.phase !== "calibrate") {
      void savePreference("phase", state.phase);
      void savePreference("processedCount", state.processedCount);
      void savePreference("deferredCount", state.deferredCount);
      void savePreference("queue", state.queue);
    }
  });

  return () => { unsubSpoons(); unsubBuffer(); };
}
