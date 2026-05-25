# InaraVest: Supabase Backend Setup Guide

Complete guide to connect your app to a real database with authentication.

---

## ✅ Step 1: Create Supabase Project

1. Go to **https://supabase.com**
2. Click **Sign Up** (use your GitHub account)
3. Click **New Project**
4. Fill in:
   - **Project Name**: `inaravest`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you (e.g., `us-east-1`)
5. Click **Create new project**
6. Wait 2-3 minutes for setup

---

## ✅ Step 2: Get Your API Keys

Once project is ready:

1. Go to **Settings** (bottom left) → **API**
2. Copy these two keys:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

3. Save them somewhere safe (you'll need them)

---

## ✅ Step 3: Create Database Tables

Go to **SQL Editor** (left sidebar) and run this SQL:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  wallet_address TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create registries table
CREATE TABLE registries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  occasion TEXT NOT NULL,
  goal_amount DECIMAL(15, 2) NOT NULL,
  current_amount DECIMAL(15, 2) DEFAULT 0,
  investment_type TEXT NOT NULL,
  cover_image_url TEXT,
  solana_wallet TEXT,
  status TEXT DEFAULT 'active',
  is_public BOOLEAN DEFAULT TRUE,
  share_token TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create contributions table
CREATE TABLE contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registry_id UUID NOT NULL REFERENCES registries(id) ON DELETE CASCADE,
  contributor_wallet TEXT,
  contributor_name TEXT,
  amount DECIMAL(15, 2) NOT NULL,
  message TEXT,
  payment_method TEXT NOT NULL,
  transaction_hash TEXT UNIQUE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_registries_user_id ON registries(user_id);
CREATE INDEX idx_registries_status ON registries(status);
CREATE INDEX idx_contributions_registry_id ON contributions(registry_id);
CREATE INDEX idx_contributions_status ON contributions(status);
```

Click **Run** button (or Ctrl+Enter).

---

## ✅ Step 4: Enable Row Level Security (RLS)

This protects user data. In **SQL Editor**, run:

```sql
-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE registries ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- Allow public to view public registries
CREATE POLICY "Public registries are viewable by everyone"
  ON registries FOR SELECT
  USING (is_public = TRUE);

-- Users can only see their own registries
CREATE POLICY "Users can see their own registries"
  ON registries FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create registries
CREATE POLICY "Users can create registries"
  ON registries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own registries
CREATE POLICY "Users can update their own registries"
  ON registries FOR UPDATE
  USING (auth.uid() = user_id);
```

Click **Run**.

---

## ✅ Step 5: Enable Email Authentication

1. Go to **Authentication** (left sidebar)
2. Click **Providers**
3. Enable **Email** (should be on by default)
4. Click **Email** settings and verify it's enabled

---

## ✅ Step 6: Add Environment Variables to Your App

In your **Codespaces terminal** (in `client/` directory):

```bash
# Create .env file
touch .env
```

Add this content to **client/.env**:

```env
VITE_SUPABASE_URL=YOUR_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
VITE_SOLANA_NETWORK=devnet
```

Replace:
- `YOUR_PROJECT_URL` with your Supabase URL
- `YOUR_ANON_KEY` with your anon public key

---

## ✅ Step 7: Create Supabase Service File

Create **client/src/lib/supabaseClient.js**:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## ✅ Step 8: Create Authentication Context

Create **client/src/context/AuthContext.jsx**:

```jsx
import { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
  }, []);

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## ✅ Step 9: Create Custom Auth Hook

Create **client/src/hooks/useAuth.js**:

