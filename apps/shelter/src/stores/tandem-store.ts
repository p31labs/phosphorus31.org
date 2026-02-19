import { create } from "zustand";
import { computeVoltage, type VoltageScore } from "@p31labs/buffer-core";

export interface ChatMessage {
  id: string;
  role: "user" | "tandem" | "system";
  content: string;
  timestamp: number;
  voltage?: VoltageScore;
  voiceInput?: boolean;
}

export type TandemMode = "chat" | "draft" | "coach";

interface TandemState {
  messages: ChatMessage[];
  isThinking: boolean;
  mode: TandemMode;
  streamingText: string;

  addUserMessage: (text: string, voiceInput?: boolean) => ChatMessage;
  addTandemMessage: (text: string) => void;
  setThinking: (v: boolean) => void;
  setStreamingText: (t: string) => void;
  setMode: (m: TandemMode) => void;
  clearHistory: () => void;
}

const STORAGE_KEY = "p31_tandem_history";
const MAX_MESSAGES = 100;

function loadHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ChatMessage[];
      return parsed.slice(-MAX_MESSAGES);
    }
  } catch { /* corrupt */ }
  return [];
}

function persist(messages: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES)));
  } catch { /* quota */ }
}

export const useTandemStore = create<TandemState>((set, get) => ({
  messages: loadHistory(),
  isThinking: false,
  mode: "chat",
  streamingText: "",

  addUserMessage: (text, voiceInput) => {
    const voltage = computeVoltage(text);
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: Date.now(),
      voltage: voltage.voltage >= 4 ? voltage : undefined,
      voiceInput,
    };
    const messages = [...get().messages, msg];
    set({ messages });
    persist(messages);
    return msg;
  },

  addTandemMessage: (text) => {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "tandem",
      content: text,
      timestamp: Date.now(),
    };
    const messages = [...get().messages, msg];
    set({ messages, streamingText: "" });
    persist(messages);
  },

  setThinking: (v) => set({ isThinking: v }),
  setStreamingText: (t) => set({ streamingText: t }),
  setMode: (m) => set({ mode: m }),

  clearHistory: () => {
    set({ messages: [] });
    localStorage.removeItem(STORAGE_KEY);
  },
}));
