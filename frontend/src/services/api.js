import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // You could inject additional headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || 'An unexpected error occurred';
    
    if (error.response?.status === 401) {
      if (error.config.url !== '/auth/me') {
        toast.error(message, { duration: 4000, position: 'top-right' });
      }
      
      // Prevent redirect loop if already on login
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        // Redirect to login on 401 Unauthorized
        window.location.href = '/login';
      }
    } else {
      // Toast all other errors
      toast.error(message, { duration: 4000, position: 'top-right' });
    }

    return Promise.reject(error);
  }
);

export default api;
