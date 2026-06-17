import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // send httpOnly cookie on every request
});

// ── Response interceptor: normalize error messages ────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      return Promise.reject(new Error('Cannot connect to server. Make sure the backend is running on port 5000.'));
    }

    // If the backend returns 404 for a GET on a collection endpoint (no data),
    // treat it as an empty list instead of an error so the UI can show
    // its empty state without showing a toast notification.
    try {
      const status = err.response.status;
      const method = err.config?.method?.toLowerCase();
      const url = err.config?.url || '';

      const looksLikeCollectionGet = method === 'get' && /\/[a-zA-Z0-9_-]+s(\/|$|\?)/.test(url);
      if (status === 404 && looksLikeCollectionGet) {
        return Promise.resolve({ data: [], status: 200, statusText: 'OK', headers: err.response.headers, config: err.config });
      }
    } catch (e) {
      // fallthrough to error normalization below
    }

    const msg =
      err.response?.data?.message ||
      err.response?.data?.error   ||
      err.message                 ||
      'Something went wrong';
    const e = new Error(msg);
    // Attach original response for callers that need status/data for debugging
    e.status = err.response?.status;
    e.response = err.response;
    return Promise.reject(e);
  }
);

/* ── Auth ─────────────────────────────────────────────────────────────────── */
export const authAPI = {
  register:       (data)  => api.post('/auth/register', data),
  login:          (data)  => api.post('/auth/login', data),
  me:             ()      => api.get('/auth/me'),
  logout:         ()      => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword:  (data)  => api.post('/auth/reset-password', data),
};

/* ── Complaints ──────────────────────────────────────────────────────────── */
export const complaintsAPI = {
  getAll:          (params) => api.get('/complaints', { params }),
  getAssignedToMe: ()       => api.get('/complaints/assigned-to-me'),
  getMySubmissions:()       => api.get('/complaints/my-submissions'),
  getById:         (id)     => api.get(`/complaints/${id}`),
  getStats:        ()       => api.get('/complaints/stats'),
  create:          (formData) =>
    api.post('/complaints', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateStatus:    (id, data) => api.put(`/complaints/${id}/status`, data),
  assign:          (id, data) => api.put(`/complaints/${id}/assign`, data),
  delete:          (id)       => api.delete(`/complaints/${id}`),
};

/* ── Users ───────────────────────────────────────────────────────────────── */
export const usersAPI = {
  getProfile:    ()         => api.get('/users/profile'),
  updateProfile: (formData) =>
    api.put('/users/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll:        ()         => api.get('/users'),
  getFaculty:    (params)   => api.get('/users/faculty', { params }),
  create:        (data)     => api.post('/users', data),
  delete:        (id)       => api.delete(`/users/${id}`),
};

/* ── Reference tables (departments / roles) ──────────────────────────────── */
export const refsAPI = {
  getDepartments: () => api.get('/refs/departments'),
  getRoles:       () => api.get('/refs/roles'),
};

export default api;
