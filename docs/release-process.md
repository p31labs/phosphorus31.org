# P31 Release Process

Complete guide for releasing P31 components - with love and light, as above so below.

## Overview

P31 uses semantic versioning and follows a structured release process to ensure quality and consistency.

## Version Numbering

### Semantic Versioning

Format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Component Versions

Components may have independent versioning:
- The Centaur: `1.0.0`
- The Scope: `1.0.0`
- The Buffer: `1.0.0`
- Node One: `1.0.0`

## Release Checklist

### Pre-Release

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version numbers updated
- [ ] Breaking changes documented
- [ ] Migration guide updated (if needed)
- [ ] Security audit completed

### Release

- [ ] Create release branch
- [ ] Update version numbers
- [ ] Build all components
- [ ] Run full test suite
- [ ] Create git tag
- [ ] Push to repository
- [ ] Create GitHub release
- [ ] Publish release notes

### Post-Release

- [ ] Monitor deployment
- [ ] Check error logs
- [ ] Verify metrics
- [ ] Update documentation
- [ ] Announce release

## Release Steps

### 1. Prepare Release

```bash
# Create release branch
git checkout -b release/v1.0.0

# Update version numbers
# In package.json files
npm version 1.0.0

# Update CHANGELOG.md
# Add release notes
```

### 2. Update Documentation

```bash
# Update version in README
# Update migration guide if needed
# Update API documentation
# Review all docs for accuracy
```

### 3. Build and Test

```bash
# Clean build
npm run clean

# Install dependencies
npm run install:all

# Run tests
npm run test

# Build all components
npm run build

# Test builds
npm run health
```

### 4. Create Release

```bash
# Commit changes
git add .
git commit -m "chore: release v1.0.0"

# Create tag
git tag -a v1.0.0 -m "Release v1.0.0"

# Push branch and tags
git push origin release/v1.0.0
git push origin v1.0.0
```

### 5. Merge to Main

```bash
# Merge release branch
git checkout main
git merge release/v1.0.0

# Push to main
git push origin main
```

### 6. Create GitHub Release

1. Go to GitHub Releases
2. Click "Draft a new release"
3. Select tag: `v1.0.0`
4. Title: `P31 v1.0.0`
5. Description: Copy from CHANGELOG.md
6. Attach build artifacts
7. Publish release

## Release Notes Template

```markdown
# P31 v1.0.0

## 🎉 Release Highlights

- Major feature additions
- Performance improvements
- Security updates

## ✨ New Features

- Feature 1
- Feature 2
- Feature 3

## 🐛 Bug Fixes

- Fixed issue with X
- Resolved Y problem
- Corrected Z behavior

## 🔄 Changes

- Changed A to B
- Updated C to D

## ⚠️ Breaking Changes

- Breaking change 1
- Breaking change 2

## 📚 Documentation

- Updated setup guide
- Added new examples
- Improved API docs

## 🔒 Security

- Security fix 1
- Security fix 2

## 🙏 Contributors

- @contributor1
- @contributor2

## 📦 Installation

```bash
npm install
npm run setup
```

## 🔗 Links

- [Documentation](https://docs.p31.io)
- [Changelog](CHANGELOG.md)
- [Migration Guide](docs/migration.md)

---

💜 With love and light. As above, so below. 💜

The Mesh Holds. 🔺
```

## Hotfix Releases

### For Critical Issues

```bash
# Create hotfix branch from main
git checkout -b hotfix/v1.0.1 main

# Fix issue
# ... make changes ...

# Update version
npm version patch

# Test fix
npm run test

# Create release
git tag -a v1.0.1 -m "Hotfix v1.0.1"
git push origin hotfix/v1.0.1
git push origin v1.0.1

# Merge to main
git checkout main
git merge hotfix/v1.0.1
git push origin main
```

## Pre-Release Testing

### Test Matrix

- [ ] Node.js 18.x
- [ ] Node.js 20.x
- [ ] Linux
- [ ] macOS
- [ ] Windows
- [ ] Docker
- [ ] All components

### Integration Tests

```bash
# Run full integration tests
npm run test:integration

# Test deployment
npm run test:deployment

# Test migration
npm run test:migration
```

## Rollback Procedure

### If Release Fails

```bash
# Revert tag
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0

# Revert merge
git revert -m 1 <merge-commit>

# Or reset to previous version
git reset --hard v0.9.0
git push origin main --force
```

### Database Rollback

```bash
# Rollback migrations
cd SUPER-CENTAUR
npm run db:rollback

# Restore from backup
psql -U user -d centaur < backup.sql
```

## Release Communication

### Announcement Channels

- GitHub Release
- Documentation updates
- Community announcements
- Email notifications (for major releases)

### Announcement Template

```
🎉 P31 v1.0.0 Released!

We're excited to announce the release of P31 v1.0.0!

Highlights:
- New features
- Performance improvements
- Security updates

Full release notes: [link]
Migration guide: [link]

💜 With love and light. As above, so below. 💜

The Mesh Holds. 🔺
```

## Best Practices

1. **Test Thoroughly** - Test all components before release
2. **Document Changes** - Update all relevant documentation
3. **Communicate Clearly** - Clear release notes and announcements
4. **Monitor Closely** - Watch for issues after release
5. **Be Prepared** - Have rollback plan ready
6. **Celebrate** - Acknowledge contributors and achievements

## Documentation

- [CHANGELOG.md](../CHANGELOG.md)
- [Migration Guide](migration.md)
- [Deployment Guide](deployment.md)
- [Testing Guide](testing.md)

## The Mesh Holds 🔺

Release with care. Test thoroughly. The mesh holds.

💜 With love and light. As above, so below. 💜
