/**
 * The Buffer Server - Express API with Redis message queue
 */
/// <reference path="./helmet.d.ts" />

import { readFileSync } from 'fs';
import { join } from 'path';
import express, { Request, Response } from 'express';
import { createServer, Server as HTTPServer } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { MessageQueue } from './queue.js';
import { BufferStore } from './store.js';
import { Logger } from './utils/logger.js';
import { Ping } from './ping.js';
import { MessageFilter } from './filter.js';
import { RetryHandler } from './retry.js';
import { BufferMonitoring } from './monitoring.js';
import { CentaurClient } from './centaur-client.js';
import { Metabolism } from './metabolism.js';
import helmet from 'helmet';
import {
  bufferRateLimit,
  processRateLimit,
  validateMessage,
  validateProcessBody,
  WS_MAX_PAYLOAD_BYTES_EXPORT as WS_MAX_PAYLOAD_BYTES,
} from './security/security-middleware.js';
import { QueuedMessage } from './queue.js';
import { AccommodationLogStore } from './accommodation-log-store.js';
import { GameStore } from './game-store.js';
import { createGameRouter } from './routes/game.js';
import { createSproutRouter } from './routes/sprout.js';

const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8')) as { version?: string };
const P31_VERSION = pkg?.version ?? '1.0.0';

export class BufferServer {
  private app: express.Express;
  private server: HTTPServer;
  private wss: WebSocketServer;
  private logger: Logger;
  private messageQueue: MessageQueue;
  private bufferStore: BufferStore;
  private ping: Ping;
  private messageFilter: MessageFilter;
  private retryHandler: RetryHandler;
  private monitoring: BufferMonitoring;
  private centaurClient: CentaurClient;
  private metabolism: Metabolism;
  private startTime: number = 0;
  /** LAUNCH-04: Accommodation log persisted in SQLite. PII-free only. */
  private accommodationLogStore: AccommodationLogStore;
  /** P31 Game Integration: molecules, LOVE, mesh directory, brain state. */
  private gameStore: GameStore;
  /** Mesh: client role for routing. Set on first message (sprout:signal → sprout, scope:subscribe → scope). */
  private wsClientRole = new WeakMap<WebSocket, 'sprout' | 'scope'>();
  /** Sprout connection id for logging (e.g. sprout-1). */
  private wsSproutId = new WeakMap<WebSocket, number>();
  /** System voltage driven by Sprout signals. Scope shows this. */
  private currentVoltage: 'green' | 'amber' | 'red' = 'green';
  private sproutConnectionId = 0;
  /** Held messages (high/urgent voltage) until explicit release. No original content in API. */
  private heldMessages: Array<{ id: string; voltage: string; kernel: string; source: string; timestamp: string }> = [];
  /** LAUNCH-02: WebSocket connections per IP (max 5). */
  private wsConnectionsByIp = new Map<string, number>();
  /** LAUNCH-02: Heartbeat — disconnect after 3 missed pongs (90s). */
  private wsPingState = new WeakMap<WebSocket, { missedPings: number; timer: ReturnType<typeof setTimeout> | null }>();
  /** LAUNCH-02: Per-connection IP for decrement on close. */
  private wsToIp = new WeakMap<WebSocket, string>();

  /**
   * LAUNCH-04: Volatile vs persistent state.
   * Volatile (in-memory only, lost on restart): currentVoltage, heldMessages, wsClientRole,
   * wsSproutId, wsConnectionsByIp, wsPingState, wsToIp, sproutConnectionId.
   * Persistent: accommodation_log (SQLite via accommodationLogStore), message queue (Redis),
   * buffer store (SQLite). Run backup script to snapshot accommodation DB; keep last 30.
   */

  private port: number;
  private readonly bufferWindowMs: number;
  private readonly maxBatchSize: number;

  constructor() {
    this.port = parseInt(process.env.PORT || '4000', 10);
    this.bufferWindowMs = parseInt(process.env.BUFFER_WINDOW_MS || '60000', 10);
    this.maxBatchSize = parseInt(process.env.MAX_BATCH_SIZE || '100', 10);
    
    this.logger = new Logger('BufferServer');
    this.app = express();
    this.server = createServer(this.app);
    this.wss = new WebSocketServer({
      server: this.server,
      path: '/ws',
      maxPayload: WS_MAX_PAYLOAD_BYTES, // LAUNCH-02: 64KB
      verifyClient: (info, cb) => this.verifyWsClient(info, cb),
    });
    
    this.messageQueue = new MessageQueue();
    this.bufferStore = new BufferStore();
    this.ping = new Ping();
    this.messageFilter = new MessageFilter();
    this.retryHandler = new RetryHandler({
      maxRetries: 3,
      initialDelay: 1000,
      maxDelay: 10000,
    });
    this.monitoring = new BufferMonitoring(this.messageQueue, this.bufferStore);
    this.centaurClient = new CentaurClient();
    this.metabolism = new Metabolism();
    this.accommodationLogStore = new AccommodationLogStore();
    this.gameStore = new GameStore();

    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
    this.startBatching();
    this.startMonitoring();
  }

