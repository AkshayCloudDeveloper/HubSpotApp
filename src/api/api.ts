// src/api/api.ts
import axios from 'axios';
import { API_BASE_URL } from '@env'; // Import from .env

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // optional timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optionally, you can add interceptors for auth tokens etc.
api.interceptors.response.use(
  response => response,
  error => {
    // Global error handling
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
