# Contributing to P31

Thank you for your interest in contributing to P31! This guide will help you get started.

## Code of Conduct

P31 follows the G.O.D. Protocol principles:
- **Respect** - Treat all contributors with respect
- **Privacy** - Protect user privacy above all
- **Sovereignty** - Code for departure, no vendor lock-in
- **Accessibility** - Universal accessibility is a requirement

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/phenix-navigator-creator67.git
cd phenix-navigator-creator67
```

### 2. Setup Development Environment

```bash
# Complete setup
npm run setup

# Or use the setup script
./scripts/setup.sh
```

See [docs/onboarding.md](docs/onboarding.md) for detailed setup instructions.

### 3. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or a bugfix branch
git checkout -b fix/bug-description
```

## Development Workflow

### 1. Make Changes

- Follow P31 naming conventions (see [docs/naming.md](docs/naming.md))
- Use P31 component names in code and documentation
- Follow existing code style
- Write tests for new features

### 2. Test Your Changes

```bash
# Run tests
npm run test

# Lint code
npm run lint

# Build to verify
npm run build
```

### 3. Commit Your Changes

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Maintenance tasks

Examples:
```
feat(buffer): add message priority queuing
fix(centaur): resolve database connection issue
docs(scope): update API documentation
```

### 4. Push and Create Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Create pull request on GitHub
```

## Coding Standards

### P31 Naming Conventions

Always use P31 component names:
- **Node One** (not Phenix Navigator, Vertex One)
- **The Buffer** (not Cognitive Shield, Tomograph)
- **The Centaur** (not SUPER-CENTAUR in docs)
- **The Scope** (not Dashboard)

See [P31 Naming Architecture](P31_naming_architecture.md) for complete reference.

### Code Style

- **TypeScript** for all new code
- **ESLint** and **Prettier** for formatting
- Follow existing patterns
- Use `GOD_CONFIG` from `god.config.ts` (never hardcode)
- Document all public APIs

### Architecture Principles

1. **Tetrahedron Topology** - Enforce exactly 4 vertices
2. **Privacy First** - Type-level encryption, zero-knowledge proofs
3. **Local First** - SQLite/PGLite for local state
4. **Performance** - Optimize for 0.350 kbps bandwidth
5. **Abdication** - No backdoors, code for departure

### File Organization

```
component-name/
├── src/              # Source code
├── tests/            # Tests
├── docs/             # Component-specific docs
├── README.md         # Component overview
└── setup.md          # Setup instructions
```

## Testing

### Writing Tests

- Write tests for all new features
- Test edge cases and error conditions
- Maintain or improve test coverage
- Use descriptive test names

### Running Tests

```bash
# All tests
npm run test

# Specific component
cd SUPER-CENTAUR && npm test
cd ui && npm test
```

## Documentation

### Updating Documentation

- Update relevant docs when adding features
- Use P31 component names consistently
- Add examples and usage patterns
- Update API documentation for API changes

### Documentation Structure

- Component docs: `docs/[component].md`
- API docs: `docs/api/[component]-[section].md`
- Setup guides: `[component]/setup.md`

## Pull Request Process

### Before Submitting

1. ✅ Tests pass locally
2. ✅ Code is linted and formatted
3. ✅ Documentation is updated
4. ✅ P31 naming conventions followed
5. ✅ No hardcoded values (use GOD_CONFIG)

### PR Description

Include:
- Description of changes
- Related issues
- Testing performed
- Screenshots (if UI changes)

### Review Process

- All PRs require review
- Address review comments promptly
- Maintain discussion in PR comments
- Update PR based on feedback

## Component-Specific Guidelines

### The Centaur (Backend)

- Follow REST API conventions
- Document all endpoints
- Include error handling
- Add authentication where needed

### The Scope (Frontend)

- Follow React best practices
- Use TypeScript for type safety
- Optimize for performance
- Ensure accessibility

### The Buffer (Communication)

- Optimize for low bandwidth
- Batch messages efficiently
- Handle edge cases gracefully
- Maintain message encryption

### Node One (Hardware)

- Follow ESP-IDF conventions
- Document hardware interfaces
- Optimize for low power
- Test on actual hardware

## Questions?

- Check [Documentation Index](docs/index.md)
- Review [Development Guide](docs/development.md)
- See [Troubleshooting](docs/troubleshooting.md)
- Open an issue for questions

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Thank You!

Your contributions make P31 better. The Mesh Holds. 🔺
