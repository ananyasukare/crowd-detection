import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlerts } from '../hooks/useContexts';
import { Button, Card, LoadingSpinner, Badge } from '../components/UI';
import { useToast } from '../hooks/useToast';

export default function Alerts() {
  const navigate = useNavigate();
  const { alerts, fetchAlerts, markAlertAsRead, deleteAlert, loading } = useAlerts();
  const { success } = useToast();

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (alertId) => {
    const result = await markAlertAsRead(alertId);
    if (result.success) {
      success('Alert marked as read');
    }
  };

  const handleDelete = async (alertId) => {
    const result = await deleteAlert(alertId);
    if (result.success) {
      success('Alert deleted');
    }
  };

  const unreadCount = alerts.filter(a => !a.is_read).length;

  if (loading && alerts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading alerts..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-2">
              {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          <Button onClick={() => navigate('/dashboard')}>Back</Button>
        </div>

        {alerts.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-gray-600">No alerts right now</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card 
                key={alert.id}
                className={`${!alert.is_read ? 'border-l-4 border-violet-600' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-900">{alert.title}</h3>
                      {!alert.is_read && (
                        <Badge variant="primary">New</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{alert.message}</p>
                    <div className="flex justify-between mt-3 text-xs text-gray-500">
                      <span>{new Date(alert.created_at).toLocaleString()}</span>
                      <span className="text-violet-400 font-semibold">{alert.type}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {!alert.is_read && (
                      <Button 
                        onClick={() => handleMarkAsRead(alert.id)}
                        variant="secondary"
                        size="sm"
                      >
                        Mark Read
                      </Button>
                    )}
                    <Button 
                      onClick={() => handleDelete(alert.id)}
                      variant="danger"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
