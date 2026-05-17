import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/alerts');
      setAlerts(response.data.alerts || []);
      return { success: true, alerts: response.data.alerts || [] };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch alerts';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const markAlertAsRead = useCallback(async (alertId) => {
    try {
      await axios.put(`/api/alerts/${alertId}/read`);
      const updatedAlerts = alerts.map(a => 
        a.id === alertId ? { ...a, is_read: true } : a
      );
      setAlerts(updatedAlerts);
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to mark alert as read';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [alerts]);

  const deleteAlert = useCallback(async (alertId) => {
    try {
      await axios.delete(`/api/alerts/${alertId}`);
      setAlerts(alerts.filter(a => a.id !== alertId));
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete alert';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [alerts]);

  const value = {
    alerts,
    loading,
    error,
    fetchAlerts,
    markAlertAsRead,
    deleteAlert,
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};
