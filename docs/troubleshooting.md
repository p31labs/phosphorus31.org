# P31 Troubleshooting Guide

Common issues and solutions for the P31 ecosystem.

## Setup Issues

### Node.js Version

**Problem**: Errors about Node.js version

**Solution**: 
```bash
node --version  # Should be 18.0.0+
nvm install 18  # If using nvm
nvm use 18
```

### Port Already in Use

**Problem**: Port 3000, 5173, or 4000 already in use

**Solution**:
```bash
# Find process
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill process or change port in .env
```

### Module Not Found

**Problem**: `Cannot find module` errors

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## The Centaur Issues

### Database Connection Failed

**Problem**: Cannot connect to database

**Solution**:
1. Verify database is running
2. Check DATABASE_URL in .env
3. Verify credentials and permissions
4. Test connection: `psql $DATABASE_URL`

### Redis Connection Failed

**Problem**: Cannot connect to Redis

**Solution**:
```bash
# Check Redis is running
redis-cli ping  # Should return PONG

# Start Redis if needed
redis-server

# Check REDIS_URL in .env
```

### API Not Responding

**Problem**: API endpoints return errors

**Solution**:
1. Check server logs
2. Verify environment variables
3. Check database connection
4. Verify API keys are set

## The Scope Issues

### Build Errors

**Problem**: Vite build fails

**Solution**:
```bash
# Clear cache
rm -rf node_modules .vite dist
npm install
npm run build
```

### API Connection Failed

**Problem**: Cannot connect to The Centaur API

**Solution**:
1. Verify The Centaur is running
2. Check VITE_API_URL in .env
3. Check CORS settings in The Centaur
4. Check browser console for errors

### 3D Rendering Issues

**Problem**: Three.js scenes not rendering

**Solution**:
1. Check browser WebGL support
2. Verify Three.js version compatibility
3. Check console for WebGL errors
4. Try different browser

## The Buffer Issues

### Message Queue Not Working

**Problem**: Messages not processing

**Solution**:
1. Verify Redis is running
2. Check REDIS_URL in .env
3. Check buffer store state
4. Verify heartbeat status

### Database Locked

**Problem**: SQLite database locked errors

**Solution**:
```bash
# Close other connections
# Check for file locks
# Restart service
```

## Node One Issues

### Flash Failed

**Problem**: Cannot flash firmware

**Solution**:
1. Check USB cable connection
2. Hold BOOT button during flash
3. Verify device is in download mode
4. Check ESP-IDF installation

### Display Not Working

**Problem**: Display shows nothing or corruption

**Solution**:
1. Verify QSPI connections
2. Check backlight GPIO6
3. Verify color byte-swapping
4. Check display initialization in logs

### LoRa Not Connecting

**Problem**: Cannot connect to mesh network

**Solution**:
1. Verify antenna connection
2. Check 915MHz frequency setting
3. Verify spreading factor
4. Check for other nodes in range

## Docker Issues

### Container Won't Start

**Problem**: Docker containers fail to start

**Solution**:
```bash
# Check logs
docker-compose logs

# Rebuild
docker-compose up -d --build

# Check ports
docker-compose ps
```

### Volume Permissions

**Problem**: Permission denied on volumes

**Solution**:
```bash
# Fix permissions
sudo chown -R $USER:$USER ./data
```

## Performance Issues

### Slow API Responses

**Problem**: API calls are slow

**Solution**:
1. Check database query performance
2. Verify Redis caching
3. Check network latency
4. Profile with performance monitor

### High Memory Usage

**Problem**: Memory usage is high

**Solution**:
1. Check for memory leaks
2. Reduce batch sizes
3. Clear caches periodically
4. Monitor with system tools

## Network Issues

### CORS Errors

**Problem**: CORS errors in browser

**Solution**:
1. Configure CORS in The Centaur
2. Add allowed origins
3. Check preflight requests

### WebSocket Disconnected

**Problem**: WebSocket keeps disconnecting

**Solution**:
1. Check network stability
2. Verify WebSocket URL
3. Check firewall settings
4. Increase timeout values

## Getting Help

### Logs

Check logs in:
- The Centaur: `SUPER-CENTAUR/logs/`
- The Buffer: Console output
- Node One: Serial monitor

### Debug Mode

Enable debug logging:
```bash
DEBUG=* npm run dev
```

### Documentation

- [Setup Guide](setup.md)
- [Development Guide](development.md)
- [Architecture](architecture.md)
- [Component Docs](index.md)
