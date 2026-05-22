# InaraVest Deployment Guide

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (https://vercel.com)
- GitHub repo linked

### Steps

1. **Connect GitHub**
   ```
   vercel login
   vercel link
   ```

2. **Set Environment Variables**
   ```
   In Vercel Dashboard → Settings → Environment Variables:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - VITE_SOLANA_NETWORK=mainnet-beta (for production)
   - VITE_PAYSTACK_PUBLIC_KEY
   ```

3. **Deploy**
   ```
   vercel deploy --prod
   ```

## Backend Deployment (Supabase)

### Database Setup

1. Create Supabase project
2. Run migrations from `docs/DATABASE.md`
3. Set up authentication providers
4. Create storage buckets for images

### Edge Functions

```bash
# Deploy functions
supabase functions deploy

# Functions location: server/functions/
```

## Solana Program Deployment

### Devnet Deployment

```bash
cd contracts

# Build
archor build

# Deploy to Devnet
archor deploy --provider.cluster devnet

# Update Anchor.toml with program ID
```

### Mainnet Deployment

1. **Audit**: Get security audit before mainnet
2. **Test**: Full testing on testnet
3. **Deploy**:
   ```bash
   archor deploy --provider.cluster mainnet-beta
   ```

## Environment Configuration

### Development (Devnet)
```env
VITE_SOLANA_NETWORK=devnet
VITE_SUPABASE_URL=https://your-project.supabase.co
```

### Production (Mainnet)
```env
VITE_SOLANA_NETWORK=mainnet-beta
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

## Monitoring & Maintenance

1. **Vercel**: Monitor builds and errors
2. **Supabase**: Check database performance
3. **Solana**: Monitor program health on-chain
4. **Analytics**: Track user metrics
