# Release tagging (LAUNCH-05)

How to cut a release and tag it in the P31 repo.

## Tag format

- **Semantic versioning:** `vMAJOR.MINOR.PATCH` (e.g. `v1.0.0`, `v1.1.0`).
- **Tags are signed references** to a commit. Use annotated tags for releases.

## Pre-tag checklist

- [ ] No secrets in repo (`.env` not committed; use `.env.example`).
- [ ] CHANGELOG `[Unreleased]` section moved to `[X.Y.Z] - YYYY-MM-DD`.
- [ ] Root `package.json` version bumped to `X.Y.Z` if you ship a single version.
- [ ] Tests pass: `npm run test` (and `npm run test:shelter` / `npm run test:scope` as needed).
- [ ] OPSEC: no full names, addresses, or kid data in committed files.

## Steps

1. **Update CHANGELOG**  
   Under `[Unreleased]`, move content into a new section:
   ```markdown
   ## [1.1.0] - 2026-02-XX
   ```
   Add date. Leave `[Unreleased]` with a short list of next changes or empty.

2. **Commit**  
   ```bash
   git add CHANGELOG.md package.json
   git commit -m "chore(release): prepare v1.1.0"
   ```

3. **Create annotated tag**  
   ```bash
   git tag -a v1.1.0 -m "Release v1.1.0"
   ```

4. **Push branch and tags**  
   ```bash
   git push origin main
   git push origin v1.1.0
   ```
   Or push all tags: `git push origin --tags` (use with care).

## Conventional commits

Commits should follow the format used in CONTRIBUTING:

- `feat(scope):` new feature  
- `fix(buffer):` bug fix  
- `docs(centaur):` documentation  
- `chore(release):` release prep  

This keeps history and CHANGELOG generation (if automated later) consistent.

## Git hygiene

- **Do not commit:** `.env`, `*.db`, `data/`, `backups/`, `node_modules/`, `dist/`, secrets, or PII. Root `.gitignore` and component `.gitignore` files enforce this.
- **Author:** Use `P31 Labs` or `will@p31ca.org` for commits (see OPSEC / AGENTS.md).
- **Branches:** Prefer short-lived feature branches; merge to `main` after review.

---

*Part of the P31 launch swarm. The mesh holds. 🔺*
