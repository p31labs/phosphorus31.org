# Project Swarm Intelligence: Migration Guide

## Overview

This guide provides step-by-step instructions for migrating the existing local-only Project Swarm Intelligence system to the new cloud-native SaaS architecture. The migration follows the "Wye-to-Delta" transformation strategy outlined in the implementation plan.

## Prerequisites

Before beginning the migration, ensure you have:

- Google Cloud Platform project with billing enabled
- Docker installed locally
- Node.js 18+ and npm
- Access to Phenix Navigator hardware (for hardware integration phase)
- Google Workspace domain for integration testing

## Migration Phases

### Phase 1: Foundation Setup (Weeks 1-4)

#### Step 1.1: Cloud Infrastructure Setup

**1.1.1 Create Google Cloud Project**

```bash
# Set your project ID
export PROJECT_ID="swarm-intelligence-prod"
export REGION="us-central1"

# Create project
gcloud projects create $PROJECT_ID --name="Swarm Intelligence"

# Set as default
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  storage.googleapis.com \
  eventarc.googleapis.com \
  pubsub.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  iam.googleapis.com
```

**1.1.2 Set Up Cloud SQL Database**

```bash
# Create Cloud SQL instance
gcloud sql instances create swarm-db \
  --database-version=POSTGRES_15 \
  --tier=db-custom-2-7680 \
  --region=$REGION \
  --storage-size=100GB

# Create database
gcloud sql databases create swarm_main \
  --instance=swarm-db

# Create user
gcloud sql users create swarm_user \
  --instance=swarm-db \
  --password=$(openssl rand -base64 32)

# Install pgvector extension
gcloud sql connect swarm-db --user=swarm_user
# In psql: CREATE EXTENSION vector;
```

**1.1.3 Set Up Storage and Caching**

```bash
# Create Cloud Storage bucket
gsutil mb -l $REGION gs://swarm-intelligence-storage

# Set up Memorystore Redis
gcloud redis instances create swarm-redis \
  --size=5 \
  --region=$REGION \
  --redis-version=redis_6_x

# Create Pub/Sub topics
gcloud pubsub topics create agent-tasks
gcloud pubsub topics create file-changes
gcloud pubsub topics create system-alerts
```

#### Step 1.2: Containerize Existing Agents

**1.2.1 Create Dockerfile for Existing Agents**

```dockerfile
# Dockerfile for swarm agents
FROM node:18-alpine

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start command
CMD ["node", "dist/index.js"]
```

**1.2.2 Build and Push Container Images**

```bash
# Build images for each agent
docker build -t gcr.io/$PROJECT_ID/swarm-orchestrator:v1.0.0 .
docker build -t gcr.io/$PROJECT_ID/cognitive-shield:v1.0.0 -f Dockerfile.cognitive-shield .
docker build -t gcr.io/$PROJECT_ID/project-analyzer:v1.0.0 -f Dockerfile.project-analyzer .
docker build -t gcr.io/$PROJECT_ID/file-system-monitor:v1.0.0 -f Dockerfile.file-monitor .

# Push to Container Registry
docker push gcr.io/$PROJECT_ID/swarm-orchestrator:v1.0.0
docker push gcr.io/$PROJECT_ID/cognitive-shield:v1.0.0
docker push gcr.io/$PROJECT_ID/project-analyzer:v1.0.0
docker push gcr.io/$PROJECT_ID/file-system-monitor:v1.0.0
```

#### Step 1.3: Deploy Core Infrastructure

**1.3.1 Deploy Cloud Run Services**

```yaml
# swarm-orchestrator.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: swarm-orchestrator
  annotations:
    run.googleapis.com/cpu-throttling: "false"
    run.googleapis.com/execution-environment: gen2
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "1"
        autoscaling.knative.dev/maxScale: "10"
    spec:
      containerConcurrency: 80
      timeoutSeconds: 900
      containers:
      - image: gcr.io/swarm-intelligence-prod/swarm-orchestrator:v1.0.0
        env:
        - name: DATABASE_URL
          value: postgresql://swarm_user:$(cat /secrets/db-password)/swarm-db:5432/swarm_main
        - name: REDIS_URL
          value: redis://$(cat /secrets/redis-host):6379
        resources:
          limits:
            cpu: "2000m"
            memory: "1Gi"
```

