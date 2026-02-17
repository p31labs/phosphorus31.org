/**
 * Colyseus schema for geodesic_world room state.
 * Shared shape with UI useRoom (players Map, structures Map).
 */
import { Schema, type, MapSchema, ArraySchema } from '@colyseus/schema';

export class Player extends Schema {
  @type('string') name = '';
  @type('string') userId = '';
  @type('number') coherence = 0;
}

export class Structure extends Schema {
  @type('string') id = '';
  @type('string') ownerId = '';
  @type(['number']) vertices = new ArraySchema<number>();
  @type(['number']) edges = new ArraySchema<number>();
  @type('number') stability = 0;
  @type('boolean') maxwellValid = false;
}

export class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type({ map: Structure }) structures = new MapSchema<Structure>();
  @type('number') globalCoherence = 0;
}
