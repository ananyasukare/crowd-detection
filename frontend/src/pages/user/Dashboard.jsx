import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { tokenAPI } from '../../services/api';
import { 
  FiHome, FiMapPin, FiClock, FiUser, FiLogOut, 
  FiSearch, FiActivity, FiChevronRight, FiGrid,
  FiBell, FiCalendar, FiArrowRight, FiShield
} from 'react-icons/fi';
import Loader from '../../components/user/Loader';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTokens, setActiveTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await tokenAPI.getMyTokens();
        // Only active tokens
        const active = response.data.filter(t => t.status === 'waiting' || t.status === 'serving');
        setActiveTokens(active);
      } catch (error) {
        console.error('Dashboard fetch failed', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: <FiGrid />, path: '/dashboard' },
    { id: 'nearby', label: 'Find Banks', icon: <FiMapPin />, path: '/nearby' },
    { id: 'tokens', label: 'My Tokens', icon: <FiClock />, path: '/my-tokens' },
    { id: 'profile', label: 'Settings', icon: <FiUser />, path: '/profile' }
  ];

  if (loading) return <Loader />;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-inter overflow-hidden">
      {/* Premium Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-100 flex flex-col hidden lg:flex relative z-20 shadow-2xl shadow-slate-200/50">
        <div className="p-10">
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-600/20">
              <FiShield />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">CrowdSync</span>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                  window.location.pathname === item.path
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                    : 'text-slate-400 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-10 border-t border-slate-50">
          <button 
            onClick={logout}
            className="w-full flex items-center space-x-4 px-6 py-4 text-red-500 hover:bg-red-50 rounded-2xl font-bold transition-all"
          >
            <FiLogOut className="text-xl" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Glass Header */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 relative z-10 shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900">Hello, {user?.name.split(' ')[0]} 👋</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Welcome to your smart queue hub</p>
          </div>

          <div className="flex items-center space-x-6">
            <button className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all relative">
              <FiBell className="text-xl" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-[1px] bg-slate-100"></div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900">{user?.name}</p>
                <p className="text-[10px] text-indigo-600 font-black uppercase tracking-wider">Premium User</p>
              </div>
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-600/20">
                {user?.name?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">Active Tokens</p>
                  <h3 className="text-4xl font-black text-slate-900">{activeTokens.length}</h3>
                </div>
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                  <FiActivity />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">Next Turn Approx</p>
                  <h3 className="text-4xl font-black text-slate-900">
                    {activeTokens.length > 0 ? (activeTokens[0].queue_position * 10) + 'm' : '--'}
                  </h3>
                </div>
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl">
                  <FiClock />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-600/20 flex items-center justify-between group">
              <div>
                <p className="text-xs font-black uppercase tracking-widest mb-1 opacity-80">Quick Discovery</p>
                <h3 className="text-xl font-black">Find Nearby Banks</h3>
                <Link to="/nearby" className="mt-4 inline-flex items-center space-x-2 text-sm font-bold bg-white/20 px-4 py-2 rounded-xl hover:bg-white/30 transition-all">
                  <span>Explore Map</span> <FiArrowRight />
                </Link>
              </div>
              <FiMapPin className="text-6xl opacity-20 group-hover:scale-110 transition-transform" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Active Live Token */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Current Progress</h3>
                <Link to="/my-tokens" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">View All History</Link>
              </div>

              {activeTokens.length > 0 ? (
                activeTokens.slice(0, 1).map(token => (
                  <div key={token._id} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                       <div className="flex items-center space-x-8">
                          <div className="w-24 h-24 bg-indigo-600 text-white rounded-[2rem] flex flex-col items-center justify-center shadow-xl shadow-indigo-600/20">
                             <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">Token</span>
                             <span className="text-4xl font-black">#{token.token_number}</span>
                          </div>
                          <div>
                             <h4 className="text-2xl font-black text-slate-900">{token.office_name}</h4>
                             <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">{token.service_type}</p>
                             <div className="flex items-center space-x-4 mt-4">
                               <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100">
                                 {token.status}
                               </span>
                               <span className="text-slate-400 text-xs font-bold flex items-center">
                                 <FiCalendar className="mr-2" /> Today
                               </span>
                             </div>
                          </div>
                       </div>
                       
                       <Link to={`/queue-status/${token._id}`} className="px-8 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm flex items-center space-x-3 hover:bg-indigo-600 transition-all shadow-xl">
                          <span>Open Live Monitor</span>
                          <FiChevronRight />
                       </Link>
                    </div>

                    <div className="mt-12 space-y-3">
                       <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                          <span>Queue Progress</span>
                          <span>{token.status === 'serving' ? 'Your Turn!' : 'Next Up'}</span>
                       </div>
                       <div className="h-4 bg-slate-50 rounded-full overflow-hidden p-1 border border-slate-100">
                          <div 
                            className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                            style={{ width: token.status === 'serving' ? '100%' : '65%' }}
                          ></div>
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-[3rem] p-16 border-2 border-dashed border-slate-100 text-center">
                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 text-4xl mx-auto mb-6">
                      <FiClock />
                   </div>
                   <h4 className="text-xl font-black text-slate-900">No Active Tokens</h4>
                   <p className="text-slate-400 mt-2 max-w-xs mx-auto text-sm font-medium leading-relaxed">You haven't booked any tokens today. Find a nearby bank to get started.</p>
                   <Link to="/nearby" className="mt-8 inline-flex px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
                      Discover Banks
                   </Link>
                </div>
              )}
            </div>

            {/* Side Activity */}
            <div className="space-y-6">
               <h3 className="text-xl font-black text-slate-900">Quick Actions</h3>
               <div className="grid grid-cols-1 gap-4">
                  <Link to="/nearby" className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all flex items-center space-x-4 shadow-sm group">
                     <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <FiSearch />
                     </div>
                     <span className="font-bold text-slate-900">New Booking</span>
                  </Link>
                  <Link to="/my-tokens" className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all flex items-center space-x-4 shadow-sm group">
                     <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <FiCalendar />
                     </div>
                     <span className="font-bold text-slate-900">History Log</span>
                  </Link>
                  <div className="bg-indigo-600/5 p-8 rounded-[2.5rem] border border-indigo-100">
                     <h5 className="font-black text-indigo-900 mb-2">Did you know?</h5>
                     <p className="text-xs text-indigo-700 leading-relaxed font-medium">Our AI can predict wait times with 95% accuracy by monitoring live CCTV feeds!</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
