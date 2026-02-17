/**
 * P31 Voice Builder — parse voice (or text) commands for World Builder.
 * Commands like "add a tetrahedron", "connect 1 and 2", "clear".
 * Returns actions to apply to vertices/edges; consumer calls onCommand with result.
 */

import { useCallback } from 'react';

export type VoiceBuilderAction =
  | { type: 'addTetrahedron' }
  | { type: 'connect'; a: number; b: number }
  | { type: 'clear' }
  | { type: 'unknown'; raw: string };

const TETRAHEDRON_PATTERNS = [
  /add\s+(a\s+)?tetra(hedron)?/i,
  /tetra(hedron)?/i,
  /build\s+(a\s+)?tetra/i,
];

const CONNECT_PATTERNS = [
  /connect\s+(\d+)\s+and\s+(\d+)/i,
  /link\s+(\d+)\s+(\d+)/i,
  /(\d+)\s+to\s+(\d+)/i,
  /edge\s+(\d+)\s+(\d+)/i,
];

const CLEAR_PATTERNS = [/clear\s*(all)?/i, /reset/i, /start\s+over/i];

function parseCommand(text: string): VoiceBuilderAction {
  const trimmed = text.trim();
  if (!trimmed) return { type: 'unknown', raw: trimmed };

  for (const p of CLEAR_PATTERNS) {
    if (p.test(trimmed)) return { type: 'clear' };
  }
  for (const p of TETRAHEDRON_PATTERNS) {
    if (p.test(trimmed)) return { type: 'addTetrahedron' };
  }
  for (const p of CONNECT_PATTERNS) {
    const m = trimmed.match(p);
    if (m) {
      const a = parseInt(m[1] ?? '0', 10);
      const b = parseInt(m[2] ?? '0', 10);
      if (a >= 0 && b >= 0 && a !== b) return { type: 'connect', a, b };
    }
  }

  return { type: 'unknown', raw: trimmed };
}

/**
 * Apply a VoiceBuilderAction to current vertices/edges.
 * addTetrahedron: append 4 new vertices and 6 edges (tetrahedron).
 * connect: add edge between vertex indices a and b (1-based in speech).
 * clear: return empty.
 */
export function applyVoiceAction(
  action: VoiceBuilderAction,
  currentVertices: number[],
  currentEdges: number[]
): { vertices: number[]; edges: number[] } | null {
  if (action.type === 'clear') {
    return { vertices: [], edges: [] };
  }
  if (action.type === 'addTetrahedron') {
    const nextIndex = currentVertices.length;
    const newV = [...currentVertices, nextIndex, nextIndex + 1, nextIndex + 2, nextIndex + 3];
    // Tetrahedron edges: (0,1),(0,2),(0,3),(1,2),(1,3),(2,3) in vertex indices
    const newE = [
      ...currentEdges,
      nextIndex,
      nextIndex + 1,
      nextIndex,
      nextIndex + 2,
      nextIndex,
      nextIndex + 3,
      nextIndex + 1,
      nextIndex + 2,
      nextIndex + 1,
      nextIndex + 3,
      nextIndex + 2,
      nextIndex + 3,
    ];
    return { vertices: newV, edges: newE };
  }
  if (action.type === 'connect') {
    const a0 = Math.max(0, action.a - 1); // 1-based to 0-based
    const b0 = Math.max(0, action.b - 1);
    const maxIdx = Math.max(a0, b0);
    let newV = [...currentVertices];
    while (newV.length <= maxIdx) newV.push(newV.length);
    const newE = [...currentEdges, a0, b0];
    return { vertices: newV, edges: newE };
  }
  return null;
}

export interface UseVoiceBuilderOptions {
  onCommand: (action: VoiceBuilderAction, applied: boolean) => void;
  enabled?: boolean;
}

export function useVoiceBuilder(
  currentVertices: number[],
  currentEdges: number[],
  onCompile: (vertices: number[], edges: number[]) => void,
  options: UseVoiceBuilderOptions
) {
  const { onCommand, enabled = true } = options;

  const handleVoiceInput = useCallback(
    (text: string) => {
      if (!enabled) return;
      const action = parseCommand(text);
      onCommand(action, false);
      const result = applyVoiceAction(action, currentVertices, currentEdges);
      if (result) {
        onCompile(result.vertices, result.edges);
        onCommand(action, true);
      }
    },
    [enabled, currentVertices, currentEdges, onCompile, onCommand]
  );

  return { parseCommand, applyVoiceAction, handleVoiceInput };
}