```bash
# Deploy services
kubectl apply -f swarm-orchestrator.yaml
kubectl apply -f cognitive-shield.yaml
kubectl apply -f project-analyzer.yaml
kubectl apply -f file-system-monitor.yaml
```

### Phase 2: Agent Migration (Weeks 5-8)

#### Step 2.1: Modify Existing Agents for Cloud

**2.1.1 Update File System Monitor for Cloud**

```typescript
// src/agents/file-system-monitor.ts (Cloud Version)
import { GoogleDriveService } from '../services/google-drive-service';
import { EventarcService } from '../services/eventarc-service';

export class FileSystemMonitorAgent implements Agent {
  private driveService: GoogleDriveService;
  private eventarcService: EventarcService;
  private localWatcher: any;

  async initialize(): Promise<void> {
    // Initialize Google Drive service
    this.driveService = new GoogleDriveService(this.config);
    await this.driveService.initialize();
    
    // Initialize Eventarc for push notifications
    this.eventarcService = new EventarcService(this.config);
    await this.eventarcService.initialize();
    
    // Set up local file watching (for local-first sync)
    this.localWatcher = chokidar.watch(this.config.projectPath, {
      ignored: /(^|[\/\\])\../,
      persistent: true,
      ignoreInitial: true
    });
  }

  async start(): Promise<void> {
    // Start Google Drive monitoring
    await this.driveService.startMonitoring();
    
    // Start local file monitoring
    this.localWatcher.on('all', (event, path) => {
      this.handleLocalChange(event, path);
    });
    
    // Set up Eventarc push notifications
    await this.eventarcService.subscribe('file-changes', (event) => {
      this.handleCloudChange(event);
    });
  }

  private async handleLocalChange(event: string, path: string): Promise<void> {
    // Process local file changes
    const change = {
      type: event,
      path,
      timestamp: new Date(),
      source: 'local'
    };
    
    // Sync to cloud
    await this.syncToCloud(change);
    
    // Emit event for other agents
    this.emit('file-change', change);
  }

  private async handleCloudChange(event: any): Promise<void> {
    // Process cloud file changes
    const change = {
      type: event.type,
      path: event.path,
      timestamp: new Date(event.timestamp),
      source: 'cloud'
    };
    
    // Sync to local
    await this.syncToLocal(change);
    
    // Emit event for other agents
    this.emit('file-change', change);
  }
}
```

**2.1.2 Update Project Analyzer for Cloud**

```typescript
// src/agents/project-analyzer.ts (Cloud Version)
import { VectorDatabase } from '../services/vector-database';
import { CloudStorageService } from '../services/cloud-storage-service';

export class ProjectAnalyzerAgent implements Agent {
  private vectorDB: VectorDatabase;
  private storageService: CloudStorageService;

  async initialize(): Promise<void> {
    // Initialize vector database for semantic search
    this.vectorDB = new VectorDatabase(this.config);
    await this.vectorDB.initialize();
    
    // Initialize cloud storage for file access
    this.storageService = new CloudStorageService(this.config);
    await this.storageService.initialize();
  }

  async execute(task: AgentTask): Promise<AgentResult> {
    switch (task.type) {
      case 'analyze-project':
        return await this.analyzeProjectCloud(task.payload.projectId);
      case 'semantic-search':
        return await this.semanticSearch(task.payload.query);
      default:
        throw new Error(`Unknown task type: ${task.type}`);
    }
  }

  private async analyzeProjectCloud(projectId: string): Promise<AgentResult> {
    // Get project files from cloud storage
    const files = await this.storageService.listProjectFiles(projectId);
    
    // Analyze files and generate embeddings
    const analysis = await this.performAnalysis(files);
    
    // Store embeddings in vector database
    await this.vectorDB.storeProjectEmbeddings(projectId, analysis.embeddings);
    
    return {
      taskId: projectId,
      success: true,
      data: analysis,
      duration: Date.now() - Date.now(),
      metadata: { projectId, fileCount: files.length }
    };
  }

  private async semanticSearch(query: string): Promise<AgentResult> {
    // Generate query embedding
    const queryEmbedding = await this.generateEmbedding(query);
    
    // Search vector database
    const results = await this.vectorDB.semanticSearch(queryEmbedding);
    
    return {
      taskId: query,
      success: true,
      data: results,
      duration: Date.now() - Date.now(),
      metadata: { query }
    };
  }
}
```

