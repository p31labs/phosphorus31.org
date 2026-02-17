/**
 * 4D Posner Playground state: selection, entanglement, per-atom phase
 */

import { create } from 'zustand';

interface PosnerPlaygroundState {
  selectedAtomIndices: number[];
  entangledPairs: [number, number][];
  atomPhases: Record<number, number>;
  setSelected: (indices: number[]) => void;
  toggleAtom: (idx: number) => void;
  entangle: (a: number, b: number) => void;
  removeEntanglement: (a: number, b: number) => void;
  setAtomPhase: (idx: number, phase: number) => void;
  clearSelection: () => void;
}

export const usePosnerPlaygroundStore = create<PosnerPlaygroundState>((set) => ({
  selectedAtomIndices: [],
  entangledPairs: [],
  atomPhases: {},
  setSelected: (indices) => set({ selectedAtomIndices: indices }),
  toggleAtom: (idx) =>
    set((state) => ({
      selectedAtomIndices: state.selectedAtomIndices.includes(idx)
        ? state.selectedAtomIndices.filter((i) => i !== idx)
        : [...state.selectedAtomIndices, idx],
    })),
  entangle: (a, b) =>
    set((state) => {
      const key = [Math.min(a, b), Math.max(a, b)].join(',');
      const exists = state.entangledPairs.some(
        ([x, y]) => [Math.min(x, y), Math.max(x, y)].join(',') === key
      );
      if (exists) return state;
      return { entangledPairs: [...state.entangledPairs, [a, b]] };
    }),
  removeEntanglement: (a, b) =>
    set((state) => ({
      entangledPairs: state.entangledPairs.filter(
        ([x, y]) => !(x === a && y === b) && !(x === b && y === a)
      ),
    })),
  setAtomPhase: (idx, phase) =>
    set((state) => ({
      atomPhases: { ...state.atomPhases, [idx]: phase },
    })),
  clearSelection: () => set({ selectedAtomIndices: [] }),
}));
