import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut, FiUser, FiBell, FiMapPin } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card mx-4 my-3 rounded-2xl px-6 py-4 flex items-center justify-between">
      <Link to="/dashboard" className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
          Q
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 hidden md:block">
          QueuePredict
        </span>
      </Link>

      <div className="flex items-center space-x-6">
        <Link to="/nearby" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium flex items-center">
          <FiMapPin className="mr-1" /> <span className="hidden sm:inline">Nearby</span>
        </Link>
        <Link to="/my-tokens" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium hidden sm:block">
          My Tokens
        </Link>
        
        <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>

        <button className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors">
          <FiBell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="group relative">
          <button className="flex items-center space-x-2 p-1 pl-2 bg-slate-100 rounded-full border border-slate-200 hover:bg-slate-200 transition-all">
            <span className="text-sm font-medium text-slate-700 hidden sm:block">{user?.name || 'User'}</span>
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
              {user?.name?.[0] || 'U'}
            </div>
          </button>
          
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
            <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <FiUser className="mr-3" /> Profile
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <FiLogOut className="mr-3" /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
