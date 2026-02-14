# The Centaur - System API

System metrics, monitoring, and management.

## GET /api/system/metrics

Get system performance metrics.

### Request

```http
GET /api/system/metrics
```

### Response

```json
{
  "cpuUsage": 45.2,
  "memoryUsage": 62.8,
  "responseTime": 125,
  "requestsPerMinute": 120,
  "errorRate": 0.02
}
```

## GET /api/system/security

Get security status.

### Request

```http
GET /api/system/security
```

### Response

```json
{
  "status": "secure",
  "threats": [],
  "lastScan": "2026-02-13T12:00:00.000Z"
}
```

## POST /api/system/security/scan

Run security scan.

### Request

```http
POST /api/system/security/scan
```

## GET /api/system/backup

Get backup status.

### Request

```http
GET /api/system/backup
```

## POST /api/system/backup/create

Create backup.

### Request

```http
POST /api/system/backup/create
```

## Documentation

- [The Centaur](centaur.md)
- [Monitoring Guide](../monitoring.md)
- [API Index](index.md)

💜 With love and light. As above, so below. 💜
