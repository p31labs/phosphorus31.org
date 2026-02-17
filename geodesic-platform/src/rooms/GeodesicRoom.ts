/**
 * GeodesicRoom — Colyseus room for geodesic_world.
 * Redis persistence, structure updates, optional DB restore.
 */
import { Room, Client } from 'colyseus';
import { GameState, Player, Structure } from '../schema/GameState.js';
import { analyzeStructureJS } from '../utils/geodesicAnalysis.js';
import type { Kysely } from 'kysely';
import type { Database } from '../db/index.js';

export interface GeodesicRoomOptions {
  worldId?: string;
}

export class GeodesicRoom extends Room<GameState> {
  static db: Kysely<Database> | null = null;
  maxClients = 16;
  autoDispose = true;

  async onCreate(options: GeodesicRoomOptions = {}) {
    this.setState(new GameState());
    this.metadata = { worldId: options?.worldId };

    // Optional: load existing world from database when db is connected
    const worldId = options?.worldId;
    if (worldId && GeodesicRoom.db) {
      try {
        const saved = await GeodesicRoom.db
          .selectFrom('worlds')
          .selectAll()
          .where('id', '=', worldId)
          .executeTakeFirst();
        if (saved?.structures && typeof saved.structures === 'object') {
          const entries = Object.entries(saved.structures as Record<string, { id: string; ownerId: string; vertices: number[]; edges: number[]; stability?: number; maxwellValid?: boolean }>);
          for (const [k, v] of entries) {
            const s = new Structure();
            s.id = v.id ?? k;
            s.ownerId = v.ownerId ?? '';
            s.vertices.splice(0, s.vertices.length, ...(v.vertices ?? []));
            s.edges.splice(0, s.edges.length, ...(v.edges ?? []));
            s.stability = v.stability ?? 0.5;
            s.maxwellValid = v.maxwellValid ?? false;
            this.state.structures.set(k, s);
          }
          this.metadata.worldId = worldId;
          this.metadata.restored = true;
        }
      } catch {
        // DB not configured or table missing
      }
    }

    this.onMessage('structureUpdate', async (client: Client, data: { id: string; vertices: number[]; edges: number[] }) => {
      let structure = this.state.structures.get(data.id);
      if (!structure) {
        structure = new Structure();
        structure.id = data.id;
        structure.ownerId = client.sessionId;
        this.state.structures.set(data.id, structure);
      }
      if (structure.ownerId !== client.sessionId) return;

      const vert = data.vertices ?? [];
      const edge = data.edges ?? [];
      structure.vertices.splice(0, structure.vertices.length, ...vert);
      structure.edges.splice(0, structure.edges.length, ...edge);

      const analysis = analyzeStructureJS(data.vertices, data.edges);
      structure.stability = analysis.stability;
      structure.maxwellValid = analysis.maxwellValid;

      this.persistWorld().catch((err) => console.error('persistWorld:', err));
    });
  }

  onJoin(client: Client, options?: { userId?: string; name?: string }) {
    const player = new Player();
    player.name = options?.name ?? `Player_${client.sessionId.slice(0, 4)}`;
    player.userId = options?.userId ?? '';
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);
    if (this.state.players.size === 0) {
      this.persistWorld().catch((err) => console.error('persistWorld:', err));
    }
  }

  private async persistWorld() {
    const worldId = (this.metadata as { worldId?: string }).worldId;
    if (!worldId) return;
    const worldData = {
      structures: Object.fromEntries(
        Array.from(this.state.structures.entries()).map(([k, v]) => [
          k,
          {
            id: v.id,
            ownerId: v.ownerId,
            vertices: Array.from(v.vertices),
            edges: Array.from(v.edges),
            stability: v.stability,
            maxwellValid: v.maxwellValid,
          },
        ])
      ),
      updated_at: new Date(),
    };
    if (GeodesicRoom.db) {
      GeodesicRoom.db
        .updateTable('worlds')
        .set(worldData)
        .where('id', '=', worldId)
        .execute()
        .catch((err: Error) => console.error('DB persistence:', err));
    }
  }
}