#### Step 2.2: Implement Local-First Sync

**2.2.1 Set Up PGLite for Local Database**

```typescript
// src/services/local-database.ts
import { PGLite } from 'pglite';

export class LocalDatabase {
  private db: PGLite;
  private syncClient: ElectricSyncClient;

  async initialize(): Promise<void> {
    // Initialize PGLite
    this.db = await PGLite.create({
      database: 'swarm_local',
      schema: this.getSchema()
    });
    
    // Initialize ElectricSQL sync
    this.syncClient = new ElectricSyncClient({
      url: 'https://sync.swarm.ai',
      authToken: await this.getAuthToken(),
      shapes: this.getShapes()
    });
    
    await this.syncClient.start();
  }

  private getShapes(): ShapeDefinition[] {
    return [
      {
        table: 'projects',
        where: 'user_id = $userId',
        parameters: { userId: this.getUserId() }
      },
      {
        table: 'files',
        where: 'project_id IN (SELECT id FROM projects WHERE user_id = $userId)',
        parameters: { userId: this.getUserId() }
      }
    ];
  }

  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    const result = await this.db.query(sql, params);
    return result.rows;
  }

  async insert<T>(table: string, data: Partial<T>): Promise<T> {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
    const result = await this.db.query(sql, values);
    
    return result.rows[0];
  }
}
```

**2.2.2 Implement ElectricSQL Sync Service**

```typescript
// src/services/electric-sync.ts
import { ElectricClient } from 'electric-sql';

export class ElectricSyncClient {
  private client: ElectricClient;
  private isSyncing: boolean = false;

  constructor(config: SyncConfig) {
    this.client = new ElectricClient({
      url: config.syncUrl,
      shapes: config.shapes,
      auth: {
        token: config.authToken
      }
    });
  }

  async start(): Promise<void> {
    await this.client.connect();
    await this.client.start();
    
    // Set up sync event handlers
    this.client.on('sync:start', () => {
      this.isSyncing = true;
      console.log('Sync started');
    });
    
    this.client.on('sync:complete', () => {
      this.isSyncing = false;
      console.log('Sync completed');
    });
    
    this.client.on('sync:error', (error) => {
      this.isSyncing = false;
      console.error('Sync error:', error);
    });
  }

  async stop(): Promise<void> {
    await this.client.stop();
    await this.client.disconnect();
  }

  isSyncing(): boolean {
    return this.isSyncing;
  }
}
```

### Phase 3: Hardware Integration (Weeks 9-12)

#### Step 3.1: Implement Hardware Authentication

**3.1.1 Create Hardware Authenticator Service**

```typescript
// src/services/hardware-authenticator.ts
import { ATECC608A } from 'atecc608a';

export class HardwareAuthenticator {
  private atecc608a: ATECC608A;
  private deviceInfo: DeviceInfo;

  async initialize(): Promise<void> {
    // Initialize ATECC608A
    this.atecc608a = new ATECC608A();
    await this.atecc608a.initialize();
    
    // Get device information
    this.deviceInfo = await this.getDeviceInfo();
  }

  async generateJWT(payload: object): Promise<string> {
    const timestamp = Date.now();
    const nonce = await this.generateNonce();
    
    const jwtPayload = {
      ...payload,
      iat: Math.floor(timestamp / 1000),
      exp: Math.floor((timestamp + 3600000) / 1000), // 1 hour expiry
      nonce,
      deviceId: this.deviceInfo.id
    };
    
    const payloadString = JSON.stringify(jwtPayload);
    const signature = await this.atecc608a.sign(payloadString);
    
    return this.encodeJWT(jwtPayload, signature);
  }

  async verifyJWT(token: string): Promise<boolean> {
    const { payload, signature, deviceId } = this.decodeJWT(token);
    
    // Verify device registration
    const device = await this.getDevice(deviceId);
    if (!device || !device.isActive) {
      return false;
    }
    
    // Verify signature
    const payloadString = JSON.stringify(payload);
    const publicKey = await this.getPublicKey(deviceId);
    
    return await this.atecc608a.verify(signature, payloadString, publicKey);
  }

  private async generateNonce(): Promise<string> {
    const buffer = new Uint8Array(32);
    crypto.getRandomValues(buffer);
    return Buffer.from(buffer).toString('hex');
  }
}
```

