import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  Chip,
  Tooltip,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Box as MuiBox,
  Autocomplete
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { userService, applicationService, roleService } from '../services/dataServices';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
    watch
  } = useForm();

  // Cargar datos iniciales
  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, appsRes, rolesRes] = await Promise.all([
        userService.getAll(),
        applicationService.getAll(),
        roleService.getAll()
      ]);
      
      setUsers(usersRes.data);
      setApplications(appsRes.data);
      setRoles(rolesRes.data);
    } catch (error) {
      setError('Error al cargar los datos');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Abrir dialog para crear/editar
  const handleOpenDialog = (user = null) => {
    setEditingUser(user);
    if (user) {
      setValue('username', user.username);
      setValue('fullName', user.fullName || '');
      setValue('email', user.email || '');
      setValue('isActive', user.isActive);
      setValue('roles', user.roles || []);
    } else {
      reset({
        isActive: true,
        roles: []
      });
    }
    setDialogOpen(true);
  };

  // Cerrar dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
    reset();
    setError('');
    setShowPassword(false);
  };

  // Guardar usuario
  const onSubmit = async (data) => {
    try {
      // Si no está editando, la contraseña es requerida
      if (!editingUser && !data.password) {
        setError('La contraseña es requerida para nuevos usuarios');
        return;
      }

      if (editingUser) {
        // Si está editando y no cambió la contraseña, no la enviamos
        const updateData = { ...data };
        if (!data.password) {
          delete updateData.password;
        }
        await userService.update(editingUser._id, updateData);
        setSuccess('Usuario actualizado correctamente');
      } else {
        await userService.create(data);
        setSuccess('Usuario creado correctamente');
      }
      
      handleCloseDialog();
      loadData();
    } catch (error) {
      setError(error.response?.data?.message || 'Error al guardar el usuario');
    }
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
      try {
        await userService.delete(id);
        setSuccess('Usuario eliminado correctamente');
        loadData();
      } catch (error) {
        setError(error.response?.data?.message || 'Error al eliminar el usuario');
      }
    }
  };

  // Obtener roles por aplicación
  const getRolesByApplication = (applicationId) => {
    return roles.filter(role => role.application === applicationId);
  };

  // Formatear roles para mostrar
  const formatUserRoles = (userRoles) => {
    return userRoles.map(roleGroup => {
      const app = applications.find(a => a._id === roleGroup.application);
      return {
        application: app?.name || 'Aplicación desconocida',
        roles: roleGroup.roles.map(roleId => {
          const role = roles.find(r => r._id === roleId);
          return role?.name || 'Rol desconocido';
        })
      };
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Gestión de Usuarios
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Administra los usuarios del sistema y sus roles
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Usuario
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Nombre Completo</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Roles</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Cargando usuarios...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No hay usuarios registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                            {user.username.charAt(0).toUpperCase()}
                          </Avatar>
                          <strong>{user.username}</strong>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {user.fullName || (
                          <Typography variant="body2" color="text.secondary" fontStyle="italic">
                            No especificado
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.email || (
                          <Typography variant="body2" color="text.secondary" fontStyle="italic">
                            No especificado
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {formatUserRoles(user.roles || []).map((roleGroup, index) => (
                            <Tooltip 
                              key={index}
                              title={`${roleGroup.application}: ${roleGroup.roles.join(', ')}`}
                            >
                              <Chip
                                label={`${roleGroup.application} (${roleGroup.roles.length})`}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </Tooltip>
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={user.isActive ? 'Activo' : 'Inactivo'}
                          color={user.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Editar">
                          <IconButton
                            onClick={() => handleOpenDialog(user)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            onClick={() => handleDelete(user._id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog para crear/editar usuario */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
              <TextField
                autoFocus
                label="Nombre de Usuario"
                variant="outlined"
                {...register('username', {
                  required: 'El nombre de usuario es requerido',
                  minLength: {
                    value: 3,
                    message: 'Mínimo 3 caracteres'
                  }
                })}
                error={!!errors.username}
                helperText={errors.username?.message}
              />

              <TextField
                label="Nombre Completo"
                variant="outlined"
                {...register('fullName')}
              />

              <TextField
                label="Email"
                type="email"
                variant="outlined"
                {...register('email', {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Email inválido'
                  }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                label={editingUser ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                {...register('password', {
                  required: editingUser ? false : 'La contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'Mínimo 6 caracteres'
                  }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  )
                }}
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  {...register('isActive')}
                  defaultChecked={true}
                />
              }
              label="Usuario activo"
              sx={{ mt: 2 }}
            />

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Asignación de Roles
            </Typography>
            
            {/* Aquí se implementaría la asignación de roles por aplicación */}
            <Typography variant="body2" color="text.secondary">
              La asignación de roles se implementará en la siguiente versión
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              {editingUser ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
