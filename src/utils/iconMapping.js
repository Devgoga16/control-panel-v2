import {
  Dashboard,
  People,
  Settings,
  Security,
  Apps,
  Menu as MenuIcon,
  Home,
  Person,
  Group,
  AdminPanelSettings,
  Business,
  ViewList,
  AccountTree,
  SupervisorAccount,
  ManageAccounts,
  Assessment,
  Analytics,
  BarChart,
  PieChart,
  TrendingUp,
  Storage,
  CloudUpload,
  Download,
  Upload,
  Folder,
  Description,
  Email,
  Phone,
  LocationOn,
  Event,
  Schedule,
  Today,
  DateRange,
  ShoppingCart,
  Payment,
  Receipt,
  Inventory,
  Category,
  Store,
  Sell,
  LocalShipping,
  Assignment,
  Task,
  ListAlt,
  CheckCircle,
  Warning,
  Error,
  Info,
  Help,
  Support,
  ContactSupport,
  Notifications,
  NotificationImportant
} from '@mui/icons-material';

// Mapeo de nombres de iconos a componentes de Material-UI
const iconMap = {
  // Principales
  'dashboard': Dashboard,
  'home': Home,
  'people': People,
  'person': Person,
  'group': Group,
  'settings': Settings,
  'security': Security,
  'apps': Apps,
  'menu': MenuIcon,
  
  // Administración
  'admin': AdminPanelSettings,
  'admin-panel': AdminPanelSettings,
  'supervisor': SupervisorAccount,
  'manage-accounts': ManageAccounts,
  'business': Business,
  
  // Navegación y Listas
  'list': ViewList,
  'view-list': ViewList,
  'tree': AccountTree,
  'list-alt': ListAlt,
  
  // Reportes y Analytics
  'assessment': Assessment,
  'analytics': Analytics,
  'bar-chart': BarChart,
  'pie-chart': PieChart,
  'trending': TrendingUp,
  'chart': BarChart,
  
  // Archivos y Storage
  'storage': Storage,
  'folder': Folder,
  'document': Description,
  'file': Description,
  'upload': CloudUpload,
  'download': Download,
  
  // Comunicación
  'email': Email,
  'mail': Email,
  'phone': Phone,
  'location': LocationOn,
  
  // Calendario y Tiempo
  'event': Event,
  'calendar': DateRange,
  'schedule': Schedule,
  'today': Today,
  'date': DateRange,
  
  // E-commerce
  'shopping': ShoppingCart,
  'cart': ShoppingCart,
  'payment': Payment,
  'receipt': Receipt,
  'inventory': Inventory,
  'category': Category,
  'store': Store,
  'sell': Sell,
  'shipping': LocalShipping,
  
  // Tareas y Asignaciones
  'assignment': Assignment,
  'task': Task,
  'tasks': ListAlt,
  'check': CheckCircle,
  'complete': CheckCircle,
  
  // Estados y Notificaciones
  'warning': Warning,
  'error': Error,
  'info': Info,
  'help': Help,
  'support': Support,
  'contact': ContactSupport,
  'notifications': Notifications,
  'alert': NotificationImportant,
};

/**
 * Obtiene el componente de icono correspondiente al nombre
 * @param {string} iconName - Nombre del icono
 * @returns {React.Component|null} - Componente del icono o null si no existe
 */
export function getIconComponent(iconName) {
  if (!iconName) return null;
  
  // Convertir a lowercase y reemplazar espacios/guiones
  const normalizedName = iconName.toLowerCase().replace(/[\s_]/g, '-');
  
  return iconMap[normalizedName] || null;
}

/**
 * Obtiene la lista de iconos disponibles
 * @returns {Array} - Array con los nombres de iconos disponibles
 */
export function getAvailableIcons() {
  return Object.keys(iconMap);
}

export default iconMap;
