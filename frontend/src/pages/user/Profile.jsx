import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiShield, FiCalendar, FiArrowLeft, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 font-inter">
      <div className="max-w-2xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center text-slate-500 font-bold text-sm mb-8 hover:text-indigo-600 transition-colors">
          <FiArrowLeft className="mr-2" /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 h-40 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          </div>

          {/* Profile Pic Overlap */}
          <div className="px-10 -mt-16 relative z-10">
            <div className="w-32 h-32 bg-white rounded-3xl p-1 shadow-2xl">
               <div className="w-full h-full bg-indigo-600 rounded-[1.4rem] flex items-center justify-center text-white text-5xl font-black">
                 {user?.name?.[0]}
               </div>
            </div>
          </div>

          <div className="p-10">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-black text-slate-900">{user?.name}</h1>
                <p className="text-indigo-600 font-bold uppercase text-xs tracking-[0.2em] mt-1">{user?.role} Account</p>
              </div>
              <button className="flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all">
                <FiEdit2 /> <span>Edit Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="flex items-center space-x-4 mb-4">
                     <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-xl">
                        <FiMail />
                     </div>
                     <span className="text-xs text-slate-400 font-black uppercase tracking-widest">Email Address</span>
                  </div>
                  <p className="font-bold text-slate-900">{user?.email}</p>
               </div>

               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="flex items-center space-x-4 mb-4">
                     <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-xl">
                        <FiShield />
                     </div>
                     <span className="text-xs text-slate-400 font-black uppercase tracking-widest">Account Status</span>
                  </div>
                  <p className="font-bold text-emerald-600 uppercase">Verified & Secure</p>
               </div>

               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="flex items-center space-x-4 mb-4">
                     <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-xl">
                        <FiCalendar />
                     </div>
                     <span className="text-xs text-slate-400 font-black uppercase tracking-widest">Member Since</span>
                  </div>
                  <p className="font-bold text-slate-900">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
               </div>
            </div>

            <div className="mt-12 p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100">
               <h4 className="font-black text-indigo-900 mb-2">Privacy & Security</h4>
               <p className="text-xs text-indigo-700 leading-relaxed font-medium">Your account data is encrypted and protected by CrowdSync Security Protocols.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
