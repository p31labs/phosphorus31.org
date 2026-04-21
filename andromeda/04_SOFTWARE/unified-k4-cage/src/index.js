/**
 * Unified k4-cage — K₄ topology DO + FamilyMeshRoom WebSocket DO + D1 telemetry chain.
 * CWP-30: merge original topology with CWP rooms (hibernation-friendly WebSockets).
 *
 * Deploy: wrangler deploy (from directory containing wrangler.toml)
 */

const VERTICES = ['will', 'sj', 'wj', 'christyn'];
const EDGES = [
  ['will', 'sj'],
  ['will', 'wj'],
  ['will', 'christyn'],
  ['sj', 'wj'],
  ['sj', 'christyn'],
  ['wj', 'christyn'],
];

function isVertex(id) {
  return VERTICES.includes(id);
}

function isEdge(v1, v2) {
  return EDGES.some(([a, b]) => (a === v1 && b === v2) || (a === v2 && b === v1));
}

/** Canonical undirected edge key for storage */
function edgeStorageKey(v1, v2) {
  return v1 < v2 ? `edge:${v1}:${v2}` : `edge:${v2}:${v1}`;
}

async function sha256(data) {
  const encoded = new TextEncoder().encode(JSON.stringify(data));
  const hash = await crypto.subtle.digest('SHA-256', encoded);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ─── K4Topology DO ─────────────────────────────────────────────

export class K4Topology extends DurableObject {
  /** @param {DurableObjectState} state */
  constructor(state, env) {
    super(state, env);
    this.storage = state.storage;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/mesh' && request.method === 'GET') {
      const vertices = {};
      for (const v of VERTICES) {
        vertices[v] =
          (await this.storage.get(`vertex:${v}`)) || {
            id: v,
            love: 0,
            presence: 'offline',
            lastSeen: 0,
            pingSent: 0,
            pingReceived: 0,
          };
      }
      const edges = [];
      for (const [a, b] of EDGES) {
        const ek = edgeStorageKey(a, b);
        const edgeData = (await this.storage.get(ek)) || { love: 0, pings: 0, lastPing: 0 };
        edges.push({ from: a, to: b, ...edgeData });
      }
      return Response.json({
        topology: 'K4',
        vertices: VERTICES.length,
        edgeCount: EDGES.length,
        betti_2: 1,
        isostatic: true,
        maxwell: '3V-6=6',
        graph: { vertices, edges },
      });
    }

    if (path.startsWith('/vertex/') && request.method === 'GET') {
      const id = path.split('/')[2];
      if (!isVertex(id)) return Response.json({ error: 'Not a K₄ vertex' }, { status: 404 });
      const data =
        (await this.storage.get(`vertex:${id}`)) || {
          id,
          love: 0,
          presence: 'offline',
          lastSeen: 0,
          pingSent: 0,
          pingReceived: 0,
        };
      return Response.json(data);
    }

    if (path.startsWith('/presence/') && request.method === 'POST') {
      const id = path.split('/')[2];
      if (!isVertex(id)) return Response.json({ error: 'Not a K₄ vertex' }, { status: 404 });
      const body = await request.json().catch(() => ({}));
      const current =
        (await this.storage.get(`vertex:${id}`)) || {
          id,
          love: 0,
          presence: 'offline',
          lastSeen: 0,
          pingSent: 0,
          pingReceived: 0,
        };
      const wasOffline = current.presence === 'offline';
      current.presence = body.status || 'online';
      current.lastSeen = Date.now();
      await this.storage.put(`vertex:${id}`, current);
      return Response.json({
        ...current,
        wasOffline,
        nowOnline: current.presence === 'online' && wasOffline,
      });
    }

    if (path.startsWith('/ping/') && request.method === 'POST') {
      const parts = path.split('/');
      const from = parts[2];
      const to = parts[3];
      if (!isVertex(from) || !isVertex(to)) {
        return Response.json({ error: 'Invalid vertices' }, { status: 400 });
      }
      if (!isEdge(from, to)) {
        return Response.json({ error: 'No edge between vertices' }, { status: 400 });
      }

      const ek = edgeStorageKey(from, to);
      const edge = (await this.storage.get(ek)) || { love: 0, pings: 0, lastPing: 0 };
      edge.love += 1;
      edge.pings += 1;
      edge.lastPing = Date.now();
      await this.storage.put(ek, edge);

      const fromV =
        (await this.storage.get(`vertex:${from}`)) || {
          id: from,
          love: 0,
          presence: 'offline',
          lastSeen: 0,
          pingSent: 0,
          pingReceived: 0,
        };
      const toV =
        (await this.storage.get(`vertex:${to}`)) || {
          id: to,
          love: 0,
          presence: 'offline',
          lastSeen: 0,
          pingSent: 0,
          pingReceived: 0,
        };
      fromV.love += 1;
      fromV.pingSent += 1;
      fromV.lastSeen = Date.now();
      toV.love += 1;
      toV.pingReceived += 1;
      await this.storage.put(`vertex:${from}`, fromV);
      await this.storage.put(`vertex:${to}`, toV);

      return Response.json({
        ok: true,
        from,
        to,
        edgeLove: edge.love,
        fromLove: fromV.love,
        toLove: toV.love,
        timestamp: Date.now(),
      });
    }

    return Response.json({ error: 'Unknown topology route' }, { status: 404 });
  }
}

