/**
 * P31 language AST and compilation result types.
 */
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface FamilyMember {
  id: string;
  role: string;
  color?: string;
  position?: Vector3;
}

export interface Family {
  id: string;
  members: FamilyMember[];
}

export interface Structure {
  id: string;
  type: 'custom' | 'sierpinski' | 'lsystem';
  vertices: number[];
  edges: number[];
  depth?: number;
}

export interface LSystemParams {
  axiom?: string;
  rules?: Record<string, string>;
  angle?: number;
  iterations?: number;
}

export interface CompilationResult {
  vertices: number[];
  edges: number[];
  families: Family[];
  structures: Structure[];
}
