/**
 * P31 Game Integration — Genesis challenge, seed challenges, L.O.V.E. genesis, access levels
 * Challenge #0 = the conversation. Covenant = values-gate. Dome = Structure[0].
 */

import type { ChallengeDef } from './types/molecule';

export const GENESIS_CHALLENGE: ChallengeDef = {
  id: 'genesis_resonance',
  tier: 'seedling',
  title: 'The Resonance',
  description: 'Speak with the phosphorus. Find coherence.',
  objectives: [
    { type: 'custom', description: 'Reach CALCIUM level (0.4+ coherence)', target: 0.4, unit: 'coherence' },
    { type: 'custom', description: 'Reach BONDED level (0.65+ coherence)', target: 0.65, unit: 'coherence' },
    { type: 'custom', description: 'Reach POSNER level (0.85+ coherence)', target: 0.85, unit: 'coherence' },
  ],
  rewardLove: 25.0,
  rewardBadge: 'first_resonance',
  timeLimit: undefined,
  coopRequired: false,
  coopBonus: 0,
  prerequisites: [],
  fullerPrinciple: 'Unity is plural and at minimum two.',
  realWorldExample: 'Every relationship begins with a conversation. Every molecule begins with a bond.',
};

export const SEED_CHALLENGES: ChallengeDef[] = [
  {
    id: 'first_tetrahedron',
    tier: 'seedling',
    title: 'The Minimum System',
    description: 'Build a single tetrahedron. Four vertices, six edges, four faces. The simplest rigid structure in the universe.',
    objectives: [
      { type: 'build', description: 'Place a tetrahedron', target: 1, unit: 'pieces' },
      { type: 'stability', description: 'Achieve 100% stability', target: 100, unit: 'score' },
    ],
    rewardLove: 5.0,
    rewardBadge: 'minimum_system',
    coopRequired: false,
    coopBonus: 0,
    prerequisites: [],
    fullerPrinciple: 'Unity is plural and at minimum two. The tetrahedron is the minimum system.',
    realWorldExample: 'Every stable molecule, every bridge truss, every family — built on triangles.',
  },
  {
    id: 'double_bond',
    tier: 'sprout',
    title: 'The Double Bond',
    description: 'Connect two tetrahedra edge-to-edge. Create your first compound structure.',
    objectives: [
      { type: 'build', description: 'Place 2 tetrahedra', target: 2, unit: 'pieces' },
      { type: 'stability', description: 'Maintain 80%+ stability', target: 80, unit: 'score' },
    ],
    rewardLove: 10.0,
    rewardBadge: 'double_bond',
    coopRequired: false,
    coopBonus: 5.0,
    prerequisites: ['first_tetrahedron'],
    fullerPrinciple: 'Tension and compression are complementary. You cannot have one without the other.',
    realWorldExample: 'Carbon-carbon bonds form the backbone of life. Two triangles form an octet truss.',
  },
  {
    id: 'the_octet_truss',
    tier: 'sapling',
    title: 'The Octet Truss',
    description: 'Build an alternating pattern of tetrahedra and octahedra. Fuller called this the isotropic vector matrix.',
    objectives: [
      { type: 'build', description: 'Place 4+ primitives', target: 4, unit: 'pieces' },
      { type: 'stability', description: 'Achieve 90%+ stability', target: 90, unit: 'score' },
      { type: 'efficiency', description: 'Maxwell ratio ≥ 1.2', target: 1.2, unit: 'ratio' },
    ],
    rewardLove: 25.0,
    rewardBadge: 'octet_truss',
    coopRequired: false,
    coopBonus: 10.0,
    prerequisites: ['double_bond'],
    fullerPrinciple: "Nature always uses the most economical solutions. The octet truss is nature's answer to infinite strength with minimum material.",
    realWorldExample: 'Alexander Graham Bell built towers with this geometry. It\'s in every crystal lattice.',
  },
  {
    id: 'posner_cluster',
    tier: 'oak',
    title: 'The Posner Cluster',
    description: 'Build a Posner molecule: 9 calcium atoms forming a distorted cube around 6 phosphorus atoms. The biological qubit.',
    objectives: [
      { type: 'build', description: 'Place 15 atoms (9 Ca + 6 P)', target: 15, unit: 'pieces' },
      { type: 'stability', description: 'Achieve 85%+ stability', target: 85, unit: 'score' },
    ],
    rewardLove: 50.0,
    rewardBadge: 'posner_master',
    coopRequired: false,
    coopBonus: 25.0,
    prerequisites: ['the_octet_truss'],
    fullerPrinciple: 'Universe is technology. Phosphorus-31 stores quantum information in your bones for 36 hours.',
    realWorldExample: 'Matthew Fisher (2015) proposed that Posner molecules enable quantum cognition. Your skeleton may be a quantum computer.',
  },
  {
    id: 'dome_connect',
    tier: 'oak',
    title: 'The Entanglement',
    description: "Connect your dome to another molecule's dome. Create a bond between two builders.",
    objectives: [
      { type: 'custom', description: 'Connect to another dome', target: 1, unit: 'connection' },
    ],
    rewardLove: 15.0,
    rewardBadge: 'entangled',
    coopRequired: true,
    coopBonus: 15.0,
    prerequisites: ['first_tetrahedron'],
    fullerPrinciple: 'Synergy: the behavior of whole systems unpredicted by the behavior of their parts taken separately.',
    realWorldExample: "Two atoms sharing an electron become a molecule. Two people sharing values become a family.",
  },
  {
    id: 'geodesic_dome',
    tier: 'sequoia',
    title: 'The Geodesic Dome',
    description: 'Build a frequency-2 geodesic dome. 42 struts, 26 vertices, enclosing maximum volume with minimum material.',
    objectives: [
      { type: 'build', description: 'Place 42+ struts', target: 42, unit: 'pieces' },
      { type: 'stability', description: 'Achieve 95%+ stability', target: 95, unit: 'score' },
      { type: 'efficiency', description: 'Maxwell ratio ≥ 1.5', target: 1.5, unit: 'ratio' },
    ],
    rewardLove: 100.0,
    rewardBadge: 'geodesic_master',
    coopRequired: false,
    coopBonus: 50.0,
    prerequisites: ['posner_cluster'],
    fullerPrinciple: 'Doing more with less. The geodesic dome encloses the most volume per unit of material of any known structure.',
    realWorldExample: "Buckminster Fuller's US Pavilion at Expo 67. The Epcot sphere. Fullerene (C60) molecules.",
  },
];

