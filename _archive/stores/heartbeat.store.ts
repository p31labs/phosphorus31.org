// Heartbeat Store - Manages heart rate, HRV, and spoons data for games
import { create } from 'zustand';

interface HeartbeatState {
  heartRate: number;
  hrv: number;
  lastUpdate: number;
  isConnected: boolean;
  history: Array<{ timestamp: number; heartRate: number; hrv: number }>;
  spoons: number;
  maxSpoons: number;

  updateHeartbeat: (heartRate: number, hrv: number) => void;
  setConnected: (connected: boolean) => void;
  updateSpoons: (delta: number) => void;
  setSpoons: (spoons: number) => void;
  reset: () => void;
}

export const useHeartbeatStore = create<HeartbeatState>((set, get) => ({
  heartRate: 72,
  hrv: 50,
  lastUpdate: Date.now(),
  isConnected: false,
  history: [],
  spoons: 12,
  maxSpoons: 12,

  updateHeartbeat: (heartRate: number, hrv: number) => {
    const now = Date.now();
    const history = [...get().history, { timestamp: now, heartRate, hrv }].slice(-100);
    set({ heartRate, hrv, lastUpdate: now, history });
  },

  setConnected: (connected: boolean) => {
    set({ isConnected: connected });
  },

  updateSpoons: (delta: number) => {
    const { spoons, maxSpoons } = get();
    const newSpoons = Math.max(0, Math.min(maxSpoons, spoons + delta));
    set({ spoons: newSpoons });
  },

  setSpoons: (spoons: number) => {
    const { maxSpoons } = get();
    set({ spoons: Math.max(0, Math.min(maxSpoons, spoons)) });
  },

  reset: () => {
    set({
      heartRate: 72,
      hrv: 50,
      lastUpdate: Date.now(),
      isConnected: false,
      history: [],
      spoons: 12,
      maxSpoons: 12,
    });
  },
}));

// Convenience hook for spoons-only access
export const useSpoons = () => {
  const spoons = useHeartbeatStore((state) => state.spoons);
  const maxSpoons = useHeartbeatStore((state) => state.maxSpoons);
  const updateSpoons = useHeartbeatStore((state) => state.updateSpoons);
  const setSpoons = useHeartbeatStore((state) => state.setSpoons);
  return { spoons, maxSpoons, updateSpoons, setSpoons };
};

export default useHeartbeatStore;
