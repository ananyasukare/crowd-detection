import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { FiPlay, FiSkipForward, FiCheckCircle, FiXCircle, FiAlertTriangle, FiPhone, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Loader from '../../components/user/Loader';
import { useAuth } from '../../context/AuthContext';

const QueueManagement = () => {
  const { user } = useAuth();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const officeId = user?.office_id;

  const fetchQueue = async () => {
    if (!officeId) {
      setLoading(false);
      return;
    }
    try {
      const response = await adminAPI.getQueue(officeId);
      setQueue(response.data);
    } catch (error) {
      console.error('Error fetching queue:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    // Auto refresh every 30 seconds for live feel
    const interval = setInterval(fetchQueue, 30000);
    return () => clearInterval(interval);
  }, [officeId]);

  const handleStatusUpdate = async (tokenId, status) => {
    try {
      await adminAPI.updateTokenStatus(tokenId, status);
      toast.success(`Token marked as ${status}`);
      fetchQueue();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <Loader />;

  if (!officeId) {
    return <div className="p-20 text-center font-bold text-slate-500">No Office Assigned to this Admin.</div>;
  }

  const servingToken = queue.find(t => t.status === 'serving');
  const waitingTokens = queue.filter(t => t.status === 'waiting');

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-inter">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-900">Queue Control</h1>
            <p className="text-slate-500 mt-1 font-bold uppercase text-[10px] tracking-widest">Real-time management panel</p>
          </div>
          <button className="px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest border border-red-100 hover:bg-red-100 transition-all">
            Emergency Stop
          </button>
        </div>

        {/* Serving Now Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-[#0F172A] rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
              <div className="space-y-8">
                <span className="px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-500/30">
                  Currently Serving
                </span>
                {servingToken ? (
                  <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                    <h2 className="text-9xl font-black text-white">#{servingToken.token_number}</h2>
                    <div className="mt-6">
                      <p className="text-2xl font-black text-indigo-300">{servingToken.user_name || 'Customer'}</p>
                      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Service: {servingToken.service_type}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-10">
                    <h2 className="text-5xl font-black text-slate-600">No Active Token</h2>
                    <p className="text-slate-500 mt-2">The counter is ready to call the next customer.</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 w-full md:w-auto">
                {servingToken ? (
                  <>
                    <button 
                      onClick={() => handleStatusUpdate(servingToken._id, 'served')}
                      className="px-10 py-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl font-black text-xl transition-all shadow-xl shadow-emerald-500/30 flex items-center justify-center"
                    >
                      <FiCheckCircle className="mr-3" /> Mark Served
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(servingToken._id, 'skipped')}
                      className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white rounded-3xl font-black transition-all border border-white/10 flex items-center justify-center"
                    >
                      <FiSkipForward className="mr-3" /> Skip Next
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => waitingTokens[0] && handleStatusUpdate(waitingTokens[0]._id, 'serving')}
                    disabled={waitingTokens.length === 0}
                    className="px-10 py-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 text-white rounded-[2rem] font-black text-2xl transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center"
                  >
                    <FiPlay className="mr-3" /> Call Next
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm flex flex-col justify-center text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Waiting in Line</p>
            <h3 className="text-8xl font-black text-slate-900">{waitingTokens.length}</h3>
            <p className="text-slate-500 font-bold mt-4">Estimated time: {waitingTokens.length * 10} mins</p>
            <div className="mt-10 flex justify-center space-x-3">
              <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce"></div>
              <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
          </div>
        </div>

        {/* Upcoming List */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900">Upcoming Tokens</h3>
            <span className="px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest">Next in queue</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-10 py-5">Token</th>
                  <th className="px-10 py-5">Customer Details</th>
                  <th className="px-10 py-5">Service Category</th>
                  <th className="px-10 py-5">Time Booked</th>
                  <th className="px-10 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {waitingTokens.map((token) => (
                  <tr key={token._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-10 py-8">
                      <span className="text-3xl font-black text-indigo-600">#{token.token_number}</span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="font-black text-slate-900 text-lg">{token.user_name || 'Premium Client'}</div>
                      <div className="text-xs text-slate-500 font-bold flex items-center mt-1 uppercase tracking-wider opacity-60">
                        <FiPhone className="mr-2" /> Phone: {token.phone || 'Verified'}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                       <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                         {token.service_type}
                       </span>
                    </td>
                    <td className="px-10 py-8 text-slate-500 font-bold">
                      {new Date(token.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex justify-end space-x-3">
                        <button 
                          onClick={() => handleStatusUpdate(token._id, 'serving')}
                          className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        >
                          <FiPlay className="text-lg" />
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(token._id, 'cancelled')}
                          className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          <FiXCircle className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {waitingTokens.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-10 py-32 text-center">
                       <div className="max-w-xs mx-auto space-y-4">
                          <FiUsers className="text-6xl text-slate-100 mx-auto" />
                          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No Waiting Tokens Found</p>
                          <p className="text-slate-300 text-xs">The queue is currently empty. New tokens will appear here automatically.</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueManagement;
