import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tokenAPI, officeAPI } from '../../services/api';
import Navbar from '../../components/user/Navbar';
import { FiClock, FiUsers, FiActivity, FiArrowLeft, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import Loader from '../../components/user/Loader';

const QueueStatus = () => {
  const { id } = useParams();
  const [token, setToken] = useState(null);
  const [office, setOffice] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const tResponse = await tokenAPI.getById(id);
      setToken(tResponse.data);
      
      const oResponse = await officeAPI.getById(tResponse.data.office_id);
      setOffice(oResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000); // Faster updates for live feel
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <Loader />;
  if (!token || !office) return <div className="p-20 text-center text-slate-400 font-bold">Data not found. Please try again.</div>;

  const physicalCrowd = office.current_crowd_count || 0;
  const digitalAhead = token.status === 'serving' ? 0 : Math.max(0, token.queue_position - 1);
  const totalWait = (physicalCrowd + digitalAhead) * 5;
  const isClose = (physicalCrowd + digitalAhead) <= 2 && token.status === 'waiting';

  const getStatusColor = () => {
    switch (token.status) {
      case 'serving': return 'from-emerald-500 to-teal-600';
      case 'waiting': return isClose ? 'from-amber-500 to-orange-600 animate-pulse' : 'from-indigo-600 to-violet-700';
      default: return 'from-slate-600 to-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 font-inter">
      <Navbar />
      
      <div className="max-w-2xl mx-auto">
        <Link to="/my-tokens" className="inline-flex items-center text-slate-500 font-bold text-sm mb-8 hover:text-indigo-600 transition-colors">
          <FiArrowLeft className="mr-2" /> Back to My Tokens
        </Link>

        <div className={`bg-gradient-to-br ${getStatusColor()} rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden mb-8 transition-all duration-500`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          
          <div className="relative z-10 text-center space-y-6">
            <span className="px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
              {token.status === 'serving' ? 'Your Turn is Now!' : (isClose ? 'Coming Up Next!' : 'Live Status')}
            </span>
            
            <h1 className="text-9xl font-black tracking-tighter">#{token.token_number}</h1>
            
            <div>
              <p className="text-white/80 font-bold uppercase text-[10px] tracking-widest">Daily Token ID</p>
              <h2 className="text-2xl font-black">{office.name}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-10">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                <p className="text-white/60 text-[10px] font-black uppercase mb-1">People Ahead</p>
                <p className="text-3xl font-black">{token.status === 'serving' ? '0' : physicalCrowd + digitalAhead}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                <p className="text-white/60 text-[10px] font-black uppercase mb-1">Estimated Wait</p>
                <p className="text-3xl font-black">{token.status === 'serving' ? 'Ready' : `${totalWait}m`}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Journey Alert */}
        {isClose && (
          <div className="bg-amber-100 border-2 border-amber-500 p-6 rounded-3xl mb-8 flex items-center space-x-6 animate-bounce">
             <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white text-3xl shrink-0 shadow-lg shadow-amber-500/20">
                <FiAlertCircle />
             </div>
             <div>
                <h4 className="font-black text-amber-900">Start Your Journey Now!</h4>
                <p className="text-sm text-amber-800 font-medium">Only {physicalCrowd + digitalAhead} people ahead. Reach branch in next 10 mins.</p>
             </div>
          </div>
        )}

        {/* Prediction Insights */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center">
            <FiActivity className="mr-3 text-indigo-600" /> Live AI Insights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mr-3">
                    <FiUsers />
                  </div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider">In-Bank Crowd</p>
               </div>
               <p className="text-2xl font-black text-slate-900">{physicalCrowd} People</p>
               <span className="text-[10px] font-bold text-slate-400 mt-1 block">Detected by AI Camera</span>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mr-3">
                    <FiActivity />
                  </div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Online Ahead</p>
               </div>
               <p className="text-2xl font-black text-slate-900">{digitalAhead} Tokens</p>
               <span className="text-[10px] font-bold text-slate-400 mt-1 block">In digital queue</span>
            </div>
          </div>

          <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-start">
             <FiInfo className="text-indigo-600 mt-1 mr-4 shrink-0" />
             <p className="text-xs text-indigo-900 font-medium leading-relaxed">
               *Wait time is calculated using AI crowd detection + current digital queue length.
             </p>
          </div>
        </div>

        {token.status === 'serving' && (
          <div className="mt-8 p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 text-center animate-bounce shadow-xl shadow-emerald-500/10">
            <FiCheckCircle className="text-6xl text-emerald-500 mx-auto mb-4" />
            <h3 className="text-3xl font-black text-emerald-900">Your Turn!</h3>
            <p className="text-emerald-700 font-bold mt-2">Please proceed to the counter now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueStatus;
