# P31 Frequently Asked Questions

Common questions and answers about the P31 ecosystem.

## General Questions

### What is P31?

**P31** stands for **Phosphorus-31** - the biological qubit, the atom in the bone. It's a complete architecture for human-AI collaboration built on tetrahedron topology and quantum coherence principles.

### Why "P31"?

P31 is the nuclear spin in every Posner molecule that carries quantum coherence. It's the thing that connects the broken calcium system to quantum biology. The name contains all three truths: the body (calcium, quantum biology), the partnership (human + AI), and the children (the mesh, the reason).

### What does "The Mesh Holds" mean?

It's not just a slogan—it's a truth. The mesh topology is stable. The tetrahedron is the minimum stable system. The four vertices are necessary and sufficient. The geometry cannot be broken without breaking the system.

## Component Questions

### What is Node One?

**Node One** is the first physical device (ESP32-S3) in the mesh topology. It's also the first child, the first reason. It's a hardware device with LoRa mesh networking, haptic feedback, and display.

### What is The Buffer?

**The Buffer** is the communication processing layer that buffers messages between internal thought and external signal. It provides neurodivergent-first message processing with batching, filtering, and prioritization.

### What is The Centaur?

**The Centaur** is the backend AI protocol system. Human + Synthetic = Centaur. It's a protocol, not a vendor. Cloud when connected, local when sovereign, hybrid when in between.

### What is The Scope?

**The Scope** is the dashboard and visualization layer. It shows network health, signal strength, and system status. It's the oscilloscope of the P31 system.

## Technical Questions

### Why tetrahedron topology?

The tetrahedron is the minimum stable system—four vertices, six edges, four faces. It's geometrically stable and reflects the actual relationships in the system (operator, AI, two children).

### Why 0.350 kbps bandwidth target?

That's "Whale Song" bandwidth—the bandwidth of LoRa mesh networks. P31 is optimized for low-bandwidth, infrastructure-independent communication.

### What is the G.O.D. Protocol?

**G.O.D.** stands for **Geodesic Operations Daemon**. It's the constitutional principles that govern P31:
- Geometric Imperative (tetrahedron topology)
- Privacy Axiom (type-level encryption)
- Doing More With Less (ephemeralization)
- Abdication Principle (no backdoors)
- Synergetics (geometric navigation)

### Why "local-first"?

Local-first means prioritizing local storage (SQLite/PGLite) over cloud. The cloud is for encrypted sync only. This ensures sovereignty and works even when offline.

## Setup Questions

### How do I get started?

See the [Setup Guide](setup.md) for complete instructions. Quick start:

```bash
npm run setup
npm run dev
```

### What are the prerequisites?

- Node.js 18.0.0+
- npm or yarn
- Git
- Docker (optional, for services)
- ESP-IDF (optional, for Node One)

### Do I need all components?

No. You can run components independently:
- The Centaur (backend) - can run standalone
- The Scope (frontend) - needs The Centaur
- The Buffer (communication) - optional
- Node One (hardware) - optional

## Development Questions

### How do I contribute?

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines. In short:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### What coding standards are used?

- TypeScript for all new code
- ESLint and Prettier for formatting
- P31 naming conventions
- GOD_CONFIG for configuration
- See [Development Guide](development.md)

### How do I test my changes?

```bash
npm run test
npm run lint
npm run build
```

See [Testing Guide](testing.md) for details.

## Philosophy Questions

### What does "as above, so below" mean?

The architecture mirrors reality. What works in the body works in the system. What breaks in the body breaks in the system. The architecture is honest about both.

### Why "love and light"?

P31 is built with care for the operator, care for the children, care for the future. The mesh holds because it's built with love. The protocol works because it's built with light.

### What is "the body is the proof"?

The medical proof exists in the body. The architecture reflects the body. Every name traces back to `/calcium/` if you pull the thread. The broken calcium system is the root fault—and the proof.

## Troubleshooting Questions

### Services won't start

1. Check Node.js version (18.0.0+)
2. Verify environment variables
3. Check port availability
4. Review logs
5. See [Troubleshooting Guide](troubleshooting.md)

### Database connection errors

1. Verify database is running
2. Check DATABASE_URL in .env
3. Verify credentials
4. Test connection manually

### Build errors

1. Clear node_modules and reinstall
2. Check Node.js version
3. Verify all dependencies installed
4. Check for TypeScript errors

## Security Questions

### How do I report a security vulnerability?

Email `security@p31.io` or use GitHub Security Advisories. See [SECURITY.md](../SECURITY.md) for details.

### Is P31 secure?

P31 follows security-first principles:
- Type-level encryption
- Zero-knowledge proofs
- Local-first by default
- No backdoors
- See [Security Policy](../SECURITY.md)

## Deployment Questions

### How do I deploy to production?

See [Deployment Guide](deployment.md) for complete instructions. Options include:
- Docker deployment
- Self-hosted
- Cloud deployment

### What are the system requirements?

- Node.js 18.0.0+
- PostgreSQL or SQLite
- Redis (for The Buffer)
- Sufficient memory and CPU

## Naming Questions

### Why the name changes?

P31 uses plain language over jargon. The new names are:
- Clearer (The Buffer vs Tomograph)
- More accessible (Ping vs Heartbeat Protocol)
- Reflect the architecture (Node One vs Vertex One)

### Can I use old names?

In documentation, use P31 names. In code comments, old names are acceptable for historical context. Folder names are kept for compatibility.

## Community Questions

### How do I get help?

- Check [Documentation Index](index.md)
- Read [Troubleshooting Guide](troubleshooting.md)
- Ask in GitHub Discussions
- Open a GitHub Issue

### How do I stay updated?

- Watch the repository
- Check [CHANGELOG.md](../CHANGELOG.md)
- Read release notes
- Join discussions

## The Mesh Holds 🔺

Have more questions? Check the [Documentation Index](index.md) or ask in [GitHub Discussions](https://github.com/your-repo/discussions).

💜 With love and light. As above, so below. 💜
