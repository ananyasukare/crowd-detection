import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

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
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: async (email, password) => {
    const formData = new FormData();
    formData.append('username', email); // FastAPI OAuth2 expects 'username'
    formData.append('password', password);
    const response = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response;
  },
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Office APIs
export const officeAPI = {
  getAll: (params) => api.get('/offices/', { params }),
  getById: (id) => api.get(`/offices/${id}`),
  create: (data) => api.post('/offices/', data),
};

// Token APIs
export const tokenAPI = {
  book: (data) => api.post('/tokens/', data),
  getMyTokens: () => api.get('/tokens/my'),
  getById: (id) => api.get(`/tokens/${id}`),
};

// Admin APIs
export const adminAPI = {
  getDashboard: (officeId) => api.get(`/admin/dashboard/${officeId}`),
  getQueue: (officeId) => api.get(`/admin/queue/${officeId}`),
  updateTokenStatus: (tokenId, status) => api.post(`/admin/token/${tokenId}/status`, null, { params: { new_status: status } }),
  updateCrowdCount: (officeId, count) => api.post(`/admin/office/${officeId}/crowd`, null, { params: { count } }),
};

export const superAdminAPI = {
  listAdmins: () => api.get('/super-admin/admins'),
  createAdmin: (adminData, officeId) => api.post('/super-admin/admins', adminData, { params: { office_id: officeId } }),
  deleteAdmin: (adminId) => api.delete(`/super-admin/admins/${adminId}`),
  updateAdmin: (adminId, data) => api.put(`/super-admin/admins/${adminId}`, null, { params: data }),
  deleteOffice: (officeId) => api.delete(`/super-admin/offices/${officeId}`),
};

export default api;
