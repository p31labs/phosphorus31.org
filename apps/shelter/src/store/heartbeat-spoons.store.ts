/**
 * HEARTBEAT SPOONS STORE (Node A: You)
 * Zustand store for spoon tracking, regulation, and mood
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  HeartbeatSpoonsState,
  HeartbeatSpoonsActions,
  RegulationMood,
  SpoonHistoryEntry,
} from '../types/heartbeat.types';

interface HeartbeatSpoonsStore extends HeartbeatSpoonsState, HeartbeatSpoonsActions {}

const initialState: HeartbeatSpoonsState = {
  spoons: {
    current: 10,
    max: 10,
    history: [],
  },
  regulation: {
    isGrounding: false,
    breathingActive: false,
    safeAffirmed: false,
  },
  mood: 'calm',
  lastCheck: Date.now(),
};

export const useHeartbeatSpoonsStore = create<HeartbeatSpoonsStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setSpoons: (count: number) => {
          const max = get().spoons.max;
          const clamped = Math.max(0, Math.min(count, max));
          const now = Date.now();

          set(
            (state) => ({
              spoons: {
                ...state.spoons,
                current: clamped,
                history: [
                  ...state.spoons.history,
                  { time: now, value: clamped },
                ].slice(-100), // Keep last 100 entries
              },
              lastCheck: now,
            }),
            false,
            'setSpoons'
          );
        },

        adjustSpoons: (delta: number) => {
          const current = get().spoons.current;
          get().setSpoons(current + delta);
        },

        startGrounding: () => {
          set(
            (state) => ({
              regulation: {
                ...state.regulation,
                isGrounding: true,
              },
            }),
            false,
            'startGrounding'
          );
        },

        stopGrounding: () => {
          set(
            (state) => ({
              regulation: {
                ...state.regulation,
                isGrounding: false,
              },
            }),
            false,
            'stopGrounding'
          );
        },

        affirmSafe: () => {
          set(
            (state) => ({
              regulation: {
                ...state.regulation,
                safeAffirmed: true,
              },
            }),
            false,
            'affirmSafe'
          );
        },

        setMood: (mood: RegulationMood) => {
          set({ mood, lastCheck: Date.now() }, false, 'setMood');
        },

        stopBreathing: () => {
          set(
            (state) => ({
              regulation: {
                ...state.regulation,
                breathingActive: false,
              },
            }),
            false,
            'stopBreathing'
          );
        },
      }),
      {
        name: 'cognitive-shield-heartbeat-spoons',
        partialize: (state) => ({
          spoons: state.spoons,
          regulation: state.regulation,
          mood: state.mood,
          lastCheck: state.lastCheck,
        }),
      }
    ),
    { name: 'HeartbeatSpoonsStore' }
  )
);

export default useHeartbeatSpoonsStore;
