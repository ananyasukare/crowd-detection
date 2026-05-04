import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useContexts';
import { useAssets } from '../hooks/useContexts';
import { useQueue } from '../hooks/useContexts';
import { Button, Card, LoadingSpinner, Stat, Badge } from '../components/UI';
import { useToast } from '../hooks/useToast';
import { getQueueStatusBgClass, formatWaitTime } from '../utils/helpers';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { nearbyAssets, fetchNearbyAssets, loading } = useAssets();
  const { userQueues, fetchUserQueues } = useQueue();
  const { success } = useToast();
  const [coordinates, setCoordinates] = useState(null);

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
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Your personalized queue management dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Stat 
            label="Active Queues" 
            value={userQueues.length} 
            icon="📊"
            color="blue"
          />
          <Stat 
            label="Nearby Assets" 
            value={nearbyAssets.length} 
            icon="📍"
            color="green"
          />
          <Stat 
            label="Average Wait" 
            value={formatWaitTime(45)} 
            icon="⏱️"
            color="yellow"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={() => navigate('/map')}
              variant="outline"
              className="w-full"
            >
              📍 View Map
            </Button>
            <Button 
              onClick={() => navigate('/queue-status')}
              variant="outline"
              className="w-full"
            >
              📊 Queue Status
            </Button>
            <Button 
              onClick={() => navigate('/alerts')}
              variant="outline"
              className="w-full"
            >
              🔔 Alerts
            </Button>
            <Button 
              onClick={() => navigate('/profile')}
              variant="outline"
              className="w-full"
            >
              👤 Profile
            </Button>
          </div>
        </div>

        {/* Active Queues */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Queues</h2>
          {userQueues.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-600 mb-4">You are not in any queue</p>
              <Button onClick={() => navigate('/map')}>Browse Assets</Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {userQueues.map((queue) => (
                <Card key={queue.id} className="hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{queue.asset_name}</h3>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span>Position: <strong>#{queue.queue_position}</strong></span>
                        <span>Est. Wait: <strong>{formatWaitTime(queue.estimated_wait)}</strong></span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => navigate(`/asset/${queue.asset_id}`)}
                        variant="secondary"
                        size="sm"
                      >
                        Details
                      </Button>
                      <Button 
                        onClick={() => navigate('/queue-status')}
                        size="sm"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Nearby Assets */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nearby Assets</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner text="Loading nearby assets..." />
            </div>
          ) : nearbyAssets.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-600">No assets found nearby</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyAssets.map((asset) => (
                <Card key={asset.id} className="hover:shadow-lg cursor-pointer" onClick={() => navigate(`/asset/${asset.id}`)}>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{asset.name}</h3>
                    <p className="text-sm text-gray-600">{asset.location}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Queue Length:</span>
                      <Badge variant={asset.queue_length > 30 ? 'danger' : asset.queue_length > 15 ? 'warning' : 'success'}>
                        {asset.queue_length} people
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Est. Wait:</span>
                      <span className="font-semibold">{formatWaitTime(asset.estimated_wait)}</span>
                    </div>
                    
                    <div className="border-t pt-3">
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/asset/${asset.id}`);
                        }}
                        className="w-full"
                        size="sm"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
