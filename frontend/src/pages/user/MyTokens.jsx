import React, { useState, useEffect } from 'react';
import Navbar from '../../components/user/Navbar';
import { tokenAPI } from '../../services/api';
import { FiClock, FiCheckCircle, FiXCircle, FiCalendar, FiArrowLeft, FiActivity } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Loader from '../../components/user/Loader';

const MyTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await tokenAPI.getMyTokens();
        setTokens(response.data);
      } catch (error) {
        console.error('Error fetching tokens:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTokens();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 md:px-8 font-inter">
      <Navbar />
      
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">My Tokens</h1>
            <p className="text-slate-500 mt-1">View and manage your live and past appointments.</p>
          </div>
          <Link to="/dashboard" className="flex items-center text-indigo-600 font-bold hover:underline">
            <FiArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
        </div>

        <div className="space-y-6">
          {tokens.map((token) => (
            <div key={token._id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
              {/* Background Accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full -mr-10 -mt-10 blur-2xl transition-all group-hover:opacity-10 ${
                token.status === 'waiting' ? 'bg-amber-500' :
                token.status === 'serving' ? 'bg-indigo-500' :
                token.status === 'served' ? 'bg-emerald-500' : 'bg-red-500'
              }`}></div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center space-x-6">
                  <div className={`w-20 h-20 rounded-3xl flex flex-col items-center justify-center ${
                    token.status === 'waiting' ? 'bg-amber-50 text-amber-600' :
                    token.status === 'serving' ? 'bg-indigo-50 text-indigo-600' :
                    token.status === 'served' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">Token</span>
                    <span className="text-3xl font-black">#{token.token_number}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{token.office_name || 'Bank Branch'}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="flex items-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                        <FiCalendar className="mr-2" /> {new Date(token.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                        <FiClock className="mr-2" /> {new Date(token.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] ${
                    token.status === 'waiting' ? 'bg-amber-100 text-amber-700' :
                    token.status === 'serving' ? 'bg-indigo-100 text-indigo-700 animate-pulse' :
                    token.status === 'served' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {token.status}
                  </div>
                  
                  {(token.status === 'waiting' || token.status === 'serving') && (
                    <Link 
                      to={`/queue-status/${token._id}`}
                      className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 text-xs font-black uppercase tracking-widest"
                    >
                      <FiActivity />
                      <span>Live Monitor</span>
                    </Link>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between text-sm">
                <p className="text-slate-500 font-medium">Service: <span className="text-slate-900 font-black">{token.service_type}</span></p>
                {token.status === 'waiting' && (
                  <p className="text-indigo-600 font-black">Approx. {token.queue_position * 10} mins wait remaining</p>
                )}
              </div>
            </div>
          ))}

          {tokens.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
               <FiXCircle className="text-6xl text-slate-100 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-slate-800">No tokens booked yet</h3>
               <p className="text-slate-500 mt-2">Book a token to start saving time at your next visit.</p>
               <Link to="/nearby" className="btn-primary inline-flex mt-8 px-10">Find Nearby Banks</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTokens;
