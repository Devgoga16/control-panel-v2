// Archivo de ejemplo para datos de prueba
// Este archivo puede ser usado para testing y desarrollo

export const mockApplications = [
  {
    _id: '1',
    alias: 'admin',
    name: 'Panel Administrativo',
    description: 'Sistema de administración principal',
    isActive: true
  },
  {
    _id: '2',
    alias: 'crm',
    name: 'Sistema CRM',
    description: 'Gestión de relaciones con clientes',
    isActive: true
  },
  {
    _id: '3',
    alias: 'erp',
    name: 'Sistema ERP',
    description: 'Planificación de recursos empresariales',
    isActive: true
  }
];

export const mockUsers = [
  {
    _id: '1',
    username: 'admin',
    fullName: 'Administrador del Sistema',
    email: 'admin@empresa.com',
    isActive: true,
    roles: [
      {
        application: '1',
        roles: ['admin-role-1', 'admin-role-2']
      }
    ]
  },
  {
    _id: '2',
    username: 'vendedor1',
    fullName: 'Juan Pérez',
    email: 'juan.perez@empresa.com',
    isActive: true,
    roles: [
      {
        application: '2',
        roles: ['vendedor-role-1']
      }
    ]
  }
];

export const mockMenu = [
  {
    _id: '1',
    application: '1',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'dashboard',
    order: 1,
    parent: null,
    isActive: true
  },
  {
    _id: '2',
    application: '1',
    label: 'Administración',
    path: null,
    icon: 'settings',
    order: 2,
    parent: null,
    isActive: true
  },
  {
    _id: '3',
    application: '1',
    label: 'Usuarios',
    path: '/users',
    icon: 'people',
    order: 1,
    parent: '2',
    isActive: true
  },
  {
    _id: '4',
    application: '1',
    label: 'Aplicaciones',
    path: '/applications',
    icon: 'apps',
    order: 2,
    parent: '2',
    isActive: true
  }
];
