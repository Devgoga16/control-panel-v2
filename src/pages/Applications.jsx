import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Grid,
  Avatar,
  Divider,
  useTheme,
  alpha,
  CircularProgress,
  Fab,
  Collapse,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Apps as AppsIcon,
  CheckCircle,
  Cancel,
  Save,
  Close,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import api from '../services/api';

export default function Applications() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      alias: '',
      name: '',
      description: ''
    }
  });

  // Cargar aplicaciones
  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/applications');
      // Manejar la estructura de respuesta del backend
      const responseData = response.data;
      let applicationsData = [];
      
      if (responseData.success && responseData.data && responseData.data.applications) {
        applicationsData = responseData.data.applications;
      } else if (Array.isArray(responseData)) {
        applicationsData = responseData;
      } else if (responseData.applications) {
        applicationsData = responseData.applications;
      }
      
      setApplications(Array.isArray(applicationsData) ? applicationsData : []);
      setError('');
    } catch (err) {
      setError('Error al cargar las aplicaciones');
      console.error('Error:', err);
      setApplications([]); // Asegurar que sea un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // Abrir dialog para crear nueva aplicación
  const handleAddNew = () => {
    setEditingApp(null);
    reset({
      alias: '',
      name: '',
      description: ''
    });
    setDialogOpen(true);
  };

  // Abrir dialog para editar aplicación
  const handleEdit = (app) => {
    setEditingApp(app);
    setValue('alias', app.alias);
    setValue('name', app.name);
    setValue('description', app.description);
    setDialogOpen(true);
  };

  // Cerrar dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingApp(null);
    reset();
    setError('');
  };

  // Enviar formulario
  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setError('');

      // Preparar datos para el envío
      const submitData = {
        alias: data.alias,
        name: data.name,
        description: data.description
      };

      if (editingApp) {
        // Actualizar aplicación existente - solo name y description en el body
        const updateData = {
          name: data.name,
          description: data.description
        };
        await api.put(`/applications/${editingApp._id}`, updateData);
        setSuccess('Aplicación actualizada correctamente');
      } else {
        // Crear nueva aplicación
        await api.post('/applications', submitData);
        setSuccess('Aplicación creada correctamente');
      }

      await loadApplications();
      handleCloseDialog();
    } catch (err) {
      setError(
        err.response?.data?.message || 
        `Error al ${editingApp ? 'actualizar' : 'crear'} la aplicación`
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Confirmar eliminación
  const handleDeleteClick = (app) => {
    setAppToDelete(app);
    setDeleteDialogOpen(true);
  };

  // Abrir configuración de aplicación
  const handleConfigureApp = (app) => {
    navigate(`/applications/${app._id}/config`);
  };

  // Eliminar aplicación
  const handleDelete = async () => {
    try {
      setSubmitting(true);
      await api.delete(`/applications/${appToDelete._id}`);
      setSuccess('Aplicación eliminada correctamente');
      await loadApplications();
      setDeleteDialogOpen(false);
      setAppToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar la aplicación');
    } finally {
      setSubmitting(false);
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Gestión de Aplicaciones
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Administra las aplicaciones del sistema
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            '&:hover': {
              boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
              transform: 'translateY(-2px)'
            }
          }}
        >
          Nueva Aplicación
        </Button>
      </Box>

      {/* Estadísticas rápidas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <AppsIcon />
                </Avatar>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Total de Aplicaciones
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {applications?.length || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Aplicaciones Activas
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {applications?.filter(app => app.isActive)?.length || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <Cancel />
                </Avatar>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Aplicaciones Inactivas
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {applications?.filter(app => !app.isActive)?.length || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de aplicaciones */}
      <Card sx={{ borderRadius: 1 }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Aplicación</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Alias</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Descripción</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Creado</TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(applications || []).map((app) => (
                  <TableRow 
                    key={app._id} 
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: alpha(theme.palette.primary.main, 0.02) 
                      },
                      '&:last-child td, &:last-child th': { border: 0 }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: app.isActive 
                              ? alpha(theme.palette.primary.main, 0.1)
                              : alpha(theme.palette.grey[500], 0.1),
                            color: app.isActive 
                              ? theme.palette.primary.main
                              : theme.palette.grey[500],
                            mr: 2,
                            fontSize: '0.875rem',
                            fontWeight: 600
                          }}
                        >
                          {app.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {app.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {app._id.slice(-8)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={app.alias}
                        size="small"
                        sx={{
                          backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                          color: theme.palette.secondary.main,
                          fontWeight: 600,
                          fontFamily: 'monospace'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {app.description || 'Sin descripción'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={app.isActive ? 'Activa' : 'Inactiva'}
                        color={app.isActive ? 'success' : 'default'}
                        size="small"
                        icon={app.isActive ? <CheckCircle /> : <Cancel />}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(app.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Configurar">
                          <IconButton
                            size="small"
                            onClick={() => handleConfigureApp(app)}
                            sx={{
                              backgroundColor: alpha(theme.palette.info.main, 0.1),
                              color: theme.palette.info.main,
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.info.main, 0.2)
                              }
                            }}
                          >
                            <SettingsIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(app)}
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
                            onClick={() => handleDeleteClick(app)}
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
                {(!applications || applications.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">
                        No hay aplicaciones registradas
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog para crear/editar aplicación */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 1 }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  mr: 2,
                  width: 32,
                  height: 32
                }}
              >
                <AppsIcon fontSize="small" />
              </Avatar>
              <Typography variant="h6" fontWeight="bold" fontSize="1.1rem">
                {editingApp ? 'Editar Aplicación' : 'Nueva Aplicación'}
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDialog} size="small">
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 1, pb: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 1, py: 1 }}>
                {error}
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Alias"
                size="small"
                {...register('alias', { 
                  required: 'El alias es requerido',
                  pattern: {
                    value: /^[a-z0-9-_]+$/,
                    message: 'Solo se permiten minúsculas, números, guiones y guiones bajos'
                  }
                })}
                error={!!errors.alias}
                helperText={errors.alias?.message}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
              <TextField
                fullWidth
                label="Nombre"
                size="small"
                {...register('name', { required: 'El nombre es requerido' })}
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
              <TextField
                fullWidth
                label="Descripción"
                size="small"
                multiline
                rows={2}
                {...register('description')}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ p: 2, pt: 1 }}>
            <Button 
              onClick={handleCloseDialog}
              size="small"
              sx={{ borderRadius: 1, textTransform: 'none' }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="small"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={16} /> : <Save fontSize="small" />}
              sx={{
                borderRadius: 1,
                textTransform: 'none',
                fontWeight: 600,
                minWidth: 100
              }}
            >
              {submitting ? 'Guardando...' : (editingApp ? 'Actualizar' : 'Crear')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 1 }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
                mr: 2
              }}
            >
              <DeleteIcon />
            </Avatar>
            <Typography variant="h6" fontWeight="bold">
              Confirmar Eliminación
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar la aplicación <strong>{appToDelete?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ borderRadius: 1, textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <DeleteIcon />}
            sx={{
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            {submitting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes de éxito */}
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

      {/* Snackbar para mensajes de error */}
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
    </Box>
  );
}