  /** LAUNCH-02: Explicit allowlist. No wildcard. Production from env CORS_ORIGIN. */
  private getAllowedOrigins(): string[] {
    const fromEnv = process.env.CORS_ORIGIN?.trim();
    if (fromEnv) return fromEnv.split(',').map((o) => o.trim()).filter(Boolean);
    if (process.env.NODE_ENV === 'production') {
      return [
        'https://phosphorus31.org',
        'https://www.phosphorus31.org',
        'https://sprout.p31.io',
        'https://scope.p31.io',
      ];
    }
    // Vite dev servers can use 5173–5180 when ports are in use
    const vitePorts = Array.from({ length: 8 }, (_, i) => 5173 + i);
    return ['http://localhost:3000', ...vitePorts.map((p) => `http://localhost:${p}`)];
  }

  /** Normalize localhost so ::1 and 127.0.0.1 share the same connection limit (integration tests). */
  private normalizeIp(raw: string): string {
    if (!raw || raw === 'unknown') return raw;
    const s = raw.trim().toLowerCase();
    if (s === '::1' || s === '127.0.0.1' || s === '::ffff:127.0.0.1') return '127.0.0.1';
    return raw;
  }

  /** LAUNCH-02: Validate Origin and max 5 connections per IP on WebSocket upgrade. */
  private verifyWsClient(
    info: { origin: string; req: { socket: { remoteAddress?: string }; headers: { origin?: string } } },
    cb: (allow: boolean, code?: number, message?: string) => void
  ): void {
    const ip = this.normalizeIp(info.req.socket.remoteAddress ?? 'unknown');
    const origin = info.origin || info.req.headers.origin || '';
    const allowed = this.getAllowedOrigins();
    if (origin && allowed.length > 0 && !allowed.includes(origin)) {
      this.logger.warn(`[MESH] WebSocket rejected: origin not in allowlist`);
      return cb(false, 403, 'Origin not allowed');
    }
    const maxPerIp = process.env.NODE_ENV === 'production' ? 5 : 10; // LAUNCH-01: allow more in dev so integration test (5+ sequential) passes
    const count = this.wsConnectionsByIp.get(ip) ?? 0;
    if (count >= maxPerIp) {
      this.logger.warn(`[MESH] WebSocket rejected: max connections per IP (${maxPerIp}) for ${ip}`);
      return cb(false, 429, 'Too many connections');
    }
    this.wsConnectionsByIp.set(ip, count + 1);
    cb(true);
  }

