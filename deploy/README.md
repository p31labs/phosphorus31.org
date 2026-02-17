# P31 deploy (LAUNCH-06)

Infrastructure configs for running P31 Shelter (Buffer) with Redis.

## Quick start

From **repo root**:

```bash
docker compose -f deploy/docker-compose.yml up -d
```

- **Shelter API:** http://localhost:4000  
- **Health:** http://localhost:4000/health  
- **Redis:** localhost:6379 (used by Shelter for message queue)

## Services

| Service | Image / build | Port | Notes |
|--------|----------------|------|------|
| redis | redis:7-alpine | 6379 | Message queue backend |
| shelter | `apps/shelter/Dockerfile` | 4000 | Buffer API; volume `shelter-data` for accommodation DB |

## Env

Set in compose or at runtime:

- `REDIS_URL=redis://redis:6379` (default in compose)
- `ACCOMMODATION_DB_DIR=/app/data` (default; volume-mounted)
- `PORT=4000`

See `config/env-reference.md` for full list.

## Build only

```bash
docker compose -f deploy/docker-compose.yml build shelter
```

## Stop

```bash
docker compose -f deploy/docker-compose.yml down
```

Data in volume `shelter-data` persists. Add `-v` to remove volumes.

---

*The mesh holds. 🔺*
