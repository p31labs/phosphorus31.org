import { create } from 'zustand'

type ConnectionStatus = 'connected' | 'reconnecting' | 'disconnected'

/** Send a message to Shelter over WebSocket. No-op when disconnected. */
export type SendToShelter = (payload: object) => void

interface ScopeSubscribed {
  currentVoltage?: string
  queueLength?: number
}

interface ScopeState {
  connectionStatus: ConnectionStatus
  lastScopeSubscribed: ScopeSubscribed | null
  sendToShelter: SendToShelter
  setConnectionStatus: (status: ConnectionStatus) => void
  setScopeSubscribed: (data: Partial<ScopeSubscribed>) => void
  setSendToShelter: (fn: SendToShelter) => void
}

const noopSend: SendToShelter = () => {}

export const useScopeStore = create<ScopeState>((set) => ({
  connectionStatus: 'disconnected',
  lastScopeSubscribed: null,
  sendToShelter: noopSend,
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setScopeSubscribed: (data) =>
    set((s) => ({
      lastScopeSubscribed: { ...s.lastScopeSubscribed, ...data } as ScopeSubscribed,
    })),
  setSendToShelter: (fn) => set({ sendToShelter: fn }),
}))
