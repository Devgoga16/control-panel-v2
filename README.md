# Panel de Control - Autenticación Centralizada

Panel de Control Frontend para manejo de autenticación multiaplicación con menús dinámicos basados en roles.

## 🚀 Características

- **Autenticación Multiaplicación**: Los usuarios pueden autenticarse en diferentes sistemas con el mismo panel
- **Roles Dinámicos**: Cada usuario puede tener múltiples roles en diferentes aplicaciones
- **Menús Jerárquicos**: Sistema de menús dinámicos generados según los roles del usuario
- **Gestión CRUD**: Administración completa de Usuarios, Aplicaciones, Roles y Menús
- **Interfaz Moderna**: Desarrollado con React + Material-UI para una experiencia de usuario óptima

## 🛠 Tecnologías

- **React 18** con Vite
- **Material-UI** para componentes
- **React Router** para navegación
- **React Hook Form** para manejo de formularios
- **Axios** para peticiones HTTP
- **Context API** para manejo de estado

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Login.jsx       # Componente de autenticación
│   ├── DashboardLayout.jsx  # Layout principal con menú
│   └── ProtectedRoute.jsx   # Protección de rutas
├── pages/              # Páginas principales
│   ├── Dashboard.jsx   # Panel principal
│   ├── Applications.jsx    # Gestión de aplicaciones
│   └── Users.jsx       # Gestión de usuarios
├── contexts/           # Context API
│   └── AuthContext.jsx # Contexto de autenticación
├── services/           # Servicios de API
│   ├── api.js         # Configuración de Axios
│   └── dataServices.js # Servicios específicos
└── utils/              # Utilidades
    └── iconMapping.js  # Mapeo de iconos para menús
```

## 🔧 Configuración del Environment

### Variables de Entorno

El proyecto utiliza variables de entorno para configurar diferentes aspectos:

1. **Copia el archivo de ejemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Edita el archivo `.env`:**
   ```env
   # URL del Backend API
   VITE_API_BASE_URL=http://localhost:3001/api

   # Alias único de esta aplicación 
   VITE_APP_ALIAS=control-panel

   # Nombre descriptivo de la aplicación
   VITE_APP_NAME=Panel de Control Centralizado

   # Modo de desarrollo
   VITE_DEV_MODE=true
   ```

### ⚠️ Importante: Alias de Aplicación

Cada sistema que implementes debe tener su propio **alias único**:

- **Control Panel**: `control-panel`
- **Sistema CRM**: `crm`
- **Sistema ERP**: `erp`
- **Panel Admin**: `admin`

El alias se envía automáticamente en todas las peticiones HTTP mediante el header `X-App-Alias`.

## 🏃‍♂️ Instalación y Ejecución

### Prerequisitos
- Node.js >= 16
- npm o yarn

### Pasos

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus valores
   ```

3. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   - El proyecto se ejecutará en `http://localhost:5173`

## 🔐 Autenticación

### Sin Selector de Aplicación
- Cada sistema tiene su alias fijo configurado en `.env`
- El usuario solo ingresa usuario y contraseña
- La aplicación se identifica automáticamente

### Credenciales de Prueba
- **Usuario:** `admin` | **Contraseña:** `admin123`
- **Usuario:** `demo` | **Contraseña:** `demo123`

## 🔧 Configuración del Backend

El frontend espera que el backend tenga los siguientes endpoints:

### Autenticación
- `POST /api/auth/login` - Login con username, password y applicationAlias
- `GET /api/auth/applications` - Lista de aplicaciones disponibles

### CRUD Endpoints
- `GET /api/applications` - Lista de aplicaciones
- `POST /api/applications` - Crear aplicación
- `PUT /api/applications/:id` - Actualizar aplicación
- `DELETE /api/applications/:id` - Eliminar aplicación

- `GET /api/users` - Lista de usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

(Similar para `/api/roles` y `/api/menus`)

## 🎨 Características de la UI

### Login
- Campo de usuario, contraseña y selector de aplicación
- Validación de formularios
- Manejo de errores
- Loading states

### Dashboard
- Vista general con estadísticas
- Información del usuario y aplicación actual
- Lista de roles y menús disponibles

### Gestión de Entidades
- Tablas con paginación y filtros
- Formularios modales para CRUD
- Confirmaciones para eliminación
- Estados de carga y error

### Menú Dinámico
- Generación automática basada en roles
- Soporte para menús jerárquicos (padre-hijo)
- Iconos personalizables
- Colapso/expansión de submenús

## 🔒 Seguridad

- Rutas protegidas con autenticación
- Tokens JWT almacenados de forma segura
- Interceptores para manejo automático de tokens expirados
- Validación de formularios tanto en frontend como backend

## 🚀 Build para Producción

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/` listos para desplegar.

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit los cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

## 📝 Próximas Funcionalidades

- [ ] Gestión completa de Roles
- [ ] Gestión completa de Menús
- [ ] Asignación de roles por usuario y aplicación
- [ ] Sistema de permisos granulares
- [ ] Auditoría de accesos
- [ ] Notificaciones en tiempo real
- [ ] Tema oscuro/claro
- [ ] Exportación de datos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
