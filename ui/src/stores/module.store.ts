/**
 * Module Store (Stub)
 * TODO: Implement full module store functionality
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { GeodesicModule } from '@/types/module.types';

interface ModuleStore {
  installedModules: GeodesicModule[];
  enabledModuleIds: Set<string>;
  installModule: (module: GeodesicModule) => void;
  enableModule: (id: string) => void;
  disableModule: (id: string) => void;
  updateModule: (id: string, updates: Partial<GeodesicModule>) => void;
  removeModule: (id: string) => void;
}

export const useModuleStore = create<ModuleStore>()(
  devtools(
    (set) => ({
      installedModules: [],
      enabledModuleIds: new Set(),
      installModule: (module) => {
        set((state) => ({
          installedModules: [...state.installedModules, module],
        }));
      },
      enableModule: (id) => {
        set((state) => ({
          enabledModuleIds: new Set([...state.enabledModuleIds, id]),
        }));
      },
      disableModule: (id) => {
        set((state) => {
          const newSet = new Set(state.enabledModuleIds);
          newSet.delete(id);
          return { enabledModuleIds: newSet };
        });
      },
      updateModule: (id, updates) => {
        set((state) => ({
          installedModules: state.installedModules.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        }));
      },
      removeModule: (id) => {
        set((state) => ({
          installedModules: state.installedModules.filter((m) => m.id !== id),
          enabledModuleIds: (() => {
            const newSet = new Set(state.enabledModuleIds);
            newSet.delete(id);
            return newSet;
          })(),
        }));
      },
    }),
    { name: 'ModuleStore' }
  )
);
