/**
 * P31 Buffer Server — Hardware message queue bridge
 *
 * Sits between Centaur (port 3001) and physical hardware (ESP32-S3 / LoRa mesh).
 * Accepts messages from Centaur, queues them for hardware nodes, and accepts
 * heartbeat pings from nodes that drain the queue.
 *
 * Port: 4000 (configurable via PORT env var)
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ── In-memory state ───────────────────────────────────────────────────────

const MESSAGE_QUEUE = new Map();
const NODES = new Map();
let messageCounter = 0;

// ── Health ────────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    role: 'BUFFER_HARDWARE_BRIDGE',
    port: PORT,
    uptime: process.uptime(),
    queued: [...MESSAGE_QUEUE.values()].filter((m) => m.status === 'queued').length,
    nodes: NODES.size,
    timestamp: new Date().toISOString(),
  });
});

// ── POST /api/messages — enqueue a message for hardware delivery ──────────

app.post('/api/messages', (req, res) => {
  const { message, priority, targetNode, metadata } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'message field required' });
  }

  const id = `msg_${++messageCounter}_${Date.now()}`;
  const record = {
    id,
    message,
    priority: priority || 'normal',
    targetNode: targetNode || '*',
    metadata: metadata || {},
    status: 'queued',
    createdAt: new Date().toISOString(),
    deliveredAt: null,
  };

  MESSAGE_QUEUE.set(id, record);
  res.status(201).json(record);
});

// ── GET /api/messages/:messageId — read a single message ──────────────────

app.get('/api/messages/:messageId', (req, res) => {
  const msg = MESSAGE_QUEUE.get(req.params.messageId);
  if (!msg) return res.status(404).json({ error: 'not found' });
  res.json(msg);
});

// ── GET /api/queue/status — queue stats ───────────────────────────────────

app.get('/api/queue/status', (_req, res) => {
  const all = [...MESSAGE_QUEUE.values()];
  res.json({
    total: all.length,
    queued: all.filter((m) => m.status === 'queued').length,
    delivered: all.filter((m) => m.status === 'delivered').length,
    failed: all.filter((m) => m.status === 'failed').length,
    timestamp: new Date().toISOString(),
  });
});

// ── POST /api/ping/heartbeat — node checks in, drains its queue ───────────

app.post('/api/ping/heartbeat', (req, res) => {
  const { nodeId, signalStrength, firmware, battery } = req.body;
  if (!nodeId) {
    return res.status(400).json({ error: 'nodeId required' });
  }

  NODES.set(nodeId, {
    nodeId,
    signalStrength: signalStrength ?? null,
    firmware: firmware ?? null,
    battery: battery ?? null,
    lastSeen: new Date().toISOString(),
  });

  const pending = [...MESSAGE_QUEUE.values()].filter(
    (m) => m.status === 'queued' && (m.targetNode === '*' || m.targetNode === nodeId)
  );

  for (const msg of pending) {
    msg.status = 'delivered';
    msg.deliveredAt = new Date().toISOString();
    msg.deliveredTo = nodeId;
  }

  res.json({
    ack: true,
    messages: pending,
    count: pending.length,
    timestamp: new Date().toISOString(),
  });
});

// ── GET /api/ping/status — node registry ──────────────────────────────────

app.get('/api/ping/status', (_req, res) => {
  res.json({
    nodes: [...NODES.values()],
    count: NODES.size,
    timestamp: new Date().toISOString(),
  });
});

// ── Start ─────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`[Buffer Server] Listening on http://localhost:${PORT}`);
  console.log(`[Buffer Server] Role: BUFFER_HARDWARE_BRIDGE`);
});
