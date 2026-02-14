# The Centaur - Authentication API

Authentication and authorization endpoints for The Centaur.

## POST /api/auth/login

Login with username and password. Supports MFA.

### Request

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "password123"
}
```

### Response (Success)

```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "username": "user@example.com",
    "email": "user@example.com"
  }
}
```

### Response (MFA Required)

```json
{
  "success": false,
  "requiresMFA": true,
  "mfaToken": "mfa-token-here",
  "user": {
    "id": "user-id",
    "username": "user@example.com"
  }
}
```

### Response (Error)

```json
{
  "error": "Invalid credentials"
}
```

## POST /api/auth/mfa/complete

Complete MFA authentication after receiving MFA code.

### Request

```http
POST /api/auth/mfa/complete
Content-Type: application/json

{
  "mfaToken": "mfa-token-from-login",
  "mfaCode": "123456"
}
```

### Response

```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "username": "user@example.com"
  }
}
```

## POST /api/auth/mfa/setup

Setup MFA for a user account.

### Request

```http
POST /api/auth/mfa/setup
Content-Type: application/json

{
  "userId": "user-id"
}
```

### Response

```json
{
  "success": true,
  "secret": "MFA-secret-key",
  "qrCode": "data:image/png;base64,..."
}
```

## POST /api/auth/mfa/enable

Enable MFA after verification.

### Request

```http
POST /api/auth/mfa/enable
Content-Type: application/json

{
  "userId": "user-id",
  "mfaToken": "verification-token"
}
```

### Response

```json
{
  "success": true,
  "message": "MFA enabled successfully"
}
```

## POST /api/auth/mfa/disable

Disable MFA for a user account.

### Request

```http
POST /api/auth/mfa/disable
Content-Type: application/json

{
  "userId": "user-id"
}
```

### Response

```json
{
  "success": true,
  "message": "MFA disabled successfully"
}
```

## GET /api/auth/mfa/status/:userId

Get MFA status for a user.

### Request

```http
GET /api/auth/mfa/status/user-id
```

### Response

```json
{
  "enabled": true,
  "setupDate": "2026-02-13T12:00:00.000Z"
}
```

## POST /api/auth/register

Register a new user account.

### Request

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser@example.com",
  "password": "secure-password",
  "email": "newuser@example.com"
}
```

### Response

```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "username": "newuser@example.com",
    "email": "newuser@example.com"
  }
}
```

## GET /api/auth/me

Get current authenticated user information.

### Request

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Response

```json
{
  "id": "user-id",
  "username": "user@example.com",
  "email": "user@example.com",
  "mfaEnabled": true
}
```

## Usage Examples

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user@example.com","password":"password123"}'

# Complete MFA
curl -X POST http://localhost:3000/api/auth/mfa/complete \
  -H "Content-Type: application/json" \
  -d '{"mfaToken":"token","mfaCode":"123456"}'

# Get current user
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens expire after 24 hours (configurable)
- MFA uses TOTP (Time-based One-Time Password)
- Rate limiting applies to all auth endpoints

## Documentation

- [The Centaur](../centaur.md)
- [API Index](index.md)
