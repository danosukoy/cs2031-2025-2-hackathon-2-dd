import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cs2031-2025-2-hackathon-2-backend-production.up.railway.app/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;