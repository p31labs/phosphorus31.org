# SUPER-CENTAUR API Documentation
**The Centaur: Backend AI Protocol**  
**Version:** 1.0.0  
**Base URL:** `http://localhost:3001` (development)  
**With love and light. As above, so below. 💜**

---

## Table of Contents

1. [Authentication](#authentication)
2. [Buffer Integration](#buffer-integration)
3. [Scope Integration](#scope-integration)
4. [Node One Integration](#node-one-integration)
5. [Health & Monitoring](#health--monitoring)
6. [Legal AI](#legal-ai)
7. [Medical Documentation](#medical-documentation)
8. [Cognitive Prosthetics](#cognitive-prosthetics)
9. [Game Engine](#game-engine)
10. [Wallet & L.O.V.E. Economy](#wallet--love-economy)
11. [Spoon Economy](#spoon-economy)
12. [Family Support](#family-support)
13. [System Management](#system-management)

---

## Authentication

All authenticated endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

### POST `/api/auth/login`
Login with username and password. May require MFA.

**Request Body:**
```typescript
{
  username: string;
  password: string;
}
```

**Response (Success):**
```typescript
{
  success: true;
  token: string;
  user: {
    id: string;
    username: string;
    // ... other user fields
  }
}
```

**Response (MFA Required):**
```typescript
{
  success: false;
  requiresMFA: true;
  mfaToken: string;
  user: { id: string; username: string; }
}
```

**Called By:** Scope (frontend dashboard)

---

### POST `/api/auth/mfa/complete`
Complete MFA authentication after receiving MFA code.

**Request Body:**
```typescript
{
  mfaToken: string;
  mfaCode: string; // 6-digit TOTP code
}
```

**Response:**
```typescript
{
  success: true;
  token: string;
  user: { id: string; username: string; }
}
```

**Called By:** Scope

---

### POST `/api/auth/mfa/setup`
Setup MFA for a user. Returns QR code and secret.

**Request Body:**
```typescript
{
  userId: string;
}
```

**Response:**
```typescript
{
  secret: string;
  qrCode: string; // Data URL for QR code
  backupCodes: string[];
}
```

**Called By:** Scope

---

### POST `/api/auth/mfa/enable`
Enable MFA after verification.

**Request Body:**
```typescript
{
  userId: string;
  mfaToken: string; // From setup
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

**Called By:** Scope

---

### POST `/api/auth/mfa/disable`
Disable MFA for a user.

**Request Body:**
```typescript
{
  userId: string;
}
```

**Response:**
```typescript
{
  success: true;
  message: string;
}
```

**Called By:** Scope

---

### GET `/api/auth/mfa/status/:userId`
Get MFA status for a user.

**Response:**
```typescript
{
  enabled: boolean;
  verified: boolean;
}
```

**Called By:** Scope

---

### POST `/api/auth/register`
Register a new user.

**Request Body:**
```typescript
{
  username: string;
  password: string;
}
```

**Response:**
```typescript
{
  id: string;
  username: string;
  createdAt: string;
}
```

**Called By:** Scope

---

### GET `/api/auth/me`
Get current authenticated user.

**Auth Required:** Yes (JWT)

**Response:**
```typescript
{
  id: string;
  username: string;
  // ... other user fields
}
```

**Called By:** Scope

---

## Buffer Integration

The Buffer is the voltage assessment system for incoming messages. These endpoints allow The Centaur to send messages to The Buffer for processing.

### POST `/api/buffer/message`
Send a message to The Buffer for voltage assessment.

**Request Body:**
```typescript
{
  message: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  metadata?: Record<string, any>;
}
```

**Response:**
```typescript
{
  success: boolean;
  messageId: string;
  status: 'HELD' | 'RELEASED' | 'PASSED';
  voltage?: number; // 0-10 voltage score
  reason?: string; // Why message was held/released
}
```

**Called By:** The Centaur (internal), Scope (user messages)

---

### GET `/api/buffer/status`
Get The Buffer connection status and queue information.

**Response:**
```typescript
{
  connected: boolean;
  queueLength: number;
  pending: number;
  processing: number;
  lastMessageTime?: string;
}
```

**Called By:** Scope (dashboard), The Centaur (health checks)

---

### GET `/api/buffer/ping`
Ping The Buffer to check connectivity.

**Response:**
```typescript
{
  active: boolean;
  lastHeartbeat: string | null;
  nodes: Record<string, any>;
  health: 'green' | 'yellow' | 'red';
}
```

**Called By:** The Centaur (health checks), Node One (via The Centaur)

---

### POST `/api/buffer/heartbeat`
Send heartbeat to The Buffer from a node.

**Request Body:**
```typescript
{
  nodeId: string;
  signalStrength: number; // 0-100
  location?: { lat: number; lon: number };
}
```

**Response:**
```typescript
{
  success: boolean;
  timestamp: string;
}
```

**Called By:** Node One (via The Centaur), Scope (if connected)

---

## Scope Integration

The Scope is the frontend dashboard. These endpoints provide data and functionality for The Scope UI.

### GET `/api/system/metrics`
Get system performance metrics.

**Response:**
```typescript
{
  cpuUsage: number;
  memoryUsage: number;
  responseTime: number;
  throughput: number;
  cacheHitRate: number;
  activeConnections: number;
  uptime: number;
  diskUsage: number;
  networkLatency: number;
}
```

**Called By:** Scope (dashboard)

---

### GET `/api/system/monitoring`
Get monitoring dashboard data.

**Response:**
```typescript
{
  systemHealth: 'healthy' | 'degraded' | 'critical';
  uptime: number;
  services: Record<string, {
    status: 'healthy' | 'degraded' | 'down';
    latency: number;
    lastCheck: string;
    errorCount: number;
  }>;
  alerts: Array<{
    id: string;
    timestamp: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    source: string;
    message: string;
    acknowledged: boolean;
  }>;
  metrics: {
    requestsPerMinute: number;
    errorRate: number;
    avgResponseTime: number;
    activeUsers: number;
  };
}
```

**Called By:** Scope (monitoring dashboard)

---

### GET `/api/system/alerts`
Get all system alerts.

**Query Parameters:**
- `severity?: 'info' | 'warning' | 'error' | 'critical'`
- `acknowledged?: boolean`
- `limit?: number`

**Response:**
```typescript
{
  alerts: Array<{
    id: string;
    timestamp: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    source: string;
    message: string;
    acknowledged: boolean;
  }>;
  total: number;
}
```

**Called By:** Scope (alerts panel)

---

### POST `/api/system/alerts/acknowledge`
Acknowledge an alert.

**Request Body:**
```typescript
{
  alertId: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

**Called By:** Scope

---

### GET `/api/wallet/balance`
Get wallet balance (LOVE tokens).

**Response:**
```typescript
{
  balance: number;
  currency: 'LOVE';
  transactions: number; // Total transaction count
}
```

**Called By:** Scope (wallet display)

---

### GET `/api/wallet/transactions`
Get wallet transaction history.

**Query Parameters:**
- `limit?: number` (default: 50)
- `offset?: number` (default: 0)

**Response:**
```typescript
{
  transactions: Array<{
    id: string;
    type: string; // 'BLOCK_PLACED', 'COHERENCE_GIFT', etc.
    amount: number;
    timestamp: string;
    description: string;
  }>;
  total: number;
}
```

**Called By:** Scope (transaction history)

---

### GET `/api/spoons/today/:memberId`
Get today's spoon count for a family member.

**Response:**
```typescript
{
  memberId: string;
  date: string; // ISO date
  total: number;
  used: number;
  remaining: number;
  activities: Array<{
    id: string;
    name: string;
    cost: number;
    timestamp: string;
  }>;
}
```

**Called By:** Scope (spoon economy display)

---

### GET `/api/spoons/history/:memberId`
Get spoon history for a family member.

**Query Parameters:**
- `days?: number` (default: 7)
- `startDate?: string` (ISO date)
- `endDate?: string` (ISO date)

**Response:**
```typescript
{
  memberId: string;
  history: Array<{
    date: string;
    total: number;
    used: number;
    activities: number;
  }>;
}
```

**Called By:** Scope (spoon history chart)

---

### POST `/api/spoons/log`
Log a spoon activity.

**Request Body:**
```typescript
{
  memberId: string;
  activity: string;
  cost: number;
  timestamp?: string; // ISO date, defaults to now
}
```

**Response:**
```typescript
{
  success: boolean;
  activityId: string;
  remaining: number;
}
```

**Called By:** Scope (activity logging)

---

## Node One Integration

Node One is the ESP32-S3 hardware device. These endpoints allow Node One to communicate with The Centaur.

### POST `/api/buffer/message`
Node One can send messages through The Centaur to The Buffer for voltage assessment.

**Request Body:**
```typescript
{
  message: string;
  source: 'node-one';
  nodeId: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  metadata?: {
    haptic?: boolean;
    display?: boolean;
    lora?: boolean;
  };
}
```

**Response:**
```typescript
{
  success: boolean;
  messageId: string;
  status: 'HELD' | 'RELEASED' | 'PASSED';
  voltage?: number;
  action?: 'display' | 'haptic' | 'block';
}
```

**Called By:** Node One (via LoRa/USB)

---

### POST `/api/buffer/heartbeat`
Node One sends periodic heartbeats to maintain mesh connectivity.

**Request Body:**
```typescript
{
  nodeId: string; // 'NODE_ONE' or device ID
  signalStrength: number; // 0-100
  batteryLevel?: number; // 0-100
  location?: { lat: number; lon: number };
  status: 'online' | 'offline' | 'low_battery';
}
```

**Response:**
```typescript
{
  success: boolean;
  timestamp: string;
  meshStatus: 'connected' | 'disconnected';
  nodes: Array<{
    nodeId: string;
    lastSeen: string;
    signalStrength: number;
  }>;
}
```

**Called By:** Node One (periodic, every 30-60 seconds)

---

### GET `/api/game/progress/:memberId`
Node One can query game progress for a family member.

**Response:**
```typescript
{
  memberId: string;
  structures: number;
  challenges: number;
  completed: number;
  loveEarned: number;
  level: number;
}
```

**Called By:** Node One (game integration)

---

## Health & Monitoring

### GET `/health`
Basic health check endpoint.

**Response:**
```typescript
{
  status: 'healthy';
  timestamp: string;
  systems: {
    legalAI: 'active' | 'unavailable';
    medical: 'active' | 'unavailable';
    blockchain: 'active' | 'unavailable';
    agents: 'active' | 'unavailable';
    chatbot: 'active' | 'unavailable';
    optimizer: 'active' | 'unavailable';
    security: 'active' | 'unavailable';
    backup: 'active' | 'unavailable';
    monitoring: 'active' | 'unavailable';
    quantumBrain: 'active' | 'unavailable';
    googleDrive: 'active' | 'unavailable';
    auth: 'active' | 'unavailable';
    buffer: 'active' | 'unavailable';
  };
}
```

**Called By:** All components (health checks), Docker healthcheck

---

### GET `/api/health/quantum-brain/status`
Quantum Brain specific health check.

**Response:**
```typescript
{
  status: 'healthy';
  timestamp: string;
  systems: {
    decisionEngine: 'active' | 'inactive';
    consciousnessMonitor: 'active' | 'inactive';
    quantumOptimizer: 'active' | 'inactive';
    realTimeOptimizer: 'active' | 'inactive';
    universalIntelligence: 'active' | 'inactive';
    integration: 'active' | 'inactive';
  };
}
```

**Called By:** Scope (quantum brain dashboard)

---

## Legal AI

### POST `/api/legal/generate`
Generate a legal document.

**Request Body:**
```typescript
{
  type: string; // 'evidence-timeline', 'motion', 'brief', etc.
  context: {
    jurisdiction: string;
    courtSystem: string;
    caseType: string;
    parties: {
      plaintiff: string;
      defendant: string;
    };
    facts: string[];
    legalIssues: string[];
    evidence: string[];
  };
  urgency?: 'low' | 'medium' | 'high';
}
```

**Response:**
```typescript
{
  success: true;
  documentType: string;
  document: string; // Generated document content
  timestamp: string;
  metadata: {
    jurisdiction: string;
    courtSystem: string;
    urgency: string;
    tokensUsed?: number;
  };
}
```

**Called By:** Scope (legal document generation), Family Support System

---

### POST `/api/legal/emergency`
Handle emergency legal situation.

**Request Body:**
```typescript
{
  type: 'restraining-order' | 'emergency-motion' | 'protection-order';
  urgency: 'high' | 'medium' | 'low';
  details: string;
  evidence: string[];
}
```

**Response:**
```typescript
{
  success: true;
  situationType: string;
  response: string; // AI-generated emergency response
  timestamp: string;
  metadata: {
    urgency: string;
    evidenceCount: number;
    tokensUsed?: number;
  };
}
```

**Called By:** Scope (emergency legal assistance), Family Support System

---

## Medical Documentation

### POST `/api/medical/document`
Create medical documentation.

**Request Body:**
```typescript
{
  patientId: string;
  condition: string; // 'hypoparathyroidism', 'intellectual-gaps', etc.
  symptoms: string[];
  history: string;
  documentationType?: 'chronic' | 'expert-witness' | 'compliance' | 'generational-trauma';
}
```

**Response:**
```typescript
{
  id: string;
  patientId: string;
  condition: string;
  documentationType: string;
  content: string;
  generatedDate: string;
  status: 'draft' | 'completed' | 'reviewed';
  compliance: {
    HIPAA: boolean;
    GDPR: boolean;
    jurisdiction: string;
  };
  blockchainHash?: string;
}
```

**Called By:** Scope (medical documentation), Family Support System

---

### GET `/api/medical/conditions`
Get available medical conditions.

**Response:**
```typescript
{
  conditions: Array<{
    id: string;
    name: string;
    description: string;
    symptoms: string[];
    treatments: string[];
    documentationRequired: boolean;
    expertWitnessRequired: boolean;
  }>;
}
```

**Called By:** Scope (condition selection)

---

## Cognitive Prosthetics

### GET `/api/cognitive-prosthetics/state`
Get current cognitive state.

**Response:**
```typescript
{
  success: true;
  state: {
    attention: number; // 0-100
    executiveFunction: number; // 0-100
    workingMemory: number; // 0-100
    emotionalRegulation: number; // 0-100
    sensoryProcessing: number; // 0-100
    timestamp: number;
  };
  healthScore: number; // 0-100
  interventions: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    message: string;
    actions: string[];
    timestamp: number;
  }>;
  recommendations: string[];
}
```

**Called By:** Scope (cognitive state dashboard)

---

### POST `/api/cognitive-prosthetics/state`
Update cognitive state.

**Request Body:**
```typescript
{
  attention?: number; // 0-100
  executiveFunction?: number; // 0-100
  workingMemory?: number; // 0-100
  emotionalRegulation?: number; // 0-100
  sensoryProcessing?: number; // 0-100
}
```

**Response:**
```typescript
{
  success: true;
  state: { /* updated state */ };
  interventions: Array</* intervention objects */>;
}
```

**Called By:** Scope (state updates), Node One (sensor data)

---

### GET `/api/cognitive-prosthetics/attention/session`
Get current focus session.

**Response:**
```typescript
{
  session: {
    id: string;
    duration: number; // minutes
    startTime: string;
    endTime?: string;
    type: 'pomodoro' | 'custom';
    completed: boolean;
  } | null;
  history: Array</* session history */>;
}
```

**Called By:** Scope (attention support UI)

---

### POST `/api/cognitive-prosthetics/attention/session/start`
Start a focus session.

**Request Body:**
```typescript
{
  duration: number; // minutes (default: 25 for Pomodoro)
  type?: 'pomodoro' | 'custom';
}
```

**Response:**
```typescript
{
  success: true;
  session: {
    id: string;
    duration: number;
    startTime: string;
    type: string;
  };
}
```

**Called By:** Scope (start focus session)

---

### GET `/api/cognitive-prosthetics/executive/tasks`
Get executive function tasks.

**Query Parameters:**
- `status?: 'pending' | 'in_progress' | 'completed'`
- `priority?: 'low' | 'medium' | 'high'`

**Response:**
```typescript
{
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    priority: string;
    deadline: string;
    status: string;
    subtasks: Array</* subtask objects */>;
    spoonCost: number;
  }>;
}
```

**Called By:** Scope (task management UI)

---

### POST `/api/cognitive-prosthetics/executive/tasks`
Create a new task.

**Request Body:**
```typescript
{
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  deadline: string; // ISO date
  parentTaskId?: string; // For subtasks
}
```

**Response:**
```typescript
{
  success: true;
  task: {
    id: string;
    title: string;
    // ... other task fields
  };
}
```

**Called By:** Scope (create task)

---

## Game Engine

### GET `/api/game/structures`
Get all game structures.

**Response:**
```typescript
{
  structures: Array<{
    id: string;
    name: string;
    type: string;
    vertices: number;
    edges: number;
    faces: number;
    coherence: number;
    stability: number;
    createdAt: string;
  }>;
}
```

**Called By:** Scope (game structures display), Node One

---

### POST `/api/game/structures`
Create a new game structure.

**Request Body:**
```typescript
{
  name: string;
  type: string;
  vertices: Array<{ x: number; y: number; z: number }>;
  // ... other structure data
}
```

**Response:**
```typescript
{
  success: true;
  structure: {
    id: string;
    name: string;
    // ... structure data
  };
}
```

**Called By:** Scope (build mode), Node One (via P31 Language)

---

### GET `/api/game/progress/:memberId`
Get game progress for a family member.

**Response:**
```typescript
{
  memberId: string;
  structures: number;
  challenges: number;
  completed: number;
  loveEarned: number;
  level: number;
  achievements: Array<string>;
}
```

**Called By:** Scope (progress display), Node One

---

### PUT `/api/game/progress/:memberId`
Update game progress.

**Request Body:**
```typescript
{
  structures?: number;
  challenges?: number;
  completed?: number;
  loveEarned?: number;
  level?: number;
}
```

**Response:**
```typescript
{
  success: true;
  progress: { /* updated progress */ };
}
```

**Called By:** Scope (progress updates), Node One (game events)

---

### GET `/api/game/challenges`
Get available challenges.

**Response:**
```typescript
{
  challenges: Array<{
    id: string;
    name: string;
    description: string;
    difficulty: number;
    reward: number; // LOVE tokens
    requirements: Array<string>;
  }>;
}
```

**Called By:** Scope (challenges display)

---

### POST `/api/game/validate`
Validate a game structure or action.

**Request Body:**
```typescript
{
  type: 'structure' | 'action';
  data: any; // Structure or action data
}
```

**Response:**
```typescript
{
  valid: boolean;
  errors: string[];
  warnings: string[];
  reward?: number; // LOVE tokens if valid
}
```

**Called By:** Scope (structure validation), Node One (game validation)

---

## Wallet & L.O.V.E. Economy

### GET `/api/wallet/balance`
Get wallet balance.

**Response:**
```typescript
{
  balance: number;
  currency: 'LOVE';
  transactions: number;
}
```

**Called By:** Scope (wallet display)

---

### POST `/api/wallet/transaction`
Create a transaction (earn or spend LOVE).

**Request Body:**
```typescript
{
  type: 'BLOCK_PLACED' | 'COHERENCE_GIFT' | 'ARTIFACT_CREATED' | 
        'CARE_RECEIVED' | 'CARE_GIVEN' | 'TETRAHEDRON_BOND' | 
        'VOLTAGE_CALMED' | 'MILESTONE_REACHED' | 'PING';
  amount: number; // LOVE tokens
  description: string;
  metadata?: Record<string, any>;
}
```

**Response:**
```typescript
{
  success: true;
  transactionId: string;
  newBalance: number;
  timestamp: string;
}
```

**Called By:** Scope (transaction creation), Game Engine (automatic)

---

### GET `/api/wallet/transactions`
Get transaction history.

**Query Parameters:**
- `limit?: number` (default: 50)
- `offset?: number` (default: 0)
- `type?: string` (filter by transaction type)

**Response:**
```typescript
{
  transactions: Array<{
    id: string;
    type: string;
    amount: number;
    timestamp: string;
    description: string;
    metadata?: Record<string, any>;
  }>;
  total: number;
}
```

**Called By:** Scope (transaction history)

---

### GET `/api/wallet/family`
Get family wallet summary.

**Response:**
```typescript
{
  totalBalance: number;
  members: Array<{
    memberId: string;
    balance: number;
    transactions: number;
  }>;
}
```

**Called By:** Scope (family wallet view)

---

### GET `/api/wallet/member/:memberId`
Get wallet for a specific family member.

**Response:**
```typescript
{
  memberId: string;
  balance: number;
  currency: 'LOVE';
  transactions: number;
  recentTransactions: Array</* transaction objects */>;
}
```

**Called By:** Scope (member wallet view)

---

### POST `/api/wallet/transfer`
Transfer LOVE between family members.

**Request Body:**
```typescript
{
  fromMemberId: string;
  toMemberId: string;
  amount: number;
  reason?: string;
}
```

**Response:**
```typescript
{
  success: true;
  transactionId: string;
  fromBalance: number;
  toBalance: number;
}
```

**Called By:** Scope (LOVE transfers)

---

## Spoon Economy

### GET `/api/spoons/today/:memberId`
Get today's spoon count.

**Response:**
```typescript
{
  memberId: string;
  date: string; // ISO date
  total: number;
  used: number;
  remaining: number;
  activities: Array<{
    id: string;
    name: string;
    cost: number;
    timestamp: string;
  }>;
}
```

**Called By:** Scope (spoon display), Node One (spoon status)

---

### POST `/api/spoons/log`
Log a spoon activity.

**Request Body:**
```typescript
{
  memberId: string;
  activity: string;
  cost: number;
  timestamp?: string; // ISO date, defaults to now
}
```

**Response:**
```typescript
{
  success: true;
  activityId: string;
  remaining: number;
  total: number;
  used: number;
}
```

**Called By:** Scope (activity logging), Node One (activity tracking)

---

### GET `/api/spoons/history/:memberId`
Get spoon history.

**Query Parameters:**
- `days?: number` (default: 7)
- `startDate?: string` (ISO date)
- `endDate?: string` (ISO date)

**Response:**
```typescript
{
  memberId: string;
  history: Array<{
    date: string;
    total: number;
    used: number;
    activities: number;
    recovery: number;
  }>;
}
```

**Called By:** Scope (spoon history chart)

---

### GET `/api/spoons/activities`
Get available spoon activities with costs.

**Response:**
```typescript
{
  activities: Array<{
    id: string;
    name: string;
    baseCost: number;
    description: string;
    category: string;
  }>;
}
```

**Called By:** Scope (activity selection)

---

### GET `/api/spoons/recovery/:memberId`
Get recovery recommendations for a member.

**Response:**
```typescript
{
  memberId: string;
  recommendations: Array<{
    type: 'rest' | 'low_stim' | 'sensory_regulation' | 'social_break';
    description: string;
    estimatedRecovery: number; // spoons recovered
    duration: number; // minutes
  }>;
  currentSpoons: number;
  maxSpoons: number;
}
```

**Called By:** Scope (recovery recommendations)

---

## Family Support

### GET `/api/family/status`
Get family support system status.

**Response:**
```typescript
{
  status: 'active' | 'inactive';
  members: number;
  activeCases: number;
  supportRequests: number;
  lastUpdate: string;
}
```

**Called By:** Scope (family support dashboard)

---

### POST `/api/family/support`
Create a support request.

**Request Body:**
```typescript
{
  type: 'emotional' | 'legal' | 'financial' | 'practical' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  requestedBy: string; // member ID
}
```

**Response:**
```typescript
{
  success: true;
  requestId: string;
  assignedTo: string[];
  status: 'pending' | 'in_progress' | 'completed';
}
```

**Called By:** Scope (support request creation)

---

## System Management

### GET `/api/system/metrics`
Get system performance metrics.

**Response:**
```typescript
{
  cpuUsage: number;
  memoryUsage: number;
  responseTime: number;
  throughput: number;
  cacheHitRate: number;
  activeConnections: number;
  uptime: number;
  diskUsage: number;
  networkLatency: number;
}
```

**Called By:** Scope (system metrics dashboard)

---

### GET `/api/system/security`
Get security status.

**Response:**
```typescript
{
  overallLevel: 'fortress' | 'high' | 'medium' | 'low';
  firewallActive: boolean;
  encryptionEnabled: boolean;
  lastScan: string;
  threatCount: number;
  auditLogEntries: number;
  activeSessions: number;
  blockedIPs: string[];
}
```

**Called By:** Scope (security dashboard)

---

### POST `/api/system/security/scan`
Perform security scan.

**Response:**
```typescript
{
  clean: boolean;
  threats: number;
  scannedAt: string;
  findings: string[];
  duration: number;
}
```

**Called By:** Scope (manual security scan)

---

### GET `/api/system/security/audit`
Get security audit log.

**Query Parameters:**
- `limit?: number` (default: 100)
- `action?: string` (filter by action)
- `userId?: string` (filter by user)

**Response:**
```typescript
{
  entries: Array<{
    id: string;
    timestamp: string;
    action: string;
    userId: string;
    ip: string;
    result: 'success' | 'failure' | 'blocked';
    details?: string;
  }>;
  total: number;
}
```

**Called By:** Scope (audit log view)

---

### GET `/api/system/backup`
Get backup status.

**Response:**
```typescript
{
  lastBackup: string | null;
  nextBackup: string;
  totalBackups: number;
  backupSizeBytes: number;
  autoBackupEnabled: boolean;
  retentionDays: number;
}
```

**Called By:** Scope (backup status)

---

### POST `/api/system/backup/create`
Create a backup.

**Request Body:**
```typescript
{
  type?: 'full' | 'incremental' (default: 'full');
}
```

**Response:**
```typescript
{
  success: true;
  backupId: string;
  timestamp: string;
  sizeBytes: number;
  status: 'completed' | 'in_progress';
}
```

**Called By:** Scope (manual backup)

---

## Error Responses

All endpoints may return error responses in the following format:

```typescript
{
  error: string;
  message?: string; // Detailed error message (development only)
  code?: string; // Error code
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
- `503` - Service Unavailable

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **Default:** 100 requests per minute per IP
- **Auth endpoints:** 10 requests per minute per IP
- **Buffer endpoints:** 50 requests per minute per IP

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642723200
```

---

## WebSocket Support

The Centaur also supports WebSocket connections for real-time updates:

**Connection:** `ws://localhost:3001`

**Events:**
- `message` - New message received
- `alert` - System alert
- `heartbeat` - Heartbeat from node
- `game_event` - Game engine event
- `cognitive_update` - Cognitive state update

**Called By:** Scope (real-time updates), Node One (real-time communication)

---

## Additional Routes

### Cognitive Prosthetics Routes
- `GET /api/cognitive-prosthetics/status` - System status
- `GET /api/cognitive-prosthetics/health` - Health check
- `GET /api/cognitive-prosthetics/memory/notes` - Memory notes
- `POST /api/cognitive-prosthetics/memory/notes` - Create note
- `GET /api/cognitive-prosthetics/memory/reminders` - Get reminders

### Strategic/Deadline Routes
- `GET /api/deadlines` - Get all deadlines
- `GET /api/deadlines/critical` - Get critical deadlines
- `POST /api/deadlines` - Create deadline
- `PUT /api/deadlines/:id` - Update deadline
- `DELETE /api/deadlines/:id` - Delete deadline

### Synergy Routes
- `GET /api/synergy` - Get synergy network status
- `GET /api/synergy/nodes` - Get all nodes
- `POST /api/synergy/nodes` - Add node
- `POST /api/synergy/connections` - Create connection
- `POST /api/synergy/boost/:id` - Boost node

### Quantum Lab Routes
- `POST /api/quantum-lab/experiment` - Run experiment
- `GET /api/quantum-lab/experiment/:id` - Get experiment
- `GET /api/quantum-lab/experiments` - List experiments
- `GET /api/quantum-lab/decay-rate` - Get decay rate

### SOP Routes
- `POST /api/sop/generate` - Generate SOP
- `GET /api/sop/:id` - Get SOP
- `GET /api/sop` - List SOPs
- `PUT /api/sop/:id` - Update SOP
- `GET /api/sop/:id/export` - Export SOP

---

**Documentation Version:** 1.0.0  
**Last Updated:** 2026-02-15  
**Maintained By:** P31 Labs  
**The Mesh Holds. 🔺**