**3.1.2 Update Agent Registry for Hardware Auth**

```typescript
// src/core/cloud-agent-registry.ts
export class CloudAgentRegistry {
  private authenticator: HardwareAuthenticator;

  constructor(authenticator: HardwareAuthenticator) {
    this.authenticator = authenticator;
  }

  async authenticateRequest(request: AuthRequest): Promise<boolean> {
    const token = request.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return false;
    }
    
    return await this.authenticator.verifyJWT(token);
  }

  async registerAgent(agent: Agent): Promise<void> {
    // Generate JWT for agent
    const jwt = await this.authenticator.generateJWT({
      agentId: agent.id,
      capabilities: agent.capabilities,
      permissions: agent.permissions
    });
    
    // Register with service discovery
    await this.serviceDiscovery.register({
      id: agent.id,
      name: agent.name,
      endpoint: this.getAgentEndpoint(agent.id),
      auth: { token: jwt }
    });
  }
}
```

#### Step 3.2: Implement Context-Aware Access

**3.2.1 Create Context-Aware Access Service**

```typescript
// src/services/context-aware-access.ts
export class ContextAwareAccess {
  private policies: AccessPolicy[] = [];

  async checkAccess(request: AccessRequest): Promise<AccessResult> {
    const context = await this.gatherContext(request);
    
    for (const policy of this.policies) {
      if (this.matchesPolicy(policy, context)) {
        return this.evaluatePolicy(policy, context);
      }
    }
    
    return { allowed: false, reason: 'No matching policy found' };
  }

  private async gatherContext(request: AccessRequest): Promise<AccessContext> {
    return {
      user: await this.getUserContext(request.userId),
      device: await this.getDeviceContext(request.deviceId),
      location: await this.getLocationContext(request.ipAddress),
      time: new Date(),
      resource: request.resource,
      action: request.action
    };
  }

  private async getUserContext(userId: string): Promise<UserContext> {
    const user = await this.userService.getUser(userId);
    return {
      id: user.id,
      email: user.email,
      subscriptionTier: user.subscriptionTier,
      lastLogin: user.lastLoginAt,
      mfaEnabled: user.mfaEnabled
    };
  }

  private async getDeviceContext(deviceId: string): Promise<DeviceContext> {
    const device = await this.deviceService.getDevice(deviceId);
    return {
      id: device.id,
      type: device.type,
      os: device.os,
      isCorporateOwned: device.isCorporateOwned,
      isEncrypted: device.isEncrypted,
      screenLockEnabled: device.screenLockEnabled,
      lastSeen: device.lastSeenAt
    };
  }
}
```

### Phase 4: Google Workspace Integration (Weeks 13-16)

#### Step 4.1: Implement Gmail Integration

**4.1.1 Create Gmail Integration Service**

```typescript
// src/services/gmail-integration.ts
export class GmailIntegration {
  private gmail: Gmail;
  private cognitiveShield: CognitiveShieldAgent;

  async setupPushNotifications(userId: string): Promise<void> {
    const watchRequest = {
      userId: 'me',
      labelIds: ['INBOX'],
      topicName: `projects/${this.config.projectId}/topics/gmail-notifications`
    };
    
    const response = await this.gmail.users.watch(watchRequest);
    this.logger.info('Gmail push notifications configured:', response.data);
  }

  async processEmailNotification(notification: GmailNotification): Promise<void> {
    const message = await this.gmail.users.messages.get({
      userId: 'me',
      id: notification.messageId
    });
    
    // Extract email content
    const email = this.parseEmail(message.data);
    
    // Process through cognitive shield
    const sanitized = await this.cognitiveShield.sanitizeEmail(email);
    
    // Store in database
    await this.storeEmail(sanitized);
    
    // Send notification to user
    await this.sendNotification(userId, sanitized);
  }

  private parseEmail(message: any): Email {
    const headers = message.payload.headers;
    const from = headers.find(h => h.name === 'From').value;
    const subject = headers.find(h => h.name === 'Subject').value;
    const date = headers.find(h => h.name === 'Date').value;
    
    const body = this.decodeBody(message.payload.body.data || this.getPartBody(message.payload.parts));
    
    return {
      id: message.id,
      from,
      subject,
      date: new Date(date),
      body,
      raw: message
    };
  }
}
```

