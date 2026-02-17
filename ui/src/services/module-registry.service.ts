/**
 * Module Registry Service (Stub)
 * TODO: Implement module registry functionality
 */

import type { ModuleMetadata } from '@/types/module.types';

export const moduleRegistry = {
  async getModules(): Promise<ModuleMetadata[]> {
    return [];
  },
  async getModule(_id: string): Promise<ModuleMetadata | null> {
    return null;
  },
  async uploadModule(_module: ModuleMetadata): Promise<void> {
    // Stub
  },
};
