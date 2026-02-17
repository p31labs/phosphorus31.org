# P31 Examples

Example code and templates for the P31 ecosystem.

## Overview

This directory contains example implementations, templates, and code samples to help you get started with P31 components.

## Examples by Component

### Node One (Hardware)

- `node-one/hardware-communication-example.cpp` - Complete hardware communication
- `node-one/basic-setup/` - Basic ESP32-S3 setup
- `node-one/whale-channel/` - LoRa mesh networking example
- `node-one/thick-click/` - Haptic feedback example
- `node-one/display/` - Display integration example

### The Buffer

- `buffer/message-batching-example.ts` - Message batching implementation
- `buffer/message-submission/` - Submit messages to The Buffer
- `buffer/priority-queue/` - Priority queue usage
- `buffer/metabolism/` - Spoon theory tracking

### The Centaur

- `centaur/api-client/` - API client implementation
- `centaur/authentication/` - Authentication flow
- `centaur/quantum-brain/` - Quantum brain integration
- `centaur/quantum-sop/` - Quantum SOP generator examples
- `centaur/legal-services/` - Legal document processing

### The Scope

- `scope/dashboard-integration-example.tsx` - Dashboard integration component
- `scope/components/` - React component examples
- `scope/visualization/` - 3D visualization examples
- `scope/monitoring/` - Monitoring dashboard examples
- `scope/integration/` - Integration with The Centaur

## Getting Started

### Using Examples

1. Copy the example to your project
2. Install dependencies
3. Configure environment variables
4. Run the example

### Quick Examples

- [Basic Integration](basic-integration.ts) - Complete P31 integration example
- [Quantum SOP Generator](quantum-sop-example.ts) - Generate SOPs with quantum brain

### Example: Basic Message Submission

```typescript
// examples/buffer/message-submission/basic.ts
import { BufferClient } from '@p31/buffer';

const client = new BufferClient({
  url: 'http://localhost:4000',
});

// Submit a message
const result = await client.submitMessage({
  message: 'Hello from P31',
  priority: 'normal',
});

console.log('Message ID:', result.messageId);
```

## Templates

### Component Template

Use the component template to create new P31 components:

```bash
cp -r examples/templates/component my-new-component
```

### API Template

Use the API template for new API endpoints:

```bash
cp -r examples/templates/api my-new-api
```

## Integration Examples

### Full Stack Example

See `examples/full-stack/` for a complete P31 stack example:
- Node One sending messages
- The Buffer processing messages
- The Centaur handling AI requests
- The Scope visualizing data

### Complete Integration

- [Basic Integration](basic-integration.ts) - Basic P31 integration
- [Component Integration](component-integration.ts) - Complete component workflow
- [Quantum SOP Example](quantum-sop-example.ts) - SOP generation examples

## Best Practices

1. **Use P31 Names** - Always use P31 component names in examples
2. **Error Handling** - Include proper error handling
3. **Type Safety** - Use TypeScript for all examples
4. **Documentation** - Comment examples thoroughly
5. **Testing** - Include test examples

## Contributing Examples

When contributing examples:

1. Follow P31 naming conventions
2. Include README with usage instructions
3. Add comments explaining the code
4. Include error handling
5. Test the example works

## Documentation

- [Development Guide](../docs/development.md)
- [API Documentation](../docs/api/index.md)
- [Component Documentation](../docs/index.md)

## The Mesh Holds 🔺
