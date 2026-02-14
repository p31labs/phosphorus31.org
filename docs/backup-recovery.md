# P31 Backup and Recovery Guide

Complete guide for backing up and recovering the P31 ecosystem.

## Overview

P31 follows local-first principles, but backups are essential for:
- Disaster recovery
- Migration between systems
- Data protection
- System restoration

## Backup Strategy

### 1. Database Backups

#### The Centaur (PostgreSQL)

```bash
# Full database backup
pg_dump -U user -d centaur > backup-$(date +%Y%m%d-%H%M%S).sql

# Compressed backup
pg_dump -U user -d centaur | gzip > backup-$(date +%Y%m%d-%H%M%S).sql.gz

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups/centaur"
DATE=$(date +%Y%m%d-%H%M%S)
pg_dump -U user -d centaur | gzip > "$BACKUP_DIR/centaur-$DATE.sql.gz"
# Keep last 30 days
find "$BACKUP_DIR" -name "centaur-*.sql.gz" -mtime +30 -delete
```

#### The Buffer (SQLite)

```bash
# SQLite backup
cp buffer.db backup-$(date +%Y%m%d-%H%M%S).db

# Or use SQLite backup command
sqlite3 buffer.db ".backup backup-$(date +%Y%m%d-%H%M%S).db"
```

### 2. Configuration Backups

```bash
# Backup all configuration
tar -czf config-backup-$(date +%Y%m%d-%H%M%S).tar.gz \
  .env* \
  config/ \
  */setup.md \
  */README.md
```

### 3. Data Backups

```bash
# Backup data directories
tar -czf data-backup-$(date +%Y%m%d-%H%M%S).tar.gz \
  data/ \
  SUPER-CENTAUR/data/ \
  cognitive-shield/data/
```

### 4. Code Backups

```bash
# Git is your code backup
git push origin main

# Or create code snapshot
tar -czf code-backup-$(date +%Y%m%d-%H%M%S).tar.gz \
  --exclude=node_modules \
  --exclude=dist \
  --exclude=build \
  .
```

## Automated Backups

### Cron Job Setup

```bash
# Edit crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /path/to/backup-script.sh

# Weekly full backup
0 3 * * 0 /path/to/full-backup-script.sh
```

### Backup Script Example

```bash
#!/bin/bash
# P31 Backup Script

BACKUP_ROOT="/backups/p31"
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="$BACKUP_ROOT/$DATE"

mkdir -p "$BACKUP_DIR"

# Database backups
pg_dump -U user -d centaur | gzip > "$BACKUP_DIR/centaur.sql.gz"
cp buffer.db "$BACKUP_DIR/buffer.db"

# Configuration
tar -czf "$BACKUP_DIR/config.tar.gz" .env* config/

# Data
tar -czf "$BACKUP_DIR/data.tar.gz" data/

# Logs
tar -czf "$BACKUP_DIR/logs.tar.gz" */logs/

# Create archive
cd "$BACKUP_ROOT"
tar -czf "p31-backup-$DATE.tar.gz" "$DATE"
rm -rf "$DATE"

# Keep last 30 days
find "$BACKUP_ROOT" -name "p31-backup-*.tar.gz" -mtime +30 -delete

echo "Backup completed: p31-backup-$DATE.tar.gz"
```

## Recovery Procedures

### 1. Database Recovery

#### PostgreSQL

```bash
# Restore from backup
gunzip < backup-20260213-120000.sql.gz | psql -U user -d centaur

# Or from uncompressed
psql -U user -d centaur < backup-20260213-120000.sql
```

#### SQLite

```bash
# Restore SQLite database
cp backup-20260213-120000.db buffer.db

# Or use restore command
sqlite3 buffer.db < backup.sql
```

### 2. Configuration Recovery

```bash
# Extract configuration backup
tar -xzf config-backup-20260213-120000.tar.gz

# Verify environment variables
cat .env
```

### 3. Full System Recovery

```bash
# 1. Restore database
gunzip < centaur-backup.sql.gz | psql -U user -d centaur

# 2. Restore configuration
tar -xzf config-backup.tar.gz

# 3. Restore data
tar -xzf data-backup.tar.gz

# 4. Reinstall dependencies
npm run install:all

# 5. Run migrations
cd SUPER-CENTAUR && npm run db:migrate

# 6. Verify
npm run health
```

## Backup Verification

### Test Restores

Regularly test your backups:

```bash
# Test database restore on test database
createdb centaur_test
gunzip < backup.sql.gz | psql -U user -d centaur_test

# Verify data
psql -U user -d centaur_test -c "SELECT COUNT(*) FROM messages;"
```

### Backup Integrity

```bash
# Verify backup file integrity
gzip -t backup.sql.gz

# Check file size
ls -lh backup.sql.gz

# Verify checksum
md5sum backup.sql.gz > backup.sql.gz.md5
md5sum -c backup.sql.gz.md5
```

## Backup Storage

### Local Storage

- External drives
- Network storage (NAS)
- Local file system

### Cloud Storage

- Encrypted cloud storage
- Multiple regions
- Versioning enabled

### Offsite Storage

- Physical backups offsite
- Multiple cloud providers
- Geographic distribution

## Encryption

### Encrypt Backups

```bash
# Encrypt backup
gpg --encrypt --recipient backup-key backup.sql.gz

# Decrypt backup
gpg --decrypt backup.sql.gz.gpg > backup.sql.gz
```

### Secure Storage

- Use encrypted storage
- Protect backup keys
- Rotate encryption keys
- Secure access controls

## Recovery Testing

### Regular Testing

Test recovery procedures:
- Monthly database restore tests
- Quarterly full system recovery tests
- Document recovery times
- Update procedures based on tests

### Recovery Time Objectives (RTO)

- **Database**: < 1 hour
- **Configuration**: < 15 minutes
- **Full System**: < 4 hours

### Recovery Point Objectives (RPO)

- **Database**: < 1 hour (hourly backups)
- **Configuration**: < 24 hours (daily backups)
- **Code**: Real-time (Git)

## Best Practices

1. **Automate Backups** - Don't rely on manual backups
2. **Test Regularly** - Verify backups work
3. **Encrypt Everything** - Protect backup data
4. **Multiple Copies** - 3-2-1 rule (3 copies, 2 media, 1 offsite)
5. **Document Procedures** - Know how to restore
6. **Monitor Backups** - Alert on failures
7. **Version Backups** - Keep multiple versions
8. **Secure Storage** - Protect backup access

## Disaster Recovery Plan

### 1. Identify Critical Systems

- Database (The Centaur)
- Configuration files
- User data
- Message queue (The Buffer)

### 2. Recovery Procedures

- Document step-by-step procedures
- Test procedures regularly
- Update based on changes
- Train team members

### 3. Communication Plan

- Notify stakeholders
- Status updates
- Recovery progress
- Post-recovery review

## Documentation

- [Deployment Guide](deployment.md)
- [Migration Guide](migration.md)
- [Troubleshooting](troubleshooting.md)
- [Security](SECURITY.md)

## The Mesh Holds 🔺

Backup regularly. Recover confidently. The mesh survives.

💜 With love and light. As above, so below. 💜
