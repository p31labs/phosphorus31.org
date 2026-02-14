# The Centaur - Autonomous Agents API

Autonomous agent creation and management.

## POST /api/agents/create

Create a new autonomous agent.

### Request

```http
POST /api/agents/create
Content-Type: application/json

{
  "name": "Legal Research Agent",
  "type": "legal",
  "capabilities": ["research", "document_analysis"],
  "parameters": {}
}
```

### Response

```json
{
  "success": true,
  "agent": {
    "id": "agent-123",
    "name": "Legal Research Agent",
    "status": "active",
    "createdAt": "2026-02-13T12:00:00.000Z"
  }
}
```

## GET /api/agents/status

Get status of all agents.

### Request

```http
GET /api/agents/status
```

### Response

```json
{
  "agents": [
    {
      "id": "agent-123",
      "name": "Legal Research Agent",
      "status": "active",
      "tasksCompleted": 42
    }
  ]
}
```

## Documentation

- [The Centaur](centaur.md)
- [API Index](index.md)

💜 With love and light. As above, so below. 💜
