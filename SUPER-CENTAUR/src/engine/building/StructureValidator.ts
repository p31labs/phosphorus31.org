/**
 * Structure Validator - Maxwell's rigidity criterion
 * E >= 3V - 6  →  ratio = E / (3V - 6), >= 1.0 means rigid
 */

import { Structure, ValidationResult, GEOMETRY_CONSTANTS } from '../types/game';
import SnapSystem from './SnapSystem';

export class StructureValidator {
  validate(structure: Structure): ValidationResult {
    const V = structure.vertices || this.countVertices(structure);
    const E = structure.edges || this.countEdges(structure);

    const denominator = Math.max(1, 3 * V - 6);
    const maxwellRatio = E / denominator;
    const isRigid = maxwellRatio >= 1.0;
    const stabilityScore = Math.min(100, Math.round(maxwellRatio * 100));
    const loadCapacity = Math.round(stabilityScore * (E / Math.max(1, V)));

    const errors: string[] = [];
    const warnings: string[] = [];

    if (structure.primitives.length === 0) {
      errors.push('Structure has no primitives');
    }
    if (!isRigid) {
      warnings.push(`Maxwell ratio ${maxwellRatio.toFixed(2)} < 1.0 — structure is not rigid`);
    }
    if (stabilityScore < 70) {
      warnings.push('Stability below recommended threshold (70)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      maxwellRatio: Math.round(maxwellRatio * 100) / 100,
      stabilityScore,
      loadCapacity,
    };
  }

  private countVertices(structure: Structure): number {
    let total = 0;
    for (const p of structure.primitives) {
      const geo = GEOMETRY_CONSTANTS[p.type as keyof typeof GEOMETRY_CONSTANTS];
      if (geo) total += geo.vertices;
    }
    return total;
  }

  private countEdges(structure: Structure): number {
    // Count actual connections between pieces
    let total = 0;
    const countedConnections = new Set<string>();
    
    for (const p of structure.primitives) {
      for (const connectedId of p.connectedTo) {
        // Create a unique key for this connection to avoid double counting
        const key = [p.id, connectedId].sort().join('-');
        if (!countedConnections.has(key)) {
          countedConnections.add(key);
          total++;
        }
      }
    }
    
    // If no connections found, fall back to geometric edge count
    if (total === 0) {
      for (const p of structure.primitives) {
        const geo = GEOMETRY_CONSTANTS[p.type as keyof typeof GEOMETRY_CONSTANTS];
        if (geo) total += geo.edges;
      }
      total = Math.floor(total / 2); // Divide by 2 since edges are shared
    }
    
    return total;
  }
}

export default StructureValidator;
