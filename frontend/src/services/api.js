import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication
export const authAPI = {
  login: (credentials) => api.post('/token/', credentials),
  register: (userData) => api.post('/register/', userData),
  refreshToken: (refreshToken) => api.post('/token/refresh/', { refresh: refreshToken }),
  passwordResetRequest: (email) => api.post('/password-reset/', { email }),
  passwordResetConfirm: (token, newPassword) =>
    api.post('/password-reset/confirm/', { token, new_password: newPassword, new_password2: newPassword }),
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
  },
  getCurrentUser: () => api.get('/auth/user/')
};

// Users
export const usersAPI = {
  getAll: (params = {}) => api.get('/users/', { params }),
  getById: (id) => api.get(`/users/${id}/`),
  create: (user) => api.post('/users/', user),
  update: (id, user) => api.put(`/users/${id}/`, user),
  delete: (id) => api.delete(`/users/${id}/`),
};

// Programs
export const programsAPI = {
  getAll: () => api.get('/programs/'),
  getById: (id) => api.get(`/programs/${id}/`),
  create: (program) => api.post('/programs/', program),
  update: (id, program) => api.put(`/programs/${id}/`, program),
  delete: (id) => api.delete(`/programs/${id}/`),
};

// Batches
export const batchesAPI = {
  getAll: () => api.get('/batches/'),
  getById: (id) => api.get(`/batches/${id}/`),
  create: (batch) => api.post('/batches/', batch),
  update: (id, batch) => api.put(`/batches/${id}/`, batch),
  delete: (id) => api.delete(`/batches/${id}/`),
};

// Batch Trainees
export const batchTraineesAPI = {
  getAll: () => api.get('/batch-trainees/'),
  getById: (id) => api.get(`/batch-trainees/${id}/`),
  create: (batchTrainee) => api.post('/batch-trainees/', batchTrainee),
  update: (id, batchTrainee) => api.put(`/batch-trainees/${id}/`, batchTrainee),
  delete: (id) => api.delete(`/batch-trainees/${id}/`),
  getMyBatches: () => api.get('/batch-trainees/?trainee=current_user'),
};

// Progress Records
export const progressAPI = {
  getAll: () => api.get('/progress-records/'),
  getById: (id) => api.get(`/progress-records/${id}/`),
  create: (progress) => api.post('/progress-records/', progress),
  update: (id, progress) => api.put(`/progress-records/${id}/`, progress),
  delete: (id) => api.delete(`/progress-records/${id}/`),
  getMyProgress: () => api.get('/progress-records/?trainee=current_user'),
};

// Designations
export const designationsAPI = {
  getAll: () => api.get('/designations/'),
  getById: (id) => api.get(`/designations/${id}/`),
  create: (designation) => api.post('/designations/', designation),
  update: (id, designation) => api.put(`/designations/${id}/`, designation),
  delete: (id) => api.delete(`/designations/${id}/`),
};

// Classes
export const classesAPI = {
  getAll: () => api.get('/classes/'),
  getById: (id) => api.get(`/classes/${id}/`),
  create: (classData) => api.post('/classes/', classData),
  update: (id, classData) => api.put(`/classes/${id}/`, classData),
  delete: (id) => api.delete(`/classes/${id}/`),
};

export default api;
