/**
 * Colyseus room for P31 Quantum Geodesic Platform
 * Multiplayer geodesic world state: players, structures, coherence.
 */
import { Room } from 'colyseus';
import { GameState, Player, Structure } from '../schema/GameState';

export type GeodesicRoomOptions = Record<string, unknown>;

export class GeodesicRoom extends Room<GameState> {
  onCreate(_options: GeodesicRoomOptions) {
    this.setState(new GameState());

    this.onMessage(
      'playerMove',
      (
        client: { sessionId: string },
        data: {
          x: number;
          y: number;
          z: number;
          rotX: number;
          rotY: number;
          rotZ: number;
        }
      ) => {
        const player = this.state.players.get(client.sessionId);
        if (player) {
          Object.assign(player, data);
        }
      }
    );

    this.onMessage(
      'structureUpdate',
      async (
        client: { sessionId: string },
        data: { id: string; vertices: number[]; edges: number[] }
      ) => {
        let structure = this.state.structures.get(data.id);
        if (!structure) {
          structure = new Structure();
          structure.id = data.id;
          structure.ownerId = client.sessionId;
          this.state.structures.set(data.id, structure);
        }
        if (structure.ownerId !== client.sessionId) return;

        structure.vertices = data.vertices;
        structure.edges = data.edges;

        const analysis = await this.analyzeStructure(data.vertices, data.edges);
        structure.stability = analysis.stability;
        structure.maxwellValid = analysis.maxwellValid;

        this.updateGlobalCoherence();
      }
    );

    this.onMessage('requestCoherenceNudge', (client: { sessionId: string }, amount: number) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.coherence = Math.min(1, Math.max(0, player.coherence + amount));
        this.updateGlobalCoherence();
      }
    });
  }

  onJoin(client: { sessionId: string }, options?: { name?: string; role?: string }) {
    const player = new Player();
    player.name = options?.name ?? `Player_${client.sessionId.slice(0, 4)}`;
    player.role = options?.role ?? '';
    this.state.players.set(client.sessionId, player);
  }

  onLeave(_client: { sessionId: string }) {
    this.state.players.delete(_client.sessionId);
    this.updateGlobalCoherence();
  }

  private updateGlobalCoherence() {
    let total = 0;
    this.state.players.forEach((p) => (total += p.coherence));
    this.state.globalCoherence =
      this.state.players.size > 0 ? total / this.state.players.size : 1.0;
  }

  private async analyzeStructure(
    vertices: number[],
    edges: number[]
  ): Promise<{ stability: number; maxwellValid: boolean }> {
    const v = vertices.length / 3;
    const e = edges.length / 2;
    const maxwellValid = e >= 3 * v - 6;
    const stability = maxwellValid
      ? 0.8 + 0.2 * (Math.min(v, 10) / 10)
      : 0.3;
    return { stability, maxwellValid };
  }
}