// ─── FamilyMeshRoom DO (WebSocket hibernation) ─────────────────

export class FamilyMeshRoom extends DurableObject {
  /** @param {DurableObjectState} state */
  constructor(state, env) {
    super(state, env);
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);

    // Internal-only (from outer Worker); URL host/path set in broadcastTopologyPing
    if (url.hostname === 'internal' && url.pathname === '/broadcast' && request.method === 'POST') {
      const payload = await request.json();
      const msg = JSON.stringify(payload);
      for (const ws of this.ctx.getWebSockets()) {
        try {
          ws.send(msg);
        } catch {
          /* ignore broken socket */
        }
      }
      return Response.json({ ok: true, delivered: this.ctx.getWebSockets().length });
    }

    if (url.pathname.endsWith('/stats') || url.pathname === '/stats') {
      const sockets = this.ctx.getWebSockets();
      return Response.json({
        connections: sockets.length,
        maxConnections: 8,
        pendingTelemetry: (await this.ctx.storage.get('pendingCount')) || 0,
        sessions: sockets.map((ws) => ({ tags: this.ctx.getTags(ws) })),
      });
    }

    if (request.headers.get('Upgrade') === 'websocket') {
      const nodeId = url.searchParams.get('node') || `anon-${Date.now()}`;
      const sockets = this.ctx.getWebSockets();
      if (sockets.length >= 8) {
        return new Response('Room full', { status: 503 });
      }
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      this.ctx.acceptWebSocket(server, [nodeId]);
      server.serializeAttachment?.({ joinedAt: Date.now() });

      const joinMsg = JSON.stringify({
        type: 'user_joined',
        userId: nodeId,
        timestamp: Date.now(),
      });
      for (const ws of this.ctx.getWebSockets()) {
        if (ws !== server) {
          try {
            ws.send(joinMsg);
          } catch {
            /* ignore */
          }
        }
      }
      try {
        server.send(JSON.stringify({ type: 'joined', userId: nodeId, room: url.pathname }));
      } catch {
        /* ignore */
      }

      return new Response(null, { status: 101, webSocket: client });
    }

    return Response.json({ error: 'Expected WebSocket or internal broadcast' }, { status: 400 });
  }

  async webSocketMessage(ws, message) {
    const tags = this.ctx.getTags(ws);
    const nodeId = tags[0] || 'unknown';
    let data;
    try {
      data = JSON.parse(message);
    } catch {
      data = { type: 'raw', content: String(message) };
    }

    if (data.type === 'ping' && data.content === 'ping') {
      ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      return;
    }

    const payload = { ...data, sender: nodeId, timestamp: Date.now() };
    const out = JSON.stringify(payload);
    for (const other of this.ctx.getWebSockets()) {
      if (other !== ws) {
        try {
          other.send(out);
        } catch {
          /* ignore */
        }
      }
    }

    const pending = (await this.ctx.storage.get('pending')) || [];
    pending.push({
      room_id: 'family-mesh',
      node_id: nodeId,
      kind: data.type || 'message',
      payload: JSON.stringify(payload),
      ts: Date.now(),
    });
    await this.ctx.storage.put('pending', pending);
    await this.ctx.storage.put('pendingCount', pending.length);

    const current = await this.ctx.storage.getAlarm();
    if (current == null) {
      await this.ctx.storage.setAlarm(Date.now() + 30_000);
    }
  }

  async webSocketClose(ws) {
    const tags = this.ctx.getTags(ws);
    const nodeId = tags[0] || 'unknown';
    const left = JSON.stringify({
      type: 'user_left',
      userId: nodeId,
      timestamp: Date.now(),
    });
    for (const other of this.ctx.getWebSockets()) {
      try {
        other.send(left);
      } catch {
        /* ignore */
      }
    }
  }

  async alarm() {
    const pending = (await this.ctx.storage.get('pending')) || [];
    if (pending.length > 0 && this.env.DB) {
      const batch = pending.splice(0, 100);
      await this.ctx.storage.put('pending', pending);
      await this.ctx.storage.put('pendingCount', pending.length);

      let prevHash = (await this.ctx.storage.get('lastTelemetryHash')) || '0';
      const rows = [];
      for (const row of batch) {
        const hash = await sha256({ ...row, prevHash });
        rows.push({ ...row, hash, prevHash, flushed_at: Date.now() });
        prevHash = hash;
      }
      await this.ctx.storage.put('lastTelemetryHash', prevHash);

      const stmt = this.env.DB.prepare(
        'INSERT INTO telemetry (room_id, node_id, kind, payload, ts, hash, prev_hash, flushed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      );
      try {
        await this.env.DB.batch(
          rows.map((r) =>
            stmt.bind(r.room_id, r.node_id, r.kind, r.payload, r.ts, r.hash, r.prevHash, r.flushed_at),
          ),
        );
      } catch {
        const back = (await this.ctx.storage.get('pending')) || [];
        await this.ctx.storage.put('pending', [...batch, ...back]);
        await this.ctx.storage.put(
          'pendingCount',
          ((await this.ctx.storage.get('pending')) || []).length,
        );
      }
    }

    const still = (await this.ctx.storage.get('pending')) || [];
    if (still.length > 0 || this.ctx.getWebSockets().length > 0) {
      await this.ctx.storage.setAlarm(Date.now() + 30_000);
    }
  }
}

