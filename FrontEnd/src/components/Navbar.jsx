import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useContexts';
import { useToast } from '../hooks/useToast';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { success } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    logout();
    success('Logged out successfully');
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <nav className="bg-gradient-to-r from-[#1B4965] to-[#003366] shadow-lg border-b-4 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center font-bold text-[#1B4965] text-lg group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#D4AF37]/50 transition-all duration-300">Q</div>
              <span className="text-white font-bold text-xl hidden sm:inline group-hover:text-[#D4AF37] transition-colors duration-300">Smart Queue</span>
            </Link>
            <div className="flex gap-4">
              <Link to="/login" className="px-4 py-2 text-white hover:text-[#D4AF37] hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95">Login</Link>
              <Link to="/register" className="px-4 py-2 bg-[#D4AF37] text-[#1B4965] hover:bg-[#F4D03F] rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/50 active:scale-95">Register</Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-[#003366] to-[#1B4965] shadow-lg border-b-4 border-[#D4AF37]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center font-bold text-[#1B4965] text-lg group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#D4AF37]/50 transition-all duration-300">Q</div>
            <span className="text-white font-bold text-xl hidden sm:inline group-hover:text-[#D4AF37] transition-colors duration-300">Smart Queue</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user?.is_admin ? (
              <>
                <Link to="/admin" className="text-white hover:text-[#D4AF37] px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 relative group">
                  🏦 Admin Panel
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-400 to-violet-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link to="/map" className="text-white hover:text-violet-300 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-violet-700/30 relative group">
                  Map
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-400 to-violet-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="text-white hover:text-violet-300 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-violet-700/30 relative group">
                  👤 User Panel
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-400 to-violet-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link to="/map" className="text-white hover:text-violet-300 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-violet-700/30 relative group">
                  Map
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-400 to-violet-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link to="/queue-status" className="text-white hover:text-violet-300 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-violet-700/30 relative group">
                  Queue
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-400 to-violet-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link to="/alerts" className="text-white hover:text-violet-300 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-violet-700/30 relative group">
                  Alerts
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-400 to-violet-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="relative group hidden sm:block">
              <button className="flex items-center gap-2 text-white hover:text-violet-300 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-violet-700/30 group-hover:bg-violet-700/30">
                <div className="w-8 h-8 bg-violet-400 rounded-full flex items-center justify-center text-violet-900 font-semibold group-hover:scale-110 transition-transform duration-300">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm">{user?.name}</span>
                <span className="text-xs group-hover:rotate-180 transition-transform duration-300">▼</span>
              </button>
              <div className="absolute right-0 mt-0 w-48 bg-gray-900 rounded-lg shadow-2xl shadow-violet-600/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-violet-900 overflow-hidden animate-slideDown">
                <Link to="/profile" className="block px-4 py-3 text-gray-300 hover:bg-violet-900/40 hover:text-violet-300 transition-all duration-300 border-b border-violet-900/50">👤 Profile</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all duration-300">🚪 Logout</button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white hover:text-violet-300 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-violet-700/30 active:scale-95"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-violet-700 animate-slideDown">
            {user?.is_admin ? (
              <>
                <Link to="/admin" className="block text-white hover:text-violet-300 hover:bg-violet-700/30 px-4 py-2 rounded transition-all duration-300">Admin Dashboard</Link>
                <Link to="/map" className="block text-white hover:text-violet-300 hover:bg-violet-700/30 px-4 py-2 rounded transition-all duration-300">Map</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="block text-white hover:text-violet-300 hover:bg-violet-700/30 px-4 py-2 rounded transition-all duration-300">Dashboard</Link>
                <Link to="/map" className="block text-white hover:text-violet-300 hover:bg-violet-700/30 px-4 py-2 rounded transition-all duration-300">Map</Link>
                <Link to="/queue-status" className="block text-white hover:text-violet-300 hover:bg-violet-700/30 px-4 py-2 rounded transition-all duration-300">Queue Status</Link>
                <Link to="/alerts" className="block text-white hover:text-violet-300 hover:bg-violet-700/30 px-4 py-2 rounded transition-all duration-300">Alerts</Link>
              </>
            )}
            <Link to="/profile" className="block text-white hover:text-violet-300 hover:bg-violet-700/30 px-4 py-2 rounded transition-all duration-300">Profile</Link>
            <button onClick={handleLogout} className="w-full text-left text-white hover:text-red-300 hover:bg-red-900/30 px-4 py-2 rounded transition-all duration-300">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}
