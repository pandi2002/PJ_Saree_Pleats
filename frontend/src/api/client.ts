import axios from 'axios';

const API_BASE = '/api';

export const api = axios.create({
  baseURL: API_BASE
});

// Interceptor to attach Authorization Bearer token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pj_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
