# P31 Complete Quick Start

**Get P31 running in 5 minutes. Everything connected. The mesh holds.**

## 5-Minute Setup

```bash
# 1. Clone and setup (1 minute)
git clone <repo>
cd p31
npm run setup

# 2. Configure (1 minute)
cd SUPER-CENTAUR
cp .env.example .env
# Edit .env with your values

# 3. Start The Centaur (1 minute)
npm run dev
# Wait for "The Centaur is running"

# 4. Start The Scope (1 minute)
# New terminal
cd ui
npm run dev
# Opens at http://localhost:5173

# 5. Verify (1 minute)
curl http://localhost:3000/health
# Should return {"status":"healthy"}
```

**That's it! P31 is running.**

## What You Have

- ✅ **The Centaur**: Backend AI protocol (port 3000)
- ✅ **The Scope**: Dashboard and UI (port 5173)
- ✅ **Health Monitoring**: All systems connected
- ✅ **Ready to Use**: Start building immediately

## Next Steps

1. **Explore The Scope**: Open http://localhost:5173
2. **Try The Centaur API**: `curl http://localhost:3000/health`
3. **Generate an SOP**: Use Quantum SOP Generator
4. **Read Documentation**: See [Documentation Index](index.md)

## Common First Tasks

### Generate Your First SOP

```bash
curl -X POST http://localhost:3000/api/quantum-brain/sop/generate \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "technical",
    "objective": "Deploy my first feature",
    "priority": "normal"
  }'
```

### Check System Health

```bash
curl http://localhost:3000/health
```

### Send a Message

```bash
curl -X POST http://localhost:3000/api/buffer/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello from P31!",
    "priority": "normal"
  }'
```

## Documentation

- [Developer Quick Start](DEVELOPER_QUICK_START.md)
- [Setup Guide](setup.md)
- [API Documentation](api/index.md)
- [Examples](../examples/README.md)

## The Mesh Holds 🔺

**5 minutes to running.**
**Everything connected.**
**The mesh holds.**

💜 **With love and light. As above, so below.** 💜