**4.1.2 Create Gmail Sidebar Add-on**

```typescript
// Google Apps Script - Gmail Sidebar
function onOpen() {
  GmailApp.createLabel('Cognitive Shield');
}

function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('Cognitive Shield');
  DocumentApp.getUi().showSidebar(html);
}

function processEmail(emailId) {
  const email = GmailApp.getMessageById(emailId);
  const cognitiveShield = new CognitiveShieldAgent();
  
  const sanitized = cognitiveShield.sanitizeEmail({
    id: email.getId(),
    from: email.getFrom(),
    subject: email.getSubject(),
    body: email.getPlainBody()
  });
  
  return sanitized;
}

function revealOriginal(emailId) {
  const email = GmailApp.getMessageById(emailId);
  return email.getPlainBody();
}
```

#### Step 4.2: Implement Drive Integration

**4.2.1 Create Drive Integration Service**

```typescript
// src/services/drive-integration.ts
export class DriveIntegration {
  private drive: Drive;
  private fileOrganizer: FileOrganizerAgent;

  async setupFileMonitoring(projectId: string): Promise<void> {
    const watchRequest = {
      fileId: projectId,
      channelType: 'web_hook',
      address: `${this.config.webhookUrl}/drive-changes`,
      expiration: Date.now() + 86400000 // 24 hours
    };
    
    const response = await this.drive.files.watch(watchRequest);
    this.logger.info('Drive monitoring configured:', response.data);
  }

  async processDriveChange(change: DriveChange): Promise<void> {
    const file = await this.drive.files.get({
      fileId: change.fileId,
      fields: 'id,name,mimeType,modifiedTime'
    });
    
    // Process file through organizer
    const organized = await this.fileOrganizer.organizeFile({
      id: file.data.id,
      name: file.data.name,
      mimeType: file.data.mimeType,
      modifiedTime: file.data.modifiedTime
    });
    
    // Move file to organized location
    await this.drive.files.update({
      fileId: change.fileId,
      addParents: organized.targetFolder,
      removeParents: organized.sourceFolder
    });
  }
}
```

### Phase 5: Testing and Deployment (Weeks 17-20)

#### Step 5.1: Set Up CI/CD Pipeline

**5.1.1 Create GitHub Actions Workflow**

```yaml
# .github/workflows/deploy.yml
name: Deploy Swarm Intelligence

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  PROJECT_ID: ${{ secrets.GCP_PROJECT }}
  REGION: us-central1
  IMAGE_TAG: ${{ github.sha }}

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: 'read'
      id-token: 'write'

    steps:
      - uses: actions/checkout@v3
      
      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v1
        with:
          workload_identity_provider: ${{ secrets.WORKLOAD_IDENTITY_PROVIDER }}
          service_account: ${{ secrets.GCP_SA_EMAIL }}

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
        with:
          project_id: ${{ secrets.GCP_PROJECT }}

      - name: Build and push Docker images
        run: |
          docker build -t gcr.io/$PROJECT_ID/swarm-orchestrator:$IMAGE_TAG .
          docker push gcr.io/$PROJECT_ID/swarm-orchestrator:$IMAGE_TAG

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy swarm-orchestrator \
            --image gcr.io/$PROJECT_ID/swarm-orchestrator:$IMAGE_TAG \
            --region $REGION \
            --platform managed \
            --allow-unauthenticated

      - name: Run integration tests
        run: |
          npm run test:integration
```

**5.1.2 Create Terraform Infrastructure**

```hcl
# terraform/main.tf
provider "google" {
  project = var.project_id
  region  = var.region
}

# Cloud SQL instance
resource "google_sql_database_instance" "swarm_db" {
  name             = "swarm-db"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = "db-custom-2-7680"
    
    backup_configuration {
      enabled            = true
      start_time         = "02:00"
      binary_log_enabled = true
    }

    ip_configuration {
      ipv4_enabled = true
    }
  }
}

# Cloud Run services
resource "google_cloud_run_service" "swarm_orchestrator" {
  name     = "swarm-orchestrator"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/swarm-orchestrator:${var.image_tag}"
        resources {
          limits = {
            cpu    = "2000m"
            memory = "1Gi"
          }
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# IAM bindings
resource "google_cloud_run_service_iam_member" "invoker" {
  project  = google_cloud_run_service.swarm_orchestrator.project
  location = google_cloud_run_service.swarm_orchestrator.location
  service  = google_cloud_run_service.swarm_orchestrator.name
  role     = "roles/run.invoker"

  member = "allUsers"
}
```

