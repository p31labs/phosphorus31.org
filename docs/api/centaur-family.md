# The Centaur - Family Support API

Family support systems and services.

## GET /api/family/status

Get family system status.

### Request

```http
GET /api/family/status
```

### Response

```json
{
  "members": [
    {
      "id": "member-1",
      "name": "Protected Member",
      "relationship": "child",
      "accessLevel": "full"
    }
  ],
  "supportSystems": {
    "active": true,
    "lastUpdate": "2026-02-13T12:00:00.000Z"
  }
}
```

## POST /api/family/support

Request family support.

### Request

```http
POST /api/family/support
Content-Type: application/json

{
  "type": "assistance",
  "memberId": "member-1",
  "description": "Need help with homework"
}
```

## Documentation

- [The Centaur](centaur.md)
- [API Index](index.md)

💜 With love and light. As above, so below. 💜
