import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/Navbar';
import { officeAPI, tokenAPI } from '../../services/api';
import { FiClock, FiUsers, FiMapPin, FiInfo, FiCheckCircle, FiChevronRight, FiCalendar, FiActivity } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Loader from '../../components/user/Loader';

const OfficeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [office, setOffice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [serviceType, setServiceType] = useState('General Banking');

  const services = [
    { name: 'General Banking', icon: '🏦', wait: '10-15 min' },
    { name: 'Cash Deposit/Withdrawal', icon: '💰', wait: '5-10 min' },
    { name: 'Loan Inquiry', icon: '📝', wait: '20-30 min' },
    { name: 'Account Opening', icon: '💳', wait: '15-20 min' }
  ];

  useEffect(() => {
    const fetchOffice = async () => {
      try {
        const response = await officeAPI.getById(id);
        setOffice(response.data);
      } catch (error) {
        toast.error("Office details not found");
        navigate('/nearby');
      } finally {
        setLoading(false);
      }
    };
    fetchOffice();
  }, [id, navigate]);

  const handleBookToken = async () => {
    setBooking(true);
    try {
      const response = await tokenAPI.book({
        office_id: id,
        service_type: serviceType
      });
      toast.success(`Token #${response.data.token_number} Booked Successfully!`);
      navigate(`/queue-status/${response.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <Loader />;
  if (!office) return <div className="p-20 text-center font-bold text-slate-400">Office information not available.</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4">
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-100">
          {/* Header Section */}
          <div className="bg-indigo-600 p-10 text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 text-indigo-200 mb-4">
                <FiMapPin /> <span>{office.location}</span>
              </div>
              <h1 className="text-4xl font-black mb-2">{office.name}</h1>
              <p className="text-indigo-100 font-bold opacity-80 uppercase tracking-widest text-sm">{office.branch}</p>
            </div>
          </div>

          <div className="p-10">
            {/* Live Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 -mt-20 relative z-20 mb-12">
              <div className="bg-white p-5 rounded-3xl shadow-lg border border-slate-50 flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-lg"><FiClock /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Predicted Wait</p>
                  <p className="text-lg font-black text-slate-900">{((office.current_crowd_count || 0) + office.queue_length) * 5}m</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl shadow-lg border border-slate-50 flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-lg"><FiUsers /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">In-Bank Crowd</p>
                  <p className="text-lg font-black text-slate-900">{office.current_crowd_count || 0} People</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl shadow-lg border border-slate-50 flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-lg"><FiActivity /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Digital Queue</p>
                  <p className="text-lg font-black text-slate-900">{office.queue_length} Booked</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl shadow-lg border border-slate-50 flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-50 text-emerald-500 rounded-xl flex items-center justify-center text-lg"><FiCheckCircle /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Status</p>
                  <p className="text-lg font-black text-emerald-500">Live</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Service Selection */}
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center">
                  <FiInfo className="mr-2 text-indigo-600" /> Select Service
                </h3>
                <div className="space-y-3">
                  {services.map((s, i) => (
                    <button 
                      key={i}
                      onClick={() => setServiceType(s.name)}
                      className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                        serviceType === s.name ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-100 hover:border-indigo-200'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl">{s.icon}</span>
                        <div className="text-left">
                          <p className={`font-bold ${serviceType === s.name ? 'text-indigo-900' : 'text-slate-700'}`}>{s.name}</p>
                          <p className="text-xs text-slate-400">Avg. {s.wait}</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        serviceType === s.name ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200'
                      }`}>
                        {serviceType === s.name && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Booking Action */}
              <div className="bg-slate-50 p-8 rounded-[2.5rem] flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Booking Summary</h3>
                  <p className="text-sm text-slate-500 mb-8">You are booking a virtual spot for {serviceType} at {office.name}.</p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-sm font-medium text-slate-600">
                      <FiCalendar className="mr-3 text-indigo-500" /> <span>Date: Today, {new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm font-medium text-slate-600">
                      <FiClock className="mr-3 text-indigo-500" /> <span>Estimated Turn: In approx {office.estimated_wait} mins</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleBookToken}
                  disabled={booking}
                  className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all flex items-center justify-center space-x-3 ${
                    booking ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/30'
                  }`}
                >
                  {booking ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Booking...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Book Token</span>
                      <FiChevronRight />
                    </>
                  )}
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-4 font-bold uppercase tracking-widest">No cancellation fees applied</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeDetail;
