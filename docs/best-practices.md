# P31 Best Practices

Guidelines and best practices for building with P31 - with love and light, as above so below.

## Code Quality

### Use P31 Names

Always use P31 component names in code and documentation:

```typescript
// ✅ Good
import { Buffer } from '@p31/buffer';
import { Centaur } from '@p31/centaur';
import { NodeOne } from '@p31/node-one';

// ❌ Bad
import { CognitiveShield } from '@cognitive/shield';
import { SuperCentaur } from '@super/centaur';
```

### Use GOD_CONFIG

Never hardcode configuration values:

```typescript
// ✅ Good
import GodConfig from '@/config/god.config';
const maxSpoons = GodConfig.Metabolism.maxSpoons;

// ❌ Bad
const maxSpoons = 12; // Hardcoded
```

### Type Safety

Use TypeScript for all new code:

```typescript
// ✅ Good
interface Message {
  id: string;
  content: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

// ❌ Bad
const message = { id: '123', content: 'test' }; // No types
```

## Architecture

### Tetrahedron Topology

Always enforce exactly 4 vertices:

```typescript
// ✅ Good
class TetrahedronGroup {
  private vertices: Vertex[] = [];
  
  addVertex(vertex: Vertex) {
    if (this.vertices.length >= 4) {
      throw new ConstitutionalViolationError('Tetrahedron must have exactly 4 vertices');
    }
    this.vertices.push(vertex);
  }
}

// ❌ Bad
class Group {
  addMember(member: Member) {
    this.members.push(member); // No limit
  }
}
```

### Privacy First

Always use encryption for user content:

```typescript
// ✅ Good
import { EncryptedBlob } from '@p31/encryption';

const encrypted = EncryptedBlob.encrypt(userContent);
await storeMessage(encrypted);

// ❌ Bad
await storeMessage(userContent); // Plaintext
```

### Local-First

Prioritize local storage:

```typescript
// ✅ Good
const localData = await localDB.get(key);
if (!localData) {
  const remoteData = await fetchRemote(key);
  await localDB.set(key, remoteData);
  return remoteData;
}
return localData;

// ❌ Bad
const data = await fetchRemote(key); // Always remote
```

## Performance

### Optimize for Bandwidth

Target 0.350 kbps (Whale Song bandwidth):

```typescript
// ✅ Good
import { encode } from '@p31/protobuf';
const encoded = encode(message); // Binary, compressed

// ❌ Bad
const json = JSON.stringify(message); // Large, uncompressed
```

### Batch Operations

Batch messages efficiently:

```typescript
// ✅ Good
const batcher = new MessageBatcher({ window: 60000, size: 100 });
batcher.add(message1);
batcher.add(message2);
// Automatically batches

// ❌ Bad
await sendMessage(message1); // Individual calls
await sendMessage(message2);
```

### Cache Aggressively

Cache expensive operations:

```typescript
// ✅ Good
const cache = new Map();
async function getData(key: string) {
  if (cache.has(key)) return cache.get(key);
  const data = await fetchData(key);
  cache.set(key, data);
  return data;
}

// ❌ Bad
async function getData(key: string) {
  return await fetchData(key); // No caching
}
```

## Error Handling

### Defensive Architecture

Throw ConstitutionalViolationError for state breaches:

```typescript
// ✅ Good
if (vertices.length !== 4) {
  throw new ConstitutionalViolationError(
    'Tetrahedron must have exactly 4 vertices'
  );
}

// ❌ Bad
if (vertices.length !== 4) {
  console.warn('Invalid vertex count'); // Silent failure
}
```

### Graceful Degradation

Handle errors gracefully:

```typescript
// ✅ Good
try {
  const response = await centaur.process(message);
  return response;
} catch (error) {
  logger.error('Centaur error:', error);
  // Fallback to local processing
  return localProcess(message);
}

// ❌ Bad
const response = await centaur.process(message); // No error handling
```

## Testing

### Test First

Write tests before or alongside code:

```typescript
// ✅ Good
describe('processMessage', () => {
  it('should process valid message', async () => {
    const result = await processMessage(validMessage);
    expect(result.success).toBe(true);
  });
});

// ❌ Bad
// No tests
```

### Test Edge Cases

Test boundary conditions:

```typescript
// ✅ Good
it('should handle empty message', () => {});
it('should handle very long message', () => {});
it('should handle special characters', () => {});

// ❌ Bad
it('should process message', () => {}); // Only happy path
```

## Documentation

### Document Public APIs

Document all public functions:

```typescript
// ✅ Good
/**
 * Processes a message through The Buffer.
 * 
 * @param message - The message to process
 * @param priority - Message priority (default: 'normal')
 * @returns Processed message result
 * @throws {ConstitutionalViolationError} If message violates constraints
 */
async function processMessage(
  message: Message,
  priority: Priority = 'normal'
): Promise<ProcessResult> {
  // Implementation
}

// ❌ Bad
async function processMessage(message: Message) {
  // No documentation
}
```

### Use P31 Names in Docs

Always use P31 component names:

```typescript
// ✅ Good
/**
 * Integrates with The Centaur to process AI requests.
 * Uses The Buffer for message queuing.
 */

// ❌ Bad
/**
 * Integrates with SUPER-CENTAUR to process AI requests.
 * Uses Cognitive Shield for message queuing.
 */
```

## Security

### Never Commit Secrets

Use environment variables:

```typescript
// ✅ Good
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error('API_KEY not set');
}

// ❌ Bad
const apiKey = 'sk-1234567890abcdef'; // Hardcoded secret
```

### Validate Input

Always validate user input:

```typescript
// ✅ Good
function processMessage(message: unknown): Message {
  if (!message || typeof message !== 'object') {
    throw new ValidationError('Invalid message');
  }
  // Validate structure
  return message as Message;
}

// ❌ Bad
function processMessage(message: any) {
  return message; // No validation
}
```

## Accessibility

### Universal Accessibility

Support all abilities:

```typescript
// ✅ Good
<button
  aria-label="Submit message"
  onClick={handleSubmit}
  className="accessible-button"
>
  Submit
</button>

// ❌ Bad
<div onClick={handleSubmit}>Submit</div> // No accessibility
```

### High Contrast

Support high contrast modes:

```css
/* ✅ Good */
.button {
  background: var(--bg-color);
  color: var(--text-color);
  border: 2px solid var(--border-color);
}

/* ❌ Bad */
.button {
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ccc; /* Low contrast */
}
```

## The Mesh Holds

### Build for Resilience

Code for departure:

```typescript
// ✅ Good
// No backdoors
// No super-admin recovery
// Keys can be destroyed
// System survives operator departure

// ❌ Bad
// Admin recovery functions
// Hardcoded master keys
// Vendor lock-in
```

### Respect the Geometry

Enforce tetrahedron topology:

```typescript
// ✅ Good
// Exactly 4 vertices
// No dynamic group sizes
// No admin roles outside geometry

// ❌ Bad
// Variable group sizes
// Admin roles
// Central hub
```

## Documentation

- [Development Guide](development.md)
- [Architecture](architecture.md)
- [Testing Guide](testing.md)
- [Security Policy](../SECURITY.md)

## The Mesh Holds 🔺

Follow these practices. Build with care. The mesh holds.

💜 With love and light. As above, so below. 💜
