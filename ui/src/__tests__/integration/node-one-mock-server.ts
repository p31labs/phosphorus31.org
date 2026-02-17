/**
 * Mock Node One Server
 * Simulates NODE ONE (ESP32-S3) WiFi AP for integration testing
 * 
 * This mock server runs on port 8080 and mimics the Node One API
 * when physical hardware is not available.
 */

import express, { Express, Request, Response } from 'express';
import { createServer, Server as HTTPServer } from 'http';
import { WebSocketServer } from 'ws';

export interface NodeOneMockConfig {
  port?: number;
  batteryLevel?: number;
  wifiClients?: number;
  loraSignal?: number;
  audioRecording?: boolean;
}

export class NodeOneMockServer {
  private app: Express;
  private server: HTTPServer;
  private wss: WebSocketServer;
  private port: number;
  private batteryLevel: number;
  private wifiClients: number;
  private loraSignal: number;
  private audioRecording: boolean;
  private audioBuffer: Buffer | null = null;
  private loraMessages: Array<{
    id: string;
    content: string;
    from: string;
    timestamp: string;
  }> = [];

  constructor(config: NodeOneMockConfig = {}) {
    this.port = config.port || 8080;
    this.batteryLevel = config.batteryLevel ?? 85;
    this.wifiClients = config.wifiClients ?? 1;
    this.loraSignal = config.loraSignal ?? 75;
    this.audioRecording = config.audioRecording ?? false;

    this.app = express();
    this.server = createServer(this.app);
    this.wss = new WebSocketServer({ server: this.server });

    this.setupRoutes();
    this.setupWebSocket();
  }

  private setupRoutes(): void {
    this.app.use(express.json());

    // Device status
    this.app.get('/api/status', (_req: Request, res: Response) => {
      res.json({
        battery: this.batteryLevel,
        wifi: {
          ssid: 'NODE_ONE_AP',
          clients: this.wifiClients,
          connected: true,
        },
        lora: {
          enabled: true,
          signalStrength: this.loraSignal,
          connected: true,
        },
        audio: {
          recording: this.audioRecording,
          available: true,
        },
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      });
    });

    // Start audio recording
    this.app.post('/api/audio/record', (_req: Request, res: Response) => {
      this.audioRecording = true;
      this.audioBuffer = null;
      res.json({
        success: true,
        recording: true,
        timestamp: new Date().toISOString(),
      });
    });

    // Stop recording and get audio buffer
    this.app.post('/api/audio/stop', (_req: Request, res: Response) => {
      this.audioRecording = false;
      // Generate mock audio buffer (simulated)
      this.audioBuffer = Buffer.from('mock_audio_data_' + Date.now());
      res.json({
        success: true,
        recording: false,
        audioBuffer: this.audioBuffer.toString('base64'),
        duration: 5000, // 5 seconds
        timestamp: new Date().toISOString(),
      });
    });

    // Get LoRa messages
    this.app.get('/api/messages', (_req: Request, res: Response) => {
      res.json({
        messages: this.loraMessages,
        total: this.loraMessages.length,
      });
    });

    // Send LoRa message
    this.app.post('/api/messages', (req: Request, res: Response) => {
      const { content, to } = req.body;
      const message = {
        id: `msg_${Date.now()}`,
        content,
        to: to || 'broadcast',
        from: 'NODE_ONE',
        timestamp: new Date().toISOString(),
      };
      this.loraMessages.push(message);
      res.json({
        success: true,
        messageId: message.id,
      });
    });

    // Mesh status
    this.app.get('/api/mesh/status', (_req: Request, res: Response) => {
      res.json({
        connected: true,
        nodes: [
          {
            nodeId: 'NODE_ONE',
            signalStrength: 100,
            lastSeen: new Date().toISOString(),
          },
          {
            nodeId: 'node_one',
            signalStrength: 75,
            lastSeen: new Date().toISOString(),
          },
        ],
        totalNodes: 2,
      });
    });

    // Health check
    this.app.get('/health', (_req: Request, res: Response) => {
      res.json({
        status: 'healthy',
        device: 'NODE_ONE',
        timestamp: new Date().toISOString(),
      });
    });
  }

  private setupWebSocket(): void {
    this.wss.on('connection', (ws) => {
      console.log('Node One WebSocket client connected');

      // Send initial status
      ws.send(
        JSON.stringify({
          type: 'status',
          data: {
            battery: this.batteryLevel,
            wifi: { clients: this.wifiClients },
            lora: { signalStrength: this.loraSignal },
          },
        })
      );

      // Simulate periodic updates
      const statusInterval = setInterval(() => {
        if (ws.readyState === 1) {
          ws.send(
            JSON.stringify({
              type: 'status_update',
              data: {
                battery: this.batteryLevel,
                timestamp: new Date().toISOString(),
              },
            })
          );
        }
      }, 5000);

      // Simulate audio level updates when recording
      const audioInterval = setInterval(() => {
        if (this.audioRecording && ws.readyState === 1) {
          ws.send(
            JSON.stringify({
              type: 'audio_level',
              data: {
                level: Math.random() * 100,
                timestamp: new Date().toISOString(),
              },
            })
          );
        }
      }, 100);

      // Simulate incoming LoRa messages
      const loraInterval = setInterval(() => {
        if (ws.readyState === 1 && Math.random() > 0.9) {
          const message = {
            id: `lora_${Date.now()}`,
            content: 'Mock LoRa message',
            from: 'node_one',
            timestamp: new Date().toISOString(),
          };
          this.loraMessages.push(message);
          ws.send(
            JSON.stringify({
              type: 'lora_message',
              data: message,
            })
          );
        }
      }, 10000);

      ws.on('close', () => {
        clearInterval(statusInterval);
        clearInterval(audioInterval);
        clearInterval(loraInterval);
        console.log('Node One WebSocket client disconnected');
      });

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          if (message.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong' }));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });
    });
  }

  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.listen(this.port, (error?: Error) => {
        if (error) {
          reject(error);
        } else {
          console.log(`🔌 Mock Node One server running on http://localhost:${this.port}`);
          resolve();
        }
      });
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve) => {
      this.wss.close(() => {
        this.server.close(() => {
          console.log('🛑 Mock Node One server stopped');
          resolve();
        });
      });
    });
  }

  // Test helpers
  public setBatteryLevel(level: number): void {
    this.batteryLevel = Math.max(0, Math.min(100, level));
  }

  public setWifiClients(count: number): void {
    this.wifiClients = count;
  }

  public setLoraSignal(strength: number): void {
    this.loraSignal = Math.max(0, Math.min(100, strength));
  }

  public addLoRaMessage(message: { content: string; from: string }): void {
    this.loraMessages.push({
      id: `msg_${Date.now()}`,
      content: message.content,
      from: message.from,
      timestamp: new Date().toISOString(),
    });
  }
}
