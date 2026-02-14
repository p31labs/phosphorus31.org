# P31 Testing Guide

Complete guide to testing in the P31 ecosystem.

## Overview

P31 uses a comprehensive testing strategy covering:
- Unit tests
- Integration tests
- End-to-end tests
- Hardware tests (Node One)

## Testing Philosophy

### Principles

1. **Test First** - Write tests before or alongside code
2. **Coverage** - Maintain high test coverage
3. **Isolation** - Tests should be independent
4. **Speed** - Fast feedback loop
5. **Clarity** - Clear test names and structure

## Test Structure

### Component Organization

```
component/
├── src/
│   └── feature.ts
├── tests/
│   ├── unit/
│   │   └── feature.test.ts
│   ├── integration/
│   │   └── feature.integration.test.ts
│   └── fixtures/
│       └── test-data.json
└── package.json
```

## Running Tests

### All Tests

```bash
# Root level
npm run test

# Specific component
cd SUPER-CENTAUR && npm test
cd ui && npm test
cd cognitive-shield && npm test
```

### Watch Mode

```bash
# Watch for changes
npm test -- --watch

# Watch specific file
npm test -- --watch feature.test.ts
```

### Coverage

```bash
# Generate coverage report
npm test -- --coverage

# View coverage
open coverage/index.html
```

## Test Types

### Unit Tests

Test individual functions and components in isolation.

**Example (The Centaur):**

```typescript
import { describe, it, expect } from 'vitest';
import { processMessage } from '../src/message-processor';

describe('processMessage', () => {
  it('should process valid message', () => {
    const message = { content: 'test', priority: 'normal' };
    const result = processMessage(message);
    expect(result.success).toBe(true);
  });

  it('should reject invalid message', () => {
    const message = { content: '' };
    const result = processMessage(message);
    expect(result.success).toBe(false);
  });
});
```

### Integration Tests

Test component interactions and API endpoints.

**Example (The Centaur API):**

```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('POST /api/messages', () => {
  it('should create message', async () => {
    const response = await request(app)
      .post('/api/messages')
      .send({ message: 'test', priority: 'normal' })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.messageId).toBeDefined();
  });
});
```

### End-to-End Tests

Test complete user workflows.

**Example (The Scope):**

```typescript
import { test, expect } from '@playwright/test';

test('user can submit message', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.fill('[data-testid="message-input"]', 'Test message');
  await page.click('[data-testid="submit-button"]');
  await expect(page.locator('[data-testid="message-status"]')).toContainText('sent');
});
```

## Component-Specific Testing

### The Centaur

```bash
cd SUPER-CENTAUR

# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- message-processor.test.ts
```

**Test Files:**
- `tests/unit/` - Unit tests
- `tests/integration/` - Integration tests
- `tests/fixtures/` - Test data

### The Scope

```bash
cd ui

# Run tests
npm test

# Run with watch
npm test -- --watch

# Run E2E tests
npm run test:e2e
```

**Test Files:**
- `src/**/*.test.tsx` - Component tests
- `tests/e2e/` - End-to-end tests

### The Buffer

```bash
cd cognitive-shield

# Run tests
npm test

# Test message processing
npm test -- message-processor
```

### Node One

Hardware testing requires physical device:

```bash
cd firmware

# Build and flash
idf.py build
idf.py flash

# Monitor and test
idf.py monitor
```

**Test Types:**
- Unit tests (mocked hardware)
- Integration tests (simulated hardware)
- Hardware tests (actual device)

## Test Utilities

### Mocking

```typescript
// Mock external dependencies
vi.mock('../src/database', () => ({
  getDatabase: vi.fn(() => mockDb),
}));

// Mock API calls
vi.mock('../src/api', () => ({
  fetchData: vi.fn(() => Promise.resolve(mockData)),
}));
```

### Fixtures

```typescript
// tests/fixtures/messages.ts
export const mockMessage = {
  id: 'msg-123',
  content: 'Test message',
  priority: 'normal',
  timestamp: '2026-02-13T12:00:00.000Z',
};
```

### Helpers

```typescript
// tests/helpers/test-helpers.ts
export function createTestUser(overrides = {}) {
  return {
    id: 'user-123',
    username: 'testuser',
    email: 'test@example.com',
    ...overrides,
  };
}
```

## Best Practices

### 1. Test Naming

```typescript
// Good
describe('processMessage', () => {
  it('should return success for valid message', () => {});
  it('should return error for empty message', () => {});
});

// Bad
describe('processMessage', () => {
  it('test 1', () => {});
  it('test 2', () => {});
});
```

### 2. Arrange-Act-Assert

```typescript
it('should process message', () => {
  // Arrange
  const message = { content: 'test', priority: 'normal' };
  
  // Act
  const result = processMessage(message);
  
  // Assert
  expect(result.success).toBe(true);
});
```

### 3. Test Isolation

```typescript
// Each test should be independent
beforeEach(() => {
  // Reset state before each test
  clearDatabase();
  resetMocks();
});
```

### 4. Test Edge Cases

```typescript
it('should handle null input', () => {});
it('should handle empty string', () => {});
it('should handle very long input', () => {});
it('should handle special characters', () => {});
```

## Continuous Integration

Tests run automatically on:
- Pull requests
- Pushes to main branch
- Scheduled runs

See `.github/workflows/ci-cd.yml` for CI configuration.

## Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical paths covered
- **E2E Tests**: Major user flows covered

## Debugging Tests

### VS Code

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "program": "${workspaceFolder}/node_modules/.bin/vitest",
  "args": ["run", "${file}"]
}
```

### Console Logging

```typescript
// Use console.log for debugging
console.log('Test state:', state);
console.log('Result:', result);
```

## Documentation

- [Development Guide](development.md)
- [Architecture](architecture.md)
- [Troubleshooting](troubleshooting.md)

## The Mesh Holds 🔺

Test thoroughly. Deploy confidently.
