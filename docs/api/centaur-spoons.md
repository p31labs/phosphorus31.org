# The Centaur - Spoons API

Spoon theory tracking and energy management.

## GET /api/spoons/status

Get current spoon status.

### Request

```http
GET /api/spoons/status?memberId=member-1
```

### Response

```json
{
  "memberId": "member-1",
  "currentSpoons": 8,
  "maxSpoons": 12,
  "recoveryRate": 0.1,
  "lastUpdate": "2026-02-13T12:00:00.000Z"
}
```

## POST /api/spoons/consume

Consume spoons for an activity.

### Request

```http
POST /api/spoons/consume
Content-Type: application/json

{
  "memberId": "member-1",
  "activity": "work",
  "spoons": 2
}
```

## Documentation

- [The Centaur](centaur.md)
- [API Index](index.md)

💜 With love and light. As above, so below. 💜
