/**
 * SUPER CENTAUR Server - Unified Server for Legal AI + Autonomous Agents
 * All mutable routes backed by persistent DataStore.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer, Server as HTTPServer } from 'http';
import { WebSocketServer } from 'ws';
import { Logger } from '../utils/logger';
import { ConfigManager } from './config-manager';
import { DataStore } from '../database/store';
import { LegalAIEngine } from '../legal/legal-ai-engine';
import { MedicalDocumentationSystem } from '../medical/medical-documentation-system';
import { BlockchainManager } from '../blockchain/blockchain-manager';
import { AutonomousAgentManager } from '../blockchain/autonomous-agent-manager';
import { Chatbot } from '../frontend/components/chatbot';
import { PerformanceOptimizer } from '../optimization/performance-optimizer';
import { SecurityManager } from '../security/security-manager';
import { BackupManager } from '../backup/backup-manager';
import { MonitoringSystem } from '../monitoring/monitoring-system';
import { QuantumBrainBridge } from '../quantum-brain';
import { createSOPRoutes } from '../quantum-brain/sop-routes';
import { QuantumLab } from '../quantum';
import { createQuantumLabRoutes } from '../quantum/quantum-lab-routes';
import { SpoonEngine } from '../spoons';
import { WalletManager } from '../wallet';
import { GoogleDriveManager } from '../google-drive';
import { SovereignGoogleDriveManager, SovereigntyValidator, digitalSelfCoreManager } from '../sovereignty';
import { AuthManager } from '../auth/auth-manager';
import { BufferClient } from '../buffer/buffer-client';
import { authenticate } from './middleware';
import { ValidationMiddleware } from '../middleware/validation';
import { applySecurityMiddleware, validateSecurityConfiguration } from '../security/secure-middleware';

// Type imports from express
type Express = express.Express;
type Request = express.Request;
type Response = express.Response;
type NextFunction = express.NextFunction;

export class SuperCentaurServer {
  private app: Express;
  private server: HTTPServer;
  private wss: WebSocketServer;
  private logger: Logger;
  private config: any;
  private store: DataStore;

  // Core systems
  private legalAI!: LegalAIEngine;
  private medicalSystem!: MedicalDocumentationSystem;
  private blockchainManager!: BlockchainManager;
  private agentManager!: AutonomousAgentManager;
  private chatbot!: Chatbot;
  private performanceOptimizer!: PerformanceOptimizer;
  private securityManager!: SecurityManager;
  private backupManager!: BackupManager;
  private monitoringSystem!: MonitoringSystem;
  private quantumBrain!: QuantumBrainBridge;
  private quantumLab!: QuantumLab;
  private googleDrive!: GoogleDriveManager;
  private sovereignGoogleDrive!: SovereignGoogleDriveManager;
  private sovereigntyValidator!: SovereigntyValidator;
  private authManager!: AuthManager;
  private spoonEngine!: SpoonEngine;
  private walletManager!: WalletManager;
  private bufferClient!: BufferClient;

  constructor(config: any) {
    this.config = config;
    this.logger = new Logger('SuperCentaurServer');
    this.store = DataStore.getInstance();
    this.app = express();
    this.server = createServer(this.app);
    this.wss = new WebSocketServer({ server: this.server });

    this.seedDefaults();
    this.initializeSystems();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
  }

  /** Seed default data into DataStore if collections are empty */
  private seedDefaults(): void {
    // Wallet balance
    if (this.store.count('wallet') === 0) {
      this.store.insert('wallet', { id: 'main', balance: 12500, currency: 'LOVE' });
    }

    // Family members
    if (this.store.count('family_members') === 0) {
      this.store.insert('family_members', { id: 'member_1', name: 'Protected Member', relationship: 'child', accessLevel: 'full' });
    }

    // Custody cases
    if (this.store.count('custody_cases') === 0) {
      this.store.insert('custody_cases', {
        id: 'case_001',
        caseNumber: 'FC-2026-001',
        status: 'active',
        court: 'Family Court',
        nextHearing: new Date(Date.now() + 14 * 86400000).toISOString(),
        currentIssues: ['Custody modification', 'Visitation schedule'],
      });
    }

    // Family wallets (multi-wallet system)
    if (this.store.count('wallets') === 0) {
      this.store.insert('wallets', { id: 'wallet_sj', memberId: 'sj', memberName: 'S.J.', role: 'Founding Node', balance: 5000, currency: 'LOVE' });
      this.store.insert('wallets', { id: 'wallet_wj', memberId: 'wj', memberName: 'W.J.', role: 'Founding Node', balance: 4000, currency: 'LOVE' });
      this.store.insert('wallets', { id: 'wallet_will', memberId: 'will', memberName: 'Will', role: 'Trustee', balance: 2500, currency: 'LOVE' });
      this.store.insert('wallets', { id: 'wallet_community', memberId: 'community', memberName: 'Community Pool', role: 'Shared', balance: 1000, currency: 'LOVE' });
    }

    // Game challenges
    if (this.store.count('game_challenges') === 0) {
      this.store.insert('game_challenges', {
        id: 'ch_001', tier: 'seedling', title: 'First Triangle', description: 'Place your first tetrahedron on the build plate.',
        objectives: [{ type: 'build', target: 1, unit: 'tetrahedra', description: 'Place 1 tetrahedron' }],
        rewardLove: 10, coopRequired: false, coopBonus: 5, prerequisites: [],
        fullerPrinciple: 'The tetrahedron is nature\'s minimum structural system.',
        realWorldExample: 'Camera tripods use triangulation for stability!',
      });
      this.store.insert('game_challenges', {
        id: 'ch_002', tier: 'seedling', title: 'Twin Peaks', description: 'Place two connected tetrahedra.',
        objectives: [{ type: 'build', target: 2, unit: 'tetrahedra', description: 'Place 2 connected tetrahedra' }],
        rewardLove: 20, coopRequired: false, coopBonus: 10, prerequisites: ['ch_001'],
        fullerPrinciple: 'Structures gain strength through triangulated connections.',
        realWorldExample: 'Roof trusses use connected triangles to span wide spaces!',
      });
      this.store.insert('game_challenges', {
        id: 'ch_003', tier: 'sprout', title: 'The Rigid Frame', description: 'Build a structure that achieves 100% Maxwell ratio.',
        objectives: [{ type: 'efficiency', target: 1.0, unit: 'ratio', description: 'Achieve Maxwell ratio >= 1.0' }],
        rewardLove: 50, rewardBadge: 'rigid_master', coopRequired: false, coopBonus: 25, prerequisites: ['ch_002'],
        fullerPrinciple: 'Maxwell\'s rule: E >= 3V - 6 guarantees rigidity.',
        realWorldExample: 'The Eiffel Tower uses this principle for its incredible strength-to-weight ratio!',
      });
    }

    // Consciousness baselines
    if (this.store.count('consciousness') === 0) {
      this.store.insert('consciousness', {
        id: 'baseline',
        coherence: 78, focus: 84, creativity: 72, awareness: 81, balance: 87,
      });
    }
  }

  private initializeSystems(): void {
    this.logger.info('Initializing SUPER CENTAUR systems...');
    
    // Validate security configuration first
    try {
      validateSecurityConfiguration();
      this.logger.info('✅ Security configuration validated');
    } catch (error: any) {
      this.logger.error('❌ Security configuration validation failed:', error);
      throw error;
    }
    
    let failures = 0;

    const initSystem = (name: string, initFn: () => any) => {
      try {
        const sys = initFn();
        this.logger.info(`✅ ${name} initialized`);
        return sys;
      } catch (error) {
        this.logger.warn(`⚠️ ${name} failed to initialize:`, error);
        failures++;
        return null;
      }
    };

    this.legalAI = initSystem('Legal AI Engine', () => new LegalAIEngine(this.config.legal, this.config.ai));
    this.medicalSystem = initSystem('Medical Documentation System', () => new MedicalDocumentationSystem(this.config.medical));
    this.blockchainManager = initSystem('Blockchain Manager', () => new BlockchainManager(this.config.blockchain));
    this.agentManager = initSystem('Autonomous Agent Manager', () => new AutonomousAgentManager(this.config.blockchain, this.config.ai));
    this.chatbot = initSystem('Smart Chatbot', () => new Chatbot(this.config.ai));
    this.performanceOptimizer = initSystem('Performance Optimizer', () => new PerformanceOptimizer());
    this.securityManager = initSystem('Security Manager', () => new SecurityManager());
    this.backupManager = initSystem('Backup Manager', () => new BackupManager());
    this.monitoringSystem = initSystem('Monitoring System', () => new MonitoringSystem());
    this.quantumBrain = initSystem('Quantum Brain Bridge', () => new QuantumBrainBridge());
    this.quantumLab = initSystem('Quantum Lab', () => new QuantumLab());
    this.googleDrive = initSystem('Google Drive Manager', () => new GoogleDriveManager());
    this.sovereignGoogleDrive = initSystem('Sovereign Google Drive Manager', () => new SovereignGoogleDriveManager(this.googleDrive));
    this.sovereigntyValidator = initSystem('Sovereignty Validator', () => new SovereigntyValidator());
    this.authManager = initSystem('Auth Manager', () => new AuthManager());
    this.spoonEngine = initSystem('Spoon Economy Engine', () => new SpoonEngine());
    this.walletManager = initSystem('Family Wallet Manager', () => new WalletManager());
    this.bufferClient = initSystem('Buffer Client', () => new BufferClient());

    if (failures === 0) {
      this.logger.info('🎉 All SUPER CENTAUR systems initialized successfully!');
    } else {
      this.logger.warn(`⚠️ ${failures} system(s) failed to initialize. Server will start with reduced functionality.`);
    }
  }

  private setupMiddleware(): void {
    // Apply security middleware first (includes headers, CORS, rate limiting)
    try {
      applySecurityMiddleware(this.app, this.logger);
      this.logger.info('✅ Security middleware applied');
    } catch (error: any) {
      this.logger.error('❌ Failed to apply security middleware:', error);
      // Don't throw - allow server to start with reduced security in dev
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    }

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request timing + logging middleware
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const start = Date.now();
      this.logger.info(`${req.method} ${req.path} - ${req.ip}`);

      res.on('finish', () => {
        const duration = Date.now() - start;
        const isError = res.statusCode >= 400;
        if (this.performanceOptimizer) this.performanceOptimizer.recordRequest(duration);
        if (this.monitoringSystem) this.monitoringSystem.recordRequest(duration, isError);
      });

      next();
    });

    // Authentication Middleware
    this.app.use(authenticate);

    // Error handling (must be last — 4-arg signature)
    this.app.use((error: any, req: Request, res: Response, _next: NextFunction) => {
      this.logger.error('Request error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    });
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        systems: {
          legalAI: this.legalAI ? 'active' : 'unavailable',
          medical: this.medicalSystem ? 'active' : 'unavailable',
          blockchain: this.blockchainManager ? 'active' : 'unavailable',
          agents: this.agentManager ? 'active' : 'unavailable',
          chatbot: this.chatbot ? 'active' : 'unavailable',
          optimizer: this.performanceOptimizer ? 'active' : 'unavailable',
          security: this.securityManager ? 'active' : 'unavailable',
          backup: this.backupManager ? 'active' : 'unavailable',
          monitoring: this.monitoringSystem ? 'active' : 'unavailable',
          quantumBrain: this.quantumBrain ? 'active' : 'unavailable',
          googleDrive: this.googleDrive ? 'active' : 'unavailable',
          auth: this.authManager ? 'active' : 'unavailable',
          buffer: this.bufferClient ? 'active' : 'unavailable',
        }
      });
    });

    // Quantum Brain health check
    this.app.get('/api/health/quantum-brain/status', (req: Request, res: Response) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        systems: {
          decisionEngine: 'active',
          consciousnessMonitor: 'active',
          quantumOptimizer: 'active',
          realTimeOptimizer: 'active',
          universalIntelligence: 'active',
          integration: 'active'
        }
      });
    });

    // API Routes
    this.setupAuthRoutes();
    this.setupLegalRoutes();
    this.setupMedicalRoutes();
    this.setupBlockchainRoutes();
    this.setupAgentRoutes();
    this.setupChatbotRoutes();
    this.setupConsciousnessRoutes();
    this.setupWalletRoutes();
    this.setupFamilyRoutes();
    this.setupSystemRoutes();
    this.setupGoogleDriveRoutes();
    this.setupSovereigntyRoutes();
    this.setupSpoonRoutes();
    this.setupFamilyWalletRoutes();
    this.setupGameRoutes();
    this.setupSOPRoutes();
    this.setupQuantumLabRoutes();
    this.setupBufferRoutes();

    // Frontend proxy
    this.app.use('/frontend', express.static(this.config.frontend.buildDir));

    // Root redirect to frontend
    this.app.get('/', (req: Request, res: Response) => {
      res.redirect('/frontend');
    });
  }

  private setupAuthRoutes(): void {
    // Enhanced login with MFA support
    this.app.post('/api/auth/login', async (req: Request, res: Response) => {
      if (!this.authManager) return res.status(503).json({ error: 'Auth system unavailable' });
      try {
        const { username, password } = req.body;
        const result = await this.authManager.loginWithMFA(username, password);
        
        if (!result.success) {
          if (result.requiresMFA) {
            return res.json({
              success: false,
              requiresMFA: true,
              mfaToken: result.mfaToken,
              user: result.user
            });
          }
          return res.status(401).json({ error: result.error });
        }
        
        res.json({
          success: true,
          token: result.token,
          user: result.user
        });
      } catch (error) {
        this.logger.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
      }
    });

    // Complete MFA authentication
    this.app.post('/api/auth/mfa/complete', async (req: Request, res: Response) => {
      if (!this.authManager) return res.status(503).json({ error: 'Auth system unavailable' });
      try {
        const { mfaToken, mfaCode } = req.body;
        const result = await this.authManager.completeMFA(mfaToken, mfaCode);
        
        if (!result.success) {
          return res.status(401).json({ error: result.error });
        }
        
        res.json({
          success: true,
          token: result.token,
          user: result.user
        });
      } catch (error) {
        this.logger.error('MFA completion error:', error);
        res.status(500).json({ error: 'MFA authentication failed' });
      }
    });

    // Setup MFA
    this.app.post('/api/auth/mfa/setup', async (req: Request, res: Response) => {
      if (!this.authManager) return res.status(503).json({ error: 'Auth system unavailable' });
      try {
        const { userId } = req.body;
        const result = await this.authManager.setupMFA(userId);
        res.json(result);
      } catch (error) {
        this.logger.error('MFA setup error:', error);
        res.status(500).json({ error: 'MFA setup failed' });
      }
    });

    // Enable MFA
    this.app.post('/api/auth/mfa/enable', async (req: Request, res: Response) => {
      if (!this.authManager) return res.status(503).json({ error: 'Auth system unavailable' });
      try {
        const { userId, mfaToken } = req.body;
        const success = await this.authManager.enableMFA(userId, mfaToken);
        res.json({ success, message: success ? 'MFA enabled successfully' : 'MFA verification failed' });
      } catch (error) {
        this.logger.error('MFA enable error:', error);
        res.status(500).json({ error: 'MFA enable failed' });
      }
    });

    // Disable MFA
    this.app.post('/api/auth/mfa/disable', async (req: Request, res: Response) => {
      if (!this.authManager) return res.status(503).json({ error: 'Auth system unavailable' });
      try {
        const { userId } = req.body;
        await this.authManager.disableMFA(userId);
        res.json({ success: true, message: 'MFA disabled successfully' });
      } catch (error) {
        this.logger.error('MFA disable error:', error);
        res.status(500).json({ error: 'MFA disable failed' });
      }
    });

    // Get MFA status
    this.app.get('/api/auth/mfa/status/:userId', async (req: Request, res: Response) => {
      if (!this.authManager) return res.status(503).json({ error: 'Auth system unavailable' });
      try {
        const { userId } = req.params;
        const status = this.authManager.getMFAStatus(userId);
        res.json(status);
      } catch (error) {
        this.logger.error('MFA status error:', error);
        res.status(500).json({ error: 'Failed to get MFA status' });
      }
    });

    this.app.post('/api/auth/register', async (req: Request, res: Response) => {
      if (!this.authManager) return res.status(503).json({ error: 'Auth system unavailable' });
      try {
        const { username, password } = req.body;
        const user = await this.authManager.register(username, password);
        res.json(user);
      } catch (error) {
        this.logger.error('Registration error:', error);
        res.status(400).json({ error: 'Registration failed (User likely exists)' });
      }
    });

    this.app.get('/api/auth/me', (req: Request, res: Response) => {
      // User is attached by middleware
      res.json((req as any).user);
    });
  }

  private setupLegalRoutes(): void {
    this.app.post('/api/legal/generate', async (req: Request, res: Response) => {
      if (!this.legalAI) return res.status(503).json({ error: 'Legal AI system unavailable', title: 'Legal Analysis', type: req.body.type, strategy: 'System initializing...', arguments: [], risk: 'unknown' });
      try {
        const { type, context, urgency } = req.body;
        const result = await this.legalAI.generateDocument(type, context, urgency);
        if (this.securityManager) this.securityManager.logAudit('legal_generate', 'user', req.ip || '127.0.0.1', 'success', `Generated ${type} document`);
        res.json(result);
      } catch (error) {
        this.logger.error('Legal document generation error:', error);
        res.status(500).json({ error: 'Failed to generate legal document' });
      }
    });

    this.app.post('/api/legal/emergency', async (req: Request, res: Response) => {
      if (!this.legalAI) return res.status(503).json({ error: 'Legal AI system unavailable' });
      try {
        const { situation, evidence } = req.body;
        const result = await this.legalAI.handleEmergency(situation, evidence);
        if (this.securityManager) this.securityManager.logAudit('legal_emergency', 'user', req.ip || '127.0.0.1', 'success', 'Emergency legal response triggered');
        res.json(result);
      } catch (error) {
        this.logger.error('Emergency legal response error:', error);
        res.status(500).json({ error: 'Failed to process emergency request' });
      }
    });
  }

  private setupMedicalRoutes(): void {
    this.app.post('/api/medical/document', async (req: Request, res: Response) => {
      if (!this.medicalSystem) return res.status(503).json({ error: 'Medical system unavailable' });
      try {
        const { patientId, condition, symptoms, history } = req.body;
        const result = await this.medicalSystem.createDocumentation(patientId, condition, symptoms, history);
        res.json(result);
      } catch (error) {
        this.logger.error('Medical documentation error:', error);
        res.status(500).json({ error: 'Failed to create medical documentation' });
      }
    });

    this.app.get('/api/medical/conditions', async (req: Request, res: Response) => {
      if (!this.medicalSystem) return res.json({ medical: [], ada: [], expertWitness: [] });
      try {
        const conditions = await this.medicalSystem.getAvailableConditions();
        res.json(conditions);
      } catch (error) {
        this.logger.error('Get medical conditions error:', error);
        res.status(500).json({ error: 'Failed to get medical conditions' });
      }
    });
  }

  private setupBlockchainRoutes(): void {
    this.app.post('/api/blockchain/deploy', async (req: Request, res: Response) => {
      if (!this.blockchainManager) return res.status(503).json({ error: 'Blockchain system unavailable' });
      try {
        const { contractType, parameters } = req.body;
        const result = await this.blockchainManager.deployContract({ name: contractType, abi: [], bytecode: '', parameters });
        res.json(result);
      } catch (error) {
        this.logger.error('Contract deployment error:', error);
        res.status(500).json({ error: 'Failed to deploy contract' });
      }
    });

    this.app.get('/api/blockchain/status', async (req: Request, res: Response) => {
      if (!this.blockchainManager) return res.json({ agents: [], contracts: [], walletBalance: 0 });
      try {
        const status = await this.blockchainManager.getStatus();
        res.json(status);
      } catch (error) {
        this.logger.error('Blockchain status error:', error);
        res.status(500).json({ error: 'Failed to get blockchain status' });
      }
    });
  }

  private setupAgentRoutes(): void {
    this.app.post('/api/agents/create', async (req: Request, res: Response) => {
      if (!this.agentManager) return res.status(503).json({ error: 'Agent system unavailable' });
      try {
        const { agentType, configuration } = req.body;
        const agent = await this.agentManager.createAgent({ type: agentType as any, name: agentType, description: '', capabilities: [], parameters: configuration || {} });
        res.json({ agentId: agent.id, status: 'created' });
      } catch (error) {
        this.logger.error('Agent creation error:', error);
        res.status(500).json({ error: 'Failed to create agent' });
      }
    });

    this.app.get('/api/agents/status', async (req: Request, res: Response) => {
      if (!this.agentManager) return res.json({ agents: [], status: 'unavailable' });
      try {
        const status = await this.agentManager.getStatus();
        res.json(status);
      } catch (error) {
        this.logger.error('Agent status error:', error);
        res.status(500).json({ error: 'Failed to get agent status' });
      }
    });
  }

  private setupChatbotRoutes(): void {
    this.app.post('/api/chat/message', async (req: Request, res: Response) => {
      if (!this.chatbot) return res.json({ message: 'Chat system is initializing. Please try again shortly.', suggestions: [], nextActions: [], confidence: 0, sources: [] });
      try {
        const { message, sessionId } = req.body;
        
        // Route through Buffer if available
        if (this.bufferClient) {
          try {
            await this.bufferClient.submitMessage({
              message,
              priority: 'normal',
              metadata: { sessionId, source: 'chatbot' }
            });
          } catch (bufferError) {
            this.logger.warn('Failed to route through Buffer, processing directly:', bufferError);
          }
        }
        
        const response = await this.chatbot.processMessage(message, sessionId);
        res.json(response);
      } catch (error) {
        this.logger.error('Chatbot processing error:', error);
        res.status(500).json({ error: 'Failed to process chat message' });
      }
    });
  }

  /**
   * Buffer Routes - Receive messages from The Buffer
   * This is the integration point where The Buffer forwards processed messages
   */
  private setupBufferRoutes(): void {
    // Receive messages from The Buffer
    this.app.post('/api/messages', async (req: Request, res: Response) => {
      try {
        const { content, source, priority, metadata, timestamp } = req.body;
        
        this.logger.info(`Received message from The Buffer: ${content.substring(0, 50)}...`);
        
        // Store message in DataStore
        const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const messageRecord = {
          id: messageId,
          content,
          source: source || 'buffer',
          priority: priority || 'normal',
          metadata: metadata || {},
          timestamp: timestamp || new Date().toISOString(),
          status: 'received',
          processedAt: new Date().toISOString(),
        };
        
        this.store.insert('messages', messageRecord);
        
        // Process with chatbot if available
        let response = null;
        if (this.chatbot) {
          try {
            const sessionId = metadata?.sessionId || 'buffer-session';
            response = await this.chatbot.processMessage(content, sessionId);
          } catch (chatError) {
            this.logger.warn('Chatbot processing failed, continuing without response:', chatError);
          }
        }
        
        // Log audit
        if (this.securityManager) {
          this.securityManager.logAudit(
            'message_received',
            'buffer',
            req.ip || '127.0.0.1',
            'success',
            `Message from ${source}: ${content.substring(0, 50)}`
          );
        }
        
        // Return success with message ID and optional response
        res.json({
          success: true,
          messageId,
          response: response?.message || null,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        this.logger.error('Error processing message from Buffer:', error);
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });

    // Get messages (for debugging/monitoring)
    this.app.get('/api/messages', async (req: Request, res: Response) => {
      try {
        const limit = parseInt(req.query.limit as string || '50', 10);
        const messages = this.store.list('messages').slice(-limit);
        res.json({
          messages,
          count: messages.length,
          total: this.store.count('messages'),
        });
      } catch (error) {
        this.logger.error('Error getting messages:', error);
        res.status(500).json({ error: 'Failed to get messages' });
      }
    });

    // Get specific message
    this.app.get('/api/messages/:messageId', async (req: Request, res: Response) => {
      try {
        const { messageId } = req.params;
        const message = this.store.find('messages', (m: any) => m.id === messageId);
        
        if (!message) {
          return res.status(404).json({ error: 'Message not found' });
        }
        
        res.json(message);
      } catch (error) {
        this.logger.error('Error getting message:', error);
        res.status(500).json({ error: 'Failed to get message' });
      }
    });
  }

  // ── Family routes — backed by DataStore ──────────────────────────
  private setupFamilyRoutes(): void {
    this.app.get('/api/family/status', (req: Request, res: Response) => {
      const members = this.store.list('family_members');
      const custodyCases = this.store.list('custody_cases');
      const supportRequests = this.store.list('support_requests');
      res.json({
        members,
        custodyCases,
        supportRequests,
        emergencyProtocols: 3,
        timestamp: new Date().toISOString(),
      });
    });

    this.app.post('/api/family/support', (req: Request, res: Response) => {
      const { type, priority, description } = req.body;
      const record = this.store.insert('support_requests', {
        type,
        priority,
        description,
        status: 'pending',
      });
      if (this.securityManager) this.securityManager.logAudit('family_support', 'user', req.ip || '127.0.0.1', 'success', `Support request: ${type}`);
      res.json(record);
    });
  }

  // ── Google Drive routes — backed by GoogleDriveManager ───────────
  private setupGoogleDriveRoutes(): void {
    // Get auth URL
    this.app.get('/api/google-drive/auth', (req: Request, res: Response) => {
      if (!this.googleDrive) return res.status(503).json({ error: 'Google Drive system unavailable' });
      if (!this.googleDrive.isConfigured()) {
        return res.status(400).json({ error: 'Google Drive credentials not configured' });
      }
      res.json({ url: this.googleDrive.getAuthUrl() });
    });

    // Handle OAuth callback
    this.app.post('/api/google-drive/callback', async (req: Request, res: Response) => {
      if (!this.googleDrive) return res.status(503).json({ error: 'Google Drive system unavailable' });
      try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ error: 'Authorization code required' });
        await this.googleDrive.handleCallback(code);
        res.json({ success: true, message: 'Authenticated successfully' });
      } catch (error) {
        this.logger.error('Google Drive auth error:', error);
        res.status(500).json({ error: 'Failed to authenticate' });
      }
    });

    // Get status
    this.app.get('/api/google-drive/status', async (req: Request, res: Response) => {
      if (!this.googleDrive) return res.json({ configured: false, authenticated: false });
      try {
        const status = await this.googleDrive.getStatus();
        res.json(status);
      } catch (error) {
        this.logger.error('Google Drive status error:', error);
        res.status(500).json({ error: 'Failed to get status' });
      }
    });

    // List files
    this.app.get('/api/google-drive/files', async (req: Request, res: Response) => {
      if (!this.googleDrive) return res.status(503).json({ error: 'Google Drive system unavailable' });
      try {
        const folderId = req.query.folderId as string;
        const pageToken = req.query.pageToken as string;
        const query = req.query.query as string;
        const result = await this.googleDrive.listFiles(folderId, pageToken, query);
        res.json(result);
      } catch (error) {
        this.logger.error('Google Drive list error:', error);
        res.status(500).json({ error: 'Failed to list files' });
      }
    });

    // Import file
    this.app.post('/api/google-drive/import', async (req: Request, res: Response) => {
      if (!this.googleDrive) return res.status(503).json({ error: 'Google Drive system unavailable' });
      try {
        const { fileId } = req.body;
        if (!fileId) return res.status(400).json({ error: 'File ID required' });
        const record = await this.googleDrive.importFile(fileId);
        if (this.securityManager) this.securityManager.logAudit('drive_import', 'user', req.ip || '127.0.0.1', 'success', `Imported file ${record.fileName}`);
        res.json(record);
      } catch (error) {
        this.logger.error('Google Drive import error:', error);
        res.status(500).json({ error: 'Failed to import file' });
      }
    });

    // Disconnect
    this.app.post('/api/google-drive/disconnect', async (req: Request, res: Response) => {
      if (!this.googleDrive) return res.status(503).json({ error: 'Google Drive system unavailable' });
      try {
        await this.googleDrive.disconnect();
        res.json({ success: true });
      } catch (error) {
        this.logger.error('Google Drive disconnect error:', error);
        res.status(500).json({ error: 'Failed to disconnect' });
      }
    });
  }

  // ── Sovereignty routes — backed by SovereignGoogleDriveManager & SovereigntyValidator ──
  private setupSovereigntyRoutes(): void {
    // Get overall sovereignty status
    this.app.get('/api/sovereignty/status', async (req: Request, res: Response) => {
      if (!this.sovereignGoogleDrive || !this.sovereigntyValidator) {
        return res.json({ 
          overallStatus: 'YELLOW',
          googleDriveStatus: 'UNAVAILABLE',
          validationStats: { totalImports: 0, approved: 0, rejected: 0, pendingReview: 0 },
          lastValidation: new Date().toISOString()
        });
      }
      try {
        const status = await this.sovereignGoogleDrive.getSovereigntyStatus();
        res.json(status);
      } catch (error) {
        this.logger.error('Sovereignty status error:', error);
        res.status(500).json({ error: 'Failed to get sovereignty status' });
      }
    });

    // Get binary dashboard data
    this.app.get('/api/sovereignty/binary-dashboard', async (req: Request, res: Response) => {
      if (!this.sovereignGoogleDrive) {
        return res.json({
          green: 0,
          yellow: 0,
          red: 0,
          lastUpdated: new Date().toISOString(),
          recentDecisions: []
        });
      }
      try {
        const dashboard = this.sovereignGoogleDrive.getBinaryDashboard();
        res.json(dashboard);
      } catch (error) {
        this.logger.error('Binary dashboard error:', error);
        res.status(500).json({ error: 'Failed to get binary dashboard' });
      }
    });

    // Scan Google Drive for sovereignty-eligible files
    this.app.post('/api/sovereignty/scan-drive', async (req: Request, res: Response) => {
      if (!this.sovereignGoogleDrive) {
        return res.status(503).json({ error: 'Sovereignty system unavailable' });
      }
      try {
        const userId = (req as any).user?.id;
        const folderId = req.body.folderId;
        const scanResults = await this.sovereignGoogleDrive.scanFolderForSovereignty(folderId, userId);
        res.json(scanResults);
      } catch (error) {
        this.logger.error('Scan Google Drive error:', error);
        res.status(500).json({ error: 'Failed to scan Google Drive' });
      }
    });

    // Import file with sovereignty validation
    this.app.post('/api/sovereignty/import', async (req: Request, res: Response) => {
      if (!this.sovereignGoogleDrive) {
        return res.status(503).json({ error: 'Sovereignty system unavailable' });
      }
      try {
        const { fileId } = req.body;
        if (!fileId) return res.status(400).json({ error: 'File ID required' });
        
        const userId = (req as any).user?.id;
        const result = await this.sovereignGoogleDrive.importFileWithSovereignty(fileId, userId);
        
        if (this.securityManager) {
          this.securityManager.logAudit('sovereignty_import', 'user', req.ip || '127.0.0.1', 'success', 
            `Sovereignty import: ${result.fileName} - ${result.sovereigntyStatus}`);
        }
        
        res.json(result);
      } catch (error) {
        this.logger.error('Sovereignty import error:', error);
        res.status(500).json({ error: 'Failed to import with sovereignty validation' });
      }
    });

    // Get sovereignty history
    this.app.get('/api/sovereignty/history', async (req: Request, res: Response) => {
      if (!this.sovereignGoogleDrive) {
        return res.json([]);
      }
      try {
        const userId = (req as any).user?.id;
        const limit = parseInt(req.query.limit as string) || 50;
        const history = this.sovereignGoogleDrive.getSovereigntyHistory(userId, limit);
        res.json(history);
      } catch (error) {
        this.logger.error('Sovereignty history error:', error);
        res.status(500).json({ error: 'Failed to get sovereignty history' });
      }
    });

    // Validate data with sovereignty rules
    this.app.post('/api/sovereignty/validate', async (req: Request, res: Response) => {
      if (!this.sovereigntyValidator) {
        return res.status(503).json({ error: 'Sovereignty validator unavailable' });
      }
      try {
        const validationRequest = req.body;
        const userId = (req as any).user?.id;
        if (userId) validationRequest.userId = userId;
        
        const result = await this.sovereigntyValidator.validate(validationRequest);
        res.json(result);
      } catch (error) {
        this.logger.error('Sovereignty validation error:', error);
        res.status(500).json({ error: 'Failed to validate data' });
      }
    });

    // ── Digital Self Core Routes ────────────────────────────────────────
    
    // Digital Self Core health check
    this.app.get('/api/digital-self-core/health', async (req: Request, res: Response) => {
      try {
        const health = await digitalSelfCoreManager.healthCheck();
        res.json(health);
      } catch (error) {
        this.logger.error('Digital Self Core health check error:', error);
        res.status(500).json({ 
          healthy: false, 
          components: {
            floatingNeutralDetector: false,
            metabolicBaseline: false,
            cognitiveLoadAssessor: false,
            intentDeclaration: false,
            meshRitual: false
          },
          message: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    });

    // Execute Grounding Phase
    this.app.post('/api/digital-self-core/grounding-phase/execute', async (req: Request, res: Response) => {
      try {
        const result = await digitalSelfCoreManager.executeGroundingPhase();
        res.json(result);
      } catch (error) {
        this.logger.error('Grounding Phase execution error:', error);
        res.status(500).json({ 
          status: 'ERROR', 
          message: 'Grounding Phase execution failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          state: {
            phase: 'GROUNDING',
            status: 'ERROR',
            progress: 0,
            completedChecks: [],
            errors: [{ error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date().toISOString() }],
            warnings: []
          }
        });
      }
    });

    // Get sovereign operator status
    this.app.get('/api/digital-self-core/sovereign-operator/status', async (req: Request, res: Response) => {
      try {
        const status = await digitalSelfCoreManager.getSovereignOperatorStatus();
        res.json(status);
      } catch (error) {
        this.logger.error('Sovereign operator status error:', error);
        res.status(500).json({
          grounded: false,
          metabolicStability: 0,
          cognitiveLoad: 0,
          intentClarity: 0,
          floatingNeutralDetected: true,
          lastGroundingCheck: new Date().toISOString(),
          issues: ['System error during status check']
        });
      }
    });

    // Check if sovereignty is grounded
    this.app.get('/api/digital-self-core/sovereignty/grounded', async (req: Request, res: Response) => {
      try {
        const grounded = await digitalSelfCoreManager.isSovereigntyGrounded();
        res.json({ grounded });
      } catch (error) {
        this.logger.error('Sovereignty grounded check error:', error);
        res.json({ grounded: false });
      }
    });

    // Get sovereignty issues
    this.app.get('/api/digital-self-core/sovereignty/issues', async (req: Request, res: Response) => {
      try {
        const issues = await digitalSelfCoreManager.getSovereigntyIssues();
        res.json(issues);
      } catch (error) {
        this.logger.error('Sovereignty issues check error:', error);
        res.json({ 
          issues: ['Unable to check sovereignty status'], 
          recommendations: ['Check system initialization'] 
        });
      }
    });

    // Get component status
    this.app.get('/api/digital-self-core/components/status', async (req: Request, res: Response) => {
      try {
        const status = await digitalSelfCoreManager.getComponentStatus();
        res.json(status);
      } catch (error) {
        this.logger.error('Component status error:', error);
        res.status(500).json({
          floatingNeutralDetector: {
            passed: false,
            details: 'Component check failed',
            timestamp: new Date().toISOString(),
            issues: [{
              type: 'SYSTEM',
              factor: 'Component Check',
              severity: 'CRITICAL',
              value: 0,
              threshold: 1
            }]
          },
          metabolicBaseline: {
            passed: false,
            details: 'Component check failed',
            timestamp: new Date().toISOString(),
            issues: [{
              type: 'SYSTEM',
              factor: 'Component Check',
              severity: 'CRITICAL',
              value: 0,
              threshold: 1
            }]
          },
          cognitiveLoadAssessor: {
            passed: false,
            details: 'Component check failed',
            timestamp: new Date().toISOString(),
            issues: [{
              type: 'SYSTEM',
              factor: 'Component Check',
              severity: 'CRITICAL',
              value: 0,
              threshold: 1
            }]
          },
          intentDeclaration: {
            passed: false,
            details: 'Component check failed',
            timestamp: new Date().toISOString(),
            issues: [{
              type: 'SYSTEM',
              factor: 'Component Check',
              severity: 'CRITICAL',
              value: 0,
              threshold: 1
            }]
          }
        });
      }
    });
  }

  // ── System routes — delegate to real subsystems ──────────────────
  private setupSystemRoutes(): void {
    // Performance metrics
    this.app.get('/api/system/metrics', async (req: Request, res: Response) => {
      if (!this.performanceOptimizer) return res.json({ cpuUsage: 0, memoryUsage: 0, responseTime: 0 });
      try {
        const metrics = await this.performanceOptimizer.getMetrics();
        res.json(metrics);
      } catch (error) {
        this.logger.error('Metrics error:', error);
        res.status(500).json({ error: 'Failed to get metrics' });
      }
    });

    // Security status
    this.app.get('/api/system/security', async (req: Request, res: Response) => {
      if (!this.securityManager) return res.json({ overallLevel: 'unknown', firewallActive: false });
      try {
        this.securityManager.setActiveSessionCount(this.wss.clients.size);
        const status = await this.securityManager.getStatus();
        res.json(status);
      } catch (error) {
        this.logger.error('Security status error:', error);
        res.status(500).json({ error: 'Failed to get security status' });
      }
    });

    // Security scan
    this.app.post('/api/system/security/scan', async (req: Request, res: Response) => {
      if (!this.securityManager) return res.status(503).json({ error: 'Security system unavailable' });
      try {
        const result = await this.securityManager.scan();
        res.json(result);
      } catch (error) {
        this.logger.error('Security scan error:', error);
        res.status(500).json({ error: 'Failed to run security scan' });
      }
    });

    // Audit log
    this.app.get('/api/system/security/audit', (req: Request, res: Response) => {
      if (!this.securityManager) return res.json([]);
      const limit = parseInt(req.query.limit as string) || 50;
      res.json(this.securityManager.getAuditLog(limit));
    });

    // Backup status
    this.app.get('/api/system/backup', async (req: Request, res: Response) => {
      if (!this.backupManager) return res.json({ lastBackup: null, totalBackups: 0 });
      try {
        const status = await this.backupManager.getStatus();
        res.json(status);
      } catch (error) {
        this.logger.error('Backup status error:', error);
        res.status(500).json({ error: 'Failed to get backup status' });
      }
    });

    // Create backup
    this.app.post('/api/system/backup/create', async (req: Request, res: Response) => {
      if (!this.backupManager) return res.status(503).json({ error: 'Backup system unavailable' });
      try {
        const type = req.body.type || 'full';
        const result = await this.backupManager.createBackup(type);
        res.json(result);
      } catch (error) {
        this.logger.error('Backup creation error:', error);
        res.status(500).json({ error: 'Failed to create backup' });
      }
    });

    // Monitoring dashboard
    this.app.get('/api/system/monitoring', async (req: Request, res: Response) => {
      if (!this.monitoringSystem) return res.json({ systemHealth: 'unknown', alerts: [] });
      try {
        const data = await this.monitoringSystem.getDashboardData();
        res.json(data);
      } catch (error) {
        this.logger.error('Monitoring error:', error);
        res.status(500).json({ error: 'Failed to get monitoring data' });
      }
    });

    // Alerts
    this.app.get('/api/system/alerts', (req: Request, res: Response) => {
      if (!this.monitoringSystem) return res.json([]);
      const alerts = this.monitoringSystem.getAlerts();
      res.json(alerts);
    });

    this.app.post('/api/system/alerts/acknowledge', (req: Request, res: Response) => {
      if (!this.monitoringSystem) return res.status(503).json({ error: 'Monitoring unavailable' });
      const { alertId } = req.body;
      const result = this.monitoringSystem.acknowledgeAlert(alertId);
      res.json({ success: result });
    });

    // Quantum Brain
    this.app.get('/api/quantum-brain/status', async (req: Request, res: Response) => {
      if (!this.quantumBrain) return res.json({ active: false });
      try {
        const status = await this.quantumBrain.getStatus();
        res.json(status);
      } catch (error) {
        this.logger.error('Quantum brain error:', error);
        res.status(500).json({ error: 'Failed to get quantum brain status' });
      }
    });

    // Performance optimization
    this.app.post('/api/system/optimize', async (req: Request, res: Response) => {
      if (!this.performanceOptimizer) return res.status(503).json({ error: 'Optimizer unavailable' });
      try {
        const result = await this.performanceOptimizer.optimize();
        res.json(result);
      } catch (error) {
        this.logger.error('Optimization error:', error);
        res.status(500).json({ error: 'Failed to optimize' });
      }
    });
  }

  // ── Consciousness routes — backed by DataStore ───────────────────
  private setupConsciousnessRoutes(): void {
    this.app.get('/api/consciousness/status', (req: Request, res: Response) => {
      const baseline = this.store.get<any>('consciousness', 'baseline');
      if (!baseline) {
        return res.json({ metrics: { coherence: 75, focus: 80, creativity: 70, awareness: 78, balance: 85 }, trends: [], timestamp: new Date().toISOString() });
      }

      // Small live jitter on top of persistent baselines
      const jitter = () => Math.floor(Math.random() * 5) - 2;
      const clamp = (v: number) => Math.max(0, Math.min(100, v));

      const metrics = {
        coherence: clamp(baseline.coherence + jitter()),
        focus: clamp(baseline.focus + jitter()),
        creativity: clamp(baseline.creativity + jitter()),
        awareness: clamp(baseline.awareness + jitter()),
        balance: clamp(baseline.balance + jitter()),
      };

      // Compute trends vs baseline
      const trend = (name: string, current: number, base: number) => {
        const change = Math.round((current - base) * 10) / 10;
        return {
          metric: name,
          direction: change >= 0 ? 'up' : 'down',
          change,
          description: change > 2 ? 'Improving steadily' : change < -2 ? 'Needs attention' : 'Stable',
        };
      };

      res.json({
        metrics,
        trends: [
          trend('Coherence', metrics.coherence, 75),
          trend('Focus', metrics.focus, 80),
          trend('Creativity', metrics.creativity, 70),
          trend('Awareness', metrics.awareness, 78),
        ],
        timestamp: new Date().toISOString(),
      });
    });

    this.app.post('/api/consciousness/optimize/:id', (req: Request, res: Response) => {
      const { id } = req.params;
      const baseline = this.store.get<any>('consciousness', 'baseline');
      if (baseline) {
        // Optimization nudges all metrics up by 1-3 points
        const bump = () => 1 + Math.floor(Math.random() * 3);
        const clamp = (v: number) => Math.min(100, v);
        this.store.update('consciousness', 'baseline', {
          coherence: clamp(baseline.coherence + bump()),
          focus: clamp(baseline.focus + bump()),
          creativity: clamp(baseline.creativity + bump()),
          awareness: clamp(baseline.awareness + bump()),
          balance: clamp(baseline.balance + bump()),
        });
      }
      res.json({
        success: true,
        optimizationId: id,
        message: `Optimization ${id} triggered successfully`,
        timestamp: new Date().toISOString(),
      });
    });
  }

  // ── Wallet routes — backed by DataStore ──────────────────────────
  private setupWalletRoutes(): void {
    this.app.get('/api/wallet/balance', (req: Request, res: Response) => {
      const wallet = this.store.get<any>('wallet', 'main');
      res.json({
        balance: wallet?.balance ?? 0,
        currency: wallet?.currency ?? 'LOVE',
        lastUpdated: wallet?.updatedAt ?? new Date().toISOString(),
      });
    });

    this.app.post('/api/wallet/transaction', (req: Request, res: Response) => {
      const { amount, description, type } = req.body;
      const numAmount = Number(amount) || 0;

      // Persist the transaction
      const txn = this.store.insert('transactions', {
        amount: numAmount,
        description,
        type,
        date: new Date().toISOString(),
        status: 'completed',
      });

      // Update wallet balance
      const wallet = this.store.get<any>('wallet', 'main');
      if (wallet) {
        const delta = type === 'income' ? numAmount : -numAmount;
        this.store.update('wallet', 'main', { balance: wallet.balance + delta });
      }

      if (this.securityManager) this.securityManager.logAudit('wallet_transaction', 'user', req.ip || '127.0.0.1', 'success', `${type} ${numAmount} LOVE`);
      res.json(txn);
    });

    // Transaction history
    this.app.get('/api/wallet/transactions', (req: Request, res: Response) => {
      const limit = parseInt(req.query.limit as string) || 50;
      res.json(this.store.recent('transactions', limit));
    });
  }

  // ── Spoon Economy routes ─────────────────────────────────────
  private setupSpoonRoutes(): void {
    this.app.get('/api/spoons/today/:memberId', (req: Request, res: Response) => {
      if (!this.spoonEngine) return res.status(503).json({ error: 'Spoon engine unavailable' });
      const { memberId } = req.params;
      res.json(this.spoonEngine.getToday(memberId));
    });

    this.app.post('/api/spoons/log', (req: Request, res: Response) => {
      if (!this.spoonEngine) return res.status(503).json({ error: 'Spoon engine unavailable' });
      const { memberId, activity, cost, category } = req.body;
      if (!memberId || !activity || cost === undefined) {
        return res.status(400).json({ error: 'memberId, activity, and cost are required' });
      }
      const entry = this.spoonEngine.logActivity(memberId, activity, Number(cost), category);
      res.json(entry);
    });

    this.app.get('/api/spoons/history/:memberId', (req: Request, res: Response) => {
      if (!this.spoonEngine) return res.status(503).json({ error: 'Spoon engine unavailable' });
      const { memberId } = req.params;
      const days = parseInt(req.query.days as string) || 7;
      res.json(this.spoonEngine.getHistory(memberId, days));
    });

    this.app.get('/api/spoons/activities', (req: Request, res: Response) => {
      if (!this.spoonEngine) return res.json([]);
      res.json(this.spoonEngine.getActivityCosts());
    });

    this.app.get('/api/spoons/recovery/:memberId', (req: Request, res: Response) => {
      if (!this.spoonEngine) return res.json([]);
      const { memberId } = req.params;
      res.json(this.spoonEngine.getRecoverySuggestions(memberId));
    });
  }

  // ── Family Wallet routes (multi-wallet) ─────────────────────
  private setupFamilyWalletRoutes(): void {
    this.app.get('/api/wallet/family', (req: Request, res: Response) => {
      if (!this.walletManager) return res.json([]);
      res.json(this.walletManager.getFamilyWallets());
    });

    this.app.get('/api/wallet/member/:memberId', (req: Request, res: Response) => {
      if (!this.walletManager) return res.status(503).json({ error: 'Wallet manager unavailable' });
      const wallet = this.walletManager.getMemberWallet(req.params.memberId);
      if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
      res.json(wallet);
    });

    this.app.post('/api/wallet/transfer', (req: Request, res: Response) => {
      if (!this.walletManager) return res.status(503).json({ error: 'Wallet manager unavailable' });
      const { fromWalletId, toWalletId, amount, description } = req.body;
      if (!fromWalletId || !toWalletId || !amount) {
        return res.status(400).json({ error: 'fromWalletId, toWalletId, and amount are required' });
      }
      const result = this.walletManager.transfer(fromWalletId, toWalletId, Number(amount), description || '');
      if ('error' in result) return res.status(400).json(result);
      if (this.securityManager) this.securityManager.logAudit('wallet_transfer', 'user', req.ip || '127.0.0.1', 'success', `Transfer ${amount} LOVE`);
      res.json(result);
    });
  }

  // ── Buffer routes ───────────────────────────────────────────
  private setupBufferRoutes(): void {
    // Submit message to Buffer
    this.app.post('/api/buffer/message', async (req: Request, res: Response) => {
      if (!this.bufferClient) return res.status(503).json({ error: 'Buffer client unavailable' });
      try {
        const { message, priority, metadata } = req.body;
        const result = await this.bufferClient.submitMessage({ message, priority, metadata });
        res.json(result);
      } catch (error) {
        this.logger.error('Buffer message error:', error);
        res.status(500).json({ error: 'Failed to submit message to Buffer' });
      }
    });

    // Get Buffer queue status
    this.app.get('/api/buffer/status', async (req: Request, res: Response) => {
      if (!this.bufferClient) return res.json({ queueLength: 0, connected: false });
      try {
        const status = await this.bufferClient.getQueueStatus();
        res.json(status);
      } catch (error) {
        this.logger.error('Buffer status error:', error);
        res.status(500).json({ error: 'Failed to get Buffer status' });
      }
    });

    // Get Ping status
    this.app.get('/api/buffer/ping', async (req: Request, res: Response) => {
      if (!this.bufferClient) return res.json({ active: false, health: 'red' });
      try {
        const status = await this.bufferClient.getPingStatus();
        res.json(status);
      } catch (error) {
        this.logger.error('Ping status error:', error);
        res.status(500).json({ error: 'Failed to get Ping status' });
      }
    });

    // Send heartbeat
    this.app.post('/api/buffer/heartbeat', async (req: Request, res: Response) => {
      if (!this.bufferClient) return res.status(503).json({ error: 'Buffer client unavailable' });
      try {
        const { nodeId, signalStrength } = req.body;
        await this.bufferClient.sendHeartbeat(nodeId || 'centaur', signalStrength || 100);
        res.json({ success: true });
      } catch (error) {
        this.logger.error('Heartbeat error:', error);
        res.status(500).json({ error: 'Failed to send heartbeat' });
      }
    });
  }

  // ── Game Engine routes ──────────────────────────────────────
  private setupGameRoutes(): void {
    this.app.get('/api/game/structures', (req: Request, res: Response) => {
      res.json(this.store.list('game_structures'));
    });

    this.app.post('/api/game/structures', (req: Request, res: Response) => {
      const { name, createdBy, primitives, vertices, edges, isRigid, stabilityScore, maxLoadBeforeFailure } = req.body;
      const structure = this.store.insert('game_structures', {
        name: name || 'Untitled',
        createdBy: createdBy || 'unknown',
        primitives: primitives || [],
        vertices: vertices || 0,
        edges: edges || 0,
        isRigid: isRigid || false,
        stabilityScore: stabilityScore || 0,
        maxLoadBeforeFailure: maxLoadBeforeFailure || 0,
      });
      res.json(structure);
    });

    this.app.get('/api/game/progress/:memberId', (req: Request, res: Response) => {
      const { memberId } = req.params;
      let progress = this.store.list<any>('game_progress', { memberId });
      if (progress.length === 0) {
        const newProgress = this.store.insert('game_progress', {
          memberId,
          completedChallenges: [],
          totalLoveEarned: 0,
          badges: [],
          buildStreak: 0,
          structures: [],
          tier: 'seedling',
          xp: 0,
        });
        return res.json(newProgress);
      }
      res.json(progress[0]);
    });

    this.app.put('/api/game/progress/:memberId', (req: Request, res: Response) => {
      const { memberId } = req.params;
      const existing = this.store.list<any>('game_progress', { memberId });
      if (existing.length === 0) {
        return res.status(404).json({ error: 'Progress not found' });
      }
      const updated = this.store.update('game_progress', existing[0].id, req.body);
      res.json(updated);
    });

    this.app.get('/api/game/challenges', (req: Request, res: Response) => {
      res.json(this.store.list('game_challenges'));
    });

    this.app.post('/api/game/validate', (req: Request, res: Response) => {
      const { primitives, vertices, edges } = req.body;
      const V = vertices || 0;
      const E = edges || 0;
      const denominator = Math.max(1, 3 * V - 6);
      const maxwellRatio = E / denominator;
      const isRigid = maxwellRatio >= 1.0;
      const stabilityScore = Math.min(100, Math.round(maxwellRatio * 100));
      const loadCapacity = Math.round(stabilityScore * (E / Math.max(1, V)));

      const errors: string[] = [];
      const warnings: string[] = [];
      if (!primitives || primitives.length === 0) errors.push('Structure has no primitives');
      if (!isRigid) warnings.push(`Maxwell ratio ${maxwellRatio.toFixed(2)} < 1.0 — not rigid`);
      if (stabilityScore < 70) warnings.push('Stability below recommended threshold (70)');

      res.json({
        isValid: errors.length === 0,
        errors,
        warnings,
        maxwellRatio: Math.round(maxwellRatio * 100) / 100,
        stabilityScore,
        loadCapacity,
      });
    });
  }

  // ── Quantum SOP Generator routes ────────────────────────────────
  private setupSOPRoutes(): void {
    if (!this.quantumBrain) {
      this.logger.warn('Quantum Brain not available, SOP routes disabled');
      return;
    }

    // Mount SOP routes
    const sopRoutes = createSOPRoutes(this.quantumBrain);
    this.app.use('/api/quantum-brain/sop', sopRoutes);
    
    this.logger.info('Quantum SOP Generator routes registered');
  }

  // ── Quantum Lab routes ──────────────────────────────────────────
  private setupQuantumLabRoutes(): void {
    if (!this.quantumLab) {
      this.logger.warn('Quantum Lab not available, routes disabled');
      return;
    }

    // Mount Quantum Lab routes
    const quantumLabRoutes = createQuantumLabRoutes(this.quantumLab);
    this.app.use('/api/quantum-lab', quantumLabRoutes);
    
    this.logger.info('Quantum Lab routes registered');
  }

  private setupWebSocket(): void {
    this.wss.on('connection', (ws) => {
      this.logger.info('WebSocket connection established');
      if (this.securityManager) this.securityManager.setActiveSessionCount(this.wss.clients.size);

      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message.toString());

          switch (data.type) {
            case 'subscribe':
              ws.send(JSON.stringify({ type: 'subscribed', systems: data.systems }));
              break;
            case 'request':
              const response = await this.handleWebSocketRequest(data);
              ws.send(JSON.stringify(response));
              break;
          }
        } catch (error) {
          this.logger.error('WebSocket message error:', error);
          ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        this.logger.info('WebSocket connection closed');
        if (this.securityManager) this.securityManager.setActiveSessionCount(this.wss.clients.size);
      });
    });
  }

  private async handleWebSocketRequest(data: any): Promise<any> {
    switch (data.system) {
      case 'legal':
        return this.legalAI ? await this.legalAI.getStatus() : { error: 'Legal AI unavailable' };
      case 'medical':
        return this.medicalSystem ? await this.medicalSystem.getStatus() : { error: 'Medical system unavailable' };
      case 'blockchain':
        return this.blockchainManager ? await this.blockchainManager.getStatus() : { error: 'Blockchain unavailable' };
      case 'agents':
        return this.agentManager ? await this.agentManager.getStatus() : { error: 'Agent manager unavailable' };
      default:
        return { error: 'Unknown system' };
    }
  }

  public async start(): Promise<void> {
    // Start all subsystems
    const startups: Promise<void>[] = [];
    if (this.performanceOptimizer) startups.push(this.performanceOptimizer.start());
    if (this.securityManager) startups.push(this.securityManager.start());
    if (this.backupManager) startups.push(this.backupManager.start());
    if (this.monitoringSystem) startups.push(this.monitoringSystem.start());
    await Promise.all(startups);

    return new Promise((resolve, reject) => {
      this.server.listen(this.config.server.port, this.config.server.host, (error?: Error) => {
        if (error) {
          this.logger.error('Failed to start server:', error);
          reject(error);
        } else {
          this.logger.info(`🚀 SUPER CENTAUR Server running on http://${this.config.server.host}:${this.config.server.port}`);
          this.logger.info(`📡 WebSocket server running on ws://${this.config.server.host}:${this.config.server.port}`);
          resolve();
        }
      });
    });
  }

  public async stop(): Promise<void> {
    // Stop all subsystems
    const shutdowns: Promise<void>[] = [];
    if (this.performanceOptimizer) shutdowns.push(this.performanceOptimizer.stop());
    if (this.securityManager) shutdowns.push(this.securityManager.stop());
    if (this.backupManager) shutdowns.push(this.backupManager.stop());
    if (this.monitoringSystem) shutdowns.push(this.monitoringSystem.stop());
    await Promise.all(shutdowns);

    this.store.flush();

    return new Promise((resolve) => {
      this.wss.close(() => {
        this.server.close(() => {
          this.logger.info('🛑 SUPER CENTAUR Server stopped');
          resolve();
        });
      });
    });
  }

  public getExpressApp(): Express {
    return this.app;
  }
}
