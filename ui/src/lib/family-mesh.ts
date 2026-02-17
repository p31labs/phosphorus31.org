/**
 * Family Mesh (Stub)
 * TODO: Implement family mesh functionality
 */

export interface FamilyMeshNode {
  id: string;
  name: string;
  status: 'online' | 'offline';
}

export const familyMesh = {
  nodes: [] as FamilyMeshNode[],
  connect: () => {},
  disconnect: () => {},
  sendMessage: () => {},
};

export function useFamilyMesh() {
  return familyMesh;
}
