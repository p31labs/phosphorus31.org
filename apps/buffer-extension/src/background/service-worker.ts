import { SpoonTracker, type VoltageScore, type HeartbeatTier } from "@p31labs/buffer-core";

interface ExtensionState {
  spoons: number;
  maxSpoons: number;
  tier: HeartbeatTier;
  lastVoltage: VoltageScore | null;
  processedCount: number;
}

const tracker = new SpoonTracker(8, 12);
let lastVoltage: VoltageScore | null = null;
let processedCount = 0;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["spoons", "processedCount"], (result) => {
    if (result.spoons != null) tracker.set(result.spoons);
    if (result.processedCount != null) processedCount = result.processedCount;
  });
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "GET_STATE") {
    const state: ExtensionState = {
      spoons: tracker.current,
      maxSpoons: tracker.max,
      tier: tracker.tier,
      lastVoltage,
      processedCount,
    };
    sendResponse(state);
  }

  if (msg.type === "SCORE_RESULT") {
    lastVoltage = msg.score;
    processedCount++;
    tracker.spend(SpoonTracker.readCost(msg.score.voltage));
    chrome.storage.local.set({ spoons: tracker.current, processedCount });
    sendResponse({ ok: true });
  }

  if (msg.type === "CALIBRATE") {
    tracker.set(msg.spoons);
    chrome.storage.local.set({ spoons: tracker.current });
    sendResponse({ ok: true });
  }

  return true;
});

chrome.sidePanel?.setPanelBehavior?.({ openPanelOnActionClick: false }).catch(() => {});
