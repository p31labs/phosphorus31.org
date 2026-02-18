/**
 * Game state schema for P31 Quantum Geodesic Platform (server copy).
 * Canonical source: shared/schema/GameState.ts — sync any schema change there first, then here.
 */
import { Schema, type, MapSchema } from '@colyseus/schema';

export class Player extends Schema {
  @type('number') x: number = 0;
  @type('number') y: number = 0;
  @type('number') z: number = 0;
  @type('number') rotX: number = 0;
  @type('number') rotY: number = 0;
  @type('number') rotZ: number = 0;
  @type('number') coherence: number = 1.0;
  @type('string') name: string = '';
  @type('string') role: string = '';
}

export class Structure extends Schema {
  @type('string') id: string = '';
  @type('string') ownerId: string = '';
  @type('number') stability: number = 0;
  @type('boolean') maxwellValid: boolean = false;
  @type(['number']) vertices: number[] = [];
  @type(['number']) edges: number[] = [];
}

export class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type({ map: Structure }) structures = new MapSchema<Structure>();
  @type('number') serverTime: number = 0;
  @type('number') globalCoherence: number = 1.0;
}
