import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAssets } from '../hooks/useContexts';
import { useQueue } from '../hooks/useContexts';
import { useToast } from '../hooks/useToast';
import { Button, Card, LoadingSpinner, Badge, Alert } from '../components/UI';
import { formatWaitTime, getQueueStatusBgClass } from '../utils/helpers';

export default function AssetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedAsset, fetchAssetDetails, loading } = useAssets();
  const { joinQueue } = useQueue();
  const { success, error: showError } = useToast();
  const [joining, setJoining] = useState(false);
  const [alreadyInQueue, setAlreadyInQueue] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAssetDetails(id);
    }
  }, [id]);

  const handleJoinQueue = async () => {
    setJoining(true);
    const result = await joinQueue(id);
    if (result.success) {
      success('Successfully joined the queue!');
      setAlreadyInQueue(true);
      setTimeout(() => navigate('/queue-status'), 2000);
    } else {
      showError(result.error);
    }
    setJoining(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading asset details..." />
      </div>
    );
  }

  if (!selectedAsset) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Alert type="error" message="Asset not found" />
          <Button onClick={() => navigate('/dashboard')} className="mt-4">Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Button onClick={() => navigate(-1)} variant="secondary" className="mb-4">← Back</Button>
            <h1 className="text-3xl font-bold text-gray-900">{selectedAsset.name}</h1>
            <p className="text-gray-600 mt-2">{selectedAsset.location}</p>
          </div>
        </div>

        {alreadyInQueue && (
          <Alert type="success" message="You have been added to the queue. Redirecting..." className="mb-6" />
        )}

        {/* Main Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <h3 className="text-gray-600 text-sm mb-2">Queue Length</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-gray-900">{selectedAsset.queue_length}</p>
              <p className="text-gray-600">people</p>
            </div>
            <Badge variant={selectedAsset.queue_length > 30 ? 'danger' : selectedAsset.queue_length > 15 ? 'warning' : 'success'} className="mt-2">
              {selectedAsset.queue_length > 30 ? 'High Queue' : selectedAsset.queue_length > 15 ? 'Medium Queue' : 'Low Queue'}
            </Badge>
          </Card>

          <Card>
            <h3 className="text-gray-600 text-sm mb-2">Estimated Wait Time</h3>
            <p className="text-4xl font-bold text-gray-900">{formatWaitTime(selectedAsset.estimated_wait)}</p>
            <p className="text-gray-600 text-sm mt-2">AI-predicted time</p>
          </Card>

          <Card>
            <h3 className="text-gray-600 text-sm mb-2">Status</h3>
            <Badge variant={selectedAsset.is_open ? 'success' : 'danger'}>
              {selectedAsset.is_open ? 'Open' : 'Closed'}
            </Badge>
            <p className="text-gray-600 text-sm mt-2">
              {selectedAsset.hours}
            </p>
          </Card>
        </div>

        {/* Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Asset Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm">Type</p>
                <p className="font-semibold text-gray-900">{selectedAsset.type}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Services</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedAsset.services?.map((service) => (
                    <Badge key={service} variant="primary">{service}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Contact</p>
                <p className="font-semibold text-gray-900">{selectedAsset.phone}</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">⏰ Operating Hours</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <p className="text-gray-600">Monday - Friday</p>
                <p className="font-semibold">9:00 AM - 5:00 PM</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Saturday</p>
                <p className="font-semibold">10:00 AM - 3:00 PM</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Sunday</p>
                <p className="font-semibold">Closed</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Queue Trends */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📈 Queue Trends (Last 24h)</h2>
          <div className="bg-gray-100 rounded-lg p-4 h-48 flex items-end justify-around">
            {[5, 12, 8, 15, 22, 18, 12, 8].map((val, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div 
                  className="bg-violet-600 rounded-t-lg" 
                  style={{ width: '30px', height: `${(val / 25) * 150}px` }}
                />
                <p className="text-xs text-gray-600 mt-2">{3 * idx}h</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Action */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Join This Queue</h3>
              <p className="text-gray-600 text-sm">Get a position in the queue and track your status</p>
            </div>
            <Button 
              onClick={handleJoinQueue}
              loading={joining}
              disabled={alreadyInQueue}
              size="lg"
            >
              {alreadyInQueue ? '✓ Added to Queue' : 'Join Queue'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
