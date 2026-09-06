import axios from 'axios';
import { useStore } from '../store/useStore.js';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach Authorization or Demo User ID header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillswap_token');
  const demoUserId = useStore.getState().currentDemoUserId;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (demoUserId) {
    config.headers['x-demo-user-id'] = demoUserId;
  }

  return config;
});
