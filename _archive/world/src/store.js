// VoxelWorld State Store
import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // Voxel blocks - Map<"x,y,z", blockData>
  blocks: new Map([
    ['0,0,0', { color: 0x00ffff }],
    ['1,0,0', { color: 0x00ffff }],
    ['0,1,0', { color: 0x00ffff }],
  ]),

  // Build mode: 'BUILD' | 'VIEW' | 'EDIT'
  mode: 'BUILD',

  // Add a block
  addBlock: (key, data = { color: 0x00ffff }) => {
    set((state) => {
      const newBlocks = new Map(state.blocks);
      newBlocks.set(key, data);
      return { blocks: newBlocks };
    });
  },

  // Remove a block
  removeBlock: (key) => {
    set((state) => {
      const newBlocks = new Map(state.blocks);
      newBlocks.delete(key);
      return { blocks: newBlocks };
    });
  },

  // Set mode
  setMode: (mode) => set({ mode }),

  // Clear all blocks
  clearBlocks: () => set({ blocks: new Map() }),

  // Get block count
  getBlockCount: () => get().blocks.size,
}));

export default useStore;
