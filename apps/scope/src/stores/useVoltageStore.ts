import { create } from 'zustand'
import { levelToNumeric, type VoltageLevel } from '../constants'

export type { VoltageLevel } from '../constants'

interface VoltageReading {
  level: VoltageLevel
  at: string
}

const MAX_READINGS = 60

interface VoltageState {
  current: VoltageLevel
  numeric: number
  history: VoltageReading[]
  setVoltage: (level: VoltageLevel, numeric?: number) => void
}

export const useVoltageStore = create<VoltageState>((set) => ({
  current: 'green',
  numeric: 2,
  history: [],
  setVoltage: (level, numeric) => {
    const n = numeric ?? levelToNumeric(level)
    const reading: VoltageReading = { level, at: new Date().toISOString() }
    set((s) => ({
      current: level,
      numeric: n,
      history: [reading, ...s.history].slice(0, MAX_READINGS),
    }))
  },
}))
