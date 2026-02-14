# P31 Integration Guide

Complete guide for integrating P31 components with external systems and services.

## Overview

P31 is designed to integrate with external systems while maintaining sovereignty and privacy. This guide covers integration patterns, APIs, and best practices.

## Integration Patterns

### 1. API Integration

#### REST API

P31 components expose REST APIs:

```typescript
// The Centaur API
const response = await fetch('http://localhost:3000/api/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    message: 'Hello from external system',
    priority: 'normal',
  }),
});
```

#### WebSocket Integration

Real-time updates via WebSocket:

```typescript
const ws = new WebSocket('ws://localhost:3000');

ws.on('message', (data) => {
  const message = JSON.parse(data);
  console.log('Received:', message);
});

ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'messages',
}));
```

### 2. Message Queue Integration

#### The Buffer Integration

Integrate with The Buffer for message processing:

```typescript
import { BufferClient } from '@p31/buffer';

const buffer = new BufferClient({
  url: 'http://localhost:4000',
});

// Submit message
const result = await buffer.submitMessage({
  message: 'External system message',
  priority: 'high',
  metadata: {
    source: 'external-system',
    systemId: 'system-123',
  },
});
```

### 3. Database Integration

#### Direct Database Access

For advanced use cases, direct database access:

```typescript
// PostgreSQL (The Centaur)
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const result = await pool.query(
  'SELECT * FROM messages WHERE priority = $1',
  ['high']
);
```

#### SQLite (The Buffer)

```typescript
import Database from 'better-sqlite3';

const db = new Database('buffer.db');
const messages = db.prepare('SELECT * FROM messages').all();
```

## External Service Integration

### AI Service Integration

#### The Centaur AI Providers

The Centaur supports multiple AI providers:

```typescript
// OpenAI
const response = await centaur.chat({
  message: 'Hello',
  provider: 'openai',
  model: 'gpt-4',
});

// Anthropic
const response = await centaur.chat({
  message: 'Hello',
  provider: 'anthropic',
  model: 'claude-3',
});

// Local Model
const response = await centaur.chat({
  message: 'Hello',
  provider: 'local',
  model: 'llama-2',
});
```

### Cloud Storage Integration

#### Google Drive

```typescript
import { GoogleDriveManager } from '@p31/google-drive';

const drive = new GoogleDriveManager({
  credentials: process.env.GOOGLE_CREDENTIALS,
});

// Upload file
await drive.upload({
  name: 'document.pdf',
  content: fileBuffer,
  folderId: 'folder-123',
});
```

### Blockchain Integration

#### Ethereum Integration

```typescript
import { WalletManager } from '@p31/wallet';
import { ethers } from 'ethers';

const wallet = new WalletManager();
const provider = new ethers.providers.JsonRpcProvider(
  process.env.ETHEREUM_RPC_URL
);

// Send transaction
const tx = await wallet.sendTransaction({
  to: '0x...',
  value: ethers.utils.parseEther('1.0'),
});
```

## Authentication Integration

### OAuth Integration

```typescript
// OAuth flow
const authUrl = centaur.getOAuthUrl({
  clientId: process.env.OAUTH_CLIENT_ID,
  redirectUri: 'https://yourapp.com/callback',
  scope: ['read', 'write'],
});

// Handle callback
const token = await centaur.handleOAuthCallback({
  code: callbackCode,
  redirectUri: 'https://yourapp.com/callback',
});
```

### API Key Authentication

```typescript
const client = new CentaurClient({
  url: 'http://localhost:3000',
  apiKey: process.env.API_KEY,
});
```

## Webhook Integration

### Receiving Webhooks

```typescript
// Express webhook endpoint
app.post('/webhook/p31', async (req, res) => {
  const signature = req.headers['x-p31-signature'];
  const isValid = verifyWebhookSignature(req.body, signature);
  
  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook
  await processWebhook(req.body);
  res.status(200).send('OK');
});
```

### Sending Webhooks

```typescript
// Configure webhook in The Centaur
await centaur.configureWebhook({
  url: 'https://yourapp.com/webhook/p31',
  events: ['message.processed', 'message.failed'],
  secret: process.env.WEBHOOK_SECRET,
});
```

## Data Synchronization

### Bidirectional Sync

```typescript
// Sync local data with P31
async function syncData() {
  // 1. Get local changes
  const localChanges = await getLocalChanges();
  
  // 2. Push to P31
  for (const change of localChanges) {
    await centaur.sync(change);
  }
  
  // 3. Get remote changes
  const remoteChanges = await centaur.getChanges({
    since: lastSyncTimestamp,
  });
  
  // 4. Apply remote changes locally
  for (const change of remoteChanges) {
    await applyChangeLocally(change);
  }
  
  // 5. Update sync timestamp
  lastSyncTimestamp = Date.now();
}
```

## Error Handling

### Retry Logic

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
}
```

### Circuit Breaker

```typescript
class CircuitBreaker {
  private failures = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      throw new Error('Circuit breaker is open');
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }
  
  private onFailure() {
    this.failures++;
    if (this.failures >= 5) {
      this.state = 'open';
      setTimeout(() => {
        this.state = 'half-open';
      }, 60000);
    }
  }
}
```

## Security Considerations

### Encryption

Always use encryption for sensitive data:

```typescript
import { EncryptedBlob } from '@p31/encryption';

// Encrypt before sending
const encrypted = EncryptedBlob.encrypt(sensitiveData);
await centaur.store(encrypted);
```

### Rate Limiting

Respect rate limits:

```typescript
import { RateLimiter } from '@p31/rate-limit';

const limiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60000,
});

async function makeRequest() {
  await limiter.wait();
  return await centaur.request();
}
```

## Testing Integrations

### Mock External Services

```typescript
// Mock The Centaur
vi.mock('@p31/centaur', () => ({
  CentaurClient: vi.fn(() => ({
    chat: vi.fn(() => Promise.resolve({ message: 'Mock response' })),
  })),
}));
```

### Integration Tests

```typescript
describe('P31 Integration', () => {
  it('should integrate with The Centaur', async () => {
    const response = await centaur.chat({ message: 'test' });
    expect(response.message).toBeDefined();
  });
});
```

## Examples

See [examples/](../examples/README.md) for complete integration examples:
- Basic integration
- Message processing
- AI chat integration
- Webhook handling

## Documentation

- [API Documentation](api/index.md)
- [Architecture](architecture.md)
- [Best Practices](best-practices.md)
- [Security Policy](../SECURITY.md)

## The Mesh Holds 🔺

Integrate with care. Maintain sovereignty. The mesh holds.

💜 With love and light. As above, so below. 💜
