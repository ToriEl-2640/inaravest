# InaraVest Database Schema

## Supabase PostgreSQL Tables

### 1. users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  wallet_address TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  investment_preference TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_wallet ON users(wallet_address);
```

### 2. registries

```sql
CREATE TABLE registries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  occasion TEXT NOT NULL, -- 'wedding', 'graduation', 'baby', 'business', 'birthday', 'housewarming', 'other'
  goal_amount DECIMAL(15, 2) NOT NULL,
  current_amount DECIMAL(15, 2) DEFAULT 0,
  investment_type TEXT NOT NULL, -- 'stocks', 'savings', 'crypto', 'business'
  cover_image_url TEXT,
  solana_wallet TEXT NOT NULL,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'cancelled'
  is_public BOOLEAN DEFAULT TRUE,
  share_token TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

CREATE INDEX idx_registries_user_id ON registries(user_id);
CREATE INDEX idx_registries_status ON registries(status);
CREATE INDEX idx_registries_share_token ON registries(share_token);
```

### 3. contributions

```sql
CREATE TABLE contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registry_id UUID NOT NULL REFERENCES registries(id) ON DELETE CASCADE,
  contributor_wallet TEXT,
  contributor_name TEXT,
  amount DECIMAL(15, 2) NOT NULL,
  message TEXT,
  payment_method TEXT NOT NULL, -- 'solana_pay', 'paystack', 'flutterwave'
  transaction_hash TEXT UNIQUE,
  transaction_signature TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'failed'
  created_at TIMESTAMP DEFAULT NOW(),
  confirmed_at TIMESTAMP
);

CREATE INDEX idx_contributions_registry_id ON contributions(registry_id);
CREATE INDEX idx_contributions_status ON contributions(status);
CREATE INDEX idx_contributions_transaction_hash ON contributions(transaction_hash);
```

### 4. transactions

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registry_id UUID NOT NULL REFERENCES registries(id),
  contribution_id UUID REFERENCES contributions(id),
  transaction_type TEXT NOT NULL, -- 'contribution', 'withdrawal', 'fee'
  amount DECIMAL(15, 2) NOT NULL,
  fee_amount DECIMAL(15, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USDC',
  blockchain_tx_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'failed'
  created_at TIMESTAMP DEFAULT NOW(),
  confirmed_at TIMESTAMP
);

CREATE INDEX idx_transactions_registry_id ON transactions(registry_id);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
```

### 5. withdrawals

```sql
CREATE TABLE withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registry_id UUID NOT NULL REFERENCES registries(id),
  user_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(15, 2) NOT NULL,
  destination_wallet TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  blockchain_tx_id TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_withdrawals_registry_id ON withdrawals(registry_id);
CREATE INDEX idx_withdrawals_user_id ON withdrawals(user_id);
```

## Security: Row-Level Security (RLS)

### Users Table RLS

```sql
-- Users can only see their own data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);
```

### Registries Table RLS

```sql
ALTER TABLE registries ENABLE ROW LEVEL SECURITY;

-- Anyone can view public registries
CREATE POLICY "Anyone can view public registries"
  ON registries FOR SELECT
  USING (is_public = TRUE);

-- Users can view their own registries
CREATE POLICY "Users can view their own registries"
  ON registries FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- Only registry creator can update
CREATE POLICY "Users can update their own registries"
  ON registries FOR UPDATE
  USING (auth.uid()::text = user_id::text);
```

## Views

### Registry Statistics View

```sql
CREATE VIEW registry_stats AS
SELECT 
  r.id,
  r.title,
  r.goal_amount,
  r.current_amount,
  COUNT(c.id) as contributor_count,
  AVG(c.amount) as avg_contribution,
  r.created_at,
  r.updated_at
FROM registries r
LEFT JOIN contributions c ON r.id = c.registry_id AND c.status = 'confirmed'
GROUP BY r.id;
```

## Migration Strategy

1. Start with basic tables (users, registries, contributions)
2. Add transactions table when payment flow implemented
3. Add withdrawals table when cash-out feature added
4. Create views and RLS policies incrementally
