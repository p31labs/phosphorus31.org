# Security

## Reporting Vulnerabilities

Email will@p31ca.org with the subject line "P31 Security". Include reproduction steps. Do not open a public issue for security vulnerabilities.

Expected response time: 48 hours.

## Security Model

P31 Labs uses a three-layer security model:

### Layer 1: Edge Authentication (p31-bouncer)

- Room codes hashed with PBKDF2 (100,000 iterations)
- JWTs signed with HMAC-SHA256, 24-hour expiry
- Speakable alphabet (no ambiguous characters: 0/O, 1/I/l excluded)
- Tokens scoped to specific rooms

### Layer 2: Data Isolation (k4-personal)

- Each user gets an isolated Durable Object with its own SQLite database
- PII scrubbing runs before any data enters LLM context
- Minors' names are replaced with initials (configurable per-user)
- Bio data (calcium levels, medication, spoon counts) stays in the user's DO

### Layer 3: LLM Sanitization (p31-agent-hub)

- Two-pass architecture: first call decides tools, second synthesizes
- Leakage parser catches raw JSON, tool_calls objects, and python_tag markers
- No user data is sent to external services — all inference runs on Cloudflare Workers AI (on-device, within Cloudflare's network)
- No telemetry is sent to Anthropic, OpenAI, or any third-party AI provider

## What We Don't Do

- No user accounts (room code is the only credential)
- No email collection
- No analytics or tracking scripts
- No third-party cookies
- No data sales
- No advertising

## Headers

The following security headers are set via Cloudflare Pages `_headers` file:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://*.trimtab-signal.workers.dev wss://*.trimtab-signal.workers.dev; frame-ancestors 'none'; base-uri 'self'
```

Known gap: `Strict-Transport-Security` header is not yet configured. Cloudflare enforces HTTPS at the edge, but the header should be added for defense in depth.

## Threat Model

| Threat | Mitigation |
|--------|------------|
| JWT theft | 24h expiry, room-scoped, HTTPS only |
| LLM prompt injection | Two-pass architecture isolates tool decisions from synthesis |
| PII leakage to LLM | Pre-inference regex scrubbing, configurable per user |
| Minor identification | Names replaced with initials before any external processing |
| Bio data exposure | Isolated per-user Durable Objects, no cross-user queries |
| WebSocket eavesdropping | WSS (TLS), room-scoped connections |
| Replay attacks | JWT `iat` claim, monotonic session IDs |

## Dependencies

Run `./scripts/security-scan.sh` for automated vulnerability scanning, secrets detection, and PII auditing across the monorepo.