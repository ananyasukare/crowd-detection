import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueue } from '../hooks/useContexts';
import { useToast } from '../hooks/useToast';
import { Button, Card, LoadingSpinner, Badge } from '../components/UI';
import { formatWaitTime } from '../utils/helpers';

export default function QueueStatus() {
  const navigate = useNavigate();
  const { userQueues, fetchUserQueues, leaveQueue, loading } = useQueue();
  const { success } = useToast();
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchUserQueues();
    const interval = setInterval(() => {
      if (autoRefresh) {
        fetchUserQueues();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleLeaveQueue = async (queueId) => {
    const result = await leaveQueue(queueId);
    if (result.success) {
      success('You have left the queue');
      if (selectedQueue?.id === queueId) {
        setSelectedQueue(null);
      }
    }
  };

  if (loading && userQueues.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading queue status..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Queue Status</h1>
            <p className="text-gray-600 mt-2">Track your position in active queues</p>
          </div>
          <div className="flex gap-2">
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-600">Auto-refresh</span>
            </label>
            <Button onClick={() => navigate('/dashboard')}>Back</Button>
          </div>
        </div>

        {userQueues.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600 mb-4">No active queues</p>
            <Button onClick={() => navigate('/map')}>Browse Assets to Join Queues</Button>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Queue List */}
            <div className="lg:col-span-2 space-y-4">
              {userQueues.map((queue) => (
                <Card 
                  key={queue.id}
                  className={`cursor-pointer transition ${selectedQueue?.id === queue.id ? 'ring-2 ring-violet-600' : ''}`}
                  onClick={() => setSelectedQueue(queue)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{queue.asset_name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{queue.asset_location}</p>
                      
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-gray-600 text-xs">YOUR POSITION</p>
                          <p className="text-3xl font-bold text-violet-400">#{queue.queue_position}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs">ESTIMATED WAIT</p>
                          <p className="text-2xl font-bold text-gray-900">{formatWaitTime(queue.estimated_wait)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs">TOTAL IN QUEUE</p>
                          <p className="text-2xl font-bold text-gray-900">{queue.total_in_queue}</p>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{Math.round((queue.queue_position / queue.total_in_queue) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-violet-600 h-2 rounded-full transition-all"
                            style={{ width: `${(queue.queue_position / queue.total_in_queue) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLeaveQueue(queue.id);
                      }}
                      variant="danger"
                      size="sm"
                    >
                      Leave
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Details Panel */}
            <div>
              {selectedQueue ? (
                <Card>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Queue Details</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600 text-sm">Status</p>
                      <Badge variant="success" className="mt-1">Active</Badge>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Current Serving</p>
                      <p className="font-bold text-lg text-gray-900 mt-1">#{selectedQueue.currently_serving || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Ahead of You</p>
                      <p className="font-bold text-lg text-gray-900 mt-1">{Math.max(0, selectedQueue.queue_position - 1)} people</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Behind You</p>
                      <p className="font-bold text-lg text-gray-900 mt-1">{Math.max(0, selectedQueue.total_in_queue - selectedQueue.queue_position)} people</p>
                    </div>
                    <div className="pt-4 border-t border-gray-700">
                      <div className="bg-violet-900 bg-opacity-30 p-3 rounded-lg border border-violet-700">
                        <p className="text-xs text-gray-300">Estimated Time</p>
                        <p className="text-2xl font-bold text-violet-400 mt-1">{formatWaitTime(selectedQueue.estimated_wait)}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleLeaveQueue(selectedQueue.id)}
                      variant="danger"
                      className="w-full mt-4"
                    >
                      Leave Queue
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="text-center py-8">
                  <p className="text-gray-600">Select a queue to view details</p>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