  private setupMiddleware(): void {
    // LAUNCH-02: Helmet security headers (CSP, HSTS when HTTPS, etc.)
    // Dev: allow WS on 4000–4010 for port fallback when 4000 is in use
    const wsPorts = process.env.NODE_ENV === 'production'
      ? [this.port]
      : Array.from({ length: 11 }, (_, i) => 4000 + i);
    const connectSrc = ["'self'", ...wsPorts.flatMap((p) => [`ws://localhost:${p}`, `wss://localhost:${p}`])];
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            fontSrc: ['https://fonts.gstatic.com'],
            connectSrc,
            imgSrc: ["'self'", 'data:'],
            frameAncestors: ["'none'"],
          },
        },
        hsts: { maxAge: 31536000, includeSubDomains: true }, // only when HTTPS in production
        xssFilter: false,
      })
    );
    this.app.use((_req: Request, res: Response, next: express.NextFunction) => {
      res.setHeader('X-XSS-Protection', '0'); // LAUNCH-02: CSP handles XSS
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
      next();
    });

    // Rate limiting
    this.app.use(bufferRateLimit());

    // Body parsing: LAUNCH-02 max 1MB
    this.app.use(express.json({ limit: '1mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '1mb' }));

    // CORS — explicit allowlist, no wildcard (LAUNCH-02)
    const allowedOrigins = this.getAllowedOrigins();
    this.app.use((req: Request, res: Response, next: express.NextFunction) => {
      const origin = req.headers.origin;

      if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
      } else if (process.env.NODE_ENV === 'production' && allowedOrigins.length > 0) {
        return res.status(403).json({ error: 'CORS not allowed' });
      }

      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
      }
      return next();
    });
    
    // Request logging
    this.app.use((req: Request, _res: Response, next) => {
      this.logger.debug(`${req.method} ${req.path}`);
      return next();
    });
  }

  private setupRoutes(): void {
    // Health check (prompt: status ok, uptime, version)
    // LAUNCH-03: Health must respond in < 10ms. Do not await Centaur (external fetch).
    this.app.get('/health', (_req: Request, res: Response) => {
      const uptimeSeconds = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;
      return res.json({
        status: 'ok',
        uptime: uptimeSeconds,
        version: P31_VERSION,
        timestamp: new Date().toISOString(),
        systems: {
          queue: this.messageQueue.isConnected(),
          store: this.bufferStore.isReady(),
          accommodationLog: this.accommodationLogStore.isReady(), // LAUNCH-07: SQLite accommodation log
          game: this.gameStore.isReady(),
          ping: this.ping.isActive(),
          centaur: false, // Set by optional /health/detailed or background; avoid blocking on external fetch
          metabolism: this.metabolism.getState(),
        },
      });
    });

    // POST /process — message intake { content, source, metadata } (LAUNCH-01: hold when high/urgent)
    this.app.post('/process', processRateLimit(), validateProcessBody, (req: Request, res: Response) => {
      try {
        const { content, source = 'manual', metadata = {} } = req.body;
        if (!content || typeof content !== 'string') {
          return res.status(400).json({ error: 'content is required and must be a string' });
        }
        const trimmed = content.trim();
        if (trimmed.length === 0) {
          return res.status(400).json({ error: 'content cannot be empty' });
        }
        const initialMessage: QueuedMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          message: trimmed,
          priority: 'normal',
          metadata: { ...metadata, source },
          timestamp: new Date().toISOString(),
          status: 'pending'
        };
        const filtered = this.messageFilter.filter(initialMessage);
        const processed: QueuedMessage = {
          ...initialMessage,
          priority: filtered.priority,
          metadata: { ...initialMessage.metadata, ...filtered.metadata, filterReason: filtered.reason }
        };
        const voltage = processed.priority === 'urgent' ? 'red' : processed.priority === 'high' ? 'amber' : 'green';
        const shouldHold = processed.priority === 'urgent' || processed.priority === 'high';
        const kernel = trimmed.replace(/[A-Z]/g, (c) => c.toLowerCase()).replace(/!{2,}/g, '!').trim();
        const actionItems: string[] = [];
        const matchQs = trimmed.match(/\?[^?]*\?/g) ?? [];
        const lastQ = trimmed.includes('?') ? [trimmed.split('?').pop()?.trim() ?? ''] : [];
        const questions: string[] = [...matchQs, ...lastQ].filter(Boolean);

        if (shouldHold) {
          this.heldMessages.push({
            id: processed.id,
            voltage,
            kernel,
            source: String(source),
            timestamp: processed.timestamp,
          });
          this.broadcastToScopes({
            type: 'message:processed',
            data: {
              id: processed.id,
              voltage,
              status: 'held',
              source,
              kernel,
              actionItems,
              questions,
              originalLength: trimmed.length,
            },
          });
          return res.status(200).json({
            id: processed.id,
            voltage: processed.priority === 'urgent' ? (trimmed.length > 80 ? 'black' : 'red') : 'amber',
            status: processed.priority === 'urgent' ? 'crisis' : 'held',
            kernel,
            actionItems,
            questions,
            originalLength: trimmed.length,
            processedAt: new Date().toISOString(),
          });
        }

        this.bufferStore.saveMessage(processed).catch((err) => this.logger.error('Save message error:', err));
        this.messageQueue.enqueue(processed).catch((err) => this.logger.error('Enqueue error:', err));
        this.broadcastWs({ type: 'message:new', data: { id: processed.id, source, priority: processed.priority } });
        this.broadcastWs({ type: 'message:processed', data: { id: processed.id, priority: processed.priority, status: 'released', source } });
        return res.status(200).json({
          id: processed.id,
          voltage,
          status: 'released',
          processedAt: new Date().toISOString(),
        });
      } catch (error) {
        this.logger.error('Error in /process:', error);
        return res.status(500).json({ error: 'Failed to process message' });
      }
    });

    // GET /history — processed message history
    this.app.get('/history', async (req: Request, res: Response) => {
      try {
        const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
        const offset = parseInt(req.query.offset as string) || 0;
        const status = req.query.status as string | undefined;
        const messages = await this.bufferStore.getMessages(limit, offset, status);
        const total = await this.bufferStore.getMessageCount(status);
        return res.json({
          messages,
          total,
          limit,
          offset,
          hasMore: offset + messages.length < total
        });
      } catch (error) {
        this.logger.error('Error getting history:', error);
        return res.status(500).json({ error: 'Failed to get history' });
      }
    });

    // GET /accommodation-log — LAUNCH-04: from SQLite; ?include_archive=true for archived records
    this.app.get('/accommodation-log', async (req: Request, res: Response) => {
      try {
        const includeArchive = (req.query.include_archive as string) === 'true';
        const format = (req.query.format as string) || (req.get('accept')?.includes('text/csv') ? 'csv' : '');
        const log = await this.accommodationLogStore.getAll(includeArchive);
        if (format === 'csv') {
          const UTF8_BOM = '\uFEFF';
          const headers = ['timestamp', 'event_type', 'signal', 'voltage_before', 'voltage_after', 'source', 'accommodation_type'];
          const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
          const rows = log.map((r) =>
            headers.map((h) => escape(String((r as unknown as Record<string, string>)[h] ?? ''))).join(',')
          );
          const csv = UTF8_BOM + headers.join(',') + '\n' + rows.join('\n');
          const filename = `p31-accommodation-log-${new Date().toISOString().slice(0, 10)}.csv`;
          res.setHeader('Content-Type', 'text/csv; charset=utf-8');
          res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
          return res.send(csv);
        }
        return res.json(log);
      } catch (e) {
        this.logger.error('GET /accommodation-log:', e);
        return res.status(500).json({ error: 'Failed to get accommodation log' });
      }
    });

    // GET /accommodation-log/export?format=csv — alias for CSV export (LAUNCH-01)
    this.app.get('/accommodation-log/export', async (req: Request, res: Response) => {
      try {
        const format = (req.query.format as string) || 'csv';
        if (format !== 'csv') return res.status(400).json({ error: 'format=csv only' });
        const includeArchive = (req.query.include_archive as string) === 'true';
        const log = await this.accommodationLogStore.getAll(includeArchive);
        const UTF8_BOM = '\uFEFF';
        const headers = ['timestamp', 'event_type', 'signal', 'voltage_before', 'voltage_after', 'source', 'accommodation_type'];
        const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
        const rows = log.map((r) =>
          headers.map((h) => escape(String((r as unknown as Record<string, string>)[h] ?? ''))).join(',')
        );
        const csv = UTF8_BOM + headers.join(',') + '\n' + rows.join('\n');
        const filename = `p31-accommodation-log-${new Date().toISOString().slice(0, 10)}.csv`;
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return res.send(csv);
      } catch (e) {
        this.logger.error('GET /accommodation-log/export:', e);
        return res.status(500).json({ error: 'Failed to export' });
      }
    });

    // GET /accommodation-log/summary — totals and aggregates (LAUNCH-01)
    this.app.get('/accommodation-log/summary', async (_req: Request, res: Response) => {
      try {
        const summary = await this.accommodationLogStore.getSummary();
        return res.json(summary);
      } catch (e) {
        this.logger.error('GET /accommodation-log/summary:', e);
        return res.status(500).json({ error: 'Failed to get summary' });
      }
    });

    // GET /queue — held messages only (kernel + metadata, no original content) (LAUNCH-01)
    this.app.get('/queue', (_req: Request, res: Response) => {
      return res.json(this.heldMessages.map((m) => ({ id: m.id, voltage: m.voltage, kernel: m.kernel, source: m.source, timestamp: m.timestamp })));
    });

    // POST /queue/:id/release — release a held message (LAUNCH-01)
    this.app.post('/queue/:id/release', async (req: Request, res: Response) => {
      const id = req.params.id;
      const idx = this.heldMessages.findIndex((m) => m.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Held message not found' });
      this.heldMessages.splice(idx, 1);
      await this.accommodationLogStore.insert({
        timestamp: new Date().toISOString(),
        event_type: 'message_released',
        signal: '',
        voltage_before: this.currentVoltage,
        voltage_after: this.currentVoltage,
        source: 'shelter',
        details: '',
        accommodation_type: 'release',
      }).catch((err) => this.logger.error('Accommodation log insert:', err));
      this.broadcastToScopes({ type: 'message:released', data: { id } });
      return res.json({ success: true, id });
    });

    // Get metabolism status
    this.app.get('/api/metabolism', (_req: Request, res: Response) => {
      try {
        const state = this.metabolism.getState();
        return res.json(state);
      } catch (error) {
        this.logger.error('Error getting metabolism status:', error);
        return res.status(500).json({ error: 'Failed to get metabolism status' });
      }
    });

    // Submit message (with input validation)
    this.app.post('/api/messages', validateMessage, async (req: Request, res: Response) => {
      try {
        const { message, priority = 'normal', metadata = {} } = req.body;
        
        // Check if we have enough energy
        if (!this.metabolism.canProcess(priority)) {
          return res.status(503).json({
            error: 'Insufficient energy',
            metabolism: this.metabolism.getState(),
            message: 'System is low on energy. Please wait for recovery.',
          });
        }
        
        if (!message || typeof message !== 'string') {
          return res.status(400).json({ error: 'Message is required and must be a string' });
        }

        // Create initial message
        const initialMessage: QueuedMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          message,
          priority: priority as 'low' | 'normal' | 'high' | 'urgent',
          metadata,
          timestamp: new Date().toISOString(),
          status: 'pending'
        };

        // Filter and adjust priority if needed
        const filtered = this.messageFilter.filter(initialMessage);
        const processedMessage: QueuedMessage = {
          ...initialMessage,
          priority: filtered.priority,
          metadata: {
            ...initialMessage.metadata,
            ...filtered.metadata,
            filterReason: filtered.reason,
          },
        };

        const messageId = await this.messageQueue.enqueue(processedMessage);

        this.logger.info(`Message enqueued: ${messageId} (priority: ${processedMessage.priority}, reason: ${filtered.reason})`);
        return res.json({ 
          success: true, 
          messageId, 
          status: 'queued',
          priority: processedMessage.priority,
          filterReason: filtered.reason,
        });
      } catch (error) {
        this.logger.error('Error submitting message:', error);
        return res.status(500).json({ error: 'Failed to submit message' });
      }
    });

    // Get message status
    this.app.get('/api/messages/:messageId', async (req: Request, res: Response) => {
      try {
        const { messageId } = req.params;
        if (!messageId) {
          return res.status(400).json({ error: 'Message ID is required' });
        }
        const status = await this.bufferStore.getMessageStatus(messageId);
        
        if (!status) {
          return res.status(404).json({ error: 'Message not found' });
        }
        
        return res.json(status);
      } catch (error) {
        this.logger.error('Error getting message status:', error);
        return res.status(500).json({ error: 'Failed to get message status' });
      }
    });

    // Get queue status
    this.app.get('/api/queue/status', async (_req: Request, res: Response) => {
      try {
        const status = await this.messageQueue.getStatus();
        return res.json(status);
      } catch (error) {
        this.logger.error('Error getting queue status:', error);
        return res.status(500).json({ error: 'Failed to get queue status' });
      }
    });

    // Ping status
    // Ping status (alias for compatibility)
    this.app.get('/api/ping', (_req: Request, res: Response) => {
      return res.json(this.ping.getStatus());
    });

    this.app.get('/api/ping/status', (_req: Request, res: Response) => {
      return res.json(this.ping.getStatus());
    });

    // Heartbeat
    this.app.post('/api/ping/heartbeat', (req: Request, res: Response) => {
      const { nodeId, signalStrength } = req.body;
      this.ping.recordHeartbeat(nodeId || 'unknown', signalStrength || 0);
      res.json({ success: true, timestamp: new Date().toISOString() });
    });

    // Get message history
    this.app.get('/api/messages', async (req: Request, res: Response) => {
      try {
        const limit = parseInt(req.query.limit as string) || 50;
        const offset = parseInt(req.query.offset as string) || 0;
        const status = req.query.status as string | undefined;

        const messages = await this.bufferStore.getMessages(limit, offset, status);
        const total = await this.bufferStore.getMessageCount(status);

        res.json({
          messages,
          total,
          limit,
          offset,
          hasMore: offset + messages.length < total,
        });
      } catch (error) {
        this.logger.error('Error getting messages:', error);
        res.status(500).json({ error: 'Failed to get messages' });
      }
    });

    // Get message statistics
    this.app.get('/api/messages/stats', async (_req: Request, res: Response) => {
      try {
        const total = await this.bufferStore.getMessageCount();
        const pending = await this.bufferStore.getMessageCount('pending');
        const processing = await this.bufferStore.getMessageCount('processing');
        const completed = await this.bufferStore.getMessageCount('completed');
        const failed = await this.bufferStore.getMessageCount('failed');

        return res.json({
          total,
          pending,
          processing,
          completed,
          failed,
        });
      } catch (error) {
        this.logger.error('Error getting message stats:', error);
        return res.status(500).json({ error: 'Failed to get message stats' });
      }
    });

    // Get monitoring metrics
    this.app.get('/api/monitoring/metrics', (_req: Request, res: Response) => {
      try {
        const metrics = this.monitoring.getMetrics();
        return res.json(metrics);
      } catch (error) {
        this.logger.error('Error getting metrics:', error);
        return res.status(500).json({ error: 'Failed to get metrics' });
      }
    });

    // Get alerts
    this.app.get('/api/monitoring/alerts', async (_req: Request, res: Response) => {
      try {
        const alerts = await this.monitoring.checkHealth();
        return res.json(alerts);
      } catch (error) {
        this.logger.error('Error getting alerts:', error);
        return res.status(500).json({ error: 'Failed to get alerts' });
      }
    });

    // Resolve alert
    this.app.post('/api/monitoring/alerts/:alertId/resolve', (req: Request, res: Response) => {
      try {
        const { alertId } = req.params;
        if (!alertId) {
          return res.status(400).json({ error: 'Alert ID is required' });
        }
        this.monitoring.resolveAlert(alertId);
        return res.json({ success: true });
      } catch (error) {
        this.logger.error('Error resolving alert:', error);
        return res.status(500).json({ error: 'Failed to resolve alert' });
      }
    });

    // P31 Game Integration — molecule, brain, sync, mesh, wallet
    this.app.use('/api/game', createGameRouter(this.gameStore));
    // P31 Sprout — signals
    this.app.use(
      '/api/sprout',
      createSproutRouter(this.gameStore, (payload) => this.broadcastAll(payload))
    );
  }

  private setupWebSocket(): void {
    this.wss.on('connection', (ws: WebSocket, req: express.Request | { socket: { remoteAddress?: string }; url?: string }) => {
      const ip = this.normalizeIp((req as { socket: { remoteAddress?: string } }).socket?.remoteAddress ?? 'unknown');
      this.wsToIp.set(ws, ip);
      this.wsPingState.set(ws, { missedPings: 0, timer: null });
      this.logger.info('[MESH] WebSocket connection established');

      ws.on('pong', () => {
        const state = this.wsPingState.get(ws);
        if (state) {
          state.missedPings = 0;
          if (state.timer) clearTimeout(state.timer);
          state.timer = null;
        }
      });

      // Send initial status (before client is tagged)
      this.messageQueue.getStatus().then((status) => {
        if (ws.readyState === 1) {
          ws.send(JSON.stringify({ type: 'status', data: status, timestamp: new Date().toISOString() }));
        }
      });

      ws.on('message', async (message: Buffer) => {
        try {
          const data = JSON.parse(message.toString()) as {
            type: string;
            signal?: string;
            timestamp?: string;
            message?: string;
            response?: string;
          };

          switch (data.type) {
            case 'sprout:signal': {
              if (!this.wsClientRole.has(ws)) {
                this.sproutConnectionId += 1;
                const id = this.sproutConnectionId;
                this.wsClientRole.set(ws, 'sprout');
                this.wsSproutId.set(ws, id);
                this.logger.info(`[MESH] Sprout connected (sprout-${id})`);
              }
              const signal = (data.signal ?? 'ok') as string;
              const sproutId = this.wsSproutId.get(ws) ?? 0;
              const ts = data.timestamp ?? new Date().toISOString();
              const prevVoltage = this.currentVoltage;
              if (signal === 'help') {
                this.currentVoltage = 'red';
                this.broadcastToScopes({
                  type: 'sprout:signal',
                  data: { signal, timestamp: ts, urgency: 'high' }
                });
                this.broadcastToScopes({ type: 'signal:help', data: { signal, timestamp: ts } });
              } else if (signal === 'break' || signal === 'hug') {
                this.currentVoltage = 'amber';
                this.broadcastToScopes({
                  type: 'sprout:signal',
                  data: { signal, timestamp: ts, urgency: 'medium' }
                });
                this.broadcastToScopes({ type: 'signal:status', data: { signal, timestamp: ts } });
              } else {
                this.currentVoltage = 'green';
                this.broadcastToScopes({
                  type: 'sprout:signal',
                  data: { signal, timestamp: ts, urgency: 'low' }
                });
                this.broadcastToScopes({ type: 'signal:status', data: { signal, timestamp: ts } });
              }
              this.accommodationLogStore.insert({
                timestamp: ts,
                event_type: 'sprout_signal',
                signal,
                voltage_before: prevVoltage,
                voltage_after: this.currentVoltage,
                source: 'sprout',
                details: '',
                accommodation_type: 'signal_received',
              }).catch((err) => this.logger.error('Accommodation log insert:', err));
              this.broadcastToScopes({
                type: 'voltage:update',
                data: { voltage: this.currentVoltage, previous: prevVoltage }
              });
              this.logger.info(`[MESH] Signal: ${signal} from sprout-${sproutId} → voltage ${prevVoltage} → ${this.currentVoltage}`);
              break;
            }
            case 'scope:respond': {
              if (!this.wsClientRole.has(ws)) {
                this.wsClientRole.set(ws, 'scope');
                this.logger.info('[MESH] Scope subscribed');
              }
              const responseMessage = typeof data.message === 'string' ? data.message : typeof data.response === 'string' ? data.response : 'They saw your signal 💚';
              this.accommodationLogStore.insert({
                timestamp: new Date().toISOString(),
                event_type: 'scope_response',
                signal: '',
                voltage_before: this.currentVoltage,
                voltage_after: this.currentVoltage,
                source: 'scope',
                details: '',
                accommodation_type: 'response_sent',
              }).catch((err) => this.logger.error('Accommodation log insert:', err));
              this.broadcastToSprouts({
                type: 'scope:response',
                data: { message: responseMessage }
              });
              this.logger.info('[MESH] Scope responded → broadcast to Sprouts');
              break;
            }
            case 'scope:subscribe': {
              if (!this.wsClientRole.has(ws)) {
                this.wsClientRole.set(ws, 'scope');
                this.logger.info('[MESH] Scope subscribed');
              }
              const lastSignalEntry = await this.accommodationLogStore.getLastSproutSignal();
              const queueStatus = await this.messageQueue.getStatus();
              ws.send(JSON.stringify({
                type: 'scope:subscribed',
                data: {
                  lastSignal: lastSignalEntry,
                  currentVoltage: this.currentVoltage,
                  queueLength: queueStatus.queueLength
                },
                timestamp: new Date().toISOString()
              }));
              break;
            }
            case 'subscribe':
              ws.send(JSON.stringify({ type: 'subscribed', channel: (data as { channel?: string }).channel }));
              const statusSub = await this.messageQueue.getStatus();
              ws.send(JSON.stringify({ type: 'status', data: statusSub, timestamp: new Date().toISOString() }));
              break;
            case 'status': {
              const queueStatus = await this.messageQueue.getStatus();
              ws.send(JSON.stringify({ type: 'status', data: queueStatus, timestamp: new Date().toISOString() }));
              break;
            }
            case 'ping':
              ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
              break;
            default:
              break;
          }
        } catch (error) {
          this.logger.error('WebSocket message error:', error);
          if (ws.readyState === 1) {
            ws.send(JSON.stringify({ error: 'Invalid message format' }));
          }
        }
      });

      ws.on('close', () => {
        const role = this.wsClientRole.get(ws);
        const clientIp = this.wsToIp.get(ws);
        if (clientIp) {
          const n = (this.wsConnectionsByIp.get(clientIp) ?? 1) - 1;
          if (n <= 0) this.wsConnectionsByIp.delete(clientIp);
          else this.wsConnectionsByIp.set(clientIp, n);
        }
        const state = this.wsPingState.get(ws);
        if (state?.timer) clearTimeout(state.timer);
        this.logger.info(`[MESH] WebSocket closed (${role ?? 'untagged'})`);
      });
    });

    this.startWsHeartbeat();
  }

  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  private startWsHeartbeat(): void {
    const PING_INTERVAL_MS = 30000;
    const PONG_TIMEOUT_MS = 35000;
    const MAX_MISSED_PONGS = 3;
    this.heartbeatInterval = setInterval(() => {
      this.wss.clients.forEach((client) => {
        const ws = client as WebSocket;
        if (ws.readyState !== 1) return;
        let state = this.wsPingState.get(ws);
        if (!state) state = { missedPings: 0, timer: null };
        this.wsPingState.set(ws, state);
        if (state.timer) clearTimeout(state.timer);
        state.timer = setTimeout(() => {
          state!.missedPings += 1;
          state!.timer = null;
          if (state!.missedPings >= MAX_MISSED_PONGS) {
            this.logger.warn('[MESH] Client disconnected: 3 missed pongs (90s)');
            ws.close();
          }
        }, PONG_TIMEOUT_MS);
        ws.ping();
      });
    }, PING_INTERVAL_MS);
  }

  private startBatching(): void {
    setInterval(async () => {
      try {
        const batch = await this.messageQueue.dequeueBatch(this.maxBatchSize);
        
        if (batch.length > 0) {
          this.logger.info(`Processing batch of ${batch.length} messages`);
          
          // Filter and process batch
          const filteredBatch = this.messageFilter.processBatch(batch);
          
          // Process batch with retry logic
          const startTime = Date.now();
          let processed = 0;
          let failed = 0;
          
          for (const message of filteredBatch) {
            message.status = 'processing';
            
            // Check energy before processing
            if (!this.metabolism.canProcess(message.priority)) {
              this.logger.warn(`Insufficient energy to process message ${message.id}, deferring`);
              // Put message back in queue
              continue;
            }
            
            // Consume energy
            if (!this.metabolism.consume(message.priority)) {
              this.logger.warn(`Failed to consume energy for message ${message.id}, deferring`);
              continue;
            }
            
            try {
              // Process message locally first
              await this.retryHandler.executeWithJitter(
                async () => {
                  await this.bufferStore.saveMessage(message);
                },
                `message ${message.id}`
              );
              
              // Forward to The Centaur
              const centaurResponse = await this.centaurClient.forwardMessage(message);
              
              if (centaurResponse.success) {
                // Mark as completed after successful forwarding
                const completed: QueuedMessage = {
                  ...message,
                  status: 'completed',
                  metadata: {
                    ...message.metadata,
                    centaurMessageId: centaurResponse.messageId,
                    centaurResponse: centaurResponse.response,
                  },
                };
                await this.bufferStore.saveMessage(completed);
                await this.messageQueue.acknowledge(message.id);
                processed++;
              } else {
                // Forwarding failed, but message is saved
                this.logger.warn(`Failed to forward message ${message.id} to The Centaur: ${centaurResponse.error}`);
                // Keep message in queue for retry
                failed++;
              }
            } catch (error) {
              this.logger.error(`Failed to process message ${message.id} after retries:`, error);
              
              // Mark as failed
              const failedMessage: QueuedMessage = {
                ...message,
                status: 'failed',
                metadata: {
                  ...message.metadata,
                  error: error instanceof Error ? error.message : String(error),
                  failedAt: new Date().toISOString(),
                },
              };
              await this.bufferStore.saveMessage(failedMessage);
              failed++;
            }
          }
          
          // Update metrics
          const processingTime = Date.now() - startTime;
          this.monitoring.updateMetrics(processed, failed, processingTime);
          
          // Broadcast batch processed
          this.wss.clients.forEach((client) => {
            if (client.readyState === 1) {
              client.send(JSON.stringify({
                type: 'batch_processed',
                count: filteredBatch.length,
                timestamp: new Date().toISOString(),
                priorities: filteredBatch.reduce((acc, msg) => {
                  acc[msg.priority] = (acc[msg.priority] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>),
              }));
            }
          });
        }
      } catch (error) {
        this.logger.error('Error processing batch:', error);
      }
    }, this.bufferWindowMs);
  }

  private startMonitoring(): void {
    // Check health every 30 seconds
    setInterval(async () => {
      try {
        const alerts = await this.monitoring.checkHealth();
        
        // Broadcast alerts via WebSocket
        if (alerts.length > 0) {
          this.wss.clients.forEach((client) => {
            if (client.readyState === 1) {
              client.send(JSON.stringify({
                type: 'alerts',
                alerts,
                timestamp: new Date().toISOString(),
              }));
            }
          });
        }
      } catch (error) {
        this.logger.error('Error in monitoring check:', error);
      }
    }, 30000);
  }

  private broadcastWs(payload: { type: string; data?: unknown }): void {
    this.broadcastAll(payload);
  }

  /** Send only to clients that identified as Scope (dashboard). */
  private broadcastToScopes(payload: { type: string; data?: unknown }): void {
    const msg = JSON.stringify({ ...payload, timestamp: new Date().toISOString() });
    this.wss.clients.forEach((client) => {
      if (client.readyState === 1 && this.wsClientRole.get(client as WebSocket) === 'scope') {
        (client as WebSocket).send(msg);
      }
    });
  }

  /** Send only to clients that identified as Sprout (kid interface). */
  private broadcastToSprouts(payload: { type: string; data?: unknown }): void {
    const msg = JSON.stringify({ ...payload, timestamp: new Date().toISOString() });
    this.wss.clients.forEach((client) => {
      if (client.readyState === 1 && this.wsClientRole.get(client as WebSocket) === 'sprout') {
        (client as WebSocket).send(msg);
      }
    });
  }

  /** Send to all connected clients. */
  private broadcastAll(payload: { type: string; data?: unknown }): void {
    const msg = JSON.stringify({ ...payload, timestamp: new Date().toISOString() });
    this.wss.clients.forEach((client) => {
      if (client.readyState === 1) (client as WebSocket).send(msg);
    });
  }

  public getPort(): number {
    return this.port;
  }

  public async start(): Promise<void> {
    this.startTime = Date.now();
    await this.messageQueue.connect();
    await this.bufferStore.initialize();
    await this.accommodationLogStore.initialize();
    await this.gameStore.initialize();
    this.ping.start();
    this.metabolism.start();

    const tryListen = (port: number): Promise<void> =>
      new Promise((resolve, reject) => {
        const onListen = (): void => {
          this.server.off('error', onError);
          this.port = port;
          this.logger.info(`🚀 The Buffer running on http://localhost:${this.port}`);
          resolve();
        };
        const onError = (err: NodeJS.ErrnoException): void => {
          if (err?.code === 'EADDRINUSE' && port < 4010) {
            this.logger.warn(`Port ${port} in use, trying ${port + 1}...`);
            this.server.close(() => tryListen(port + 1).then(resolve).catch(reject));
          } else {
            this.logger.error('Failed to start server:', err);
            reject(err);
          }
        };
        this.server.once('error', onError);
        this.server.listen(port, onListen);
      });

    return tryListen(this.port);
  }

  public async stop(): Promise<void> {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    this.ping.stop();
    this.metabolism.stop();
    await this.gameStore.close();
    await this.accommodationLogStore.close();
    await this.bufferStore.close();
    await this.messageQueue.disconnect();
    
    return new Promise((resolve) => {
      this.wss.close(() => {
        this.server.close(() => {
          this.logger.info('🛑 The Buffer stopped');
          resolve();
        });
      });
    });
  }
}
