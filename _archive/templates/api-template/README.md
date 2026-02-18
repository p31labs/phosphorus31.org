# P31 API Template

Template for creating new API endpoints in The Centaur (P31 backend system).

## Quick Start

1. Copy `api-template.ts` to your API directory
2. Rename and customize for your feature
3. Add validation schemas
4. Integrate with The Centaur server
5. Document endpoints

## Structure

```
api/
├── my-feature-routes.ts      # Main route file
├── validation-schema.ts       # Zod validation schemas
└── README.md                  # API documentation
```

## Features

- ✅ Authentication middleware
- ✅ Rate limiting
- ✅ Request validation (Zod)
- ✅ Error recovery integration
- ✅ Performance monitoring
- ✅ Standardized response format
- ✅ Request ID tracking
- ✅ Performance metrics in responses

## Template File

See `api-template.ts` for complete implementation with:
- GET, POST, PUT, DELETE endpoints
- Error handling with recovery
- Performance tracking
- Standardized ApiResponse format
- Request validation

## Validation

Use Zod schemas (see `validation-schema.example.ts`):

```typescript
import { z } from 'zod';

export const createItemSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['type1', 'type2'])
});
```

## Integration

```typescript
// In SUPER-CENTAUR/src/server.ts
import { createFeatureRoutes } from './api/feature-routes';
import { errorRecovery, performanceMonitor } from './engine';

const routes = createFeatureRoutes(errorRecovery, performanceMonitor);
app.use('/api/feature', routes);
```

## Response Format

All endpoints return standardized format:

```typescript
{
  success: boolean;
  data?: any;
  error?: string;
  metadata: {
    timestamp: number;
    requestId: string;
    performance?: {
      responseTime: number;
      memoryUsage?: number;
    };
  };
}
```

## P31 Integration

- Use P31 component names in documentation
- Reference The Centaur, The Buffer, Node One, etc.
- Follow G.O.D. Protocol principles
- Use GOD_CONFIG for configuration

## Documentation

- Document all endpoints in OpenAPI/Swagger format
- Include request/response examples
- Add to `docs/api/index.md`
- Reference P31 components

## The Mesh Holds 🔺

Build APIs that hold. The mesh holds.

💜 With love and light. As above, so below. 💜
