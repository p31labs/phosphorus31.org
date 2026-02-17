/**
 * P31 Scope — Navigation store (Posner nodes, zoom, breadcrumbs).
 * Molecular layer: which node is selected, fractal zoom level, zoom history.
 */

import { create } from 'zustand';

export type PosnerNodeId =
  | null
  | 'neural-core'
  | 'settings'
  | 'communication'
  | 'archives'
  | 'project-a'
  | 'project-b';

export type ZoomLevel = 'constellation' | 'workspace' | 'data';

export interface Breadcrumb {
  label: string;
  nodeId: PosnerNodeId;
}

interface NavigationState {
  activeNode: PosnerNodeId;
  zoomLevel: ZoomLevel;
  breadcrumbs: Breadcrumb[];
  navigateTo: (nodeId: PosnerNodeId) => void;
  zoomIn: (nodeId: PosnerNodeId) => void;
  zoomOut: () => void;
  resetView: () => void;
}

const DEFAULT_BREADCRUMB: Breadcrumb = { label: 'Home', nodeId: null };

export const useNavigationStore = create<NavigationState>((set) => ({
  activeNode: null,
  zoomLevel: 'workspace',
  breadcrumbs: [DEFAULT_BREADCRUMB],

  navigateTo: (nodeId) =>
    set((state) => {
      const label = nodeIdToLabel(nodeId);
      const newCrumb: Breadcrumb = { label, nodeId };
      const breadcrumbs = state.breadcrumbs[state.breadcrumbs.length - 1]?.nodeId === nodeId
        ? state.breadcrumbs
        : [...state.breadcrumbs, newCrumb].slice(-10);
      return { activeNode: nodeId, breadcrumbs };
    }),

  zoomIn: (nodeId) =>
    set((state) => {
      const label = nodeIdToLabel(nodeId);
      const newCrumb: Breadcrumb = { label, nodeId };
      const breadcrumbs = [...state.breadcrumbs, newCrumb].slice(-10);
      const zoomLevel: ZoomLevel =
        state.zoomLevel === 'constellation' ? 'workspace' : state.zoomLevel === 'workspace' ? 'data' : 'data';
      return { activeNode: nodeId, zoomLevel, breadcrumbs };
    }),

  zoomOut: () =>
    set((state) => {
      const zoomLevel: ZoomLevel =
        state.zoomLevel === 'data' ? 'workspace' : state.zoomLevel === 'workspace' ? 'constellation' : 'constellation';
      const breadcrumbs =
        zoomLevel === 'constellation' ? [DEFAULT_BREADCRUMB] : state.breadcrumbs.slice(0, -1);
      const activeNode = breadcrumbs[breadcrumbs.length - 1]?.nodeId ?? null;
      return { activeNode, zoomLevel, breadcrumbs };
    }),

  resetView: () =>
    set({
      activeNode: null,
      zoomLevel: 'workspace',
      breadcrumbs: [DEFAULT_BREADCRUMB],
    }),
}));

function nodeIdToLabel(nodeId: PosnerNodeId): string {
  const map: Record<NonNullable<PosnerNodeId>, string> = {
    'neural-core': 'Neural Core',
    settings: 'Settings',
    communication: 'Comm',
    archives: 'Archives',
    'project-a': 'Project A',
    'project-b': 'Project B',
  };
  return nodeId ? map[nodeId] ?? nodeId : 'Home';
}
