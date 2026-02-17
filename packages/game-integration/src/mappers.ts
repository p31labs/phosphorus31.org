/**
 * P31 Game Integration — Molecule → Structure, Molecule → Player, Dome → Colyseus
 * The dome IS Structure[0]. The molecule IS the player in the mesh.
 */

import type { P31Molecule, StructureMesh, MeshPlayer } from './types/molecule';

/** Tetrahedron connection points (6 edges) — placeholder for snap system */
function generateTetrahedronConnections(): Array<{ id: string; type: string; position: { x: number; y: number; z: number }; normal: { x: number; y: number; z: number }; isOccupied: boolean }> {
  const r = Math.sqrt(6) / 4;
  return [
    { id: 'cp_0', type: 'edge', position: { x: r, y: 0, z: 0 }, normal: { x: 1, y: 0, z: 0 }, isOccupied: false },
    { id: 'cp_1', type: 'edge', position: { x: -r / 2, y: r, z: 0 }, normal: { x: -0.5, y: 1, z: 0 }, isOccupied: false },
    { id: 'cp_2', type: 'edge', position: { x: -r / 2, y: -r / 2, z: r }, normal: { x: -0.5, y: -0.5, z: 1 }, isOccupied: false },
    { id: 'cp_3', type: 'edge', position: { x: -r / 2, y: -r / 2, z: -r }, normal: { x: -0.5, y: -0.5, z: -1 }, isOccupied: false },
    { id: 'cp_4', type: 'vertex', position: { x: 0, y: 0, z: 0 }, normal: { x: 0, y: 1, z: 0 }, isOccupied: false },
    { id: 'cp_5', type: 'vertex', position: { x: 0, y: 0, z: 0 }, normal: { x: 0, y: 0, z: 1 }, isOccupied: false },
  ];
}

/** Dome → game engine Structure (minimal, no THREE). Structure[0] = single tetrahedron. */
export function domeToStructure(molecule: P31Molecule): StructureMesh {
  return {
    id: 'dome_' + molecule.fingerprint,
    name: molecule.dome.name,
    createdBy: molecule.fingerprint,
    createdAt: new Date(molecule.created).getTime(),
    primitives: [
      {
        id: 'genesis_tetra',
        type: 'tetrahedron',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 1,
        color: molecule.dome.color,
        material: 'quantum',
        connectedTo: [],
        connectionPoints: generateTetrahedronConnections(),
        quantumState: {
          coherence: molecule.player.coherence,
          entanglement: [],
          phase: 0,
        },
      },
    ],
    vertices: 4,
    edges: 6,
    isRigid: true,
    stabilityScore: 100,
    maxLoadBeforeFailure: 600,
  };
}

/** Molecule → Colyseus Player (mesh lobby) */
export function moleculeToPlayer(mol: P31Molecule): MeshPlayer {
  return {
    x: 0,
    y: 0,
    z: 0,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    coherence: mol.player.coherence,
    name: mol.dome.name,
    role: mol.player.tier,
  };
}

/** Colyseus GameState Structure shape (flattened vertices/edges for schema) */
export interface ColyseusStructurePayload {
  id: string;
  ownerId: string;
  stability: number;
  maxwellValid: boolean;
  vertices: number[];
  edges: number[];
}

/** Dome structure → Colyseus schema payload (flattened arrays for Schema) */
export function domeToColyseusStructure(mol: P31Molecule): ColyseusStructurePayload {
  const s = domeToStructure(mol);
  const vertices: number[] = [];
  for (const p of s.primitives) {
    vertices.push(p.position.x, p.position.y, p.position.z);
  }
  const edges: number[] = [0, 1, 0, 2, 0, 3, 1, 2, 1, 3, 2, 3];
  return {
    id: s.id,
    ownerId: mol.fingerprint,
    stability: s.stabilityScore,
    maxwellValid: s.isRigid,
    vertices,
    edges,
  };
}
