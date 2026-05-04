import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),
  register: (name, email, password, phone) =>
    api.post('/api/auth/register', { name, email, password, phone }),
  logout: () => api.post('/api/auth/logout'),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
  changePassword: (currentPassword, newPassword) =>
    api.post('/api/auth/change-password', { current_password: currentPassword, new_password: newPassword }),
};

// Asset APIs
export const assetAPI = {
  getAllAssets: (filters = {}) =>
    api.get('/api/assets', { params: filters }),
  getNearbyAssets: (latitude, longitude, radius = 5) =>
    api.get('/api/assets/nearby', { params: { latitude, longitude, radius } }),
  getAssetById: (id) =>
    api.get(`/api/assets/${id}`),
  createAsset: (data) =>
    api.post('/api/assets', data),
  updateAsset: (id, data) =>
    api.put(`/api/assets/${id}`, data),
  deleteAsset: (id) =>
    api.delete(`/api/assets/${id}`),
  getAssetStats: (id) =>
    api.get(`/api/assets/${id}/stats`),
};

// Queue APIs
export const queueAPI = {
  joinQueue: (assetId) =>
    api.post('/api/queue/join', { asset_id: assetId }),
  leaveQueue: (queueId) =>
    api.post(`/api/queue/${queueId}/leave`),
  getUserQueues: () =>
    api.get('/api/queue/user'),
  getQueueDetails: (queueId) =>
    api.get(`/api/queue/${queueId}`),
  getAssetQueueStatus: (assetId) =>
    api.get(`/api/queue/asset/${assetId}/status`),
  getQueueHistory: () =>
    api.get('/api/queue/history'),
};

// Alert APIs
export const alertAPI = {
  getAllAlerts: () =>
    api.get('/api/alerts'),
  getAlertById: (id) =>
    api.get(`/api/alerts/${id}`),
  markAsRead: (id) =>
    api.put(`/api/alerts/${id}/read`),
  deleteAlert: (id) =>
    api.delete(`/api/alerts/${id}`),
  createAlert: (data) =>
    api.post('/api/alerts', data),
};

// Analytics APIs (for admin)
export const analyticsAPI = {
  getQueueAnalytics: (assetId, dateRange = 'week') =>
    api.get(`/api/analytics/queue/${assetId}`, { params: { range: dateRange } }),
  getAssetAnalytics: (assetId, dateRange = 'week') =>
    api.get(`/api/analytics/asset/${assetId}`, { params: { range: dateRange } }),
  getDashboardAnalytics: (dateRange = 'week') =>
    api.get('/api/analytics/dashboard', { params: { range: dateRange } }),
};

// Settings APIs (for admin)
export const settingsAPI = {
  getSettings: () =>
    api.get('/api/settings'),
  updateSettings: (data) =>
    api.put('/api/settings', data),
};

export default api;

