import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  TextField,
  Avatar,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  alpha
} from '@mui/material';
import {
  Person,
  Security,
  Palette,
  Notifications,
  Language,
  Storage,
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  DarkMode,
  LightMode,
  Brightness4
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';

export default function Settings() {
  const theme = useTheme();
  const { darkMode, toggleDarkMode } = useCustomTheme();
  const { user, application } = useAuth();
  
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || user?.name || '',
    email: user?.email || '',
    username: user?.username || ''
  });
  
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailNotifications: false,
    autoSave: true,
    compactMode: false
  });

  const handleProfileEdit = () => {
    setEditingProfile(true);
  };

  const handleProfileSave = () => {
    // Aquí integrarías con tu API para guardar los cambios
    console.log('Guardando perfil:', profileData);
    setEditingProfile(false);
  };

  const handleProfileCancel = () => {
    setProfileData({
      fullName: user?.fullName || user?.name || '',
      email: user?.email || '',
      username: user?.username || ''
    });
    setEditingProfile(false);
  };

  const handlePreferenceChange = (key) => (event) => {
    setPreferences(prev => ({
      ...prev,
      [key]: event.target.checked
    }));
  };

  const handleProfileDataChange = (field) => (event) => {
    setProfileData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const settingsSections = [
    {
      title: 'Perfil de Usuario',
      icon: Person,
      color: 'primary',
      content: (
        <Card sx={{ borderRadius: 3 }}>
          <CardHeader
            title="Información Personal"
            action={
              editingProfile ? (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={handleProfileSave}
                    sx={{ 
                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.success.main, 0.2)
                      }
                    }}
                  >
                    <Save fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleProfileCancel}
                    sx={{ 
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                      color: theme.palette.error.main,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.error.main, 0.2)
                      }
                    }}
                  >
                    <Cancel fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <IconButton
                  size="small"
                  onClick={handleProfileEdit}
                  sx={{ 
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2)
                    }
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              )
            }
          />
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: theme.palette.primary.main,
                    fontSize: '2rem',
                    mr: 3
                  }}
                >
                  {user?.fullName?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                {editingProfile && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: -8,
                      right: 16,
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      width: 32,
                      height: 32,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark
                      }
                    }}
                  >
                    <PhotoCamera fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                {editingProfile ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nombre Completo"
                        value={profileData.fullName}
                        onChange={handleProfileDataChange('fullName')}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={profileData.email}
                        onChange={handleProfileDataChange('email')}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Usuario"
                        value={profileData.username}
                        onChange={handleProfileDataChange('username')}
                        size="small"
                        disabled
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <>
                    <Typography variant="h6" gutterBottom>
                      {user?.fullName || user?.name || 'Usuario'}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      @{user?.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email || 'Email no configurado'}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Aplicación Actual:
            </Typography>
            <Chip
              label={application?.name || 'Sistema'}
              color="primary"
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </CardContent>
        </Card>
      )
    },
    {
      title: 'Apariencia',
      icon: Palette,
      color: 'secondary',
      content: (
        <Card sx={{ borderRadius: 3 }}>
          <CardHeader title="Configuración de Tema" />
          <CardContent>
            <List>
              <ListItem>
                <ListItemIcon>
                  {darkMode ? <DarkMode /> : <LightMode />}
                </ListItemIcon>
                <ListItemText
                  primary="Modo Oscuro"
                  secondary="Cambiar entre tema claro y oscuro"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={darkMode}
                    onChange={toggleDarkMode}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Brightness4 />
                </ListItemIcon>
                <ListItemText
                  primary="Modo Compacto"
                  secondary="Reducir espacios y elementos de la interfaz"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={preferences.compactMode}
                    onChange={handlePreferenceChange('compactMode')}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      )
    },
    {
      title: 'Notificaciones',
      icon: Notifications,
      color: 'warning',
      content: (
        <Card sx={{ borderRadius: 3 }}>
          <CardHeader title="Preferencias de Notificación" />
          <CardContent>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Notifications />
                </ListItemIcon>
                <ListItemText
                  primary="Notificaciones del Sistema"
                  secondary="Recibir notificaciones en tiempo real"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={preferences.notifications}
                    onChange={handlePreferenceChange('notifications')}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText
                  primary="Notificaciones por Email"
                  secondary="Recibir actualizaciones por correo electrónico"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={preferences.emailNotifications}
                    onChange={handlePreferenceChange('emailNotifications')}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      )
    },
    {
      title: 'Sistema',
      icon: Storage,
      color: 'info',
      content: (
        <Card sx={{ borderRadius: 3 }}>
          <CardHeader title="Configuración del Sistema" />
          <CardContent>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Save />
                </ListItemIcon>
                <ListItemText
                  primary="Guardado Automático"
                  secondary="Guardar cambios automáticamente"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={preferences.autoSave}
                    onChange={handlePreferenceChange('autoSave')}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Language />
                </ListItemIcon>
                <ListItemText
                  primary="Idioma"
                  secondary="Español (ES)"
                />
                <ListItemSecondaryAction>
                  <Button variant="outlined" size="small">
                    Cambiar
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Security />
                </ListItemIcon>
                <ListItemText
                  primary="Seguridad"
                  secondary="Cambiar contraseña y configuración de seguridad"
                />
                <ListItemSecondaryAction>
                  <Button variant="outlined" size="small">
                    Configurar
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      )
    }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Configuración
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Personaliza tu experiencia en el Panel de Control
      </Typography>

      <Grid container spacing={3}>
        {settingsSections.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <Grid item xs={12} lg={6} key={index}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      backgroundColor: alpha(theme.palette[section.color].main, 0.1),
                      color: theme.palette[section.color].main,
                      mr: 2,
                      width: 48,
                      height: 48
                    }}
                  >
                    <IconComponent />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    {section.title}
                  </Typography>
                </Box>
                {section.content}
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Los cambios se guardan automáticamente
        </Typography>
      </Box>
    </Box>
  );
}
