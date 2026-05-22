# InaraVest: GitHub Codespaces Quick Start Guide

This guide will get you to a **fully working MVP app** in GitHub Codespaces in ~30 minutes.

---

## Step 1: Open in Codespaces

1. Go to your repo: https://github.com/ToriEl-2640/inaravest
2. Click **Code** → **Codespaces** → **Create codespace on main**
3. Wait for environment to load (2-3 minutes)

---

## Step 2: Initialize Project Structure

Once in Codespaces terminal, run:

```bash
# Navigate to repo root
cd /workspaces/inaravest

# Create frontend
npm create vite@latest client -- --template react

# When prompted, press 'y' and select 'react'
```

---

## Step 3: Install Frontend Dependencies

```bash
cd client

# Install all required packages
npm install

# Install Tailwind + Solana packages
npm install -D tailwindcss postcss autoprefixer
npm install -D @tailwindcss/vite
npm install react-router-dom
npm install @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/pay
npm install axios react-hot-toast lucide-react
npm install @supabase/supabase-js
```

---

## Step 4: Configure Tailwind

Update **client/vite.config.js**:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Update **client/src/index.css** (create if doesn't exist):

```css
@import "tailwindcss";
```

---

## Step 5: Create Core Component Structure

Create folder structure in **client/src/**:

```bash
mkdir -p src/{components,pages,hooks,context,lib,assets}
touch src/{components,pages,hooks,context,lib}/.gitkeep
```

---

## Step 6: Create Essential Components

### **client/src/components/Navbar.jsx**

```jsx
import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';

export default function Navbar() {
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
            <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              <Wallet size={18} />
              <span>Connect Wallet</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

### **client/src/components/Hero.jsx**

```jsx
import { ArrowRight, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Gift className="w-6 h-6 text-emerald-600" />
              <span className="text-emerald-600 font-semibold">Investment Gifting Platform</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Celebrate Today.
              <span className="block text-emerald-600">Invest for Tomorrow.</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              Transform celebrations into wealth-building opportunities. Create registries, 
              receive gifts, and grow your investments together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/create-registry"
                className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition"
              >
                Create Registry
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/explore"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition"
              >
                Explore Registries
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16">
              <div>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <p className="text-gray-600">Registries Created</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <p className="text-gray-600">Invested</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <p className="text-gray-600">Investors</p>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl p-12 flex items-center justify-center min-h-96">
            <div className="text-center">
              <Gift className="w-32 h-32 text-emerald-600 mx-auto mb-4 opacity-50" />
              <p className="text-gray-600 font-semibold">Visual Preview</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### **client/src/components/RegistryCard.jsx**

```jsx
import { TrendingUp, Users, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RegistryCard({ registry }) {
  const progress = (registry.current_amount / registry.goal_amount) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
      {/* Cover Image */}
      <div className="h-40 bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="w-16 h-16 text-white mx-auto mb-2 opacity-80" />
          <p className="text-white font-semibold">{registry.investment_type}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{registry.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{registry.description}</p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">
              ₦{registry.current_amount?.toLocaleString()} / ₦{registry.goal_amount?.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-emerald-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-emerald-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-1">
            <Users size={16} />
            <span>{registry.contributors || 0} contributors</span>
          </div>
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">
            {registry.occasion}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/registry/${registry.id}`}
            className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition text-center font-semibold"
          >
            View
          </Link>
          <button className="flex-1 border-2 border-emerald-600 text-emerald-600 py-2 rounded-lg hover:bg-emerald-50 transition flex items-center justify-center">
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
```

### **client/src/components/Footer.jsx**

```jsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4">InaraVest</h3>
            <p className="text-sm">The future of gifting is investment.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Create Registry</a></li>
              <li><a href="#" className="hover:text-white">Explore</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Privacy</a></li>
              <li><a href="#" className="hover:text-white">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; 2026 InaraVest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
```

---

## Step 7: Create Page Components

### **client/src/pages/HomePage.jsx**

```jsx
import Hero from '../components/Hero';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div>
      <Hero />
      
      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '1', title: 'Create Registry', desc: 'Choose occasion, set goal, select investment type' },
              { num: '2', title: 'Share Link', desc: 'Send shareable link to friends and family' },
              { num: '3', title: 'Receive Gifts', desc: 'Friends contribute via Solana Pay' },
              { num: '4', title: 'Invest & Grow', desc: 'Funds automatically invested in your choice' }
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Occasions</h2>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {['Wedding', 'Graduation', 'Baby Arrival', 'Business Launch', 'Birthday'].map((occasion) => (
              <button key={occasion} className="p-6 bg-white rounded-lg hover:shadow-lg transition text-center font-semibold text-gray-900">
                {occasion}
              </button>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
```

### **client/src/pages/ExplorePage.jsx**

```jsx
import { useState } from 'react';
import RegistryCard from '../components/RegistryCard';
import Footer from '../components/Footer';

export default function ExplorePage() {
  // Mock data for demonstration
  const [registries] = useState([
    {
      id: '1',
      title: 'Tunde & Toyin Wedding',
      description: 'Help us invest for our future together',
      goal_amount: 500000,
      current_amount: 250000,
      investment_type: 'stocks',
      occasion: 'wedding',
      contributors: 15
    },
    {
      id: '2',
      title: 'Chioma Graduation Fund',
      description: 'First-class degree investment',
      goal_amount: 200000,
      current_amount: 180000,
      investment_type: 'savings',
      occasion: 'graduation',
      contributors: 8
    },
    {
      id: '3',
      title: 'Baby Arrival - Tech Fund',
      description: 'Building tech skills for our baby',
      goal_amount: 150000,
      current_amount: 45000,
      investment_type: 'crypto',
      occasion: 'baby',
      contributors: 22
    }
  ]);

  return (
    <div>
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Explore Registries</h1>
          <p className="text-xl opacity-90">Discover investment opportunities from celebrations across Nigeria</p>
        </div>
      </div>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {registries.map((registry) => (
              <RegistryCard key={registry.id} registry={registry} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
```

### **client/src/pages/CreateRegistryPage.jsx**

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

export default function CreateRegistryPage() {
  const navigate = useNavigate();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to Supabase
    console.log('Form data:', formData);
    alert('Registry created! (Demo mode)');
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
              className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition"
            >
              Create Registry
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

## Step 8: Create App Router

### **client/src/App.jsx**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import CreateRegistryPage from './pages/CreateRegistryPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/create-registry" element={<CreateRegistryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### **client/src/main.jsx**

Update to include Tailwind import:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### **client/index.html**

Make sure it has the root div:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>InaraVest - Investment Gifting Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## Step 9: Run the Development Server

```bash
# From client/ directory
npm run dev
```

You'll see:
```
VITE v5.0.0  ready in 123 ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

---

## Step 10: Open in Browser

In Codespaces, you'll get a notification to **Open in Browser** or:

1. Click the **Ports** tab at bottom
2. See `5173` listed
3. Click the globe icon to open

You now have a **fully functional MVP** with:
- ✅ Homepage with hero section
- ✅ Navbar with navigation
- ✅ Explore registries page
- ✅ Create registry form
- ✅ Registry cards with progress tracking
- ✅ Responsive Tailwind design
- ✅ Clean, professional UI

---

## Next Steps After MVP Works

### Phase 2: Connect Backend
```bash
# Install Supabase client
npm install @supabase/supabase-js

# Create services/supabaseClient.js
```

### Phase 3: Add Solana Integration
```bash
# Already installed, now integrate wallet connection
# Update components/WalletButton.jsx
```

### Phase 4: Deploy to Vercel
```bash
# From Codespaces
npm install -g vercel
vercel
```

---

## Troubleshooting

**If `npm run dev` fails:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**If port 5173 is busy:**
```bash
npm run dev -- --port 3000
```

**If Tailwind not loading:**
```bash
# Restart dev server
# Ctrl+C, then npm run dev again
```

---

## Your App is Live! 🎉

You now have a working InaraVest MVP in Codespaces with:
- Beautiful UI
- Smooth routing
- Mock data
- Ready for backend integration

Next: Connect Supabase for real data persistence!

