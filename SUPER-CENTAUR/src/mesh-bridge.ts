/**
 * P31 Tandem ↔ mesh bridge (CWP-30).
 * In production (`NODE_ENV === 'production'`), registers proxy routes to Cloudflare Workers.
 * In development, returns without registering routes so local SUPER-CENTAUR handlers stay in effect.
 *
 * Optional env overrides (same paths, different hosts):
 *   MESH_AGENT_HUB, MESH_CAGE, MESH_PERSONAL, MESH_HUBS, MESH_BOUNCER, MESH_CHAMBER, MESH_BUFFER_API
 */

import type { Application, Request, Response } from 'express';
import { Logger } from './utils/logger';

const logger = new Logger('mesh-bridge');

const DEFAULT_MESH = {
  agentHub: 'https://p31-agent-hub.trimtab-signal.workers.dev',
  cage: 'https://k4-cage.trimtab-signal.workers.dev',
  personal: 'https://k4-personal.trimtab-signal.workers.dev',
  hubs: 'https://k4-hubs.trimtab-signal.workers.dev',
  bouncer: 'https://p31-bouncer.trimtab-signal.workers.dev',
  chamber: 'https://reflective-chamber.trimtab-signal.workers.dev',
  bufferApi: 'https://p31-buffer-api.trimtab-signal.workers.dev',
} as const;

type MeshTarget = keyof typeof DEFAULT_MESH;

function meshUrls(): typeof DEFAULT_MESH {
  return {
    agentHub: process.env.MESH_AGENT_HUB || DEFAULT_MESH.agentHub,
    cage: process.env.MESH_CAGE || DEFAULT_MESH.cage,
    personal: process.env.MESH_PERSONAL || DEFAULT_MESH.personal,
    hubs: process.env.MESH_HUBS || DEFAULT_MESH.hubs,
    bouncer: process.env.MESH_BOUNCER || DEFAULT_MESH.bouncer,
    chamber: process.env.MESH_CHAMBER || DEFAULT_MESH.chamber,
    bufferApi: process.env.MESH_BUFFER_API || DEFAULT_MESH.bufferApi,
  };
}

