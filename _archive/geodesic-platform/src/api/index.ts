/**
 * REST API: auth, worlds, structures, marketplace, portals.
 */
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sql } from 'kysely';
import type { Kysely } from 'kysely';
import type { Database } from '../db/index.js';
import { createAuthMiddleware } from '../middleware/auth.js';
import { analyzeStructureJS } from '../utils/geodesicAnalysis.js';

export function createApi(db: Kysely<Database>) {
  const app = express();
  app.use(cors());
  app.use(express.json());
  const authenticate = createAuthMiddleware(db);
  const JWT_SECRET = process.env.JWT_SECRET ?? 'change-me';

  app.post('/api/auth/register', async (req, res) => {
    const { email, username, password } = req.body as { email?: string; username?: string; password?: string };
    if (!email || !username || !password) {
      res.status(400).json({ error: 'email, username, password required' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await db
        .insertInto('users')
        .values({
          email,
          username,
          password_hash: hashedPassword,
          coherence_balance: 1000,
        })
        .returning(['id', 'email', 'username', 'coherence_balance'])
        .executeTakeFirst();
      if (!user) {
        res.status(500).json({ error: 'Insert failed' });
        return;
      }
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      res.json({ user, token });
    } catch {
      res.status(400).json({ error: 'User already exists' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      res.status(400).json({ error: 'email, password required' });
      return;
    }
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    await db.updateTable('users').set({ last_login: new Date() }).where('id', '=', user.id).execute();
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    const { password_hash: _, ...rest } = user;
    res.json({ user: rest, token });
  });

  app.get('/api/worlds', async (_req, res) => {
    const worlds = await db
      .selectFrom('worlds')
      .innerJoin('users', 'worlds.owner_id', 'users.id')
      .select([
        'worlds.id',
        'worlds.name',
        'worlds.description',
        'worlds.visibility',
        'worlds.coherence_value',
        'worlds.visitor_count',
        'worlds.created_at',
        'users.username as owner_name',
      ])
      .where('worlds.visibility', '=', 'public')
      .orderBy('worlds.visitor_count', 'desc')
      .limit(50)
      .execute();
    res.json(worlds);
  });

  app.get('/api/worlds/:id', async (req, res) => {
    const row = await db
      .selectFrom('worlds')
      .innerJoin('users', 'worlds.owner_id', 'users.id')
      .select([
        'worlds.id',
        'worlds.name',
        'worlds.description',
        'worlds.visibility',
        'worlds.structures',
        'worlds.settings',
        'worlds.coherence_value',
        'worlds.visitor_count',
        'worlds.created_at',
        'users.username as owner_name',
        'users.id as owner_id',
      ])
      .where('worlds.id', '=', req.params.id!)
      .executeTakeFirst();
    if (!row) {
      res.status(404).json({ error: 'World not found' });
      return;
    }
    await db
      .updateTable('worlds')
      .set({ visitor_count: sql`visitor_count + 1` })
      .where('id', '=', req.params.id!)
      .execute();
    res.json(row);
  });

  app.post('/api/worlds', authenticate, async (req, res) => {
    const { name, description, visibility = 'public' } = req.body as { name?: string; description?: string; visibility?: string };
    if (!req.user || !name) {
      res.status(400).json({ error: 'name required' });
      return;
    }
    const world = await db
      .insertInto('worlds')
      .values({
        owner_id: req.user.id,
        name,
        description: description ?? null,
        visibility: visibility ?? 'public',
        structures: {},
        settings: {},
        coherence_value: 100,
      })
      .returning(['id', 'name', 'created_at'])
      .executeTakeFirst();
    if (!world) {
      res.status(500).json({ error: 'Insert failed' });
      return;
    }
    res.json(world);
  });

  app.post('/api/structures/analyze', authenticate, async (req, res) => {
    const { vertices, edges } = req.body as { vertices?: number[]; edges?: number[] };
    if (!vertices || !edges) {
      res.status(400).json({ error: 'vertices, edges required' });
      return;
    }
    const analysis = analyzeStructureJS(vertices, edges);
    res.json(analysis);
  });

  app.post('/api/structures', authenticate, async (req, res) => {
    const { world_id, name, vertices, edges } = req.body as { world_id?: string; name?: string; vertices?: number[]; edges?: number[] };
    if (!req.user || !world_id || !vertices || !edges) {
      res.status(400).json({ error: 'world_id, vertices, edges required' });
      return;
    }
    const analysis = analyzeStructureJS(vertices, edges);
    const bonus = Math.floor((analysis.coherenceBonus ?? 0) * 100);
    const structure = await db
      .insertInto('structures')
      .values({
        world_id,
        owner_id: req.user.id,
        name: name ?? null,
        vertices: JSON.stringify(vertices),
        edges: JSON.stringify(edges),
        analysis_result: JSON.stringify(analysis),
        stability: analysis.stability,
        coherence_bonus: analysis.coherenceBonus ?? 0,
      })
      .returning('id')
      .executeTakeFirst();
    if (!structure) {
      res.status(500).json({ error: 'Insert failed' });
      return;
    }
    await db
      .updateTable('worlds')
      .set({
        coherence_value: sql`coherence_value + ${bonus}`,
        updated_at: new Date(),
      })
      .where('id', '=', world_id)
      .execute();
    if (bonus > 0) {
      await db
        .updateTable('users')
        .set({ coherence_balance: sql`coherence_balance + ${bonus}` })
        .where('id', '=', req.user.id)
        .execute();
    }
    res.json({ id: structure.id, analysis });
  });

  app.get('/api/marketplace', async (_req, res) => {
    const assets = await db
      .selectFrom('assets')
      .innerJoin('users', 'assets.owner_id', 'users.id')
      .select([
        'assets.id',
        'assets.name',
        'assets.description',
        'assets.price',
        'assets.thumbnail_url',
        'assets.download_count',
        'assets.created_at',
        'users.username as creator',
      ])
      .where('assets.listed', '=', true)
      .orderBy('assets.created_at', 'desc')
      .limit(50)
      .execute();
    res.json(assets);
  });

  app.post('/api/marketplace/buy', authenticate, async (req, res) => {
    const { assetId } = req.body as { assetId?: string };
    if (!req.user || !assetId) {
      res.status(400).json({ error: 'assetId required' });
      return;
    }
    try {
      await db.transaction().execute(async (trx) => {
        const asset = await trx.selectFrom('assets').selectAll().where('id', '=', assetId).forUpdate().executeTakeFirst();
        if (!asset) throw new Error('Asset not found');
        const buyer = await trx.selectFrom('users').select('coherence_balance').where('id', '=', req.user!.id).forUpdate().executeTakeFirst();
        if (!buyer || buyer.coherence_balance < asset.price) throw new Error('Insufficient funds');
        await trx.updateTable('users').set({ coherence_balance: sql`coherence_balance - ${asset.price}` }).where('id', '=', req.user!.id).execute();
        await trx.updateTable('users').set({ coherence_balance: sql`coherence_balance + ${asset.price}` }).where('id', '=', asset.owner_id).execute();
        await trx
          .insertInto('transactions')
          .values({ from_user: req.user!.id, to_user: asset.owner_id, asset_id: assetId, amount: asset.price, type: 'purchase' })
          .execute();
        await trx.updateTable('assets').set({ download_count: sql`download_count + 1` }).where('id', '=', assetId).execute();
      });
      res.json({ success: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Purchase failed';
      res.status(400).json({ error: msg });
    }
  });

  app.post('/api/portals', authenticate, async (req, res) => {
    const { source_world_id, target_world_id, source_position, target_position } = req.body as {
      source_world_id?: string;
      target_world_id?: string;
      source_position?: number[];
      target_position?: number[];
    };
    if (!req.user || !source_world_id || !target_world_id) {
      res.status(400).json({ error: 'source_world_id, target_world_id required' });
      return;
    }
    const portal = await db
      .insertInto('portals')
      .values({
        source_world_id,
        target_world_id,
        source_position: JSON.stringify(source_position ?? [0, 0, 0]),
        target_position: JSON.stringify(target_position ?? [0, 0, 0]),
        owner_id: req.user.id,
        coherence_cost: 50,
      })
      .returning(['id', 'coherence_cost'])
      .executeTakeFirst();
    if (!portal) {
      res.status(500).json({ error: 'Insert failed' });
      return;
    }
    res.json({ id: portal.id, cost: portal.coherence_cost });
  });

  return app;
}
