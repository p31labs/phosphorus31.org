# The Centaur - Medical Services API

Medical documentation and health tracking services.

## POST /api/medical/document

Create medical documentation.

### Request

```http
POST /api/medical/document
Content-Type: application/json

{
  "patientId": "patient-123",
  "documentType": "assessment",
  "data": {
    "symptoms": ["fatigue", "joint pain"],
    "vitals": {
      "bloodPressure": "120/80",
      "heartRate": 72
    }
  }
}
```

### Response

```json
{
  "success": true,
  "document": {
    "id": "med-doc-123",
    "type": "assessment",
    "createdAt": "2026-02-13T12:00:00.000Z"
  }
}
```

## GET /api/medical/conditions

Get medical condition information.

### Request

```http
GET /api/medical/conditions?query=calcium
```

### Response

```json
{
  "conditions": [
    {
      "name": "Calcium regulation disorder",
      "description": "...",
      "relatedConditions": []
    }
  ]
}
```

## Documentation

- [The Centaur](centaur.md)
- [API Index](index.md)

💜 With love and light. As above, so below. 💜
