import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useContexts';
import { useAssets } from '../hooks/useContexts';
import { useQueue } from '../hooks/useContexts';
import { Button, Card, LoadingSpinner, Stat, Badge } from '../components/UI';
import { useToast } from '../hooks/useToast';
import { getQueueStatusBgClass, formatWaitTime } from '../utils/helpers';
import axios from 'axios';

export default function UserPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { nearbyAssets, fetchNearbyAssets, loading } = useAssets();
  const { userQueues, fetchUserQueues } = useQueue();
  const { success } = useToast();
  const [coordinates, setCoordinates] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [recentQueues, setRecentQueues] = useState([]);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ latitude, longitude });
        fetchNearbyAssets(latitude, longitude);
      });
    }
    fetchUserQueues();
    fetchRecentQueues();
  }, []);

  const fetchRecentQueues = async () => {
    try {
      const response = await axios.get('/api/token/history', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      setRecentQueues(response.data.queues || []);
    } catch (err) {
      console.log('History not available');
    }
  };

  const handleJoinQueue = async (assetId) => {
    try {
      const response = await axios.post(`/api/token/join`, { asset_id: assetId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      success(`Added to queue! Your token: ${response.data.token_number}`);
      fetchUserQueues();
    } catch (err) {
      console.log('Failed to join queue');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">👤 Welcome, {user?.name}!</h1>
              <p className="text-emerald-200">Your smart queue management dashboard</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button onClick={() => setActiveTab('dashboard')} variant={activeTab === 'dashboard' ? 'primary' : 'outline'}>
                🏠 Dashboard
              </Button>
              <Button onClick={() => setActiveTab('queues')} variant={activeTab === 'queues' ? 'primary' : 'outline'}>
                📋 My Queues
              </Button>
              <Button onClick={() => navigate('/map')} variant="outline">
                📍 Map
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-emerald-700 to-emerald-600 border-emerald-500 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Active Queues</p>
                    <p className="text-4xl font-bold text-white mt-2">{userQueues.length}</p>
                  </div>
                  <span className="text-5xl">📊</span>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-700 to-cyan-600 border-cyan-500 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-cyan-100 text-sm font-medium">Nearby Assets</p>
                    <p className="text-4xl font-bold text-white mt-2">{nearbyAssets.length}</p>
                  </div>
                  <span className="text-5xl">📍</span>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-orange-700 to-orange-600 border-orange-500 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Avg Wait Time</p>
                    <p className="text-4xl font-bold text-white mt-2">12m</p>
                  </div>
                  <span className="text-5xl">⏱️</span>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-slate-900 border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">🚀 Quick Actions</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Button className="w-full" size="lg" onClick={() => navigate('/map')}>📍 Find Assets</Button>
                <Button className="w-full" size="lg" onClick={() => setActiveTab('queues')}>📋 View Queues</Button>
                <Button className="w-full" size="lg" onClick={() => navigate('/alerts')}>🔔 Alerts</Button>
                <Button className="w-full" size="lg" onClick={() => navigate('/profile')}>👤 Profile</Button>
              </div>
            </Card>

            {/* My Current Queues */}
            <Card className="bg-slate-900 border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">📋 My Current Queues</h2>
              {userQueues.length === 0 ? (
                <p className="text-gray-400 py-8 text-center">No active queues. Find an asset and join a queue to get started.</p>
              ) : (
                <div className="space-y-3">
                  {userQueues.map((queue) => (
                    <div key={queue.id} className={`${getQueueStatusBgClass(queue.status)} rounded-lg p-4 border border-opacity-30 flex items-center justify-between`}>
                      <div>
                        <p className="font-semibold text-white">Token #{queue.token_number}</p>
                        <p className="text-gray-300 text-sm">Position: {queue.position} • Wait: {formatWaitTime(queue.estimated_wait)}</p>
                      </div>
                      <Badge color={queue.status === 'waiting' ? 'yellow' : 'green'}>{queue.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Nearby Assets */}
            <Card className="bg-slate-900 border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">📍 Nearby Assets</h2>
              {loading ? (
                <LoadingSpinner />
              ) : nearbyAssets.length === 0 ? (
                <p className="text-gray-400 py-8 text-center">No nearby assets found. Enable location or try the map view.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nearbyAssets.map((asset) => (
                    <Card key={asset.id} className="bg-slate-800 border-slate-600 p-4 hover:border-emerald-500 transition">
                      <h3 className="font-bold text-white">{asset.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">{asset.location}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Queue Length:</span>
                          <span className="font-semibold text-white">{asset.queue_length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Wait Time:</span>
                          <span className="font-semibold text-orange-400">{formatWaitTime(asset.estimated_wait)}</span>
                        </div>
                      </div>
                      <Button onClick={() => handleJoinQueue(asset.id)} size="sm" className="w-full">
                        📝 Join Queue
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent History */}
            {recentQueues.length > 0 && (
              <Card className="bg-slate-900 border-slate-700 p-6">
                <h2 className="text-xl font-bold text-white mb-4">📝 Recent History</h2>
                <div className="space-y-3">
                  {recentQueues.slice(0, 5).map((queue, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Token #{queue.token_number}</p>
                        <p className="text-gray-400 text-sm">{queue.asset_name}</p>
                      </div>
                      <Badge color={queue.completed ? 'green' : 'gray'}>
                        {queue.completed ? 'Completed' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Queues Tab */}
        {activeTab === 'queues' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">📋 Manage Your Queues</h2>

            {userQueues.length === 0 ? (
              <Card className="bg-slate-900 border-slate-700 p-8 text-center">
                <p className="text-gray-400 text-lg mb-4">You're not in any queue yet</p>
                <Button onClick={() => navigate('/map')} size="lg">Find and Join a Queue</Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {userQueues.map((queue) => (
                  <Card key={queue.id} className="bg-slate-900 border-slate-700 p-6 hover:border-emerald-500 transition">
                    <div className="grid md:grid-cols-3 gap-4 items-center">
                      <div>
                        <p className="text-gray-400 text-sm">Token Number</p>
                        <p className="text-3xl font-bold text-emerald-400">#{queue.token_number}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Position in Queue</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-bold text-white">{queue.position}</p>
                          <p className="text-gray-500">of {queue.total_in_queue}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Estimated Wait</p>
                        <p className="text-3xl font-bold text-orange-400">{formatWaitTime(queue.estimated_wait)}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <Badge color={queue.status === 'waiting' ? 'yellow' : queue.status === 'serving' ? 'blue' : 'green'}>
                        {queue.status.toUpperCase()}
                      </Badge>
                      <Badge color="info">{queue.asset_name}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
