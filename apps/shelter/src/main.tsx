import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import App from "./App";
import { syncSpoons, syncVoltage, syncMode, syncGameState } from "@/lib/bus-bridge";
import { useSpoonStore } from "@/stores/spoon-store";
import { useBufferStore } from "@/stores/buffer-store";
import { useShelterStore } from "@/stores/shelter-store";
import "./index.css";

// Sync Zustand → bus (localStorage + BroadcastChannel) for cross-tab and standalone HTMLs
useSpoonStore.subscribe((s) => syncSpoons(s.current));
useBufferStore.subscribe((s) => {
  syncVoltage(s.score?.voltage ?? 0);
  syncMode(s.phase);
});
useShelterStore.subscribe((s) =>
  syncGameState(s.player.xp, s.player.level, s.player.love.balance),
);
// Initial sync
syncSpoons(useSpoonStore.getState().current);
syncVoltage(useBufferStore.getState().score?.voltage ?? 0);
syncMode(useBufferStore.getState().phase);
syncGameState(
  useShelterStore.getState().player.xp,
  useShelterStore.getState().player.level,
  useShelterStore.getState().player.love.balance,
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
