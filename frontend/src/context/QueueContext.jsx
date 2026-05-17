import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';

export const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [userQueues, setUserQueues] = useState([]);
  const [queueDetails, setQueueDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const joinQueue = useCallback(async (assetId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/queue/join', { asset_id: assetId });
      const newQueue = response.data.queue;
      setUserQueues([...userQueues, newQueue]);
      return { success: true, queue: newQueue };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to join queue';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [userQueues]);

  const leaveQueue = useCallback(async (queueId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`/api/queue/${queueId}/leave`);
      setUserQueues(userQueues.filter(q => q.id !== queueId));
      if (queueDetails?.id === queueId) {
        setQueueDetails(null);
      }
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to leave queue';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [userQueues, queueDetails]);

  const fetchUserQueues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/queue/user');
      setUserQueues(response.data.queues || []);
      return { success: true, queues: response.data.queues || [] };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch user queues';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQueueDetails = useCallback(async (queueId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/queue/${queueId}`);
      setQueueDetails(response.data.queue);
      return { success: true, queue: response.data.queue };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch queue details';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAssetQueueStatus = useCallback(async (assetId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/queue/asset/${assetId}/status`);
      return { success: true, status: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch queue status';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    userQueues,
    queueDetails,
    loading,
    error,
    joinQueue,
    leaveQueue,
    fetchUserQueues,
    fetchQueueDetails,
    fetchAssetQueueStatus,
  };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
};
