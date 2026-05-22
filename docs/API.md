# InaraVest API Documentation

## Authentication

All authenticated endpoints require a Supabase JWT token in the Authorization header:

```
Authorization: Bearer <supabase_jwt_token>
```

## Registries API

### GET /registries

Fetch all public registries (paginated)

```
GET /registries?page=1&limit=20

Response:
{
  "data": [
    {
      "id": "uuid",
      "title": "Wedding Registry",
      "goal_amount": 5000,
      "current_amount": 2500,
      "contributor_count": 15,
      "occasion": "wedding"
    }
  ],
  "total": 100
}
```

### GET /registries/:id

Fetch single registry by ID

```
GET /registries/uuid

Response:
{
  "id": "uuid",
  "title": "Wedding Registry",
  "description": "...",
  "goal_amount": 5000,
  "current_amount": 2500,
  "investment_type": "stocks",
  "occasion": "wedding",
  "contributors": [...],
  "progress_percentage": 50
}
```

### POST /registries (Authenticated)

Create new registry

```
POST /registries
Content-Type: application/json

{
  "title": "Wedding Registry",
  "description": "Investing for our wedding",
  "goal_amount": 5000,
  "investment_type": "stocks",
  "occasion": "wedding"
}

Response:
{
  "id": "uuid",
  "share_url": "https://inaravest.com/registry/uuid"
}
```

## Contributions API

### POST /contributions

Create contribution

```
POST /contributions

{
  "registry_id": "uuid",
  "amount": 100,
  "contributor_name": "John Doe",
  "message": "Congrats!",
  "payment_method": "solana_pay"
}

Response:
{
  "id": "uuid",
  "status": "pending",
  "solana_pay_qr": "data:image/png;base64,..."
}
```

### GET /contributions/:registry_id

Get contributions for registry

```
GET /contributions/uuid

Response:
{
  "data": [
    {
      "id": "uuid",
      "contributor_name": "John Doe",
      "amount": 100,
      "message": "Congrats!",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## Wallet API

### GET /wallet/balance (Authenticated)

Get wallet balance

```
GET /wallet/balance

Response:
{
  "wallet_address": "...",
  "usdc_balance": 1000.50,
  "sol_balance": 5.25
}
```

### POST /wallet/withdraw (Authenticated)

Withdraw funds

```
POST /wallet/withdraw

{
  "registry_id": "uuid",
  "amount": 500,
  "destination_wallet": "..."
}

Response:
{
  "transaction_id": "uuid",
  "status": "processing",
  "blockchain_tx": "..."
}
```

## Error Responses

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid registry ID"
  }
}
```

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per authenticated user
