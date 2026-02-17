# The Centaur - Google Drive API

Google Drive integration for file management and synchronization.

## GET /api/google-drive/auth

Get Google Drive authentication URL.

### Request

```http
GET /api/google-drive/auth
```

### Response

```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/auth?...",
  "state": "auth-state-token"
}
```

## POST /api/google-drive/callback

Handle Google Drive OAuth callback.

### Request

```http
POST /api/google-drive/callback
Content-Type: application/json

{
  "code": "oauth-code",
  "state": "auth-state-token"
}
```

## GET /api/google-drive/status

Get Google Drive connection status.

### Request

```http
GET /api/google-drive/status
```

### Response

```json
{
  "connected": true,
  "email": "user@example.com",
  "quota": {
    "used": 1024000000,
    "total": 15000000000
  }
}
```

## GET /api/google-drive/files

List files in Google Drive.

### Request

```http
GET /api/google-drive/files?folderId=folder-123
```

### Response

```json
{
  "files": [
    {
      "id": "file-123",
      "name": "document.pdf",
      "mimeType": "application/pdf",
      "size": 1024000
    }
  ]
}
```

## POST /api/google-drive/import

Import file from Google Drive.

### Request

```http
POST /api/google-drive/import
Content-Type: application/json

{
  "fileId": "file-123",
  "destination": "local-path"
}
```

## POST /api/google-drive/disconnect

Disconnect Google Drive.

### Request

```http
POST /api/google-drive/disconnect
```

## Documentation

- [The Centaur](../centaur.md)
- [API Index](index.md)

💜 With love and light. As above, so below. 💜