async function proxyFetch(
  base: string,
  path: string,
  init: RequestInit,
): Promise<{ status: number; contentType: string; body: ArrayBuffer }> {
  const url = `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  logger.info(`${init.method || 'GET'} ${url}`);
  const start = Date.now();
  const resp = await fetch(url, { ...init, signal: AbortSignal.timeout(25_000) }).catch((err: Error) => {
    logger.error(`${url}: ${err.message}`);
    throw err;
  });
  const body = await resp.arrayBuffer();
  const contentType = resp.headers.get('content-type') || 'application/json';
  logger.info(`← ${resp.status} (${Date.now() - start}ms)`);
  return { status: resp.status, contentType, body };
}

function sendBuffer(res: Response, result: { status: number; contentType: string; body: ArrayBuffer }) {
  res.status(result.status);
  res.setHeader('Content-Type', result.contentType);
  return res.send(Buffer.from(result.body));
}

/**
 * Register mesh proxy routes. Call early in route setup so production proxies win over legacy paths.
 */
export function meshProxy(app: Application): void {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    logger.info('Mesh bridge: development — proxy routes not registered (local handlers)');
    return;
  }

  const MESH = meshUrls();
  logger.info('Mesh bridge: production — proxy routes active');

  const postJson = (target: MeshTarget, path: string) => async (req: Request, res: Response) => {
    try {
      const r = await proxyFetch(MESH[target], path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body ?? {}),
      });
      return sendBuffer(res, r);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'mesh_unreachable';
      res.status(502).json({ error: 'mesh_unreachable', message });
    }
  };

  const getPath = (target: MeshTarget, path: string) => async (_req: Request, res: Response) => {
    try {
      const r = await proxyFetch(MESH[target], path, { method: 'GET' });
      return sendBuffer(res, r);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'mesh_unreachable';
      res.status(502).json({ error: 'mesh_unreachable', message });
    }
  };

  // Auth
  app.post('/api/auth/login', postJson('bouncer', '/auth'));
  app.post('/api/auth/verify', postJson('bouncer', '/verify'));

  // Chat
  app.post('/api/chat', postJson('agentHub', '/api/chat'));
  app.post('/api/chat/clear', postJson('agentHub', '/api/clear'));

  // Spoons / energy (mesh naming)
  app.get('/api/spoons', async (req, res) => {
    const userId = (req.query.userId as string) || 'will';
    try {
      const r = await proxyFetch(MESH.personal, `/agent/${userId}/energy`, { method: 'GET' });
      return sendBuffer(res, r);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'mesh_unreachable';
      res.status(502).json({ error: 'mesh_unreachable', message });
    }
  });

  app.put('/api/spoons', async (req, res) => {
    const userId = (req.body as { userId?: string })?.userId || 'will';
    try {
      const r = await proxyFetch(MESH.personal, `/agent/${userId}/energy`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body ?? {}),
      });
      return sendBuffer(res, r);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'mesh_unreachable';
      res.status(502).json({ error: 'mesh_unreachable', message });
    }
  });

  // Bio + medical → bio
  app.post('/api/bio', async (req, res) => {
    const userId = (req.body as { userId?: string })?.userId || 'will';
    try {
      const r = await proxyFetch(MESH.personal, `/agent/${userId}/bio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body ?? {}),
      });
      return sendBuffer(res, r);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'mesh_unreachable';
      res.status(502).json({ error: 'mesh_unreachable', message });
    }
  });

  app.post('/api/medical/log', async (req, res) => {
    const userId = (req.body as { userId?: string })?.userId || 'will';
    const bioPayload = {
      type: (req.body as { type?: string })?.type || 'medical_event',
      value: (req.body as { value?: unknown })?.value,
      unit: (req.body as { unit?: string })?.unit || 'event',
      source: 'centaur',
    };
    try {
      const r = await proxyFetch(MESH.personal, `/agent/${userId}/bio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bioPayload),
      });
      return sendBuffer(res, r);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'mesh_unreachable';
      res.status(502).json({ error: 'mesh_unreachable', message });
    }
  });

  // Personal state
  app.get('/api/state', async (req, res) => {
    const userId = (req.query.userId as string) || 'will';
    try {
      const r = await proxyFetch(MESH.personal, `/agent/${userId}/state`, { method: 'GET' });
      return sendBuffer(res, r);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'mesh_unreachable';
      res.status(502).json({ error: 'mesh_unreachable', message });
    }
  });

  app.put('/api/state', async (req, res) => {
    const userId = (req.body as { userId?: string })?.userId || 'will';
    try {
      const r = await proxyFetch(MESH.personal, `/agent/${userId}/state`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body ?? {}),
      });
      return sendBuffer(res, r);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'mesh_unreachable';
      res.status(502).json({ error: 'mesh_unreachable', message });
    }
  });

  app.get('/api/reminders', async (req, res) => {
    const userId = (req.query.userId as string) || 'will';
    try {
      const r = await proxyFetch(MESH.personal, `/agent/${userId}/reminders`, { method: 'GET' });
      return sendBuffer(res, r);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'mesh_unreachable';
      res.status(502).json({ error: 'mesh_unreachable', message });
    }
  });

  app.post('/api/reminders', async (req, res) => {
    const userId = (req.body as { userId?: string })?.userId || 'will';
    try {
      const r = await proxyFetch(MESH.personal, `/agent/${userId}/reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body ?? {}),
      });
      return sendBuffer(res, r);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'mesh_unreachable';
      res.status(502).json({ error: 'mesh_unreachable', message });
    }
  });

  // K₄ cage
  app.get('/api/mesh', getPath('cage', '/api/mesh'));
  app.get('/api/vertex/:id', async (req, res) => {
    try {
      const r = await proxyFetch(MESH.cage, `/api/vertex/${encodeURIComponent(req.params.id)}`, {
        method: 'GET',
      });
      return sendBuffer(res, r);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'mesh_unreachable';
      res.status(502).json({ error: 'mesh_unreachable', message });
    }
  });

  app.post('/api/presence/:id', async (req, res) => {
    try {
      const r = await proxyFetch(MESH.cage, `/api/presence/${encodeURIComponent(req.params.id)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body ?? {}),
      });
      return sendBuffer(res, r);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'mesh_unreachable';
      res.status(502).json({ error: 'mesh_unreachable', message });
    }
  });

  app.post('/api/ping/:from/:to', async (req, res) => {
    try {
      const r = await proxyFetch(
        MESH.cage,
        `/api/ping/${encodeURIComponent(req.params.from)}/${encodeURIComponent(req.params.to)}`,
        { method: 'POST' },
      );
      return sendBuffer(res, r);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'mesh_unreachable';
      res.status(502).json({ error: 'mesh_unreachable', message });
    }
  });

  app.get('/api/telemetry', async (req, res) => {
    const limit = (req.query.limit as string) || '50';
    try {
      const r = await proxyFetch(MESH.cage, `/api/telemetry?limit=${encodeURIComponent(limit)}`, {
        method: 'GET',
      });
      return sendBuffer(res, r);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'mesh_unreachable';
      res.status(502).json({ error: 'mesh_unreachable', message });
    }
  });

  // Buffer analyze (edge) — path configurable; monorepo `p31-buffer-api` uses POST /rewrite
  app.post('/api/buffer/analyze', postJson('bufferApi', process.env.MESH_BUFFER_ANALYZE_PATH || '/rewrite'));

  // Synthesis
  app.post('/api/synthesis/weekly', postJson('chamber', '/synthesize'));

  // Fleet health (7 endpoints including buffer-api)
  app.get('/api/fleet/health', async (_req, res) => {
    const entries = Object.entries(MESH) as [MeshTarget, string][];
    const checks = await Promise.all(
      entries.map(async ([name, baseUrl]) => {
        const start = Date.now();
        try {
          const base = baseUrl.replace(/\/$/, '');
          const path = name === 'chamber' ? '/' : '/health';
          const r = await fetch(`${base}${path}`, {
            method: 'GET',
            signal: AbortSignal.timeout(5000),
          });
          const ok = r.ok;
          return { name, status: ok ? 'up' : 'down', http: r.status, ms: Date.now() - start };
        } catch {
          return { name, status: 'down', http: 0, ms: Date.now() - start };
        }
      }),
    );
    const allUp = checks.every((c) => c.status === 'up');
    res.json({ status: allUp ? 'all_up' : 'degraded', workers: checks, timestamp: Date.now() });
  });

  logger.info('Mesh bridge: routes registered');
}
