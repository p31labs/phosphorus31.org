/**
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { create } from 'zustand';

// Define the shape of our store's state and actions
interface PhenixState {
  blocks: Map<string, string>; // "x,y,z" -> "block_type"
  voltage: number; // System Entropy
  mode: 'BUILD' | 'VIEW' | 'SLICE';
  addBlock: (pos: string) => void;
  removeBlock: (pos: string) => void;
  setVoltage: (v: number) => void;
  setMode: (m: 'BUILD' | 'VIEW' | 'SLICE') => void;
}

export const useStore = create<PhenixState>((set) => ({
  blocks: new Map(),
  voltage: 70,
  mode: 'BUILD',
  addBlock: (pos) => set((state) => ({
    blocks: new Map(state.blocks).set(pos, 'standard'),
    voltage: Math.max(0, state.voltage - 2), // Building reduces entropy!
  })),
  removeBlock: (pos) => set((state) => {
    const newBlocks = new Map(state.blocks);
    newBlocks.delete(pos);
    return { blocks: newBlocks };
  }),
  setVoltage: (v) => set({ voltage: v }),
  setMode: (m) => set({ mode: m }),
}));