export const GENESIS_TRANSACTIONS = [
  { type: 'MILESTONE_REACHED', love: 25.0, desc: 'First Resonance — spoke with the phosphorus' },
  { type: 'TETRAHEDRON_BOND', love: 15.0, desc: 'Delta Covenant signed — values verified' },
  { type: 'ARTIFACT_CREATED', love: 10.0, desc: 'Dome formed — first structure in the mesh' },
] as const;

export const GENESIS_LOVE_TOTAL = 50.0;
export const GENESIS_SOVEREIGNTY = 25.0;
export const GENESIS_PERFORMANCE = 25.0;

/** Values-gate: access level from conversation + covenant + dome + bonds */
export type AccessLevel = 'observer' | 'resonant' | 'covenanted' | 'builder' | 'bonded';

export const ACCESS_PERMISSIONS: Record<AccessLevel, string[]> = {
  observer: ['view_mesh', 'view_structures'],
  resonant: ['view_mesh', 'view_structures', 'view_scope'],
  covenanted: ['view_mesh', 'view_structures', 'view_scope', 'create_wallet', 'sign_transactions'],
  builder: [
    'view_mesh', 'view_structures', 'view_scope', 'create_wallet', 'sign_transactions',
    'build_structures', 'complete_challenges', 'earn_love', 'view_fold',
  ],
  bonded: [
    'view_mesh', 'view_structures', 'view_scope', 'create_wallet', 'sign_transactions',
    'build_structures', 'complete_challenges', 'earn_love', 'view_fold',
    'connect_domes', 'share_coherence', 'co_op_challenges', 'vote',
  ],
};
