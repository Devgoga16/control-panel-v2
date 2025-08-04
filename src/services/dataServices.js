import api from './api';

// Helper para manejar fallback a mock
const withMockFallback = async (apiCall, mockCall) => {
  try {
    return await apiCall();
  } catch (error) {
    if (import.meta.env.VITE_DEV_MODE === 'true') {
      console.log('API no disponible, usando mock...', error.message);
      return await mockCall();
    }
    throw error;
  }
};

// Servicios para Applications
export const applicationService = {
  getAll: () => withMockFallback(
    () => api.get('/applications'),
    async () => {
      const { mockServices } = await import('./mockService');
      return mockServices.applications.getAll();
    }
  ),
  getById: (id) => api.get(`/applications/${id}`),
  create: (data) => withMockFallback(
    () => api.post('/applications', data),
    async () => {
      const { mockServices } = await import('./mockService');
      return mockServices.applications.create(data);
    }
  ),
  update: (id, data) => withMockFallback(
    () => api.put(`/applications/${id}`, data),
    async () => {
      const { mockServices } = await import('./mockService');
      return mockServices.applications.update(id, data);
    }
  ),
  delete: (id) => withMockFallback(
    () => api.delete(`/applications/${id}`),
    async () => {
      const { mockServices } = await import('./mockService');
      return mockServices.applications.delete(id);
    }
  ),
};

// Servicios para Users
export const userService = {
  getAll: () => withMockFallback(
    () => api.get('/users'),
    async () => {
      const { mockServices } = await import('./mockService');
      return mockServices.users.getAll();
    }
  ),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => withMockFallback(
    () => api.post('/users', data),
    async () => {
      const { mockServices } = await import('./mockService');
      return mockServices.users.create(data);
    }
  ),
  update: (id, data) => withMockFallback(
    () => api.put(`/users/${id}`, data),
    async () => {
      const { mockServices } = await import('./mockService');
      return mockServices.users.update(id, data);
    }
  ),
  delete: (id) => withMockFallback(
    () => api.delete(`/users/${id}`),
    async () => {
      const { mockServices } = await import('./mockService');
      return mockServices.users.delete(id);
    }
  ),
  getUsersByApplication: (applicationId) => api.get(`/users/application/${applicationId}`),
};

// Servicios para Roles
export const roleService = {
  getAll: () => api.get('/roles'),
  getById: (id) => api.get(`/roles/${id}`),
  create: (data) => api.post('/roles', data),
  update: (id, data) => api.put(`/roles/${id}`, data),
  delete: (id) => api.delete(`/roles/${id}`),
  getRolesByApplication: (applicationId) => api.get(`/roles/application/${applicationId}`),
};

// Servicios para Menus
export const menuService = {
  getAll: () => api.get('/menus'),
  getById: (id) => api.get(`/menus/${id}`),
  create: (data) => api.post('/menus', data),
  update: (id, data) => api.put(`/menus/${id}`, data),
  delete: (id) => api.delete(`/menus/${id}`),
  getMenusByApplication: (applicationId) => api.get(`/menus/application/${applicationId}`),
  getMenuHierarchy: (applicationId) => api.get(`/menus/hierarchy/${applicationId}`),
};

// Servicio de autenticación
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  getApplications: () => api.get('/auth/applications'), // Para el selector de aplicaciones (ya no se usa)
};
