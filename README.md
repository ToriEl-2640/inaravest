# InaraVest

> **Celebrate today. Invest for tomorrow.**

A Solana-powered investment gifting platform that transforms celebrations into wealth-building opportunities.

## What is InaraVest?

InaraVest reimagines gift-giving for life's biggest milestones. Instead of wishlists for physical products, users create a registry tied to a real financial goal — and friends, family, or community members contribute money that goes directly into an investment vehicle of the creator's choice.

### How It Works

1. **Create Registry**: Select occasion, set goal, choose investment type
2. **Share Link**: Get a shareable registry link
3. **Receive Gifts**: Friends contribute via Solana Pay QR codes
4. **Invest & Grow**: Funds automatically route to investment platform

### Target Market

- **Primary**: Nigerians aged 22–45 in urban centres
- **Secondary**: West African diaspora and emerging markets
- **Use Case**: Weddings, graduations, baby arrivals, business launches, naming ceremonies, birthdays

## Core Value Proposition

InaraVest redirects money that is **already being spent on gifts** into **productive financial instruments**. It doesn't ask people to give more; it asks them to **give smarter**.

---

## MVP Features (Phase 1)

### Authentication
- Email signup/login
- Wallet connect
- Google auth (Phase 2)

### Registry Creation
- Choose occasion
- Add title & description
- Set funding goal
- Select investment type
- Upload cover image

### Public Registry Page
- Goal amount & progress bar
- Contributors list
- Share button
- Solana Pay payment option

### Contributions
- Preset amounts
- Custom amounts
- Wallet payments (Solana Pay)
- Fiat payment gateway (Paystack/Flutterwave)

### Dashboard
- Track registries
- View contributions
- Withdraw/invest funds
- Manage profile

---

## Tech Stack

### Frontend
- **React** + Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Solana Wallet Adapter** for wallet integration

### Backend
- **Supabase** (Auth, Database, Storage)
- **Edge Functions** for serverless logic

### Blockchain
- **Solana Network** (Devnet → Mainnet Beta)
- **Solana Pay** for QR code payments
- **USDC & SPL Tokens**
- **Anchor Framework** for Solana Programs

### Payments
- **Solana Pay** (primary)
- **Paystack** / **Flutterwave** (fiat fallback)

### Deployment
- **Vercel** (frontend)
- **Supabase Cloud** (backend)

---

## Project Structure

```
inaravest/
│
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── layouts/           # Layout wrappers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions
│   │   ├── context/           # Context API providers
│   │   ├── assets/            # Images, icons, fonts
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/                    # Supabase Edge Functions & API
│   ├── functions/
│   ├── migrations/
│   └── package.json
│
├── contracts/                 # Solana Programs (Rust/Anchor)
│   ├── programs/
│   ├── tests/
│   ├── Cargo.toml
│   └── Anchor.toml
│
├── docs/                      # Documentation
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   └── DEPLOYMENT.md
│
├── SOLANA_GRANT_ALIGNMENT.md  # Solana Foundation Grant Strategy
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## Core Pages

### Public Pages
- `/` - Homepage
- `/about` - About page
- `/explore` - Browse registries
- `/registry/:id` - Public registry view

### Authenticated Pages
- `/dashboard` - User dashboard
- `/create-registry` - Create new registry
- `/settings` - Profile settings
- `/wallet` - Wallet management

---

## Database Schema (Supabase/PostgreSQL)

### users
```sql
id (UUID, PK)
full_name (TEXT)
email (TEXT, UNIQUE)
wallet_address (TEXT)
avatar_url (TEXT)
created_at (TIMESTAMP)
```

### registries
```sql
id (UUID, PK)
user_id (UUID, FK → users.id)
title (TEXT)
description (TEXT)
occasion (TEXT)
goal_amount (DECIMAL)
current_amount (DECIMAL)
investment_type (TEXT) -- 'stocks', 'savings', 'crypto', 'business'
cover_image (TEXT)
solana_wallet (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### contributions
```sql
id (UUID, PK)
registry_id (UUID, FK → registries.id)
contributor_name (TEXT)
amount (DECIMAL)
message (TEXT)
payment_method (TEXT) -- 'solana_pay', 'paystack', 'flutterwave'
transaction_hash (TEXT)
created_at (TIMESTAMP)
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Git
- Rust & Cargo (for Solana contracts)
- Solana CLI

### Quick Start

```bash
# Clone repository
git clone https://github.com/ToriEl-2640/inaravest.git
cd inaravest

# Frontend setup
cd client
npm install
npm run dev

# In another terminal, Solana program setup
cd contracts
archor build
archor test
```

### Environment Variables

Create `.env` in project root:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Solana
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com

# Payments
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_key
FLUTTERWAVE_SECRET=your_flutterwave_key
```

---

## Solana Integration

### Required Packages

```bash
npm install @solana/web3.js
npm install @solana/wallet-adapter-react
npm install @solana/wallet-adapter-react-ui
npm install @solana/wallet-adapter-wallets
npm install @solana/pay
```

### Solana Program (Anchor)

```bash
archor init contracts
cd contracts
archor add idl
```

---

## Development Roadmap

### Week 1: Foundation
- [ ] Project setup & routing
- [ ] Tailwind configuration
- [ ] Homepage UI
- [ ] Component library

### Week 2: Authentication & Registry
- [ ] Email auth (Supabase)
- [ ] Registry creation form
- [ ] Supabase integration
- [ ] File upload (cover images)

### Week 3: Public & Contributions
- [ ] Public registry pages
- [ ] Contribution flow
- [ ] Progress tracking
- [ ] Share functionality

### Week 4: Solana & Deployment
- [ ] Solana Pay integration
- [ ] Wallet connection
- [ ] Mainnet deployment
- [ ] Testing & optimization

---

## Solana Foundation Grant

This project aligns with the **Solana Foundation Grant Program** across three pillars:

1. **Payments**: Solana Pay-powered P2P gifting
2. **Financial Inclusion**: First-time investor onboarding for emerging markets
3. **Developer Tooling**: Open-source registry contract & SDKs

See **[SOLANA_GRANT_ALIGNMENT.md](./SOLANA_GRANT_ALIGNMENT.md)** for full grant strategy.

---

## Revenue Model

- **1.5% transaction fee** on every gift processed
- **₦2,500/month premium tier** with analytics & custom branding
- **Revenue-share partnerships** with fintech platforms
- **Anonymized data insights** sold to financial institutions

---

## Impact Goals (Year 3)

- **45,000 registries** created
- **₦22.5 billion** pooled and invested
- **150,000 first-time investors** onboarded
- **Reduced financial exclusion** in emerging markets

---

## Brand Direction

**Design Style**
- Clean fintech aesthetic
- Warm African celebration visuals
- Rounded cards & soft shadows
- Gold + emerald accent palette
- Minimal but emotional

**Inspiration**: Risevest, Bamboo, Airbnb, Apple Wallet, Cowrywise

---

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - see LICENSE file for details

---

## Contact & Support

- **GitHub**: [@ToriEl-2640](https://github.com/ToriEl-2640)
- **Email**: Get in touch via GitHub
- **Twitter**: Updates on project progress

---

**The future of gifting is investment. 🎉💰**
