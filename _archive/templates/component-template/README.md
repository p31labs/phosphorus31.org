# P31 Component Template

Template for creating new P31 components following G.O.D. Protocol principles.

## Quick Start

1. Copy `component-template.ts` to your component directory
2. Rename and customize for your component
3. Add tests using `component.test.ts` as template
4. Document in component README
5. Integrate with GameEngine or The Centaur

## Structure

```
component-name/
├── src/
│   ├── index.ts              # Main entry point
│   ├── component.ts          # Component logic (use template)
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Utilities
├── tests/
│   ├── component.test.ts     # Unit tests (use template)
│   └── integration.test.ts   # Integration tests
├── docs/
│   └── README.md             # Component documentation
├── package.json
├── tsconfig.json
└── README.md
```

## Features

- ✅ GOD_CONFIG integration
- ✅ Error recovery system
- ✅ Performance monitoring
- ✅ Lifecycle management (init/start/stop/dispose)
- ✅ State management
- ✅ Configuration management
- ✅ TypeScript types

## Template File

See `component-template.ts` for complete implementation with:
- Initialization and lifecycle
- Error handling with recovery
- Performance tracking
- Configuration management
- State management

## Naming

- Use P31 component names (Node One, The Buffer, The Centaur, etc.)
- Follow P31 naming conventions
- Reference P31 components correctly in documentation

## Configuration

Always use GOD_CONFIG:

```typescript
import GodConfig from '@/config/god.config';

const config = {
  ...GodConfig.MyComponent, // From god.config.ts
  ...customConfig           // Overrides
};
```

## Error Handling

```typescript
try {
  await operation();
} catch (error) {
  const recovered = this.errorRecovery.handleError({
    component: 'MyComponent',
    action: 'operation',
    timestamp: Date.now(),
    error: error as Error
  });
  
  if (!recovered) {
    throw error;
  }
}
```

## Integration with GameEngine

```typescript
// In GameEngine constructor
this.myComponent = new MyComponent(
  undefined,              // Use default config
  this.errorRecovery,     // Share error recovery
  this.performanceMonitor // Share performance monitor
);

// In init()
await this.myComponent.initialize();

// In loop()
this.myComponent.update(deltaTime);

// In dispose()
this.myComponent.dispose();
```

## Testing

See `component.test.ts` for complete test template with:
- Initialization tests
- Lifecycle tests
- Update tests
- Configuration tests
- Error handling tests

## Documentation

- Document all public APIs
- Use P31 component names
- Include integration examples
- Reference related components
- Document GOD_CONFIG usage

## P31 Integration Points

Document how your component integrates with:
- **The Centaur**: Backend services
- **The Buffer**: Message processing
- **The Scope**: UI visualization
- **Node One**: Hardware device
- **Ping**: Object permanence

## The Mesh Holds 🔺

Build components that hold. The mesh holds.

💜 With love and light. As above, so below. 💜
