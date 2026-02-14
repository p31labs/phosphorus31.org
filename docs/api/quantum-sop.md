# Quantum SOP Generator API

Complete API reference for the Quantum SOP Generator.

## Base URL

```
/api/quantum-brain/sop
```

## Endpoints

### POST /generate

Generate a new Standard Operating Procedure.

#### Request

```http
POST /api/quantum-brain/sop/generate
Content-Type: application/json

{
  "domain": "technical",
  "objective": "Deploy new API version with zero downtime",
  "priority": "high",
  "constraints": [
    "Zero downtime requirement",
    "Must support rollback"
  ],
  "audience": "DevOps engineers"
}
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| domain | string | Yes | Domain: `legal`, `medical`, `technical`, `operational` |
| objective | string | Yes | What the SOP should accomplish |
| priority | string | No | Priority: `low`, `normal`, `high`, `critical` (default: `normal`) |
| constraints | string[] | No | Constraints or requirements |
| audience | string | No | Who will use this SOP |

#### Response

```json
{
  "success": true,
  "sop": {
    "id": "SOP-TEC-abc123",
    "title": "Standard Operating Procedure: Deploy new API version with zero downtime",
    "domain": "technical",
    "objective": "Deploy new API version with zero downtime",
    "version": "1.0.0",
    "createdAt": "2026-02-13T12:00:00.000Z",
    "updatedAt": "2026-02-13T12:00:00.000Z",
    "steps": [
      {
        "id": "step-1",
        "order": 1,
        "action": "Review deployment requirements",
        "description": "Step 1 of 6: initialization phase for Deploy new API version with zero downtime",
        "verification": "Verify output matches expected result",
        "dependencies": [],
        "quantumWeight": 0.85
      }
    ],
    "quantumMetrics": {
      "coherence": 0.87,
      "efficiency": 0.92,
      "adaptability": 0.85,
      "stability": 0.90
    },
    "metadata": {
      "estimatedDuration": 30,
      "complexity": "moderate",
      "riskLevel": "high",
      "requiresApproval": true
    }
  },
  "message": "SOP generated successfully"
}
```

### GET /:id

Get a specific SOP by ID.

#### Request

```http
GET /api/quantum-brain/sop/SOP-TEC-abc123
```

#### Response

```json
{
  "success": true,
  "sop": {
    "id": "SOP-TEC-abc123",
    "title": "...",
    "steps": [...],
    "quantumMetrics": {...},
    "metadata": {...}
  }
}
```

### GET /

List all SOPs, optionally filtered by domain.

#### Request

```http
GET /api/quantum-brain/sop
GET /api/quantum-brain/sop?domain=technical
```

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| domain | string | Filter by domain (optional) |

#### Response

```json
{
  "success": true,
  "count": 5,
  "sops": [
    {
      "id": "SOP-TEC-abc123",
      "title": "...",
      "domain": "technical"
    }
  ]
}
```

### PUT /:id

Update an existing SOP.

#### Request

```http
PUT /api/quantum-brain/sop/SOP-TEC-abc123
Content-Type: application/json

{
  "objective": "Updated objective",
  "priority": "critical"
}
```

#### Response

```json
{
  "success": true,
  "sop": {
    "id": "SOP-TEC-abc123",
    "version": "1.0.1",
    "updatedAt": "2026-02-13T13:00:00.000Z",
    ...
  },
  "message": "SOP updated successfully"
}
```

### GET /:id/export

Export SOP in various formats.

#### Request

```http
GET /api/quantum-brain/sop/SOP-TEC-abc123/export?format=markdown
```

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| format | string | Export format: `json`, `markdown`, `pdf` (default: `json`) |

#### Response

Returns the SOP in the requested format:
- `json`: JSON format
- `markdown`: Markdown format
- `pdf`: PDF format (falls back to markdown if PDF library not available)

## Usage Examples

### Generate Technical SOP

```bash
curl -X POST http://localhost:3000/api/quantum-brain/sop/generate \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "technical",
    "objective": "Deploy new feature",
    "priority": "high"
  }'
```

### Get SOP

```bash
curl http://localhost:3000/api/quantum-brain/sop/SOP-TEC-abc123
```

### Export SOP as Markdown

```bash
curl http://localhost:3000/api/quantum-brain/sop/SOP-TEC-abc123/export?format=markdown \
  -o sop.md
```

## Error Responses

### 400 Bad Request

```json
{
  "error": "Missing required fields: domain and objective are required"
}
```

### 404 Not Found

```json
{
  "error": "SOP not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Failed to generate SOP",
  "message": "Error details"
}
```

## Integration

The Quantum SOP Generator integrates with:
- **The Centaur**: Quantum brain decision-making
- **The Buffer**: Message processing
- **The Scope**: Dashboard visualization

## Documentation

- [Quantum SOP Generator Guide](../quantum-sop-generator.md)
- [The Centaur](../centaur.md)
- [API Index](index.md)

## The Mesh Holds 🔺

Generate SOPs with quantum coherence. The mesh holds.

💜 With love and light. As above, so below. 💜
