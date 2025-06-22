import axios from 'axios';
import store from './store/store.js';
import { logout } from './store/authSlice';
import { logout as adminLogout } from './store/adminSlice';

axios.defaults.withCredentials = true;

console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// List of public routes that don't require authentication
const publicRoutes = [
  '/tenders',
  '/tenders/user',
  '/products',
  '/products/getAllProducts'
];

// Request interceptor to add token to requests
instance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const userToken = state.auth.token;
    const adminToken = state.admin.token;
    
    console.log("Request interceptor state:", {
      url: config.url,
      baseURL: config.baseURL,
      headers: config.headers,
      adminToken: adminToken ? "present" : "missing",
      userToken: userToken ? "present" : "missing",
      adminAuth: state.admin.adminAuth,
      admin: state.admin.admin
    });

    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }

    // Ensure headers object exists
    if (!config.headers) {
      config.headers = {};
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response error:", {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
      message: error.message
    });

    if (error.response && error.response.status === 401) {
      // Check if the current route is a public route
      const isPublicRoute = publicRoutes.some(route => 
        error.config.url.includes(route)
      );

      if (!isPublicRoute) {
        // Only handle authentication redirects for protected routes
        const state = store.getState();
        if (state.admin.adminAuth) {
          store.dispatch(adminLogout());
          window.location.href = '/adminLogin';
        } else {
          store.dispatch(logout());
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default instance;