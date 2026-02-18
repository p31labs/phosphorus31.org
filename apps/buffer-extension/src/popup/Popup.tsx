import { useEffect, useState } from "react";
import { HEARTBEATS, type HeartbeatTier, type VoltageScore } from "@p31labs/buffer-core";

interface ExtState {
  spoons: number;
  maxSpoons: number;
  tier: HeartbeatTier;
  lastVoltage: VoltageScore | null;
  processedCount: number;
}

export default function Popup() {
  const [state, setState] = useState<ExtState | null>(null);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_STATE" }, (res: ExtState) => {
      if (res) setState(res);
    });
  }, []);

  if (!state) {
    return <div style={{ padding: 16, textAlign: "center", color: "#555" }}>Loading...</div>;
  }

  const hb = HEARTBEATS[state.tier];

  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <span style={{ color: "#39FF14", fontSize: 12 }}>⬡</span>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: "#39FF14" }}>
          THE BUFFER
        </span>
      </div>

      <div style={{
        display: "flex", gap: 3, marginBottom: 8, alignItems: "center",
      }}>
        {Array.from({ length: state.maxSpoons }, (_, i) => (
          <div key={i} style={{
            width: 3, height: 12, borderRadius: 1,
            background: i < state.spoons ? hb.color : "rgba(255,255,255,0.04)",
          }} />
        ))}
        <span style={{ fontSize: 9, fontWeight: 600, color: hb.color, marginLeft: 4 }}>
          {state.spoons}
        </span>
      </div>

      <div style={{
        fontSize: 8, letterSpacing: 1.5, fontWeight: 700, color: hb.color,
        padding: "3px 6px", borderRadius: 3, background: `${hb.color}12`,
        border: `1px solid ${hb.color}22`, display: "inline-block", marginBottom: 8,
      }}>
        {hb.label}
      </div>

      {state.lastVoltage && (
        <div style={{ fontSize: 9, color: "#666", lineHeight: 1.6 }}>
          Last: V:{state.lastVoltage.voltage.toFixed(1)} {state.lastVoltage.gate}
        </div>
      )}

      <div style={{ fontSize: 8, color: "#333", marginTop: 8 }}>
        {state.processedCount} messages processed
      </div>

      <button
        onClick={() => chrome.sidePanel?.open?.({ windowId: undefined! })}
        style={{
          width: "100%", marginTop: 10, padding: "6px 0", borderRadius: 4,
          background: "rgba(57,255,20,0.06)", border: "1px solid rgba(57,255,20,0.15)",
          color: "#39FF14", fontSize: 9, fontWeight: 600, letterSpacing: 1.5,
          cursor: "pointer", fontFamily: "monospace",
        }}
      >
        OPEN DASHBOARD
      </button>
    </div>
  );
}
