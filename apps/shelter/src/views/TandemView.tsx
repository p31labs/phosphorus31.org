import { useState, useRef, useEffect, useCallback } from "react";
import { useTandemStore, type TandemMode } from "@/stores/tandem-store";
import { useSpoonStore } from "@/stores/spoon-store";
import { useShelterStore } from "@/stores/shelter-store";
import { useGameAction } from "@/hooks/useGameAction";
import { useQuantumBrain } from "@/hooks/useQuantumBrain";
import { sendToTandem } from "@/services/tandem-ai";
import {
  speak,
  stopSpeaking,
  isSpeechRecognitionSupported,
  startListening,
  stopListening,
  isListening,
} from "@/lib/voice";

const MODES: { id: TandemMode; label: string; icon: string }[] = [
  { id: "chat", label: "TALK", icon: ">>" },
  { id: "draft", label: "DRAFT", icon: "✎" },
  { id: "coach", label: "COACH", icon: "◎" },
];

const QUICK_ACTIONS = [
  "How am I doing?",
  "What should I focus on?",
  "Help me breathe",
  "Score this draft",
];

function voltageColor(v: number): string {
  if (v >= 8) return "#EF4444";
  if (v >= 6) return "#F59E0B";
  if (v >= 4) return "#06B6D4";
  return "#39FF14";
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function TandemView() {
  const {
    messages, isThinking, mode, streamingText,
    addUserMessage, addTandemMessage, setThinking, setStreamingText, setMode, clearHistory,
  } = useTandemStore();
  const { current: spoons, max: maxSpoons, tier, spend } = useSpoonStore();
  const { player } = useShelterStore();
  const gameAction = useGameAction();
  const brain = useQuantumBrain();

  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streamingText]);

  const buildContext = useCallback(() => ({
    coherence: brain.coherence,
    phase: brain.phase,
    spoons,
    maxSpoons,
    tier,
    player,
    mode,
  }), [brain, spoons, maxSpoons, tier, player, mode]);

  const send = useCallback(async (text: string, voiceInput = false) => {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;

    const msg = addUserMessage(trimmed, voiceInput);
    setInput("");
    setThinking(true);
    spend(0.25);

    if (msg.voltage && msg.voltage.voltage >= 6) {
      gameAction("message_scored", { voltage: msg.voltage.voltage });
    }
    gameAction("tandem_chat");

    try {
      const ctx = buildContext();
      const allMessages = [...messages, msg];
      const response = await sendToTandem(allMessages, ctx, (chunk) => {
        setStreamingText(chunk);
      });
      addTandemMessage(response);
    } catch (err) {
      addTandemMessage("Connection lost. The mesh will reconnect.");
    } finally {
      setThinking(false);
    }
  }, [isThinking, addUserMessage, setThinking, spend, gameAction, buildContext, messages, addTandemMessage, setStreamingText]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const toggleVoice = useCallback(() => {
    if (listening) {
      stopListening();
      setListening(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) return;

    const started = startListening({
      onInterim: (text) => setInput(text),
      onFinal: (result) => {
        setInput(result.transcript);
        setListening(false);
        send(result.transcript, true);
      },
      onEnd: () => setListening(false),
      onError: () => setListening(false),
    });

    if (started) setListening(true);
  }, [listening, send]);

  const speakLast = useCallback(async () => {
    const last = messages.filter((m) => m.role === "tandem").pop();
    if (!last) return;
    setSpeaking(true);
    try {
      await speak(last.content);
    } catch { /* voice unavailable */ }
    setSpeaking(false);
  }, [messages]);

  const handleSpeak = () => {
    if (speaking) { stopSpeaking(); setSpeaking(false); }
    else speakLast();
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col flex-1 max-w-[640px] mx-auto w-full">
      {/* Mode bar */}
      <div className="flex items-center gap-1.5 px-4 pt-2 pb-1">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`text-[8px] tracking-[.15em] font-bold px-2.5 py-1 rounded border transition-colors ${
              mode === m.id
                ? "border-phosphor/30 bg-phosphor/[0.06] text-phosphor"
                : "border-white/[0.06] bg-transparent text-txt-dim hover:text-txt-muted"
            }`}
          >
            {m.icon} {m.label}
          </button>
        ))}
        <div className="flex-1" />
        {messages.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-[7px] tracking-wider text-txt-dim/50 hover:text-rose transition-colors"
          >
            CLEAR
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {isEmpty && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="text-phosphor text-2xl mb-3">&gt;&gt;</div>
            <div className="text-[10px] tracking-[.2em] font-bold text-phosphor/60 mb-1">THE TANDEM</div>
            <div className="text-[8px] text-txt-dim/40 max-w-[280px] leading-relaxed mb-6">
              Your digital consciousness. Talk, draft, think out loud. Voltage-aware. Energy-aware. Always here.
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {QUICK_ACTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-[7px] tracking-wider px-2.5 py-1.5 rounded border border-white/[0.06]
                    text-txt-dim hover:text-phosphor hover:border-phosphor/20 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 ${
                msg.role === "user"
                  ? "bg-white/[0.05] border border-white/[0.08] text-txt-primary"
                  : "bg-phosphor/[0.04] border border-phosphor/[0.08] text-txt-muted"
              }`}
            >
              {msg.role === "tandem" && (
                <div className="text-[7px] tracking-[.15em] font-bold text-phosphor/50 mb-1">TANDEM</div>
              )}
              <div className="text-[11px] leading-relaxed whitespace-pre-wrap">{msg.content}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[6px] text-txt-dim/30">{formatTime(msg.timestamp)}</span>
                {msg.voiceInput && <span className="text-[6px] text-cyan/40">voice</span>}
                {msg.voltage && (
                  <span
                    className="text-[7px] font-bold tracking-wider px-1.5 py-0.5 rounded"
                    style={{
                      color: voltageColor(msg.voltage.voltage),
                      background: `${voltageColor(msg.voltage.voltage)}12`,
                    }}
                  >
                    V:{msg.voltage.voltage.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {(isThinking || streamingText) && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-lg px-3 py-2 bg-phosphor/[0.04] border border-phosphor/[0.08]">
              <div className="text-[7px] tracking-[.15em] font-bold text-phosphor/50 mb-1">TANDEM</div>
              {streamingText ? (
                <div className="text-[11px] leading-relaxed text-txt-muted whitespace-pre-wrap">
                  {streamingText}
                  <span className="animate-pulse text-phosphor">|</span>
                </div>
              ) : (
                <div className="flex gap-1 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-phosphor/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-phosphor/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-phosphor/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-white/[0.05] px-3 py-2">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === "draft" ? "Paste your draft here..."
                : mode === "coach" ? "What do you need help with?"
                : "Talk to your Tandem..."
            }
            rows={1}
            className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2
              text-[11px] text-txt-primary placeholder:text-txt-dim/30
              focus:outline-none focus:border-phosphor/20 resize-none
              min-h-[36px] max-h-[120px]"
            style={{ height: "auto", overflow: "hidden" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 120) + "px";
            }}
          />

          {isSpeechRecognitionSupported() && (
            <button
              onClick={toggleVoice}
              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all text-sm ${
                listening
                  ? "border-rose/40 bg-rose/10 text-rose animate-pulse"
                  : "border-white/[0.08] bg-white/[0.02] text-txt-dim hover:text-cyan"
              }`}
              aria-label={listening ? "Stop listening" : "Start voice input"}
            >
              {listening ? "●" : "🎤"}
            </button>
          )}

          {messages.some((m) => m.role === "tandem") && (
            <button
              onClick={handleSpeak}
              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all text-sm ${
                speaking
                  ? "border-amber/40 bg-amber/10 text-amber"
                  : "border-white/[0.08] bg-white/[0.02] text-txt-dim hover:text-amber"
              }`}
              aria-label={speaking ? "Stop speaking" : "Read last response"}
            >
              {speaking ? "◼" : "🔊"}
            </button>
          )}

          <button
            onClick={() => send(input)}
            disabled={!input.trim() || isThinking}
            className="h-8 px-3 rounded-lg border border-phosphor/20 bg-phosphor/[0.06]
              text-phosphor text-[9px] font-bold tracking-[.12em]
              disabled:opacity-30 disabled:cursor-not-allowed
              hover:bg-phosphor/10 transition-colors"
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}
