import axios from 'axios';
import store from './store/store.js';
import { logout } from './store/authSlice';

axios.defaults.withCredentials = true;

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);

// Request interceptor to add token to requests
instance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      store.dispatch(logout());
      window.location.href = '/login'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default instance;