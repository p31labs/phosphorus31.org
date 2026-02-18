import { create } from "zustand";
import { computeVoltage, extractBLUF, SpoonTracker, type VoltageScore, type BLUFResult } from "@p31labs/buffer-core";
import type { AIRewriteResult, QueueItem } from "@/types";

type Phase = "calibrate" | "input" | "scored" | "rewritten" | "original";

interface BufferState {
  input: string;
  score: VoltageScore | null;
  bluf: BLUFResult | null;
  aiResult: AIRewriteResult | null;
  aiLoading: boolean;
  phase: Phase;
  queue: QueueItem[];
  processedCount: number;
  deferredCount: number;
  trimtab: number;

  setInput: (text: string) => void;
  scoreMessage: () => VoltageScore | null;
  setAIResult: (result: AIRewriteResult | null) => void;
  setAILoading: (loading: boolean) => void;
  setPhase: (phase: Phase) => void;
  deferMessage: () => void;
  markDone: () => void;
  processFromQueue: (index: number) => void;
  setTrimtab: (value: number) => void;
  reset: () => void;
}

let nextQueueId = Date.now();

export const useBufferStore = create<BufferState>((set, get) => ({
  input: "",
  score: null,
  bluf: null,
  aiResult: null,
  aiLoading: false,
  phase: "calibrate",
  queue: [],
  processedCount: 0,
  deferredCount: 0,
  trimtab: 0,

  setInput: (text) => set({ input: text }),

  scoreMessage: () => {
    const { input } = get();
    if (!input.trim()) return null;
    const score = computeVoltage(input);
    const bluf = extractBLUF(input);
    set({ score, bluf, aiResult: null, phase: "scored" });
    return score;
  },

  setAIResult: (result) => set({ aiResult: result }),
  setAILoading: (loading) => set({ aiLoading: loading }),
  setPhase: (phase) => set({ phase }),

  deferMessage: () => {
    const { input, score, queue } = get();
    if (!score) return;
    const item: QueueItem = {
      id: nextQueueId++,
      text: input.slice(0, 200),
      voltage: score.voltage,
      gate: score.gate,
      timestamp: Date.now(),
    };
    set({
      queue: [...queue, item],
      deferredCount: get().deferredCount + 1,
      input: "",
      score: null,
      bluf: null,
      aiResult: null,
      phase: "input",
    });
  },

  markDone: () => {
    set({
      processedCount: get().processedCount + 1,
      input: "",
      score: null,
      bluf: null,
      aiResult: null,
      phase: "input",
    });
  },

  processFromQueue: (index) => {
    const { queue } = get();
    const item = queue[index];
    if (!item) return;
    set({
      input: item.text,
      queue: queue.filter((_, i) => i !== index),
      phase: "input",
    });
  },

  setTrimtab: (value) => set({ trimtab: value }),

  reset: () => set({
    input: "",
    score: null,
    bluf: null,
    aiResult: null,
    aiLoading: false,
    phase: "input",
  }),
}));
