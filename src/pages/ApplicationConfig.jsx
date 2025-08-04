import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  Avatar,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  Snackbar,
  Breadcrumbs,
  Link,
  Divider,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Icon
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Apps as AppsIcon,
  AccountTree as RolesIcon,
  Menu as MenuIcon,
  Schedule as ScheduleIcon,
  Link as LinkIcon,
  Dashboard as DashboardIcon,
  Folder as FolderIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  Category as CategoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Build as BuildIcon
} from '@mui/icons-material';
import api from '../services/api';

// Función para renderizar iconos dinámicamente desde Material Icons
const renderIcon = (iconName, props = {}) => {
  if (!iconName) {
    return <Icon {...props}>folder</Icon>; // Icono por defecto
  }
  
  // Convertir nombres con guiones bajos a formato Material Icons válido
  const formattedIconName = iconName.toLowerCase().replace(/_/g, '_');
  
  return <Icon {...props}>{formattedIconName}</Icon>;
};

export default function ApplicationConfig() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  
  // Estados para menús
  const [menus, setMenus] = useState([]);
  const [menusLoading, setMenusLoading] = useState(false);
  
  // Estados para modal de roles
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleFormData, setRoleFormData] = useState({
    name: '',
    description: ''
  });
  
  // Estados para modal de menús
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [menuFormData, setMenuFormData] = useState({
    label: '',
    path: '',
    icon: '',
    order: 1
  });
  
  // Estados para modal de asignación de menús a roles
  const [roleMenuModalOpen, setRoleMenuModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [assignedMenus, setAssignedMenus] = useState([]);
  
  // Estados para la configuración
  const [appUrl, setAppUrl] = useState('');
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [isActive, setIsActive] = useState(true);

  // Cargar datos de la aplicación
  const loadApplication = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/applications/${id}`);
      const appData = response.data.data || response.data;
      setApplication(appData);
      setIsActive(appData.isActive);
      // Aquí cargarías también la configuración adicional si existe
      setError('');
    } catch (err) {
      setError('Error al cargar la aplicación');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar roles de la aplicación
  const loadRoles = async () => {
    try {
      setRolesLoading(true);
      const response = await api.get(`/roles/application/${id}?page=1&limit=10`);
      const rolesData = response.data.data.roles || [];
      setRoles(rolesData);
    } catch (err) {
      console.error('Error al cargar roles:', err);
      setRoles([]);
    } finally {
      setRolesLoading(false);
    }
  };

  // Cargar menús de la aplicación
  const loadMenus = async () => {
    try {
      setMenusLoading(true);
      const response = await api.get(`/menus/application/${id}?includeInactive=false`);
      const menusData = response.data.data.menus || [];
      setMenus(menusData);
    } catch (err) {
      console.error('Error al cargar menús:', err);
      setMenus([]);
    } finally {
      setMenusLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadApplication();
      loadRoles();
      loadMenus();
    }
  }, [id]);

  // Guardar configuración
  const handleSaveConfig = async () => {
    try {
      setSaving(true);
      // Aquí implementarías la lógica para guardar la configuración
      // Por ahora solo simularemos
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Configuración guardada correctamente');
    } catch (err) {
      setError('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  // Funciones para manejo de roles
  const handleAddRole = () => {
    setEditingRole(null);
    setRoleFormData({ name: '', description: '' });
    setRoleModalOpen(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setRoleFormData({
      name: role.name,
      description: role.description || ''
    });
    setRoleModalOpen(true);
  };

  const handleDeleteRole = async (roleId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este rol?')) {
      try {
        await api.delete(`/roles/${roleId}`);
        await loadRoles(); // Recargar la lista
        setSuccess('Rol eliminado correctamente');
      } catch (err) {
        setError('Error al eliminar el rol');
        console.error('Error:', err);
      }
    }
  };

  const handleSaveRole = async () => {
    try {
      if (editingRole) {
        // Para PUT solo enviamos name y description
        const updateData = {
          name: roleFormData.name,
          description: roleFormData.description
        };
        await api.put(`/roles/${editingRole._id}`, updateData);
        setSuccess('Rol actualizado correctamente');
      } else {
        // Para POST enviamos name, description y application
        const createData = {
          name: roleFormData.name,
          description: roleFormData.description,
          application: id
        };
        await api.post('/roles', createData);
        setSuccess('Rol creado correctamente');
      }

      setRoleModalOpen(false);
      await loadRoles();
    } catch (err) {
      setError('Error al guardar el rol');
      console.error('Error:', err);
    }
  };

  // Funciones para manejo de menús
  const handleAddMenu = () => {
    setEditingMenu(null);
    // Calcular el siguiente orden disponible
    const nextOrder = menus.length > 0 ? Math.max(...menus.map(m => m.order)) + 1 : 1;
    setMenuFormData({ 
      label: '', 
      path: '', 
      icon: '', 
      order: nextOrder 
    });
    setMenuModalOpen(true);
  };

  const handleEditMenu = (menu) => {
    setEditingMenu(menu);
    setMenuFormData({
      label: menu.label,
      path: menu.path,
      icon: menu.icon,
      order: menu.order
    });
    setMenuModalOpen(true);
  };

  const handleDeleteMenu = async (menuId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este menú?')) {
      try {
        await api.delete(`/menus/${menuId}`);
        await loadMenus(); // Recargar la lista
        setSuccess('Menú eliminado correctamente');
      } catch (err) {
        setError('Error al eliminar el menú');
        console.error('Error:', err);
      }
    }
  };

  const handleSaveMenu = async () => {
    try {
      if (editingMenu) {
        // Para PUT solo enviamos los campos del menú
        const updateData = {
          label: menuFormData.label,
          path: menuFormData.path,
          icon: menuFormData.icon,
          order: parseInt(menuFormData.order)
        };
        await api.put(`/menus/${editingMenu._id}`, updateData);
        setSuccess('Menú actualizado correctamente');
      } else {
        // Para POST enviamos todos los campos incluyendo application
        const createData = {
          application: id,
          label: menuFormData.label,
          path: menuFormData.path,
          icon: menuFormData.icon,
          order: parseInt(menuFormData.order)
        };
        await api.post('/menus', createData);
        setSuccess('Menú creado correctamente');
      }

      setMenuModalOpen(false);
      await loadMenus();
    } catch (err) {
      setError('Error al guardar el menú');
      console.error('Error:', err);
    }
  };

  // Funciones para asignación de menús a roles
  const handleAssignMenusToRole = (role) => {
    setSelectedRole(role);
    // Obtener los IDs de los menús ya asignados al rol
    const currentMenuIds = role.menuAccess ? role.menuAccess.map(menu => menu._id || menu) : [];
    setAssignedMenus(currentMenuIds);
    setRoleMenuModalOpen(true);
  };

  const handleToggleMenuAssignment = (menuId) => {
    setAssignedMenus(prev => {
      if (prev.includes(menuId)) {
        return prev.filter(id => id !== menuId);
      } else {
        return [...prev, menuId];
      }
    });
  };

  const handleSaveMenuAssignment = async () => {
    try {
      await api.post(`/roles/${selectedRole._id}/menus`, {
        menuIds: assignedMenus
      });
      setSuccess('Menús asignados correctamente al rol');
      setRoleMenuModalOpen(false);
      await loadRoles(); // Recargar roles para ver los cambios
    } catch (err) {
      setError('Error al asignar menús al rol');
      console.error('Error:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!application) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Aplicación no encontrada
        </Typography>
        <Button onClick={() => navigate('/applications')} sx={{ mt: 2 }}>
          Volver a Aplicaciones
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header con breadcrumbs */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link 
            color="inherit" 
            href="#" 
            onClick={() => navigate('/applications')}
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <AppsIcon sx={{ mr: 0.5, fontSize: 16 }} />
            Aplicaciones
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <SettingsIcon sx={{ mr: 0.5, fontSize: 16 }} />
            Configuración
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              onClick={() => navigate('/applications')}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                Configurar Aplicación
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {application.name} ({application.alias})
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
            onClick={handleSaveConfig}
            disabled={saving}
            sx={{
              borderRadius: 1,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Información básica */}
        <Grid item xs={12} xl={8}>
          <Card sx={{ borderRadius: 1, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Información Básica
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    size="small"
                    value={application.name}
                    disabled
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Alias"
                    size="small"
                    value={application.alias}
                    disabled
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descripción"
                    size="small"
                    multiline
                    rows={2}
                    value={application.description || ''}
                    disabled
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Configuración de aplicación */}
          <Card sx={{ borderRadius: 1, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Configuración de Aplicación
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="URL de la Aplicación"
                    size="small"
                    value={appUrl}
                    onChange={(e) => setAppUrl(e.target.value)}
                    placeholder="https://ejemplo.com"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tiempo de Sesión (minutos)"
                    size="small"
                    type="number"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        color="primary"
                        size="small"
                      />
                    }
                    label="Aplicación activa"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Gestión de Roles */}
          <Card sx={{ borderRadius: 1, mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 }, mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Roles de la Aplicación ({roles.length})
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddRole}
                  sx={{ borderRadius: 1, textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
                >
                  Agregar Rol
                </Button>
              </Box>
              
              {rolesLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : roles.length > 0 ? (
                <TableContainer component={Paper} sx={{ borderRadius: 1, border: `1px solid ${alpha(theme.palette.divider, 0.12)}`, overflowX: 'auto' }}>
                  <Table size="small" sx={{ minWidth: { xs: 600, sm: 'auto' } }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                        <TableCell sx={{ fontWeight: 600, minWidth: { xs: 150, sm: 'auto' } }}>Rol</TableCell>
                        <TableCell sx={{ fontWeight: 600, minWidth: { xs: 120, sm: 'auto' } }}>Descripción</TableCell>
                        <TableCell sx={{ fontWeight: 600, minWidth: { xs: 140, sm: 'auto' } }}>Menús Asignados</TableCell>
                        <TableCell sx={{ fontWeight: 600, minWidth: { xs: 80, sm: 'auto' } }}>Estado</TableCell>
                        <TableCell sx={{ fontWeight: 600, textAlign: 'center', minWidth: { xs: 120, sm: 'auto' } }}>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {roles.map((role) => (
                        <TableRow key={role._id} sx={{ '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.02) } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                                  color: theme.palette.secondary.main,
                                  mr: 2,
                                  fontSize: '0.75rem',
                                  fontWeight: 600
                                }}
                              >
                                {role.name.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {role.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ID: {role._id.slice(-8)}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ maxWidth: 200 }}>
                              {role.description || 'Sin descripción'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {role.menuAccess && role.menuAccess.length > 0 ? (
                                role.menuAccess.slice(0, 2).map((menu) => (
                                  <Chip
                                    key={menu._id}
                                    label={menu.label}
                                    size="small"
                                    sx={{
                                      backgroundColor: alpha(theme.palette.info.main, 0.1),
                                      color: theme.palette.info.main,
                                      fontWeight: 500,
                                      fontSize: '0.7rem'
                                    }}
                                  />
                                ))
                              ) : (
                                <Typography variant="caption" color="text.secondary">
                                  Sin menús
                                </Typography>
                              )}
                              {role.menuAccess && role.menuAccess.length > 2 && (
                                <Chip
                                  label={`+${role.menuAccess.length - 2} más`}
                                  size="small"
                                  sx={{
                                    backgroundColor: alpha(theme.palette.grey[500], 0.1),
                                    color: theme.palette.grey[600],
                                    fontSize: '0.7rem'
                                  }}
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={role.isActive ? 'Activo' : 'Inactivo'}
                              color={role.isActive ? 'success' : 'default'}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                              <Tooltip title="Gestionar Menús">
                                <IconButton
                                  size="small"
                                  onClick={() => handleAssignMenusToRole(role)}
                                  sx={{
                                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                                    color: theme.palette.success.main,
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.success.main, 0.2)
                                    }
                                  }}
                                >
                                  <MenuIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Editar">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditRole(role)}
                                  sx={{
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.primary.main, 0.2)
                                    }
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteRole(role._id)}
                                  sx={{
                                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                                    color: theme.palette.error.main,
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.error.main, 0.2)
                                    }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ minHeight: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary" variant="body2">
                    No hay roles configurados para esta aplicación
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Gestión de Menús */}
          <Card sx={{ borderRadius: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 }, mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Opciones de Menú ({menus.length})
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddMenu}
                  sx={{ borderRadius: 1, textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
                >
                  Agregar Menú
                </Button>
              </Box>
              
              {menusLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : menus.length > 0 ? (
                <TableContainer component={Paper} sx={{ borderRadius: 1, border: `1px solid ${alpha(theme.palette.divider, 0.12)}`, overflowX: 'auto' }}>
                  <Table size="small" sx={{ minWidth: { xs: 600, sm: 'auto' } }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                        <TableCell sx={{ fontWeight: 600, minWidth: { xs: 150, sm: 'auto' } }}>Menú</TableCell>
                        <TableCell sx={{ fontWeight: 600, minWidth: { xs: 120, sm: 'auto' } }}>Ruta</TableCell>
                        <TableCell sx={{ fontWeight: 600, minWidth: { xs: 80, sm: 'auto' } }}>Orden</TableCell>
                        <TableCell sx={{ fontWeight: 600, minWidth: { xs: 80, sm: 'auto' } }}>Estado</TableCell>
                        <TableCell sx={{ fontWeight: 600, textAlign: 'center', minWidth: { xs: 120, sm: 'auto' } }}>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {menus
                        .sort((a, b) => a.order - b.order)
                        .map((menu) => (
                        <TableRow key={menu._id} sx={{ '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.02) } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                  color: theme.palette.primary.main,
                                  mr: 2,
                                  fontSize: '0.75rem'
                                }}
                              >
                                {renderIcon(menu.icon, { fontSize: 'small' })}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {menu.label}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Icono: {menu.icon}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={menu.path}
                              size="small"
                              sx={{
                                backgroundColor: alpha(theme.palette.success.main, 0.1),
                                color: theme.palette.success.main,
                                fontFamily: 'monospace',
                                fontSize: '0.7rem'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Chip
                                label={menu.order}
                                size="small"
                                sx={{
                                  backgroundColor: alpha(theme.palette.info.main, 0.1),
                                  color: theme.palette.info.main,
                                  fontWeight: 600,
                                  minWidth: 35
                                }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={menu.isActive ? 'Activo' : 'Inactivo'}
                              color={menu.isActive ? 'success' : 'default'}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                              <Tooltip title="Editar">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditMenu(menu)}
                                  sx={{
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.primary.main, 0.2)
                                    }
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteMenu(menu._id)}
                                  sx={{
                                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                                    color: theme.palette.error.main,
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.error.main, 0.2)
                                    }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ minHeight: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary" variant="body2">
                    No hay opciones de menú configuradas para esta aplicación
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Panel lateral con información */}
        <Grid item xs={12} xl={4}>
          <Card sx={{ borderRadius: 1, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Estado de la Aplicación
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip
                  label={application.isActive ? 'Activa' : 'Inactiva'}
                  color={application.isActive ? 'success' : 'default'}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Creada: {new Date(application.createdAt).toLocaleDateString('es-ES')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                ID: {application._id}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 1 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Acciones Rápidas
              </Typography>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <RolesIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <ListItemText 
                    primary="Gestionar Roles"
                    secondary="Configurar roles y permisos"
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <MenuIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <ListItemText 
                    primary="Configurar Menús"
                    secondary="Definir estructura de navegación"
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ScheduleIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <ListItemText 
                    primary="Tiempo de Sesión"
                    secondary="Configurar duración de sesiones"
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <LinkIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <ListItemText 
                    primary="URL de Aplicación"
                    secondary="Definir enlace de acceso"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar para mensajes */}
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSuccess('')} 
          severity="success" 
          sx={{ borderRadius: 1 }}
        >
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setError('')} 
          severity="error" 
          sx={{ borderRadius: 1 }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Modal para Crear/Editar Rol */}
      <Dialog 
        open={roleModalOpen} 
        onClose={() => setRoleModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingRole ? 'Editar Rol' : 'Nuevo Rol'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Nombre del Rol"
              variant="outlined"
              size="small"
              value={roleFormData.name}
              onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
              sx={{ mb: 2, borderRadius: 1 }}
              required
            />
            <TextField
              fullWidth
              label="Descripción"
              variant="outlined"
              size="small"
              multiline
              rows={3}
              value={roleFormData.description}
              onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })}
              sx={{ borderRadius: 1 }}
              placeholder="Describe las responsabilidades de este rol..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setRoleModalOpen(false)}
            sx={{ borderRadius: 1, textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveRole}
            variant="contained"
            disabled={!roleFormData.name.trim()}
            sx={{ borderRadius: 1, textTransform: 'none' }}
          >
            {editingRole ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para Crear/Editar Menú */}
      <Dialog 
        open={menuModalOpen} 
        onClose={() => setMenuModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingMenu ? 'Editar Menú' : 'Nuevo Menú'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Etiqueta del Menú"
                  variant="outlined"
                  size="small"
                  value={menuFormData.label}
                  onChange={(e) => setMenuFormData({ ...menuFormData, label: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  required
                  placeholder="Ej: Dashboard, Aplicaciones"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ruta del Menú"
                  variant="outlined"
                  size="small"
                  value={menuFormData.path}
                  onChange={(e) => setMenuFormData({ ...menuFormData, path: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  required
                  placeholder="Ej: /dashboard, /applications"
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="Icono"
                  variant="outlined"
                  size="small"
                  value={menuFormData.icon}
                  onChange={(e) => setMenuFormData({ ...menuFormData, icon: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  placeholder="Ej: dashboard, person, zone_person_alert, account_circle"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Orden"
                  variant="outlined"
                  size="small"
                  type="number"
                  value={menuFormData.order}
                  onChange={(e) => setMenuFormData({ ...menuFormData, order: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  required
                  inputProps={{ min: 1 }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setMenuModalOpen(false)}
            sx={{ borderRadius: 1, textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveMenu}
            variant="contained"
            disabled={!menuFormData.label.trim() || !menuFormData.path.trim()}
            sx={{ borderRadius: 1, textTransform: 'none' }}
          >
            {editingMenu ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para Asignar Menús a Rol */}
      <Dialog 
        open={roleMenuModalOpen} 
        onClose={() => setRoleMenuModalOpen(false)}
        maxWidth="lg"
        fullWidth
        scroll='body'
        PaperProps={{
          sx: { 
            borderRadius: 1,
            maxHeight: '90vh',
            margin: { xs: 1, sm: 2 },
            width: { xs: 'calc(100% - 16px)', sm: 'auto' }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
          Gestionar Menús - {selectedRole?.name}
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Selecciona los menús que tendrá acceso este rol:
            </Typography>
            
            {menus.length > 0 ? (
              <Box sx={{ maxHeight: '60vh', overflowY: 'auto', pr: 1 }}>
                <Grid container spacing={2}>
                  {menus
                    .sort((a, b) => a.order - b.order)
                    .map((menu) => (
                      <Grid item xs={12} sm={6} md={4} key={menu._id}>
                        <Card
                          sx={{
                            p: 1.5,
                            cursor: 'pointer',
                            border: assignedMenus.includes(menu._id) 
                              ? `2px solid ${theme.palette.primary.main}` 
                              : `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                            backgroundColor: assignedMenus.includes(menu._id) 
                              ? alpha(theme.palette.primary.main, 0.05) 
                              : 'transparent',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.02)
                            },
                            borderRadius: 1,
                            minHeight: '80px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          onClick={() => handleToggleMenuAssignment(menu._id)}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Avatar
                              sx={{
                                width: 36,
                                height: 36,
                                backgroundColor: assignedMenus.includes(menu._id)
                                  ? theme.palette.primary.main
                                  : alpha(theme.palette.primary.main, 0.1),
                                color: assignedMenus.includes(menu._id)
                                  ? 'white'
                                  : theme.palette.primary.main,
                                mr: 1.5,
                                flexShrink: 0
                              }}
                            >
                              {renderIcon(menu.icon, { fontSize: 'small' })}
                            </Avatar>
                            <Box sx={{ flexGrow: 1, minWidth: 0, mr: 1 }}>
                              <Typography variant="subtitle2" fontWeight={600} noWrap>
                                {menu.label}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {menu.path}
                              </Typography>
                            </Box>
                            <Box sx={{ flexShrink: 0 }}>
                              <Chip
                                label={menu.order}
                                size="small"
                                sx={{
                                  backgroundColor: alpha(theme.palette.info.main, 0.1),
                                  color: theme.palette.info.main,
                                  fontWeight: 600,
                                  minWidth: 30,
                                  height: 24,
                                  fontSize: '0.7rem'
                                }}
                              />
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography color="text.secondary">
                  No hay menús disponibles para asignar
                </Typography>
              </Box>
            )}
            
            {menus.length > 0 && (
              <Box 
                sx={{ 
                  mt: 2, 
                  p: 2, 
                  backgroundColor: alpha(theme.palette.info.main, 0.05), 
                  borderRadius: 1,
                  position: 'sticky',
                  bottom: 0,
                  zIndex: 1
                }}
              >
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Menús seleccionados: {assignedMenus.length} de {menus.length}
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 0.5,
                    maxHeight: '60px',
                    overflowY: 'auto'
                  }}
                >
                  {assignedMenus.map(menuId => {
                    const menu = menus.find(m => m._id === menuId);
                    return menu ? (
                      <Chip
                        key={menuId}
                        label={menu.label}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 500, fontSize: '0.7rem' }}
                      />
                    ) : null;
                  })}
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1, flexWrap: 'wrap' }}>
          <Button 
            onClick={() => setRoleMenuModalOpen(false)}
            sx={{ 
              borderRadius: 1, 
              textTransform: 'none',
              flex: { xs: '1 1 100%', sm: '0 0 auto' },
              order: { xs: 2, sm: 1 }
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveMenuAssignment}
            variant="contained"
            sx={{ 
              borderRadius: 1, 
              textTransform: 'none',
              flex: { xs: '1 1 100%', sm: '0 0 auto' },
              order: { xs: 1, sm: 2 }
            }}
          >
            Guardar Asignación ({assignedMenus.length} menús)
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
