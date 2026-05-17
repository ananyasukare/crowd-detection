import React, { useState, useEffect, useRef } from 'react';
import { adminAPI } from '../../services/api';
import { FiUsers, FiClock, FiActivity, FiTrendingUp, FiArrowRight, FiMenu, FiBell, FiCheckCircle, FiPlay, FiSettings, FiLogOut, FiAlertCircle, FiGrid, FiBarChart2, FiCamera, FiVideo, FiVideoOff, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import { Line as LineChart, Bar as BarChart } from 'react-chartjs-2';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import Loader from '../../components/user/Loader';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); 
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Camera & AI State
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState(null);
  const [crowdCount, setCrowdCount] = useState(0);
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasHighCrowdAlert, setHasHighCrowdAlert] = useState(false);
  const [aiModel, setAiModel] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionRef = useRef(null);
  const officeId = user?.office_id;

  // Load AI Model on Mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        const model = await cocoSsd.load();
        setAiModel(model);
        console.log("AI Model Loaded Successfully");
      } catch (err) {
        console.error("Failed to load AI model", err);
      }
    };
    loadModel();
  }, []);

  useEffect(() => {
    if (!officeId) {
      setLoading(false);
      return;
    }
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getDashboard(officeId);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [officeId]);

  // Alert Monitoring Logic
  useEffect(() => {
    if (crowdCount > 10) {
      if (!hasHighCrowdAlert) {
        setHasHighCrowdAlert(true);
        toast.error("⚠️ HIGH CROWD ALERT!", { position: "top-center" });
      }
    } else {
      setHasHighCrowdAlert(false);
    }
  }, [crowdCount, hasHighCrowdAlert]);

  const runDetection = async () => {
    if (aiModel && videoRef.current && isCameraOn) {
      const predictions = await aiModel.detect(videoRef.current);
      
      // Filter only persons
      const persons = predictions.filter(p => p.class === 'person');
      const count = persons.length;
      
      setCrowdCount(count);

      // Draw detection boxes on canvas
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        persons.forEach(person => {
          const [x, y, width, height] = person.bbox;
          ctx.strokeStyle = '#4f46e5';
          ctx.lineWidth = 4;
          ctx.strokeRect(x, y, width, height);
          ctx.fillStyle = '#4f46e5';
          ctx.font = 'bold 16px Inter';
          ctx.fillText(`Person ${Math.round(person.score * 100)}%`, x, y > 20 ? y - 10 : y + 20);
        });
      }

      // Sync with DB every few seconds
      detectionRef.current = requestAnimationFrame(runDetection);
    }
  };

  // Periodic Sync to Backend
  useEffect(() => {
    let syncInterval;
    if (isCameraOn && officeId) {
      syncInterval = setInterval(() => {
        adminAPI.updateCrowdCount(officeId, crowdCount)
          .catch(err => console.error("Sync failed", err));
      }, 5000);
    }
    return () => clearInterval(syncInterval);
  }, [isCameraOn, crowdCount, officeId]);

  const startCamera = async () => {
    if (!aiModel) {
      toast.error("AI Model still loading... please wait.");
      return;
    }
    setIsInitializing(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      setStream(mediaStream);
      setIsCameraOn(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          runDetection();
        };
      }
      toast.success("AI Monitoring Online");
    } catch (err) {
      toast.error("Camera Access Denied");
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOn(false);
    setCrowdCount(0);
    if (detectionRef.current) cancelAnimationFrame(detectionRef.current);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-inter">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0F172A] flex flex-col h-screen sticky top-0 shrink-0">
        <div className="p-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">A</div>
            <span className="text-xl font-black text-white tracking-tight">Admin<span className="text-indigo-400">Hub</span></span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: 'overview', label: 'Dashboard', icon: <FiGrid /> },
            { id: 'monitor', label: 'Live Monitor', icon: <FiCamera /> },
            { id: 'analytics', label: 'Branch Stats', icon: <FiBarChart2 /> },
            { id: 'settings', label: 'Settings', icon: <FiSettings /> },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'}`}>
              <span className="text-xl">{item.icon}</span> <span>{item.label}</span>
            </button>
          ))}
          <button onClick={() => navigate('/admin/queue')} className="w-full flex items-center space-x-3 px-6 py-4 text-slate-400 hover:bg-slate-800 rounded-2xl font-bold transition-all">
            <FiUsers className="text-xl" /> <span>Queue Mgmt</span>
          </button>
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button onClick={logout} className="w-full flex items-center space-x-3 px-6 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl font-bold transition-all">
            <FiLogOut /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0 relative z-10">
          <div>
            <h2 className="text-lg font-black text-slate-900">{stats?.office?.name || 'Manager Panel'}</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stats?.office?.branch}</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="h-10 w-[1px] bg-slate-100"></div>
            <div className="flex flex-col text-right">
              <span className="text-sm font-black text-slate-900">{user?.name}</span>
              <span className="text-[10px] text-indigo-600 font-black uppercase tracking-wider">Store Manager</span>
            </div>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
              {user?.name?.[0]}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 space-y-10 bg-[#F8FAFC]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Live Queue', value: stats?.stats?.active_queue || '0', icon: <FiActivity />, color: 'indigo' },
                  { label: 'Completed', value: stats?.stats?.served_today || '0', icon: <FiCheckCircle />, color: 'emerald' },
                  { label: 'Avg Wait', value: (stats?.stats?.avg_wait_time || '15') + 'm', icon: <FiClock />, color: 'amber' },
                  { label: 'AI Status', value: isCameraOn ? 'ACTIVE' : 'OFFLINE', icon: <FiAlertCircle />, color: isCameraOn ? 'emerald' : 'slate' }
                ].map((s, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center space-x-6">
                    <div className={`w-14 h-14 bg-${s.color}-50 text-${s.color}-600 rounded-2xl flex items-center justify-center text-2xl`}>
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                      <p className="text-3xl font-black text-slate-900">{s.value}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {activeTab === 'monitor' && (
            <div className="space-y-8">
               <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900">AI Crowd Scan</h3>
                    <p className="text-slate-500 mt-1">Real-time neural network detection active.</p>
                  </div>
                  {!isCameraOn ? (
                    <button onClick={startCamera} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/20 flex items-center space-x-2 hover:bg-indigo-700 transition-all">
                      <FiVideo /> <span>Launch AI Monitor</span>
                    </button>
                  ) : (
                    <button onClick={stopCamera} className="px-8 py-4 bg-red-500 text-white rounded-2xl font-black shadow-xl shadow-red-500/20 flex items-center space-x-2">
                      <FiVideoOff /> <span>Stop Monitoring</span>
                    </button>
                  )}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 bg-black rounded-[3rem] overflow-hidden aspect-video relative border-4 border-white shadow-2xl">
                    <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                    <canvas ref={canvasRef} width={640} height={480} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
                    {isCameraOn && (
                      <div className="absolute top-6 left-6">
                        <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-2"></div> LIVE AI SCAN
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Live Detection</p>
                       <h4 className="text-8xl font-black text-slate-900">{crowdCount}</h4>
                       <p className="text-slate-500 text-sm mt-2 font-bold uppercase tracking-widest">People in Frame</p>
                    </div>
                    <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-600/20">
                       <h5 className="font-black text-lg mb-2">AI Accuracy Active</h5>
                       <p className="text-white/60 text-xs leading-relaxed">System is currently using COCO-SSD Neural Network to detect and count unique human entities in real-time.</p>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
