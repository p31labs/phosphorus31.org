# The Centaur - Wallet API

Wallet management and transactions.

## GET /api/wallet/balance

Get wallet balance.

### Request

```http
GET /api/wallet/balance
```

### Response

```json
{
  "balance": 12500,
  "currency": "LOVE",
  "address": "0x...",
  "network": "ethereum"
}
```

## POST /api/wallet/transfer

Transfer funds between wallets.

### Request

```http
POST /api/wallet/transfer
Content-Type: application/json

{
  "fromWalletId": "wallet-1",
  "toWalletId": "wallet-2",
  "amount": 100,
  "description": "Payment"
}
```

## Documentation

- [The Centaur](centaur.md)
- [API Index](index.md)

💜 With love and light. As above, so below. 💜
