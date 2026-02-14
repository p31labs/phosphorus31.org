# The Centaur - Blockchain API

Blockchain operations and smart contract management.

## POST /api/blockchain/deploy

Deploy a smart contract.

### Request

```http
POST /api/blockchain/deploy
Content-Type: application/json

{
  "contractName": "P31Token",
  "network": "ethereum",
  "parameters": {}
}
```

### Response

```json
{
  "success": true,
  "contractAddress": "0x...",
  "transactionHash": "0x...",
  "deployedAt": "2026-02-13T12:00:00.000Z"
}
```

## GET /api/blockchain/status

Get blockchain network status.

### Request

```http
GET /api/blockchain/status
```

### Response

```json
{
  "network": "ethereum",
  "status": "connected",
  "blockNumber": 12345678,
  "gasPrice": "20000000000"
}
```

## Documentation

- [The Centaur](centaur.md)
- [API Index](index.md)

💜 With love and light. As above, so below. 💜
