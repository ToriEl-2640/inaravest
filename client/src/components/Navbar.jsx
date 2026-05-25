import { Link } from 'react-router-dom';
import { LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, signOut, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
            <Link to="/explore" className="text-gray-600 hover:text-emerald-600 transition">
              Explore
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-emerald-600 transition">
              About
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 bg-emerald-100 rounded-full animate-pulse"></div>
            ) : user ? (
              <>
                <span className="text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
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