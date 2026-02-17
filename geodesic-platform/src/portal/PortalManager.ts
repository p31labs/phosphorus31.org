/**
 * Portal manager — create, use, list portals; coherence cost and persistence.
 */
import { sql } from 'kysely';
import type { Kysely } from 'kysely';
import type { Database } from '../db/index.js';

export interface PortalRecord {
  id: string;
  sourceWorldId: string;
  targetWorldId: string;
  sourcePosition: [number, number, number];
  targetPosition: [number, number, number];
  ownerId: string;
  isActive: boolean;
  coherenceCost: number;
}

export class PortalManager {
  constructor(private db: Kysely<Database>) {}

  async getPortalsInWorld(worldId: string): Promise<PortalRecord[]> {
    const rows = await this.db
      .selectFrom('portals')
      .selectAll()
      .where('is_active', '=', true)
      .where((eb) =>
        eb.or([eb('source_world_id', '=', worldId), eb('target_world_id', '=', worldId)])
      )
      .execute();
    return rows.map((r) => ({
      id: r.id,
      sourceWorldId: r.source_world_id,
      targetWorldId: r.target_world_id,
      sourcePosition: (r.source_position as [number, number, number]) ?? [0, 0, 0],
      targetPosition: (r.target_position as [number, number, number]) ?? [0, 0, 0],
      ownerId: r.owner_id,
      isActive: r.is_active,
      coherenceCost: r.coherence_cost,
    }));
  }

  async usePortal(
    portalId: string,
    userId: string,
    fromWorldId: string
  ): Promise<{ success: boolean; targetWorldId?: string; targetPosition?: [number, number, number] }> {
    const portal = await this.db
      .selectFrom('portals')
      .selectAll()
      .where('id', '=', portalId)
      .where('is_active', '=', true)
      .executeTakeFirst();
    if (!portal) return { success: false };
    if (fromWorldId !== portal.source_world_id && fromWorldId !== portal.target_world_id) {
      return { success: false };
    }
    const user = await this.db
      .selectFrom('users')
      .select('coherence_balance')
      .where('id', '=', userId)
      .executeTakeFirst();
    if (!user || user.coherence_balance < portal.coherence_cost) {
      return { success: false };
    }
    const targetWorldId =
      fromWorldId === portal.source_world_id ? portal.target_world_id : portal.source_world_id;
    const targetPosition =
      fromWorldId === portal.source_world_id
        ? (portal.target_position as [number, number, number])
        : (portal.source_position as [number, number, number]);
    await this.db
      .updateTable('users')
      .set({ coherence_balance: sql`coherence_balance - ${portal.coherence_cost}` })
      .where('id', '=', userId)
      .execute();
    await this.db
      .updateTable('portals')
      .set({ is_active: portal.is_active })
      .where('id', '=', portalId)
      .execute();
    return { success: true, targetWorldId, targetPosition: targetPosition ?? [0, 0, 0] };
  }
}