#### Step 5.2: Migration Testing

**5.2.1 Create Migration Test Suite**

```typescript
// tests/migration.test.ts
describe('Swarm Intelligence Migration', () => {
  let testEnvironment: TestEnvironment;
  let localSwarm: ProjectSwarmIntelligence;
  let cloudSwarm: CloudSwarmIntelligence;

  beforeAll(async () => {
    // Setup test environment
    testEnvironment = new TestEnvironment();
    await testEnvironment.setup();
    
    // Initialize local swarm
    localSwarm = new ProjectSwarmIntelligence(localConfig);
    await localSwarm.initialize();
    
    // Initialize cloud swarm
    cloudSwarm = new CloudSwarmIntelligence(cloudConfig);
    await cloudSwarm.initialize();
  });

  afterAll(async () => {
    await testEnvironment.teardown();
  });

  describe('Data Migration', () => {
    it('should migrate project data correctly', async () => {
      // Create test project in local swarm
      const localProject = await localSwarm.createProject({
        name: 'test-project',
        path: '/test/project'
      });

      // Migrate to cloud
      await cloudSwarm.migrateProject(localProject.id);

      // Verify migration
      const cloudProject = await cloudSwarm.getProject(localProject.id);
      expect(cloudProject.name).toBe(localProject.name);
      expect(cloudProject.path).toBe(localProject.path);
    });

    it('should maintain data consistency during sync', async () => {
      // Create file in local
      const localFile = await localSwarm.createFile({
        projectId: testProject.id,
        name: 'test.txt',
        content: 'test content'
      });

      // Sync to cloud
      await cloudSwarm.syncProject(testProject.id);

      // Verify file exists in cloud
      const cloudFile = await cloudSwarm.getFile(localFile.id);
      expect(cloudFile.content).toBe(localFile.content);
    });
  });

  describe('Agent Migration', () => {
    it('should migrate agent functionality', async () => {
      // Test local agent
      const localResult = await localSwarm.executeAgent('project-analyzer', {
        projectId: testProject.id
      });

      // Test cloud agent
      const cloudResult = await cloudSwarm.executeAgent('project-analyzer', {
        projectId: testProject.id
      });

      // Results should be equivalent
      expect(cloudResult.data.quality).toBeDefined();
      expect(cloudResult.data.architecture).toBeDefined();
    });
  });

  describe('Performance Comparison', () => {
    it('should maintain or improve performance', async () => {
      const localStart = Date.now();
      await localSwarm.analyzeProject(testProject.id);
      const localDuration = Date.now() - localStart;

      const cloudStart = Date.now();
      await cloudSwarm.analyzeProject(testProject.id);
      const cloudDuration = Date.now() - cloudStart;

      // Cloud should be faster or comparable
      expect(cloudDuration).toBeLessThanOrEqual(localDuration * 1.2);
    });
  });
});
```

### Phase 6: Production Deployment

#### Step 6.1: Blue-Green Deployment

**6.1.1 Set Up Blue-Green Deployment**

```bash
# Deploy new version (Green)
gcloud run deploy swarm-orchestrator-green \
  --image gcr.io/$PROJECT_ID/swarm-orchestrator:v2.0.0 \
  --region $REGION \
  --platform managed

# Test green deployment
curl https://swarm-orchestrator-green-$REGION.a.run.app/health

# Switch traffic to green
gcloud run services update-traffic swarm-orchestrator \
  --to-revisions swarm-orchestrator-green=100

# Monitor for issues
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=swarm-orchestrator" \
  --limit 100 --format json

# If issues found, rollback
gcloud run services update-traffic swarm-orchestrator \
  --to-revisions swarm-orchestrator-blue=100
```

#### Step 6.2: Monitoring and Alerting

**6.2.1 Set Up Monitoring**