```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## ✅ Step 10: Update App.jsx with Auth Provider

Replace **client/src/App.jsx** with:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import CreateRegistryPage from './pages/CreateRegistryPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/create-registry" element={<CreateRegistryPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

---

## ✅ Step 11: Update Navbar with Auth

Replace **client/src/components/Navbar.jsx** with:

```jsx
import { Link } from 'react-router-dom';
import { Wallet, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">IV</span>
            </div>
            <span className="text-xl font-bold text-gray-900">InaraVest</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/explore" className="text-gray-600 hover:text-emerald-600">
              Explore
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-emerald-600">
              About
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
```

---

## ✅ Step 12: Create Login Page

Create **client/src/pages/LoginPage.jsx**:

```jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        toast.success('Sign up successful! Check your email.');
      } else {
        await signIn(email, password);
        toast.success('Logged in successfully!');
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            {isSignUp ? 'Create Account' : 'Login'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-gray-900 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-900 font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Login'}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-gray-600 mt-4">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-emerald-600 font-semibold hover:underline"
            >
              {isSignUp ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## ✅ Step 13: Add Login Route to App.jsx

Update **client/src/App.jsx** Routes:

```jsx
import LoginPage from './pages/LoginPage';

// Add this route:
<Route path="/login" element={<LoginPage />} />
```

---

## ✅ Step 14: Update Create Registry to Save to Database

Replace **client/src/pages/CreateRegistryPage.jsx** with:

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';

export default function CreateRegistryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    occasion: '',
    goal_amount: '',
    investment_type: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      // Insert into database
      const { data, error } = await supabase
        .from('registries')
        .insert([
          {
            user_id: user.id,
            title: formData.title,
            description: formData.description,
            occasion: formData.occasion,
            goal_amount: parseFloat(formData.goal_amount),
            investment_type: formData.investment_type,
            is_public: true,
            status: 'active'
          }
        ])
        .select();

      if (error) throw error;

      toast.success('Registry created successfully!');
      navigate(`/registry/${data[0].id}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Create Your Registry</h1>
          <p className="text-lg opacity-90">Start your investment journey</p>
        </div>
      </div>

      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
            {/* Title */}
            <div className="mb-6">
              <label className="block text-gray-900 font-semibold mb-2">Registry Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Our Dream Wedding"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-gray-900 font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell your story..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
              ></textarea>
            </div>

            {/* Occasion */}
            <div className="mb-6">
              <label className="block text-gray-900 font-semibold mb-2">Occasion</label>
              <select
                name="occasion"
                value={formData.occasion}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                required
              >
                <option value="">Select occasion</option>
                <option value="wedding">Wedding</option>
                <option value="graduation">Graduation</option>
                <option value="baby">Baby Arrival</option>
                <option value="business">Business Launch</option>
                <option value="birthday">Birthday</option>
              </select>
            </div>

            {/* Goal Amount */}
            <div className="mb-6">
              <label className="block text-gray-900 font-semibold mb-2">Goal Amount (₦)</label>
              <input
                type="number"
                name="goal_amount"
                value={formData.goal_amount}
                onChange={handleChange}
                placeholder="e.g., 500000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                required
              />
            </div>

            {/* Investment Type */}
            <div className="mb-8">
              <label className="block text-gray-900 font-semibold mb-2">Investment Type</label>
              <select
                name="investment_type"
                value={formData.investment_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                required
              >
                <option value="">Select investment type</option>
                <option value="stocks">Stocks & ETFs</option>
                <option value="savings">High-Yield Savings</option>
                <option value="crypto">Cryptocurrency</option>
                <option value="business">Business Capital</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Registry'}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
```

---

## ✅ Step 15: TROUBLESHOOTING - Dev Server Won't Start

**Run these commands in order in your Codespaces terminal:**

```bash
# Navigate to client folder
cd /workspaces/inaravest/client

# Kill any existing processes
pkill -f "vite\|npm"

# Wait 2 seconds
sleep 2

# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock
rm -rf node_modules package-lock.json

# Reinstall everything
npm install

# Start dev server
npm run dev
```

**If still not working:**

```bash
# Try on a different port
npm run dev -- --port 3000
```

**If you see errors, share the error message and I'll help!**

---

## ✅ Step 15b: Once Dev Server is Running

Once you see:
```
➜  Local:   http://localhost:5173/
```

Click the **Ports** tab at the bottom of Codespaces, find port **5173**, and click the globe icon 🌐

---

## ✅ Step 16: Test Your Backend

1. **Homepage** should load
2. Click **Login** button
3. **Sign up** with email/password
4. **Create a registry**
5. Check Supabase **Data Editor** → `registries` table
6. Your data should appear!

---

## ✅ Step 17: Deploy to Vercel

Once everything works locally:

```bash
# From client/ directory
vercel --prod
```

---

## 🎉 Your App Now Has:

- ✅ Real database (Supabase PostgreSQL)
- ✅ User authentication
- ✅ Registries that persist
- ✅ Login/signup forms
- ✅ Protected pages
- ✅ Real data storage
- ✅ Live on Vercel

---

## 🚀 Next Steps

1. **Test everything** - Create account, create registry
2. **Fix any bugs** - Let me know if something breaks
3. **Add Solana** - Wallet integration + payments
4. **Deploy** - Share with others

**Let me know once Step 15 works!** 🚀
