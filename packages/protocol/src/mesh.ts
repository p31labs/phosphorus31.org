/**
 * @p31/protocol — tetrahedron mesh node and vertex identifiers.
 * UPPERCASE = hardware/origin; lowercase = human nodes (per P31 naming).
 */

export const NODE_IDS = [
  'NODE_ZERO',  // The Operator (origin)
  'node_one',   // Bash (founding node #1)
  'node_two',   // Willow (founding node #2)
  'NODE_ONE',   // ESP32-S3 hardware
  'NODE_TWO',   // Future hardware
] as const;

export type NodeId = (typeof NODE_IDS)[number];

export const VERTEX_IDS = ['A', 'B', 'C', 'D'] as const;
export type VertexId = (typeof VERTEX_IDS)[number];

/** Map vertex to role (Compass, Hearth, Greenhouse, Studio, Sync). */
export const VERTEX_ROLES: Record<VertexId, string> = {
  A: 'Compass',
  B: 'Hearth',
  C: 'Greenhouse',
  D: 'Studio',
};