```yaml
# monitoring/alerts.yaml
apiVersion: monitoring.googleapis.com/v3
kind: AlertPolicy
metadata:
  name: swarm-agent-health
spec:
  displayName: Swarm Agent Health Check
  conditions:
  - displayName: Agent Response Time
    conditionThreshold:
      filter: 'metric.type="run.googleapis.com/request_count" AND resource.type="cloud_run_revision"'
      comparison: COMPARISON_LT
      thresholdValue: 10
      duration: 300s
  notificationChannels:
  - name: projects/$PROJECT_ID/notificationChannels/email-alerts
```

```bash
# Apply monitoring configuration
gcloud monitoring policies create --policy-from-file=monitoring/alerts.yaml
```

## Migration Checklist

### Phase 1: Foundation (Weeks 1-4)
- [ ] Google Cloud project setup
- [ ] Cloud SQL database creation
- [ ] Storage and caching setup
- [ ] Container registry configuration
- [ ] Basic Cloud Run services deployed

### Phase 2: Agent Migration (Weeks 5-8)
- [ ] Existing agents containerized
- [ ] File system monitor updated for cloud
- [ ] Project analyzer updated for cloud
- [ ] Local-first sync implemented
- [ ] PGLite integration complete

### Phase 3: Hardware Integration (Weeks 9-12)
- [ ] Hardware authenticator implemented
- [ ] ATECC608A integration complete
- [ ] Context-aware access controls
- [ ] Device registration system
- [ ] Security hardening complete

### Phase 4: Workspace Integration (Weeks 13-16)
- [ ] Gmail integration implemented
- [ ] Drive integration complete
- [ ] Workspace add-ons deployed
- [ ] Cognitive shield integration
- [ ] User interface updates

### Phase 5: Testing (Weeks 17-18)
- [ ] CI/CD pipeline setup
- [ ] Integration tests complete
- [ ] Performance testing
- [ ] Security testing
- [ ] User acceptance testing

### Phase 6: Deployment (Weeks 19-20)
- [ ] Blue-green deployment setup
- [ ] Production deployment
- [ ] Monitoring and alerting
- [ ] Documentation updates
- [ ] User training materials

## Troubleshooting

### Common Issues

**Issue: Database Connection Timeouts**
```bash
# Check Cloud SQL connection
gcloud sql connect swarm-db --user=swarm_user

# Verify network connectivity
telnet swarm-db:5432
```

**Issue: Container Build Failures**
```bash
# Check build logs
gcloud builds list --filter="status=FAILURE"

# Debug locally
docker build --no-cache -t test-image .
```

**Issue: Authentication Failures**
```bash
# Verify JWT tokens
curl -H "Authorization: Bearer $TOKEN" https://api.swarm.ai/health

# Check hardware authentication
node -e "console.log(require('./src/services/hardware-authenticator'))"
```

**Issue: Sync Failures**
```bash
# Check ElectricSQL logs
kubectl logs -f deployment/electric-sync

# Verify PGLite connection
node -e "require('./src/services/local-database').testConnection()"
```

### Rollback Procedures

**Rollback Cloud Run Service**
```bash
# List revisions
gcloud run revisions list --service=swarm-orchestrator

# Rollback to previous revision
gcloud run services update-traffic swarm-orchestrator \
  --to-revisions PREVIOUS_REVISION_NAME=100
```

**Rollback Database Changes**
```bash
# Restore from backup
gcloud sql backups restore BACKUP_ID \
  --restore-instance=swarm-db \
  --backup-instance=swarm-db
```

**Rollback Local Changes**
```bash
# Stop cloud services
gcloud run services update-traffic swarm-orchestrator \
  --to-revisions swarm-orchestrator=0

# Restart local swarm
npm run start swarm
```

## Post-Migration Tasks

### Performance Optimization
- Monitor resource usage and adjust scaling
- Optimize database queries and indexes
- Implement caching strategies
- Review and optimize agent execution

### Security Hardening
- Conduct security audit
- Implement additional access controls
- Review and update security policies
- Monitor for security vulnerabilities

### User Training
- Create user documentation
- Conduct training sessions
- Gather user feedback
- Iterate on user experience

### Continuous Improvement
- Monitor system performance
- Collect usage metrics
- Plan future enhancements
- Maintain system documentation

This migration guide provides a comprehensive roadmap for transforming the local Project Swarm Intelligence system into a cloud-native SaaS platform. Follow each phase carefully and test thoroughly to ensure a successful migration.