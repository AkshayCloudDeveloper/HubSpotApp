// src/api/api.ts
import axios from 'axios';
import { API_BASE_URL } from '@env'; // Import from .env
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetToLogin } from "./RootNavigation";

let logoutFn: (() => Promise<void>) | null = null;

export const setLogoutFunction = (fn: () => Promise<void>) => {
  logoutFn = fn;
};


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // optional timeout
  headers: {
    'Content-Type': 'application/json',
  },
});
console.log('API Base URL:', API_BASE_URL);

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error('Error getting token from storage:', e);
  }
  return config;
});

// Optionally, you can add interceptors for auth tokens etc.
api.interceptors.response.use(
  
  response => response,
  async (error) => {
    if (error.response?.status === 401  && logoutFn) {
      await AsyncStorage.multiRemove(['authToken', 'refreshToken']);
      // Optional: add event emitter or navigation reset here
      await logoutFn();
      resetToLogin();
    }
    return Promise.reject(error);
  },
  // error => {
  //   // Global error handling
  //   console.error('API Error:', error.response || error.message);
  //   return Promise.reject(error);
  // }
);

export default api;
