# P31 Design Patterns

Common design patterns used throughout the P31 ecosystem.

## Patterns

### 1. Tetrahedron Topology Pattern

**Enforce exactly 4 vertices in all group structures.**

```typescript
class TetrahedronGroup {
  private vertices: Vertex[] = [];
  
  addVertex(vertex: Vertex) {
    if (this.vertices.length >= 4) {
      throw new ConstitutionalViolationError(
        'Tetrahedron must have exactly 4 vertices'
      );
    }
    this.vertices.push(vertex);
  }
}
```

### 2. EncryptedBlob Pattern

**Type-level encryption for all user content.**

```typescript
import { EncryptedBlob } from '@p31/encryption';

// Encrypt before storing
const encrypted = EncryptedBlob.encrypt(userContent);
await store(encrypted);

// Decrypt when needed
const decrypted = EncryptedBlob.decrypt(encrypted);
```

### 3. Local-First Pattern

**Prioritize local storage, sync to cloud.**

```typescript
async function getData(key: string) {
  // Try local first
  const local = await localDB.get(key);
  if (local) return local;
  
  // Fetch from remote
  const remote = await fetchRemote(key);
  
  // Store locally
  await localDB.set(key, remote);
  
  return remote;
}
```

### 4. Message Batching Pattern

**Batch messages for efficiency.**

```typescript
class MessageBatcher {
  private batch: Message[] = [];
  private window = 60000; // 60 seconds
  
  addMessage(message: Message) {
    this.batch.push(message);
    
    if (this.batch.length >= 100) {
      this.flush();
    }
  }
  
  flush() {
    processBatch(this.batch);
    this.batch = [];
  }
}
```

### 5. Quantum Coherence Pattern

**Use quantum brain for decision-making.**

```typescript
const decision = await quantumBrain.makeDecision({
  type: 'operation',
  data: context,
});

if (decision.confidence > 0.8) {
  proceed(decision);
}
```

### 6. Retry with Exponential Backoff

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
      await new Promise(resolve => 
        setTimeout(resolve, 1000 * Math.pow(2, i))
      );
    }
  }
  throw new Error('Max retries exceeded');
}
```

### 7. Circuit Breaker Pattern

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
}
```

### 8. GOD_CONFIG Pattern

**Never hardcode, always use GOD_CONFIG.**

```typescript
import GodConfig from '@/config/god.config';

// ✅ Good
const maxSpoons = GodConfig.Metabolism.maxSpoons;

// ❌ Bad
const maxSpoons = 12; // Hardcoded
```

### 9. Ping Pattern

**Object permanence and connection health.**

```typescript
class PingSystem {
  private lastPing = 0;
  private threshold = 60000; // 1 minute
  
  async ping() {
    this.lastPing = Date.now();
    await sendHeartbeat();
  }
  
  isAlive(): boolean {
    return Date.now() - this.lastPing < this.threshold;
  }
}
```

### 10. Abdication Pattern

**No backdoors, code for departure.**

```typescript
// ✅ Good: Keys can be destroyed
class AdminKeys {
  destroy() {
    // Permanently delete admin keys
    // No recovery possible
  }
}

// ❌ Bad: Recovery function
function recoverAdminAccess() {
  // This violates abdication principle
}
```

## Implementation Library

See `templates/patterns-library.ts` for complete, reusable implementations of all patterns.

### Usage Example

```typescript
import {
  TetrahedronGroup,
  MessageBatcher,
  withRetry,
  CircuitBreaker,
  PingSystem,
  PerformanceTracker
} from '@/templates/patterns-library';

// Use Tetrahedron Group
const group = new TetrahedronGroup();
group.addVertex({ id: '1', type: 'operator' });
group.addVertex({ id: '2', type: 'synthetic_body' });
group.addVertex({ id: '3', type: 'node' });
group.addVertex({ id: '4', type: 'node' });
group.validate(); // Throws if not exactly 4 vertices

// Use Message Batcher
const batcher = new MessageBatcher(async (messages) => {
  await sendToBuffer(messages);
});

// Use Retry
const result = await withRetry(
  () => fetchData(),
  { maxRetries: 3, initialDelay: 1000 }
);

// Use Circuit Breaker
const breaker = new CircuitBreaker({ failureThreshold: 5 });
const data = await breaker.execute(() => riskyOperation());

// Use Ping System
const ping = new PingSystem(60000);
await ping.ping('node-1');
const isAlive = ping.isAlive('node-1');

// Use Performance Tracker
const tracker = new PerformanceTracker();
const result = await tracker.track('operation', async () => {
  return await expensiveOperation();
});
```

## Additional Patterns

### 11. Observer Pattern (Event System)

```typescript
class EventEmitter<T = any> {
  private listeners: Map<string, Set<(data: T) => void>> = new Map();

  on(event: string, callback: (data: T) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: (data: T) => void): void {
    this.listeners.get(event)?.delete(callback);
  }

  emit(event: string, data: T): void {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }
}
```

### 12. Factory Pattern (Component Creation)

```typescript
class ComponentFactory {
  static create(type: string, config: any): Component {
    switch (type) {
      case 'buffer':
        return new BufferComponent(config);
      case 'centaur':
        return new CentaurComponent(config);
      default:
        throw new Error(`Unknown component type: ${type}`);
    }
  }
}
```

### 13. Singleton Pattern (Service Instances)

```typescript
class ServiceManager {
  private static instance: ServiceManager;

  private constructor() {}

  static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager();
    }
    return ServiceManager.instance;
  }
}
```

## Best Practices

1. **Always use GOD_CONFIG** - Never hardcode values
2. **Enforce Tetrahedron Topology** - Validate 4-vertex constraint
3. **Type-level encryption** - Use EncryptedBlob for user content
4. **Local-first** - Always try local storage first
5. **Error recovery** - Integrate with ErrorRecovery system
6. **Performance tracking** - Monitor all operations
7. **No backdoors** - Follow abdication principle

## Documentation

- [Best Practices](best-practices.md)
- [Architecture](architecture.md)
- [Development Guide](development.md)
- [Patterns Library](../templates/patterns-library.ts)

## The Mesh Holds 🔺

Patterns hold. The mesh holds.

💜 With love and light. As above, so below. 💜