/** Notify default family mesh room after a REST ping */
async function broadcastTopologyPing(env, body) {
  try {
    const roomObjId = env.FAMILY_MESH_ROOM.idFromName('family-mesh');
    const room = env.FAMILY_MESH_ROOM.get(roomObjId);
    await room.fetch(
      new Request('http://internal/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'topology_ping', ...body }),
      }),
    );
  } catch {
    /* room optional during rollout */
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/' && request.method === 'GET') {
      return new Response('k4-cage alive');
    }

    if (path === '/health' && request.method === 'GET') {
      const topoId = env.K4_TOPOLOGY.idFromName('family');
      const topo = env.K4_TOPOLOGY.get(topoId);
      const meshResp = await topo.fetch(new Request('http://do/mesh'));
      const mesh = await meshResp.json();
      return Response.json({
        status: 'ok',
        service: 'k4-cage-unified',
        topology: {
          vertices: mesh.vertices,
          edges: mesh.edgeCount,
          isostatic: mesh.isostatic,
        },
        timestamp: Date.now(),
      });
    }

    if (
      path === '/api/mesh' ||
      path.startsWith('/api/vertex/') ||
      path.startsWith('/api/presence/') ||
      path.startsWith('/api/ping/')
    ) {
      const topoId = env.K4_TOPOLOGY.idFromName('family');
      const topo = env.K4_TOPOLOGY.get(topoId);
      const doPath = path.replace('/api/', '/');
      const inner = new Request(`http://do${doPath}`, {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      });
      const resp = await topo.fetch(inner);

      if (path.startsWith('/api/ping/') && request.method === 'POST' && resp.ok) {
        const json = await resp.clone().json().catch(() => null);
        if (json && json.ok) {
          await broadcastTopologyPing(env, json);
        }
      }
      return resp;
    }

    if (path === '/api/telemetry' && request.method === 'GET') {
      if (!env.DB) return Response.json({ error: 'D1 not bound' }, { status: 500 });
      const limit = parseInt(url.searchParams.get('limit') || '50', 10);
      const results = await env.DB.prepare('SELECT * FROM telemetry ORDER BY ts DESC LIMIT ?')
        .bind(limit)
        .all();
      return Response.json({
        chain: 'sha256',
        standard: 'Daubert',
        count: results.results.length,
        events: results.results,
      });
    }

    if (path.startsWith('/room-stats/')) {
      const parts = path.split('/').filter(Boolean);
      const roomId = parts[1] || 'family-mesh';
      const roomObjId = env.FAMILY_MESH_ROOM.idFromName(roomId);
      const room = env.FAMILY_MESH_ROOM.get(roomObjId);
      return room.fetch(new Request(`http://do/${roomId}/stats`));
    }

    if (path.startsWith('/ws/')) {
      const parts = path.split('/').filter(Boolean);
      const roomId = parts[1] || 'family-mesh';
      const roomObjId = env.FAMILY_MESH_ROOM.idFromName(roomId);
      const room = env.FAMILY_MESH_ROOM.get(roomObjId);
      const wsUrl = new URL(request.url);
      wsUrl.pathname = `/${roomId}`;
      return room.fetch(new Request(wsUrl.toString(), request));
    }

    if (path === '/api/admin/dashboard') {
      const token =
        request.headers.get('Authorization')?.replace('Bearer ', '') || url.searchParams.get('token');
      if (token !== env.ADMIN_TOKEN) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const topoId = env.K4_TOPOLOGY.idFromName('family');
      const topo = env.K4_TOPOLOGY.get(topoId);
      const meshResp = await topo.fetch(new Request('http://do/mesh'));
      const mesh = await meshResp.json();

      const roomObjId = env.FAMILY_MESH_ROOM.idFromName('family-mesh');
      const room = env.FAMILY_MESH_ROOM.get(roomObjId);
      const statsResp = await room.fetch(new Request('http://do/family-mesh/stats'));
      const stats = await statsResp.json();

      return Response.json({ mesh, room: stats, timestamp: Date.now() });
    }

    return Response.json({ error: 'Not found' }, { status: 404 });
  },
};
