# P31 Code Examples
## Practical Implementation Guide

Real-world code examples for working with P31 components.

---

## The Buffer - Message Processing

### Submitting a Message

```typescript
import { BufferClient } from '@p31/buffer-client';

const buffer = new BufferClient({
  apiUrl: 'http://localhost:3001',
  apiKey: 'your-api-key'
});

// Submit message
const message = await buffer.submitMessage({
  content: 'Hello from Node One',
  priority: 'normal',
  source: 'node-one',
  metadata: {
    nodeId: 1,
    timestamp: Date.now()
  }
});

console.log('Message ID:', message.id);
```

### Retrieving Processed Messages

```typescript
// Get messages from queue
const messages = await buffer.getMessages({
  limit: 10,
  status: 'processed'
});

messages.forEach(msg => {
  console.log(`[${msg.status}] ${msg.content}`);
});
```

### Batch Processing

```typescript
// The Buffer automatically batches messages in 60-second windows
// You can check batch status:

const batchStatus = await buffer.getBatchStatus();
console.log(`Batch: ${batchStatus.count} messages, ${batchStatus.timeRemaining}ms remaining`);
```

---

## The Centaur - API Integration

### Authentication

```typescript
import { CentaurClient } from '@p31/centaur-client';

const centaur = new CentaurClient({
  apiUrl: 'http://localhost:3000'
});

// Login
const auth = await centaur.auth.login({
  email: 'user@example.com',
  password: 'password'
});

// Set token for subsequent requests
centaur.setToken(auth.token);
```

### Sending Messages to AI

```typescript
// Send message to The Centaur
const response = await centaur.chat.send({
  message: 'What is the status of Node One?',
  context: {
    component: 'node-one',
    nodeId: 1
  }
});

console.log('AI Response:', response.content);
```

### Health Check

```typescript
// Check system health
const health = await centaur.health.check();

console.log('Status:', health.status);
console.log('Components:', health.components);
```

---

## The Scope - UI Components

### Using GOD_CONFIG

```typescript
import GodConfig from '@/config/god.config';

// Access metabolism config
const maxSpoons = GodConfig.Metabolism.maxSpoons; // 12
const stressThreshold = GodConfig.Metabolism.stressThreshold; // 8

// Access heartbeat config
const greenThreshold = GodConfig.Heartbeat.thresholds.green; // 70
```

### Connection Status Component

```typescript
import { usePing } from '@/hooks/usePing';

function ConnectionStatus() {
  const { status, heartbeat } = usePing();
  
  const getStatusColor = () => {
    if (heartbeat >= GodConfig.Heartbeat.thresholds.green) return 'green';
    if (heartbeat >= GodConfig.Heartbeat.thresholds.yellow) return 'yellow';
    return 'red';
  };
  
  return (
    <div className={`status ${getStatusColor()}`}>
      Connection: {status} ({heartbeat}%)
    </div>
  );
}
```

### Message Display Component

```typescript
import { useBuffer } from '@/hooks/useBuffer';

function MessageList() {
  const { messages, loading } = useBuffer();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="messages">
      {messages.map(msg => (
        <div key={msg.id} className="message">
          <div className="content">{msg.content}</div>
          <div className="metadata">
            {msg.source} - {new Date(msg.timestamp).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Node One - Firmware Examples

### Sending Message via LoRa

```cpp
#include "whale_channel.h"
#include "buffer_client.h"

void send_message_to_buffer(const char* message) {
    // Create message packet
    MessagePacket packet;
    packet.nodeId = get_node_id();
    packet.timestamp = get_timestamp();
    strncpy(packet.content, message, MAX_MESSAGE_LENGTH);
    
    // Send via Whale Channel (LoRa)
    whale_channel_send(&packet);
}

// Example usage
void loop() {
    if (button_pressed()) {
        send_message_to_buffer("Button pressed on Node One");
    }
    delay(100);
}
```

### Haptic Feedback

```cpp
#include "thick_click.h"

void trigger_haptic_feedback(int intensity) {
    // Intensity: 0-100
    thick_click_trigger(intensity);
}

// Example: Notification received
void on_message_received() {
    trigger_haptic_feedback(50); // Medium intensity
}
```

### Display Update

```cpp
#include "display.h"

void update_display_status(const char* status) {
    display_clear();
    display_set_text(0, 0, "Node One");
    display_set_text(0, 20, status);
    display_refresh();
}
```

---

## Integration Examples

### Complete Message Flow

```typescript
// 1. Node One sends message via LoRa
// (Firmware code above)

// 2. The Buffer receives and processes
const buffer = new BufferClient({ apiUrl: 'http://localhost:3001' });
const message = await buffer.submitMessage({
  content: 'Hello from Node One',
  source: 'node-one',
  nodeId: 1
});

// 3. The Buffer forwards to The Centaur
// (Automatic - The Buffer handles this)

