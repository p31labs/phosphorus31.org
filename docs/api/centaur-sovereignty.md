# The Centaur - Sovereignty API

Sovereignty validation and digital self management.

## GET /api/sovereignty/status

Get sovereignty status.

### Request

```http
GET /api/sovereignty/status
```

### Response

```json
{
  "sovereign": true,
  "grounded": true,
  "issues": [],
  "lastValidation": "2026-02-13T12:00:00.000Z"
}
```

## GET /api/sovereignty/binary-dashboard

Get binary sovereignty dashboard.

### Request

```http
GET /api/sovereignty/binary-dashboard
```

## POST /api/sovereignty/scan-drive

Scan Google Drive for sovereignty issues.

### Request

```http
POST /api/sovereignty/scan-drive
```

## POST /api/sovereignty/import

Import files with sovereignty validation.

### Request

```http
POST /api/sovereignty/import
Content-Type: application/json

{
  "fileId": "file-123",
  "validate": true
}
```

## GET /api/sovereignty/history

Get sovereignty validation history.

### Request

```http
GET /api/sovereignty/history?limit=10
```

## POST /api/sovereignty/validate

Validate sovereignty configuration.

### Request

```http
POST /api/sovereignty/validate
Content-Type: application/json

{
  "config": {}
}
```

## Documentation

- [The Centaur](../centaur.md)
- [API Index](index.md)

💜 With love and light. As above, so below. 💜
