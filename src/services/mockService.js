// Mock del servicio de autenticación para testing
// Este archivo simula las respuestas del backend

import { mockApplications, mockUsers, mockMenu } from '../utils/mockData';

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock del login
export const mockLogin = async (credentials) => {
  await delay(1000); // Simular tiempo de respuesta del servidor
  
  const { username, password, applicationAlias } = credentials;
  
  // Validar aplicación - buscar por alias o usar el alias actual
  let application;
  if (applicationAlias === 'admin') {
    // Si es el panel admin, crear la aplicación dinámicamente
    application = {
      id: 'admin-app-id',
      alias: 'admin',
      name: import.meta.env.VITE_APP_NAME || 'Panel de Administración',
      description: 'Sistema de administración y gestión centralizada',
      isActive: true
    };
  } else if (applicationAlias === 'control-panel') {
    // Si es el control panel, crear la aplicación dinámicamente
    application = {
      _id: 'control-panel-id',
      alias: 'control-panel',
      name: import.meta.env.VITE_APP_NAME || 'Panel de Control Centralizado',
      description: 'Sistema centralizado de autenticación y gestión',
      isActive: true
    };
  } else {
    // Buscar en las aplicaciones mock
    application = mockApplications.find(app => app.alias === applicationAlias);
  }
  
  if (!application) {
    throw new Error('Aplicación no encontrada');
  }
  
  // Validar usuario (contraseñas de prueba)
  let user = null;
  if (username === 'admin' && password === 'admin123') {
    user = mockUsers.find(u => u.username === 'admin');
  } else if (username === 'vendedor1' && password === 'vend123') {
    user = mockUsers.find(u => u.username === 'vendedor1');
  } else if (username === 'superadmin' && password === '123456') {
    // Usuario del backend real
    user = {
      id: 'superadmin-id',
      username: 'superadmin',
      fullName: 'Super Administrador',
      email: 'superadmin@company.com',
      isActive: true,
      roles: [
        {
          application: application._id,
          roles: ['super-admin-role']
        }
      ]
    };
  } else if (username === 'demo' && password === 'demo123') {
    // Usuario demo adicional
    user = {
      _id: '3',
      username: 'demo',
      fullName: 'Usuario Demo',
      email: 'demo@empresa.com',
      isActive: true,
      roles: [
        {
          application: application._id,
          roles: ['demo-role-1']
        }
      ]
    };
  }
  
  if (!user) {
    throw new Error('Credenciales inválidas');
  }
  
  // Simular roles (simplificado para el demo)
  const roles = [
    { name: 'Administrador', description: 'Acceso completo al sistema' },
    { name: 'Usuario', description: 'Acceso básico' }
  ];
  
  // Generar menú dinámico según la aplicación
  let userMenu;
  if (applicationAlias === 'admin' || applicationAlias === 'control-panel') {
    // Menú específico para el panel administrativo
    userMenu = [
      {
        _id: '1',
        application: application.id || application._id,
        label: 'Dashboard',
        path: '/dashboard',
        icon: 'dashboard',
        order: 1,
        parent: null,
        isActive: true
      },
      {
        _id: '2',
        application: application.id || application._id,
        label: 'Administración',
        path: null,
        icon: 'settings',
        order: 2,
        parent: null,
        isActive: true
      },
      {
        _id: '3',
        application: application.id || application._id,
        label: 'Usuarios',
        path: '/users',
        icon: 'people',
        order: 1,
        parent: '2',
        isActive: true
      },
      {
        _id: '4',
        application: application.id || application._id,
        label: 'Aplicaciones',
        path: '/applications',
        icon: 'apps',
        order: 2,
        parent: '2',
        isActive: true
      },
      {
        _id: '5',
        application: application.id || application._id,
        label: 'Roles',
        path: '/roles',
        icon: 'security',
        order: 3,
        parent: '2',
        isActive: true
      },
      {
        _id: '6',
        application: application.id || application._id,
        label: 'Menús',
        path: '/menus',
        icon: 'menu',
        order: 4,
        parent: '2',
        isActive: true
      }
    ];
  } else {
    // Filtrar menú por aplicación desde los datos mock
    userMenu = mockMenu.filter(menu => menu.application === (application.id || application._id));
  }
  
  // Generar token mock
  const token = `mock-jwt-token-${Date.now()}`;
  
  return {
    success: true,
    user,
    application,
    roles,
    menu: userMenu,
    token
  };
};

// Mock para obtener aplicaciones disponibles
export const mockGetApplications = async () => {
  await delay(500);
  return { data: mockApplications };
};

// Mock para otros servicios
export const mockServices = {
  applications: {
    getAll: async () => {
      await delay(800);
      return { data: mockApplications };
    },
    create: async (data) => {
      await delay(1000);
      return { data: { ...data, _id: Date.now().toString() } };
    },
    update: async (id, data) => {
      await delay(1000);
      return { data: { ...data, _id: id } };
    },
    delete: async (id) => {
      await delay(800);
      return { success: true };
    }
  },
  users: {
    getAll: async () => {
      await delay(800);
      return { data: mockUsers };
    },
    create: async (data) => {
      await delay(1000);
      return { data: { ...data, _id: Date.now().toString() } };
    },
    update: async (id, data) => {
      await delay(1000);
      return { data: { ...data, _id: id } };
    },
    delete: async (id) => {
      await delay(800);
      return { success: true };
    }
  }
};
