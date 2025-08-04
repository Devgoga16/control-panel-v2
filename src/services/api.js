import axios from 'axios';

// Configuración base de la API usando variables de entorno
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar información de la aplicación a todas las requests
api.interceptors.request.use(
  (config) => {
    // Agregar el token de autenticación si existe
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Temporalmente comentado hasta que el backend permita este header
    // config.headers['X-App-Alias'] = import.meta.env.VITE_APP_ALIAS || 'control-panel';
    
    // Log en modo desarrollo
    if (import.meta.env.VITE_DEV_MODE === 'true') {
      console.log('API Request:', {
        method: config.method,
        url: config.url,
        // appAlias: config.headers['X-App-Alias'],
        hasToken: !!token
      });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => {
    // Log en modo desarrollo
    if (import.meta.env.VITE_DEV_MODE === 'true') {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url
      });
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Log de errores en modo desarrollo
    if (import.meta.env.VITE_DEV_MODE === 'true') {
      console.error('API Error:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        url: error.config?.url
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;
