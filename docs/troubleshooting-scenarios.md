# P31 Troubleshooting Scenarios

Common troubleshooting scenarios and solutions for the P31 ecosystem.

## Scenario 1: Services Won't Start

### Symptoms
- `npm run dev` fails
- Port already in use errors
- Component crashes on startup

### Diagnosis

```bash
# Check if ports are in use
lsof -i :3000  # The Centaur
lsof -i :5173  # The Scope
lsof -i :4000  # The Buffer

# Check Node.js version
node --version  # Should be 18.0.0+

# Check environment variables
cat .env
```

### Solutions

**Port Already in Use:**
```bash
# Kill process on port
lsof -ti:3000 | xargs kill

# Or change port in .env
PORT=3001
```

**Missing Dependencies:**
```bash
# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm run install:all
```

**Environment Variables Missing:**
```bash
# Copy example and configure
cp .env.example .env
# Edit .env with your values
```

## Scenario 2: Database Connection Errors

### Symptoms
- "Cannot connect to database" errors
- Database timeout errors
- Migration failures

### Diagnosis

```bash
# Test PostgreSQL connection
psql -U user -d centaur -c "SELECT 1"

# Check database is running
pg_isready -U user

# Check connection string
echo $DATABASE_URL
```

### Solutions

**Database Not Running:**
```bash
# Start PostgreSQL
sudo systemctl start postgresql

# Or with Docker
docker-compose up -d postgres
```

**Wrong Credentials:**
```bash
# Update .env
DATABASE_URL=postgresql://user:password@localhost:5432/centaur
```

**Database Doesn't Exist:**
```bash
# Create database
createdb centaur

# Run migrations
cd SUPER-CENTAUR
npm run db:migrate
```

## Scenario 3: The Buffer Not Processing Messages

### Symptoms
- Messages stuck in queue
- No messages processed
- Buffer health check fails

### Diagnosis

```bash
# Check Buffer health
curl http://localhost:4000/health

# Check Redis connection
redis-cli ping

# Check Buffer logs
tail -f cognitive-shield/logs/*.log
```

### Solutions

**Redis Not Running:**
```bash
# Start Redis
redis-server

# Or with Docker
docker-compose up -d redis
```

**Redis Connection Error:**
```bash
# Update .env
REDIS_URL=redis://localhost:6379

# Test connection
redis-cli -u redis://localhost:6379 ping
```

**Message Queue Full:**
```bash
# Clear queue (use with caution)
redis-cli FLUSHDB

# Or restart Buffer
cd cognitive-shield
npm run dev
```

## Scenario 4: The Scope Not Connecting to The Centaur

### Symptoms
- API calls fail
- CORS errors in browser
- 404 errors

### Diagnosis

```bash
# Check The Centaur is running
curl http://localhost:3000/health

# Check API URL in The Scope
cat ui/.env
# Should have: VITE_API_URL=http://localhost:3000

# Check browser console for errors
# Open DevTools > Console
```

### Solutions

**CORS Errors:**
```bash
# Update The Centaur CORS config
# In SUPER-CENTAUR/.env
CORS_ORIGIN=http://localhost:5173
```

**Wrong API URL:**
```bash
# Update The Scope .env
VITE_API_URL=http://localhost:3000
```

**The Centaur Not Running:**
```bash
# Start The Centaur
cd SUPER-CENTAUR
npm run dev
```

## Scenario 5: Build Failures

### Symptoms
- `npm run build` fails
- TypeScript errors
- Missing dependencies

### Diagnosis

```bash
# Check TypeScript errors
npm run type-check

# Check for missing dependencies
npm ls

# Check Node.js version
node --version
```

### Solutions

**TypeScript Errors:**
```bash
# Fix type errors
npm run lint -- --fix

# Or check specific file
npx tsc --noEmit src/file.ts
```

**Missing Dependencies:**
```bash
# Install missing dependencies
npm install missing-package

# Or reinstall all
rm -rf node_modules package-lock.json
npm install
```

**Node.js Version:**
```bash
# Use correct Node.js version
nvm use 18
# Or install Node.js 18+
```

