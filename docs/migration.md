# P31 Migration and Upgrade Guide

Complete guide for migrating and upgrading the P31 ecosystem.

## Overview

This guide covers:
- Upgrading between P31 versions
- Migrating from old component names
- Database migrations
- Configuration updates
- Breaking changes

## Version Upgrades

### Upgrading P31

#### 1. Backup Current Installation

```bash
# Backup database
pg_dump centaur > backup-$(date +%Y%m%d).sql

# Backup configuration
tar -czf config-backup-$(date +%Y%m%d).tar.gz .env* config/

# Backup data
tar -czf data-backup-$(date +%Y%m%d).tar.gz data/
```

#### 2. Update Dependencies

```bash
# Update root dependencies
npm install

# Update component dependencies
npm run install:all
```

#### 3. Run Migrations

```bash
# The Centaur database migrations
cd SUPER-CENTAUR
npm run db:migrate
```

#### 4. Update Configuration

Check for new environment variables:
- Review `config/env-reference.md`
- Update `.env` files
- Test configuration

#### 5. Verify Installation

```bash
# Run health checks
npm run health

# Run tests
npm run test

# Check logs
tail -f SUPER-CENTAUR/logs/*.log
```

## Component Name Migration

### From Old Names to P31

If you have code using old component names, migrate to P31 names:

#### Phenix Navigator → Node One

```typescript
// Old
import { PhenixNavigator } from '@phenix/navigator';

// New
import { NodeOne } from '@p31/node-one';
```

#### Cognitive Shield → The Buffer

```typescript
// Old
import { CognitiveShield } from '@cognitive/shield';

// New
import { Buffer } from '@p31/buffer';
```

#### SUPER-CENTAUR → The Centaur

```typescript
// Old
import { SuperCentaur } from '@super/centaur';

// New
import { Centaur } from '@p31/centaur';
```

#### Dashboard → The Scope

```typescript
// Old
import { Dashboard } from '@dashboard/components';

// New
import { Scope } from '@p31/scope';
```

## Database Migrations

### The Centaur Database

#### Migration Scripts

```bash
cd SUPER-CENTAUR

# Run all pending migrations
npm run db:migrate

# Rollback last migration
npm run db:rollback

# Check migration status
npm run db:status
```

#### Manual Migration

```sql
-- Example: Add new column
ALTER TABLE messages ADD COLUMN priority VARCHAR(20) DEFAULT 'normal';

-- Example: Create index
CREATE INDEX idx_messages_priority ON messages(priority);

-- Example: Update data
UPDATE messages SET priority = 'normal' WHERE priority IS NULL;
```

### The Buffer Database

The Buffer uses SQLite by default. Migrations are handled automatically, but you can manually migrate:

```sql
-- Backup database
.backup buffer.db buffer-backup.db

-- Run migrations
-- (handled automatically on startup)
```

## Configuration Migration

### Environment Variables

#### New Variables

Check `config/env-reference.md` for new environment variables:

```bash
# Add new variables to .env
NEW_FEATURE_ENABLED=true
NEW_API_KEY=your-key-here
```

#### Deprecated Variables

Remove deprecated variables:

```bash
# Remove from .env
# OLD_VARIABLE=value  # Deprecated
```

### GOD_CONFIG Updates

Update `god.config.ts` files:

```typescript
// Old
export const Config = {
  maxMessages: 100,
};

// New
export const GodConfig = {
  Buffer: {
    maxMessages: 100,
    batchWindow: 60000,
  },
};
```

## Breaking Changes

### Version 1.0.0

#### API Changes

- Authentication endpoints updated
- Response formats standardized
- Error codes changed

#### Migration Steps

1. Update API client code
2. Update error handling
3. Test all API integrations

### Component Changes

#### The Centaur

- Database schema changes
- New required environment variables
- Updated authentication flow

#### The Buffer

- Message format changes
- New batching configuration
- Updated priority levels

#### The Scope

- Component API changes
- New required props
- Updated state management

## Rollback Procedures

### Rollback Database

```bash
# Restore database backup
psql centaur < backup-20260213.sql

# Or for SQLite
cp buffer-backup.db buffer.db
```

### Rollback Code

```bash
# Checkout previous version
git checkout v0.9.0

# Reinstall dependencies
npm run install:all

# Restart services
npm run dev
```

### Rollback Configuration

```bash
# Restore configuration backup
tar -xzf config-backup-20260213.tar.gz
```

## Testing After Migration

### 1. Health Checks

```bash
# Check all services
npm run health

# Individual checks
curl http://localhost:3000/health
curl http://localhost:4000/health
```

### 2. Functional Tests

```bash
# Run test suite
npm run test

# Test specific components
cd SUPER-CENTAUR && npm test
cd ui && npm test
```

### 3. Integration Tests

```bash
# Test API endpoints
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"message":"test","priority":"normal"}'
```

## Troubleshooting Migrations

### Common Issues

#### Database Connection Errors

```bash
# Check database is running
psql -U user -d centaur -c "SELECT 1"

# Verify connection string
echo $DATABASE_URL
```

#### Missing Environment Variables

```bash
# Check .env file
cat .env

# Compare with reference
cat config/env-reference.md
```

#### Migration Failures

```bash
# Check migration logs
tail -f SUPER-CENTAUR/logs/migration.log

# Rollback and retry
npm run db:rollback
npm run db:migrate
```

## Best Practices

1. **Always Backup** - Backup before upgrading
2. **Test First** - Test in staging environment
3. **Read Release Notes** - Check for breaking changes
4. **Update Gradually** - Update one component at a time
5. **Monitor Closely** - Watch logs and metrics after upgrade
6. **Have Rollback Plan** - Know how to rollback

## Migration Checklist

- [ ] Backup database
- [ ] Backup configuration
- [ ] Backup data files
- [ ] Read release notes
- [ ] Check breaking changes
- [ ] Update dependencies
- [ ] Run migrations
- [ ] Update configuration
- [ ] Test health checks
- [ ] Run test suite
- [ ] Test integrations
- [ ] Monitor logs
- [ ] Verify metrics
- [ ] Document changes

## Documentation

- [Setup Guide](setup.md)
- [Deployment Guide](deployment.md)
- [Troubleshooting](troubleshooting.md)
- [Changelog](../CHANGELOG.md)

## The Mesh Holds 🔺

Migrate carefully. Test thoroughly.
