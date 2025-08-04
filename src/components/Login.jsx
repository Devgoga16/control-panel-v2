import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Fade,
  Avatar,
  styled,
  keyframes,
  useTheme,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Login as LoginIcon, 
  PersonOutline,
  LockOutlined,
  Security,
  DarkMode,
  LightMode
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';

// Animaciones personalizadas
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const slideIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

// Componentes estilizados
const LoginContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
  position: 'relative',
}));

const LoginPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  width: '100%',
  maxWidth: '420px',
  borderRadius: 16,
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.palette.mode === 'dark'
    ? `0 4px 20px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)`
    : `0 4px 20px rgba(25, 49, 75, 0.08), 0 1px 3px rgba(25, 49, 75, 0.04)`,
  animation: `${slideIn} 0.4s ease-out`,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.palette.mode === 'dark'
      ? `0 8px 30px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3)`
      : `0 8px 30px rgba(25, 49, 75, 0.12), 0 2px 6px rgba(25, 49, 75, 0.06)`,
    transform: 'translateY(-2px)',
  }
}));

const LogoAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  backgroundColor: theme.palette.primary.main,
  margin: '0 auto 24px',
  animation: `${float} 3s ease-in-out infinite`,
  boxShadow: `0 4px 16px ${theme.palette.primary.main}30`,
  '& .MuiSvgIcon-root': {
    fontSize: 40,
    color: 'white',
  }
}));

const GradientButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  padding: '12px 24px',
  fontSize: '1rem',
  fontWeight: 600,
  borderRadius: 10,
  textTransform: 'none',
  boxShadow: `0 2px 8px ${theme.palette.primary.main}25`,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: `0 4px 12px ${theme.palette.primary.main}35`,
    transform: 'translateY(-1px)',
  },
  '&:disabled': {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.grey[500],
    transform: 'none',
    boxShadow: 'none',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
  '& .MuiOutlinedInput-root': {
    borderRadius: 10,
    backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2e' : theme.palette.grey[50],
    transition: 'all 0.2s ease',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.mode === 'dark' ? '#2D4B6F' : theme.palette.grey[300],
    },
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? '#242938' : theme.palette.background.paper,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.mode === 'dark' ? '#242938' : theme.palette.background.paper,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
  '& .MuiOutlinedInput-input': {
    color: theme.palette.text.primary,
    // Estilos para autocompletado de navegador
    '&:-webkit-autofill': {
      WebkitBoxShadow: theme.palette.mode === 'dark' 
        ? `0 0 0 1000px #1a1f2e inset !important`
        : `0 0 0 1000px ${theme.palette.grey[50]} inset !important`,
      WebkitTextFillColor: `${theme.palette.text.primary} !important`,
      caretColor: theme.palette.text.primary,
      borderRadius: '10px !important',
    },
    '&:-webkit-autofill:hover': {
      WebkitBoxShadow: theme.palette.mode === 'dark' 
        ? `0 0 0 1000px #242938 inset !important`
        : `0 0 0 1000px ${theme.palette.background.paper} inset !important`,
      WebkitTextFillColor: `${theme.palette.text.primary} !important`,
      borderRadius: '10px !important',
    },
    '&:-webkit-autofill:focus': {
      WebkitBoxShadow: theme.palette.mode === 'dark' 
        ? `0 0 0 1000px #242938 inset !important`
        : `0 0 0 1000px ${theme.palette.background.paper} inset !important`,
      WebkitTextFillColor: `${theme.palette.text.primary} !important`,
      borderRadius: '10px !important',
    },
  },
}));

const DarkModeToggle = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5, 3),
  borderRadius: 20,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  zIndex: 1000,
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
    transform: 'translateX(-50%) translateY(-4px)',
  },
}));

const ThemeSwitch = styled(Switch)(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: 0,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
    backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#fafafa',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 2px 4px rgba(0,0,0,0.3)' 
      : '0 2px 4px rgba(0,0,0,0.1)',
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'dark' 
      ? theme.palette.grey[600] 
      : theme.palette.grey[300],
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const { darkMode, toggleDarkMode } = useCustomTheme();
  
  const { login, isLoading, error } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    const credentials = {
      ...data,
      applicationAlias: import.meta.env.VITE_APP_ALIAS || 'admin'
    };
    
    const result = await login(credentials);
    if (result.success) {
      // El redirect se maneja en el App.jsx
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleThemeToggle = () => {
    toggleDarkMode();
  };

  const appName = import.meta.env.VITE_APP_NAME || 'Panel de Administración';
  const appAlias = import.meta.env.VITE_APP_ALIAS || 'admin';

  return (
    <>
      <LoginContainer maxWidth="sm">
        <Fade in={true} timeout={600}>
          <LoginPaper elevation={0}>
            {/* Logo y Título */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <LogoAvatar>
                <Security />
              </LogoAvatar>
              
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 1,
                  fontSize: '1.8rem'
                }}
              >
                {appName}
              </Typography>
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontSize: '0.95rem', opacity: 0.8 }}
              >
                Ingresa tus credenciales para continuar
              </Typography>
            </Box>

            {/* Alert de Error */}
            {error && (
              <Fade in={true}>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Formulario */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <StyledTextField
                fullWidth
                label="Usuario"
                autoComplete="username"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline color="action" />
                    </InputAdornment>
                  ),
                }}
                {...register('username', {
                  required: 'El usuario es requerido',
                  minLength: {
                    value: 3,
                    message: 'El usuario debe tener al menos 3 caracteres'
                  }
                })}
                error={!!errors.username}
                helperText={errors.username?.message}
              />

              <StyledTextField
                fullWidth
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...register('password', {
                  required: 'La contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                  }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />

              <GradientButton
                type="submit"
                fullWidth
                disabled={isLoading}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <LoginIcon />
                  )
                }
                sx={{ mt: 3 }}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </GradientButton>
            </Box>
          </LoginPaper>
        </Fade>
      </LoginContainer>

      {/* Dark Mode Toggle */}
      <DarkModeToggle>
        {darkMode ? (
          <DarkMode sx={{ fontSize: 24, color: 'primary.main' }} />
        ) : (
          <LightMode sx={{ fontSize: 24, color: 'warning.main' }} />
        )}
        <ThemeSwitch
          checked={darkMode}
          onChange={handleThemeToggle}
        />
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: '0.875rem', 
            color: 'text.primary', 
            fontWeight: 600,
            minWidth: 'max-content'
          }}
        >
          {darkMode ? 'Modo Oscuro' : 'Modo Claro'}
        </Typography>
      </DarkModeToggle>
    </>
  );
}
