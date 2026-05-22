# InaraVest Architecture

## System Overview

InaraVest is a decentralized investment gifting platform composed of:

1. **Frontend** (React/Vite)
2. **Backend** (Supabase)
3. **Blockchain** (Solana Smart Contracts)
4. **Payment Layer** (Solana Pay + Fiat Gateway)

## Component Breakdown

### Frontend Architecture

```
Client (React)
  ├── Pages
  │   ├── HomePage
  │   ├── RegistryPage
  │   ├── DashboardPage
  │   └── CreateRegistryPage
  ├── Components
  │   ├── Navbar
  │   ├── RegistryCard
  │   ├── ContributionModal
  │   └── WalletButton
  ├── Hooks
  │   ├── useRegistry
  │   ├── useWallet
  │   └── useContributions
  ├── Context
  │   ├── AuthContext
  │   ├── WalletContext
  │   └── RegistryContext
  └── Services
      ├── supabaseClient.js
      ├── solanaService.js
      └── paymentService.js
```

### Backend Architecture

**Supabase Stack:**
- PostgreSQL Database
- Supabase Auth
- Storage Bucket (cover images)
- Edge Functions (serverless logic)

**Tables:**
- `users` - User profiles & wallet info
- `registries` - Registry metadata
- `contributions` - Contribution records
- `transactions` - Payment tracking

### Blockchain Architecture

**Solana Program (Rust/Anchor):**

```
Registry Program
├── Instructions
│   ├── create_registry
│   ├── add_contribution
│   ├── withdraw_funds
│   └── close_registry
├── State
│   ├── Registry Account
│   ├── Contribution Account
│   └── Registry Vault (for USDC)
└── Events
    ├── RegistryCreated
    ├── ContributionAdded
    └── FundsWithdrawn
```

## Data Flow

### Registry Creation Flow

```
1. User creates registry on frontend
   ↓
2. Data stored in Supabase (registries table)
   ↓
3. Solana Program creates on-chain Registry account
   ↓
4. Registry ID linked in Supabase
   ↓
5. Share link generated
```

### Contribution Flow

```
1. Contributor opens public registry link
   ↓
2. Enters amount & wallet connects
   ↓
3. Solana Pay QR displayed
   ↓
4. Contributor scans & confirms USDC transfer
   ↓
5. Transaction recorded on-chain
   ↓
6. Contribution added to Supabase
   ↓
7. Registry progress updated in real-time
```

## Security Considerations

1. **Wallet Security**: Solana Wallet Adapter handles key management
2. **Smart Contract Auditing**: Registry program reviewed before mainnet
3. **Database Access**: Row-level security (RLS) on Supabase
4. **Transaction Verification**: All on-chain transactions verified
5. **Rate Limiting**: Edge functions protected against abuse

## Performance Optimization

1. **Frontend**: Vite bundling, code splitting, lazy loading
2. **Database**: Indexed queries, pagination
3. **Blockchain**: Batch transaction processing
4. **Caching**: Redis for frequently accessed data (Phase 2)

## Scalability Plan

**Phase 1 (MVP):**
- Single Solana program on Devnet
- Centralized database
- Direct P2P payments

**Phase 2:**
- Program audit & Mainnet deployment
- Multi-program architecture for different investment types
- Caching layer added

**Phase 3:**
- DAO governance for protocol
- Cross-chain bridging
- Automated yield optimization