## Scenario 6: Authentication Failures

### Symptoms
- Login fails
- Token errors
- 401 Unauthorized

### Diagnosis

```bash
# Check JWT secret
echo $JWT_SECRET

# Test authentication endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

### Solutions

**Missing JWT Secret:**
```bash
# Generate JWT secret
openssl rand -base64 32

# Add to .env
JWT_SECRET=your-secret-here
```

**Wrong Credentials:**
```bash
# Check user exists in database
psql -U user -d centaur -c "SELECT * FROM users;"

# Or create test user
cd SUPER-CENTAUR
npm run db:seed
```

## Scenario 7: Performance Issues

### Symptoms
- Slow API responses
- High memory usage
- Timeout errors

### Diagnosis

```bash
# Check system metrics
curl http://localhost:3000/api/system/metrics

# Check memory usage
ps aux | grep node

# Check database performance
psql -U user -d centaur -c "EXPLAIN ANALYZE SELECT * FROM messages;"
```

### Solutions

**Slow Database Queries:**
```sql
-- Add indexes
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
CREATE INDEX idx_messages_priority ON messages(priority);

-- Analyze queries
EXPLAIN ANALYZE SELECT * FROM messages WHERE priority = 'high';
```

**High Memory Usage:**
```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm run dev

# Or optimize code
# Use streaming for large data
# Implement pagination
```

**Slow API Responses:**
```typescript
// Add caching
const cache = new Map();
async function getData(key: string) {
  if (cache.has(key)) return cache.get(key);
  const data = await fetchData(key);
  cache.set(key, data);
  return data;
}
```

## Scenario 8: Node One Hardware Issues

### Symptoms
- Device not connecting
- Display not working
- LoRa not transmitting

### Diagnosis

```bash
# Check serial connection
idf.py monitor

# Check device in download mode
# Hold BOOT button while connecting USB

# Check ESP-IDF installation
idf.py --version
```

### Solutions

**Flash Issues:**
```bash
# Hold BOOT button during flash
idf.py flash

# Or use flash tool
esptool.py --port /dev/ttyUSB0 write_flash 0x1000 firmware.bin
```

**Display Issues:**
```cpp
// Check QSPI connections
// Verify GPIO pins
// Check backlight GPIO6
// Verify color byte-swapping
```

**LoRa Issues:**
```cpp
// Check antenna connection
// Verify 915MHz frequency
// Check spreading factor
// Verify other nodes in range
```

## Scenario 9: Docker Issues

### Symptoms
- Containers won't start
- Volume permission errors
- Network connectivity issues

### Diagnosis

```bash
# Check container status
docker-compose ps

# Check logs
docker-compose logs

# Check volumes
docker volume ls
```

### Solutions

**Container Won't Start:**
```bash
# Rebuild containers
docker-compose up -d --build

# Check ports
docker-compose ps
```

**Volume Permissions:**
```bash
# Fix permissions
sudo chown -R $USER:$USER ./data

# Or use named volumes
volumes:
  - p31_data:/data
```

## Scenario 10: Migration Issues

### Symptoms
- Migration fails
- Data loss
- Schema errors

### Diagnosis

```bash
# Check migration status
cd SUPER-CENTAUR
npm run db:status

# Check database schema
psql -U user -d centaur -c "\d"
```

### Solutions

**Migration Fails:**
```bash
# Rollback migration
npm run db:rollback

# Fix migration script
# Re-run migration
npm run db:migrate
```

**Data Loss:**
```bash
# Restore from backup
psql -U user -d centaur < backup.sql

# Or restore specific table
pg_restore -U user -d centaur -t messages backup.dump
```

## Getting More Help

### Documentation
- [Troubleshooting Guide](troubleshooting.md)
- [Setup Guide](setup.md)
- [Architecture](architecture.md)

### Community
- GitHub Discussions
- GitHub Issues
- Community Guide

### Logs
- The Centaur: `SUPER-CENTAUR/logs/`
- The Buffer: Console output
- Node One: Serial monitor

## The Mesh Holds 🔺

Troubleshoot with care. The mesh holds.

💜 With love and light. As above, so below. 💜
