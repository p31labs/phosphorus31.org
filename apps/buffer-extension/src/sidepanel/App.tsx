import { useState, useEffect, useCallback } from "react";
import {
  computeVoltage,
  extractBLUF,
  GATES,
  HEARTBEATS,
  type GateName,
  type HeartbeatTier,
  type VoltageScore,
  type BLUFResult,
} from "@p31labs/buffer-core";

interface ExtState {
  spoons: number;
  maxSpoons: number;
  tier: HeartbeatTier;
}

export default function SidePanel() {
  const [input, setInput] = useState("");
  const [score, setScore] = useState<VoltageScore | null>(null);
  const [bluf, setBluf] = useState<BLUFResult | null>(null);
  const [ext, setExt] = useState<ExtState>({ spoons: 8, maxSpoons: 12, tier: "GREEN" });

  const refreshState = useCallback(() => {
    chrome.runtime.sendMessage({ type: "GET_STATE" }, (res: ExtState) => {
      if (res) setExt(res);
    });
  }, []);

  useEffect(() => { refreshState(); }, [refreshState]);

  const handleScore = () => {
    if (!input.trim()) return;
    const s = computeVoltage(input);
    const b = extractBLUF(input);
    setScore(s);
    setBluf(b);
    chrome.runtime.sendMessage({ type: "SCORE_RESULT", score: s }, () => refreshState());
  };

  const hb = HEARTBEATS[ext.tier];
  const gc = score ? GATES[score.gate as GateName] : null;

  return (
    <div style={{ padding: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
        <span style={{ color: "#39FF14", fontSize: 12 }}>⬡</span>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: "#39FF14" }}>
          THE BUFFER
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 2, alignItems: "center" }}>
          {Array.from({ length: ext.maxSpoons }, (_, i) => (
            <div key={i} style={{
              width: 2, height: 10, borderRadius: 1,
              background: i < ext.spoons ? hb.color : "rgba(255,255,255,0.04)",
            }} />
          ))}
          <span style={{ fontSize: 8, fontWeight: 600, color: hb.color, marginLeft: 3 }}>
            {ext.spoons}
          </span>
        </div>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste a message..."
        rows={5}
        style={{
          width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 5, padding: 10, color: "#d4d4d4", fontSize: 11, fontFamily: "monospace",
          resize: "vertical", outline: "none", boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderColor = "rgba(57,255,20,0.2)")}
        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.06)")}
        onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleScore(); }}
      />

      <button
        onClick={handleScore}
        disabled={!input.trim()}
        style={{
          width: "100%", marginTop: 6, padding: "7px 0", borderRadius: 5, border: "none",
          background: input.trim() ? "#39FF14" : "rgba(255,255,255,0.04)",
          color: input.trim() ? "#0a0a0f" : "rgba(255,255,255,0.12)",
          fontSize: 10, fontWeight: 700, letterSpacing: 2, cursor: input.trim() ? "pointer" : "default",
          fontFamily: "monospace",
        }}
      >
        SCORE ▸
      </button>

      {score && gc && (
        <div style={{ marginTop: 10 }}>
          <div style={{
            display: "flex", gap: 8, alignItems: "center", padding: "8px 10px",
            borderRadius: 5, background: gc.bg, border: `1px solid ${gc.color}33`,
          }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: gc.color }}>{score.voltage}</span>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: gc.color }}>
                {score.gate} — {gc.label}
              </div>
              <div style={{ fontSize: 7, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>
                U:{score.urgency} · E:{score.emotional} · C:{score.cognitive}
              </div>
            </div>
          </div>

          {score.passiveAggressive.length > 0 && (
            <div style={{
              marginTop: 6, padding: "6px 8px", borderRadius: 4,
              background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.12)",
            }}>
              <div style={{ fontSize: 7, letterSpacing: 1.5, color: "#a78bfa", fontWeight: 600 }}>
                SUBTEXT
              </div>
              {score.passiveAggressive.map((p, i) => (
                <div key={i} style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                  → {p.translation}
                </div>
              ))}
            </div>
          )}

          {bluf && (
            <div style={{
              marginTop: 6, padding: "6px 8px", borderRadius: 4,
              background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)",
            }}>
              <div style={{ fontSize: 7, letterSpacing: 1.5, color: "rgba(255,255,255,0.25)", fontWeight: 600 }}>
                BLUF
              </div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", lineHeight: 1.5, marginTop: 2 }}>
                {bluf.summary}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
