import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5002/api'
});

// Create a separate instance for public endpoints (like contact form)
export const publicApi = axios.create({
  baseURL: 'http://localhost:5002/api'
});

// Add request interceptor to publicApi to prevent caching
publicApi.interceptors.request.use(config => {
  // Add cache control headers to prevent caching
  config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  config.headers['Pragma'] = 'no-cache';
  config.headers['Expires'] = '0';
  
  return config;
}, error => {
  return Promise.reject(error);
});

// Store refresh promise to prevent multiple concurrent refreshes
let refreshTokenPromise = null;

// Function to refresh token
const refreshToken = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await axios.post('http://localhost:5002/api/auth/refresh', {}, {
      headers: {
        'x-auth-token': token
      }
    });
    
    const newToken = response.data.token;
    localStorage.setItem('token', newToken);
    return newToken;
  } catch (error) {
    // If refresh fails, remove token and redirect to login
    localStorage.removeItem('token');
    window.location.href = '/superadmin/login';
    throw error;
  }
};

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  
  // Add cache control headers to prevent caching
  config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  config.headers['Pragma'] = 'no-cache';
  config.headers['Expires'] = '0';
  
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // If we're already refreshing token, wait for it
      if (refreshTokenPromise) {
        try {
          const newToken = await refreshTokenPromise;
          originalRequest.headers['x-auth-token'] = newToken;
          return api(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      
      // Start token refresh
      refreshTokenPromise = refreshToken();
      
      try {
        const newToken = await refreshTokenPromise;
        originalRequest.headers['x-auth-token'] = newToken;
        refreshTokenPromise = null;
        return api(originalRequest);
      } catch (err) {
        refreshTokenPromise = null;
        return Promise.reject(err);
      }
    }
    
    // For other 401 errors, redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if we're not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/superadmin/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;