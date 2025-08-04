import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person,
  Security,
  Apps as AppsIcon,
  CheckCircle
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user, application, roles, menu } = useAuth();
  const theme = useTheme();

  const stats = [
    {
      title: 'Usuario Activo',
      value: user?.username || 'N/A',
      icon: Person,
      color: 'primary'
    },
    {
      title: 'Aplicación',
      value: application?.name || 'N/A',
      icon: AppsIcon,
      color: 'secondary'
    },
    {
      title: 'Roles Asignados',
      value: roles?.length || 0,
      icon: Security,
      color: 'success'
    },
    {
      title: 'Opciones de Menú',
      value: menu?.length || 0,
      icon: DashboardIcon,
      color: 'info'
    }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Bienvenido al Panel de Control - {application?.name || 'Sistema'}
      </Typography>

      {/* Estadísticas principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card elevation={2} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: `${stat.color}.main`, mr: 2 }}>
                      <IconComponent />
                    </Avatar>
                    <Box>
                      <Typography color="text.secondary" gutterBottom variant="body2">
                        {stat.title}
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {stat.value}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3}>
        {/* Información del Usuario */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información del Usuario
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
                {user?.fullName?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {user?.fullName || 'Usuario'}
                </Typography>
                <Typography color="text.secondary">
                  @{user?.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email || 'Sin email configurado'}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Roles Activos:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {roles && roles.length > 0 ? (
                roles.map((role, index) => (
                  <Chip
                    key={index}
                    label={role.name}
                    color="primary"
                    variant="outlined"
                    size="small"
                    icon={<CheckCircle />}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No hay roles asignados
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Información de la Aplicación */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              Aplicación Actual
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Nombre:
              </Typography>
              <Typography variant="body1" gutterBottom>
                {application?.name || 'No especificado'}
              </Typography>
              
              <Typography variant="subtitle2" color="text.secondary">
                Alias:
              </Typography>
              <Typography variant="body1" gutterBottom>
                {application?.alias || 'No especificado'}
              </Typography>
              
              <Typography variant="subtitle2" color="text.secondary">
                Descripción:
              </Typography>
              <Typography variant="body1" gutterBottom>
                {application?.description || 'Sin descripción'}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Opciones de Menú Disponibles:
            </Typography>
            <List dense>
              {menu && menu.length > 0 ? (
                menu.slice(0, 5).map((menuItem, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircle color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={menuItem.label}
                      secondary={menuItem.path}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No hay opciones de menú disponibles
                </Typography>
              )}
              {menu && menu.length > 5 && (
                <ListItem>
                  <ListItemText 
                    primary={`... y ${menu.length - 5} opciones más`}
                    sx={{ fontStyle: 'italic' }}
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
