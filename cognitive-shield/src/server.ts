/**
 * The Buffer Server - Express API with Redis message queue
 */

import express, { Request, Response } from 'express';
import { createServer, Server as HTTPServer } from 'http';
import { WebSocketServer } from 'ws';
import { MessageQueue } from './queue';
import { BufferStore } from './store';
import { Logger } from './utils/logger';
import { Ping } from './ping';
import { MessageFilter } from './filter';
import { RetryHandler } from './retry';
import { BufferMonitoring } from './monitoring';
import { CentaurClient } from './centaur-client';
import { Metabolism } from './metabolism';
import { bufferRateLimit, validateMessage, bufferSecurityHeaders } from './security/security-middleware';
import { QueuedMessage } from './queue';

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
  
  private readonly port: number;
  private readonly bufferWindowMs: number;
  private readonly maxBatchSize: number;

  constructor() {
    this.port = parseInt(process.env.PORT || '4000', 10);
    this.bufferWindowMs = parseInt(process.env.BUFFER_WINDOW_MS || '60000', 10);
    this.maxBatchSize = parseInt(process.env.MAX_BATCH_SIZE || '100', 10);
    
    this.logger = new Logger('BufferServer');
    this.app = express();
    this.server = createServer(this.app);
    this.wss = new WebSocketServer({ server: this.server });
    
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
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
    this.startBatching();
    this.startMonitoring();
  }

  private setupMiddleware(): void {
    // Security headers first
    this.app.use(bufferSecurityHeaders);
    
    // Rate limiting
    this.app.use(bufferRateLimit());
    
    // Body parsing with size limits
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // CORS - Secure configuration
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || 
      (process.env.NODE_ENV === 'production' ? [] : ['http://localhost:5173', 'http://localhost:3000']);
    
    this.app.use((req: Request, res: Response, next) => {
      const origin = req.headers.origin;
      
      if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
      } else if (process.env.NODE_ENV === 'production' && allowedOrigins.length > 0) {
        // In production, reject unknown origins
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
    // Health check
    this.app.get('/health', async (_req: Request, res: Response) => {
      return res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        systems: {
          queue: this.messageQueue.isConnected(),
          store: this.bufferStore.isReady(),
          ping: this.ping.isActive(),
          centaur: await this.centaurClient.checkHealth(),
          metabolism: this.metabolism.getState()
        }
      });
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
  }

  private setupWebSocket(): void {
    this.wss.on('connection', (ws) => {
      this.logger.info('WebSocket connection established');
      
      // Send initial status
      this.messageQueue.getStatus().then(status => {
        ws.send(JSON.stringify({ 
          type: 'status', 
          data: status,
          timestamp: new Date().toISOString(),
        }));
      });
      
      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message.toString());
          
          switch (data.type) {
            case 'subscribe':
              ws.send(JSON.stringify({ type: 'subscribed', channel: data.channel }));
              // Send current status on subscribe
              const status = await this.messageQueue.getStatus();
              ws.send(JSON.stringify({ 
                type: 'status', 
                data: status,
                timestamp: new Date().toISOString(),
              }));
              break;
            case 'status':
              const queueStatus = await this.messageQueue.getStatus();
              ws.send(JSON.stringify({ 
                type: 'status', 
                data: queueStatus,
                timestamp: new Date().toISOString(),
              }));
              break;
            case 'ping':
              ws.send(JSON.stringify({ 
                type: 'pong',
                timestamp: new Date().toISOString(),
              }));
              break;
          }
        } catch (error) {
          this.logger.error('WebSocket message error:', error);
          ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
      });
      
      ws.on('close', () => {
        this.logger.info('WebSocket connection closed');
      });
    });
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

  public async start(): Promise<void> {
    await this.messageQueue.connect();
    await this.bufferStore.initialize();
    this.ping.start();
    this.metabolism.start();
    
    return new Promise((resolve, reject) => {
      this.server.listen(this.port, (error?: Error) => {
        if (error) {
          this.logger.error('Failed to start server:', error);
          reject(error);
        } else {
          this.logger.info(`🚀 The Buffer running on http://localhost:${this.port}`);
          resolve();
        }
      });
    });
  }

  public async stop(): Promise<void> {
    this.ping.stop();
    this.metabolism.stop();
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
