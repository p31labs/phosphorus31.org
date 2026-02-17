import { create } from 'zustand'
import type { SproutSignalPayload } from '../types'

const MAX_HISTORY = 50

interface SignalEntry extends SproutSignalPayload {
  receivedAt: string
}

interface SignalState {
  lastSignal: SignalEntry | null
  history: SignalEntry[]
  addSignal: (payload: SproutSignalPayload) => void
  clearHelpTriage: () => void
}

export const useSignalStore = create<SignalState>((set) => ({
  lastSignal: null,
  history: [],
  addSignal: (payload) => {
    const entry: SignalEntry = {
      ...payload,
      receivedAt: new Date().toISOString(),
    }
    set((s) => ({
      lastSignal: entry,
      history: [entry, ...s.history].slice(0, MAX_HISTORY),
    }))
  },
  clearHelpTriage: () => set({ lastSignal: null }),
}))
