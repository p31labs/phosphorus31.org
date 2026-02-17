/**
 * P31 Scope — Copilot store (coherence, mode, notifications, speech).
 * Drives PulseIndicator and copilot behavior.
 */

import { create } from 'zustand';

export type CoherenceLevel = 'high' | 'medium' | 'low' | 'critical';

export type CopilotMode = 'passive' | 'nudge' | 'active' | 'emergency';

export interface PendingNotification {
  id: string;
  message: string;
  severity?: 'info' | 'caution' | 'critical';
  timestamp: number;
}

interface CopilotState {
  coherenceLevel: CoherenceLevel;
  copilotMode: CopilotMode;
  pendingNotifications: PendingNotification[];
  speaking: boolean;
  setCoherence: (level: CoherenceLevel) => void;
  queueNotification: (notif: Omit<PendingNotification, 'id' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;
  speak: (text: string) => void;
  setSpeaking: (v: boolean) => void;
}

let notifId = 0;

export const useCopilotStore = create<CopilotState>((set, get) => ({
  coherenceLevel: 'medium',
  copilotMode: 'passive',
  pendingNotifications: [],
  speaking: false,

  setCoherence: (level) =>
    set((state) => ({
      coherenceLevel: level,
      copilotMode: coherenceToMode(level, state.copilotMode),
    })),

  queueNotification: (notif) =>
    set((state) => ({
      pendingNotifications: [
        ...state.pendingNotifications,
        {
          ...notif,
          id: `notif-${++notifId}`,
          timestamp: Date.now(),
        },
      ].slice(-20),
    })),

  dismissNotification: (id) =>
    set((state) => ({
      pendingNotifications: state.pendingNotifications.filter((n) => n.id !== id),
    })),

  speak: (text) => {
    set({ speaking: true });
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(text);
      u.onend = () => set({ speaking: false });
      window.speechSynthesis.speak(u);
    } else {
      set({ speaking: false });
    }
  },

  setSpeaking: (v) => set({ speaking: v }),
}));

function coherenceToMode(level: CoherenceLevel, current: CopilotMode): CopilotMode {
  if (level === 'critical') return 'emergency';
  if (level === 'low') return 'active';
  if (level === 'medium') return current === 'emergency' ? 'nudge' : current;
  return 'passive';
}
