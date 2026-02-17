/**
 * ChimeGenerator — The Harmonic Heart.
 * Translates the geometric harmony of nearby structures into melodies.
 * Each structure's stability becomes a note; fractal dimension adds octaves.
 * Maxwell's rule decides consonance or dissonance.
 * Bob's steady rhythm, Marge's joyful surprise. A living musical tribute.
 */

export interface StructureLike {
  stability?: number;
  fractalDimension?: number;
  vertices?: number[];
  [key: string]: unknown;
}

/** Structure shape used by the class (stability, optional fractalDimension). */
interface StructureNote {
  stability?: number;
  fractalDimension?: number;
  [key: string]: unknown;
}

export class ChimeGenerator {
  private static scale = [60, 62, 64, 65, 67, 69, 71, 72]; // C major scale

  static generateMelody(structures: StructureNote[], type: 'hour' | 'structure'): number[] {
    if (structures.length === 0) {
      return type === 'hour' ? [60] : [60, 64, 67];
    }

    const notes: number[] = [];
    structures.forEach((s) => {
      const stability = Math.max(0, Math.min(1, s.stability ?? 0.5));
      const degree = Math.floor(stability * this.scale.length);
      const note = this.scale[Math.min(degree, this.scale.length - 1)];
      const octave = s.fractalDimension != null ? Math.floor(s.fractalDimension * 2) : 0;
      notes.push(note + 12 * octave);
    });

    notes.sort((a, b) => a - b);
    if (type === 'structure') {
      notes.push(...[...notes].reverse());
    }
    return notes;
  }

  /** Valid: consonant C major; invalid: spicy dissonant cluster. */
  static maxwellChord(valid: boolean): number[] {
    return valid ? [60, 64, 67] : [61, 64, 68];
  }
}

/**
 * Generate a melody based on nearby structures (backward-compatible export).
 * @param structures - list of structures with stability and optional fractal dimension
 * @param type - 'hour' or 'structure'
 * @returns array of MIDI note numbers (0–127)
 */
export function generateMelody(
  structures: StructureLike[],
  type: 'hour' | 'structure'
): number[] {
  return ChimeGenerator.generateMelody(structures, type);
}

/**
 * Musical interpretation of Maxwell's rule: valid → consonance; invalid → dissonance.
 */
export function maxwellChord(valid: boolean): number[] {
  return ChimeGenerator.maxwellChord(valid);
}
