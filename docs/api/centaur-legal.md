# The Centaur - Legal Services API

Legal document processing and AI-powered legal services.

## POST /api/legal/generate

Generate legal documents using AI.

### Request

```http
POST /api/legal/generate
Content-Type: application/json

{
  "documentType": "motion",
  "context": {
    "caseNumber": "FC-2026-001",
    "court": "Family Court",
    "jurisdiction": "State of Georgia"
  },
  "requirements": [
    "Must cite relevant case law",
    "Include supporting evidence"
  ]
}
```

### Response

```json
{
  "success": true,
  "document": {
    "id": "doc-123",
    "type": "motion",
    "content": "...",
    "generatedAt": "2026-02-13T12:00:00.000Z"
  }
}
```

## POST /api/legal/emergency

Generate emergency legal documents.

### Request

```http
POST /api/legal/emergency
Content-Type: application/json

{
  "situation": "Custody emergency",
  "urgency": "critical",
  "deadline": "2026-02-14T09:00:00.000Z"
}
```

## Documentation

- [The Centaur](centaur.md)
- [API Index](index.md)

💜 With love and light. As above, so below. 💜
