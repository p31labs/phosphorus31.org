// Entry point for the world package (3D voxel engine)
import VoxelWorld from './VoxelWorld';
import { Fabricator } from './fabricator';

console.log("GENESIS_GATE world package started.");

// Initialize world modules
export const initializeWorld = async () => {
  console.log("Initializing world modules...");

  // Note: VoxelWorld is a React component - it will be initialized in the UI
  // Fabricator can be initialized here for G-code generation

  console.log("World modules initialized successfully.");
  return { VoxelWorld, Fabricator };
};

export { VoxelWorld };
export { Fabricator };
