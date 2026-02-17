import { create } from 'zustand'
import type { HistoryMessage } from '../types'

interface MessageState {
  messages: HistoryMessage[]
  total: number
  loading: boolean
  setMessages: (messages: HistoryMessage[], total: number) => void
  setLoading: (loading: boolean) => void
  prependMessage: (msg: HistoryMessage) => void
  updateMessage: (id: string, updates: Partial<HistoryMessage>) => void
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],
  total: 0,
  loading: false,
  setMessages: (messages, total) => set({ messages, total }),
  setLoading: (loading) => set({ loading }),
  prependMessage: (msg) =>
    set((s) => ({
      messages: [msg, ...s.messages.filter((m) => m.id !== msg.id)],
      total: s.total + 1,
    })),
  updateMessage: (id, updates) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),
}))