// 4. The Centaur processes with AI
const centaur = new CentaurClient({ apiUrl: 'http://localhost:3000' });
const response = await centaur.chat.send({
  message: 'Process this message from Node One',
  context: { nodeId: 1 }
});

// 5. The Scope displays result
// (React component above)
```

### Energy/Spool Management

```typescript
import { useMetabolism } from '@/hooks/useMetabolism';

function EnergyDisplay() {
  const { spoons, maxSpoons, stressLevel } = useMetabolism();
  
  const getStressColor = () => {
    if (spoons <= GodConfig.Metabolism.recoveryThreshold) return 'red';
    if (spoons <= GodConfig.Metabolism.stressThreshold) return 'yellow';
    return 'green';
  };
  
  return (
    <div className={`energy ${getStressColor()}`}>
      <div>Energy: {spoons} / {maxSpoons}</div>
      <div>Stress: {stressLevel}</div>
    </div>
  );
}
```

### Ping/Heartbeat Monitoring

```typescript
import { useEffect, useState } from 'react';
import { usePing } from '@/hooks/usePing';

function NetworkHealth() {
  const { heartbeat, status, lastPing } = usePing();
  const [history, setHistory] = useState<number[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setHistory(prev => [...prev.slice(-9), heartbeat]);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [heartbeat]);
  
  return (
    <div className="network-health">
      <div>Status: {status}</div>
      <div>Heartbeat: {heartbeat}%</div>
      <div>Last Ping: {new Date(lastPing).toLocaleTimeString()}</div>
      <div className="history">
        {history.map((h, i) => (
          <div key={i} className="bar" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}
```

---

## Error Handling

### The Buffer

```typescript
try {
  const message = await buffer.submitMessage({
    content: 'Test message',
    source: 'test'
  });
} catch (error) {
  if (error.code === 'BUFFER_FULL') {
    console.error('Buffer is full, message queued');
  } else if (error.code === 'RATE_LIMIT') {
    console.error('Rate limit exceeded, retry later');
  } else {
    console.error('Unknown error:', error);
  }
}
```

### The Centaur

```typescript
try {
  const response = await centaur.chat.send({
    message: 'Hello'
  });
} catch (error) {
  if (error.status === 401) {
    // Re-authenticate
    await centaur.auth.refresh();
  } else if (error.status === 503) {
    console.error('Service unavailable, retry later');
  }
}
```

---

## Testing Examples

### Unit Test - GOD_CONFIG

```typescript
import { describe, it, expect } from 'vitest';
import GodConfig from '@/config/god.config';

describe('GOD_CONFIG', () => {
  it('should have valid metabolism config', () => {
    expect(GodConfig.Metabolism.maxSpoons).toBe(12);
    expect(GodConfig.Metabolism.stressThreshold).toBe(8);
  });
  
  it('should have valid heartbeat config', () => {
    expect(GodConfig.Heartbeat.thresholds.green).toBe(70);
    expect(GodConfig.Heartbeat.thresholds.yellow).toBe(50);
    expect(GodConfig.Heartbeat.thresholds.red).toBe(30);
  });
});
```

### Integration Test - Message Flow

```typescript
import { describe, it, expect } from 'vitest';
import { BufferClient } from '@p31/buffer-client';
import { CentaurClient } from '@p31/centaur-client';

describe('Message Flow', () => {
  it('should process message from Node One to The Scope', async () => {
    const buffer = new BufferClient({ apiUrl: 'http://localhost:3001' });
    const centaur = new CentaurClient({ apiUrl: 'http://localhost:3000' });
    
    // Submit message
    const message = await buffer.submitMessage({
      content: 'Test message',
      source: 'test'
    });
    
    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check in The Centaur
    const processed = await centaur.messages.get(message.id);
    expect(processed).toBeDefined();
    expect(processed.status).toBe('processed');
  });
});
```

---

## Best Practices

### Always Use GOD_CONFIG

```typescript
// ❌ Don't hardcode
const maxSpoons = 12;

// ✅ Use GOD_CONFIG
import GodConfig from '@/config/god.config';
const maxSpoons = GodConfig.Metabolism.maxSpoons;
```

### Handle Errors Gracefully

```typescript
// ❌ Don't ignore errors
await buffer.submitMessage({ content: 'test' });

// ✅ Handle errors
try {
  await buffer.submitMessage({ content: 'test' });
} catch (error) {
  console.error('Failed to submit message:', error);
  // Show user-friendly error
}
```

### Use TypeScript Types

```typescript
// ✅ Use proper types
import { Message, MessageStatus } from '@p31/buffer-types';

function processMessage(message: Message): MessageStatus {
  // Type-safe processing
  return 'processed';
}
```

---

## References

- [API Documentation](api/index.md) - Complete API reference
- [GOD_CONFIG Reference](god-config.md) - Configuration guide
- [Development Guide](development.md) - Development workflow
- [Component Documentation](index.md) - Individual component guides

---

**The Mesh Holds.** 🔺
