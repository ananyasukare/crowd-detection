import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiMapPin, FiActivity, FiArrowRight, FiShield, FiSmartphone } from 'react-icons/fi';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
              Q
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              QueuePredict
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Features</a>
            <a href="#how-it-works" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">How it Works</a>
            <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Sign In</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 font-bold text-sm">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              AI-Powered Realtime Queue Tracking
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1]">
              Skip the wait, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">save your time.</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
              Geospatial AI that predicts crowd density and waiting times for banks and government offices. Book tokens online and visit only when it's your turn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/register" className="btn-primary py-4 px-8 text-lg flex items-center justify-center">
                Book Your First Token <FiArrowRight className="ml-2" />
              </Link>
              <Link to="/login" className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-all flex items-center justify-center">
                Admin Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-6 pt-4 grayscale opacity-60">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Trusted by:</span>
              <div className="font-bold text-slate-500 italic">Central Bank</div>
              <div className="font-bold text-slate-500 italic">Passport Seva</div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-600/10 rounded-[3rem] blur-3xl transform rotate-6 group-hover:rotate-3 transition-transform"></div>
            <div className="relative bg-white border border-slate-100 p-4 rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <img 
                src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=1000" 
                alt="Queue Management" 
                className="rounded-[2rem] w-full h-[500px] object-cover"
              />
              {/* Floating Widget 1 */}
              <div className="absolute top-10 left-10 glass-card p-4 rounded-2xl shadow-xl animate-bounce delay-75">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                    <FiClock />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Estimated Wait</p>
                    <p className="font-bold text-slate-900">12 Minutes</p>
                  </div>
                </div>
              </div>
              {/* Floating Widget 2 */}
              <div className="absolute bottom-10 right-10 glass-card p-4 rounded-2xl shadow-xl animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white">
                    <FiActivity />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Live Crowd</p>
                    <p className="font-bold text-slate-900">High Density</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900">Smart Features for Smart Citizens</h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Our AI engine works 24/7 to monitor traffic and ensure you never have to stand in a long line again.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "Geospatial Locator", 
              desc: "Automatically find the nearest bank or office with the shortest queue using live GPS data.",
              icon: <FiMapPin />,
              color: "indigo"
            },
            { 
              title: "AI Prediction", 
              desc: "Predicts peak crowd hours and suggests the best time to visit using machine learning.",
              icon: <FiActivity />,
              color: "violet"
            },
            { 
              title: "Smart Notifications", 
              desc: "Get an alert on your phone exactly 15 minutes before your turn so you're always on time.",
              icon: <FiSmartphone />,
              color: "emerald"
            }
          ].map((f, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-2 group">
              <div className={`w-14 h-14 bg-${f.color}-50 text-${f.color}-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-${f.color}-600 group-hover:text-white transition-all`}>
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-black text-indigo-600">500+</p>
            <p className="text-slate-500 font-medium mt-2">Active Offices</p>
          </div>
          <div>
            <p className="text-4xl font-black text-indigo-600">1.2M</p>
            <p className="text-slate-500 font-medium mt-2">Tokens Issued</p>
          </div>
          <div>
            <p className="text-4xl font-black text-indigo-600">85%</p>
            <p className="text-slate-500 font-medium mt-2">Time Saved</p>
          </div>
          <div>
            <p className="text-4xl font-black text-indigo-600">4.9/5</p>
            <p className="text-slate-500 font-medium mt-2">User Rating</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-900/40">
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full -ml-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to reclaim your time?</h2>
            <p className="text-indigo-200 mb-12 text-lg max-w-xl mx-auto">Join the future of public service management. Download the app or register online today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary py-4 px-12 text-lg">Create Free Account</Link>
              <button className="px-12 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold border border-white/10 transition-all">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">Q</div>
            <span className="font-bold text-slate-900">QueuePredict</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 AI Geospatial Queue Management. All rights reserved.</p>
          <div className="flex space-x-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600">Terms</a>
            <a href="#" className="hover:text-indigo-600">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
