import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useContexts';
import { Button, Card } from '../components/UI';
import InteractiveQueueShow from '../components/InteractiveQueueShow';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5DC] via-[#FFFFFF] to-[#F0F0F0]">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-[#1B4965] leading-tight">
              Smart Queue <span className="text-[#D4AF37]">Management</span> System
            </h1>
            <p className="text-xl text-[#333333]">
              Reduce waiting times, improve service delivery, and optimize government asset management with our intelligent queue system.
            </p>
            <div className="flex gap-4 flex-wrap">
              {isAuthenticated ? (
                <>
                  {user?.is_admin ? (
                    <>
                      <Button 
                        onClick={() => navigate('/admin')}
                        size="lg"
                        className="px-8"
                      >
                        🏦 Go to Admin Panel
                      </Button>
                      <Button 
                        onClick={() => navigate('/map')}
                        variant="secondary"
                        size="lg"
                        className="px-8"
                      >
                        📍 View Map
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        onClick={() => navigate('/dashboard')}
                        size="lg"
                        className="px-8"
                      >
                        👤 Go to My Dashboard
                      </Button>
                      <Button 
                        onClick={() => navigate('/map')}
                        variant="secondary"
                        size="lg"
                        className="px-8"
                      >
                        📍 View Map
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => navigate('/login')}
                    size="lg"
                    className="px-8"
                  >
                    Get Started
                  </Button>
                  <Button 
                    onClick={() => navigate('/register')}
                    variant="outline"
                    size="lg"
                    className="px-8"
                  >
                    Learn More
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full h-full bg-gradient-to-br from-violet-600 to-violet-900 rounded-2xl shadow-2xl shadow-violet-600/40 flex items-center justify-center border border-violet-700 hover:shadow-3xl hover:shadow-violet-600/60 transition-all duration-500 overflow-hidden group" style={{ minHeight: '600px' }}>
              <InteractiveQueueShow />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center text-white mb-16 animate-slideInDown">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '📍', title: 'Asset Map', desc: 'Real-time location of government assets with queue status indicators' },
            { icon: '⏱️', title: 'Wait Time', desc: 'AI-powered predictions for accurate wait time estimates' },
            { icon: '📱', title: 'Notifications', desc: 'Smart alerts to keep you informed about queue updates' },
            { icon: '📊', title: 'Analytics', desc: 'Track trends and optimize services with data insights' },
            { icon: '🔐', title: 'Secure', desc: 'Bank-level security for all your personal information' },
            { icon: '🚀', title: 'Fast', desc: 'Lightning-quick queue operations and smooth experience' },
          ].map((feature, idx) => (
            <div key={idx} className={`animate-slideInUp transition-all duration-500`} style={{ animationDelay: `${idx * 100}ms` }}>
              <Card className="text-center hover:shadow-2xl hover:shadow-violet-600/30 group">
                <div className="text-4xl mb-4 group-hover:scale-125 group-hover:animate-bounce transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{feature.desc}</p>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-violet-900 to-violet-800 py-16 border-y border-violet-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold">10K+</div>
              <p className="text-violet-200">Active Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold">500+</div>
              <p className="text-violet-200">Assets Tracked</p>
            </div>
            <div>
              <div className="text-4xl font-bold">45%</div>
              <p className="text-violet-200">Wait Time Reduction</p>
            </div>
            <div>
              <div className="text-4xl font-bold">99.9%</div>
              <p className="text-violet-200">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="text-center bg-gradient-to-r from-violet-900 to-violet-800 border-2 border-violet-700">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Save Time?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already saving hours by using Smart Queue Management System
          </p>
          {!isAuthenticated && (
            <Button 
              onClick={() => navigate('/register')}
              size="lg"
              className="px-8"
            >
              Create Free Account
            </Button>
          )}
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2024 Smart Queue Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
