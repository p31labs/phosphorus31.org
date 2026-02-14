# P31 Development Guide

Complete development workflow and conventions for the P31 ecosystem.

## Development Environment

### Prerequisites

- Node.js 18.0.0+
- Git
- Code editor (VS Code recommended)
- Docker (for local services)

### VS Code Workspace

Open the workspace file:

```bash
code P31.code-workspace
```

Or use the existing workspace:
```bash
code "USE ME-phenix-navigator-creator.code-workspace"
```

## Project Structure

```
phenix-navigator-creator67/
├── SUPER-CENTAUR/      # The Centaur (backend)
├── ui/                  # The Scope (frontend)
├── cognitive-shield/    # The Buffer
├── firmware/            # Node One
├── docs/                # Documentation
├── scripts/             # Utility scripts
└── config/              # Configuration templates
```

## Development Workflow

### 1. Start Development Servers

Terminal 1 - The Centaur:
```bash
cd SUPER-CENTAUR
npm run dev
```

Terminal 2 - The Scope:
```bash
cd ui
npm run dev
```

Terminal 3 - The Buffer:
```bash
cd cognitive-shield
npm run dev
```

### 2. Make Changes

- Edit code in respective directories
- Hot reload will update automatically
- Check browser console for errors

### 3. Run Tests

```bash
# The Centaur
cd SUPER-CENTAUR
npm test

# The Scope
cd ui
npm test

# The Buffer
cd cognitive-shield
npm test
```

### 4. Build for Production

```bash
# The Centaur
cd SUPER-CENTAUR
npm run build

# The Scope
cd ui
npm run build
```

## Coding Conventions

### P31 Naming

- Use P31 component names in documentation and comments
- Code may use technical folder names (SUPER-CENTAUR, etc.)
- User-facing text always uses P31 names

### TypeScript

- Strict type checking
- Use interfaces for types
- Avoid `any` types

### Code Style

- Follow existing code style
- Use ESLint and Prettier
- Format before committing

## G.O.D. Protocol Compliance

### Constitutional Rules

1. **Tetrahedron Topology**: Enforce 4-vertex constraint
2. **Privacy Axiom**: Type-level encryption, zero-knowledge
3. **Doing More With Less**: Optimize for 0.350 kbps
4. **Abdication Principle**: No backdoors, code for departure
5. **Synergetics**: Geometric navigation, haptic-first

### Validation

Run constitutional compliance checks:

```bash
npm run check:ideology
npm run check:system
```

## Testing

### Unit Tests

```bash
npm test
```

### Integration Tests

```bash
npm run test:integration
```

### E2E Tests

```bash
npm run test:e2e
```

## Debugging

### The Centaur

- Use VS Code debugger
- Check logs in `logs/` directory
- Monitor Redis and database

### The Scope

- Use React DevTools
- Check browser console
- Use Three.js scene inspector

### The Buffer

- Monitor message queue in Redis
- Check buffer store state
- Verify heartbeat status

## Git Workflow

### Branching

- `main` - Production code
- `develop` - Development branch
- `feature/*` - Feature branches

### Commits

- Use descriptive commit messages
- Reference P31 components by name
- Follow conventional commits format

## Documentation

### Code Comments

- Document complex logic
- Reference P31 component names
- Include examples where helpful

### README Updates

- Keep component READMEs current
- Update setup guides when needed
- Document breaking changes

## Performance

### Optimization

- Profile before optimizing
- Use React.memo for expensive components
- Optimize Three.js rendering
- Minimize bundle size

### Monitoring

- Use performance monitor in The Scope
- Track API response times
- Monitor message queue depth

## Deployment

### Build Process

1. Run tests
2. Build all components
3. Run compliance checks
4. Create deployment package

### Environment

- Use environment variables
- Never commit secrets
- Use .env.example templates

## Resources

- [Architecture Documentation](architecture.md)
- [Component Documentation](index.md)
- [Quick Reference](quick-reference.md)
- [Troubleshooting](troubleshooting.md)
