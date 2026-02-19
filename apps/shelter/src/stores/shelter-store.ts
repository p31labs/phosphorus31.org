import { create } from "zustand";
import {
  type PlayerState,
  type Quest,
  createStreakState,
  createLOVEState,
} from "@p31labs/game-engine";

export interface Toast {
  id: string;
  type: "achievement" | "xp" | "quest" | "level";
  data: Record<string, unknown>;
  timestamp: number;
}

export type Tab = "tandem" | "buffer" | "brain" | "quests" | "stats" | "breathe" | "settings" | "jitterbug" | "clock";

interface ShelterState {
  player: PlayerState;
  setPlayer: (p: PlayerState) => void;

  dailyQuests: Quest[];
  weeklyQuests: Quest[];
  dailyDate: string;
  weeklyDate: string;
  setQuests: (daily: Quest[], weekly: Quest[], dailyDate: string, weeklyDate: string) => void;
  updateQuests: (daily: Quest[], weekly: Quest[]) => void;

  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;

  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id" | "timestamp">) => void;
  removeToast: (id: string) => void;

  checkedInToday: boolean;
  setCheckedInToday: (v: boolean) => void;
}

export function createDefaultPlayer(): PlayerState {
  return {
    xp: 0,
    level: 0,
    totalXpEarned: 0,
    prestige: 0,
    title: "Observer",
    streaks: createStreakState(),
    love: createLOVEState(),
    achievements: [],
    inventory: [],
    questsCompleted: 0,
    messagesScored: 0,
    lastActive: new Date().toISOString(),
  };
}

export const useShelterStore = create<ShelterState>((set) => ({
  player: createDefaultPlayer(),
  setPlayer: (p) => set({ player: p }),

  dailyQuests: [],
  weeklyQuests: [],
  dailyDate: "",
  weeklyDate: "",
  setQuests: (daily, weekly, dailyDate, weeklyDate) =>
    set({ dailyQuests: daily, weeklyQuests: weekly, dailyDate, weeklyDate }),
  updateQuests: (daily, weekly) => set({ dailyQuests: daily, weeklyQuests: weekly }),

  activeTab: "tandem",
  setActiveTab: (tab) => set({ activeTab: tab }),

  toasts: [],
  addToast: (toast) =>
    set((s) => ({
      toasts: [
        ...s.toasts,
        { ...toast, id: crypto.randomUUID(), timestamp: Date.now() },
      ],
    })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  checkedInToday: false,
  setCheckedInToday: (v) => set({ checkedInToday: v }),
}));
