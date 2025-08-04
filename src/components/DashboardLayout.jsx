import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Collapse,
  Chip,
  useTheme,
  alpha,
  Switch,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Settings,
  ExpandLess,
  ExpandMore,
  ChevronLeft as ChevronLeftIcon,
  DarkMode,
  LightMode
} from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
import { getIconComponent } from '../utils/iconMapping';

const drawerWidth = 280;

// Styled components con el tema personalizado
const StyledAppBar = styled(AppBar)(({ theme, open }) => ({
  backgroundColor: '#ffffff',
  color: theme.palette.text.primary,
  boxShadow: '0 2px 20px rgba(25, 49, 75, 0.06)',
  backdropFilter: 'blur(20px)',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // En desktop, ajustar cuando el sidebar esté abierto
  [theme.breakpoints.up('sm')]: {
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  },
  // En móvil, siempre ocupa todo el ancho
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
    width: '100%',
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    background: theme.palette.mode === 'dark' 
      ? `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[900]} 100%)`
      : `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    borderRight: 'none',
    boxShadow: theme.palette.mode === 'dark'
      ? '4px 0 24px rgba(0, 0, 0, 0.4)'
      : '4px 0 24px rgba(25, 49, 75, 0.15)',
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(255, 255, 255, 0.1)',
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(255, 255, 255, 0.3)',
      borderRadius: '3px',
      '&:hover': {
        background: theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.3)'
          : 'rgba(255, 255, 255, 0.4)',
      },
    },
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
  backgroundColor: 'transparent',
  color: theme.palette.mode === 'dark' ? theme.palette.text.primary : '#ffffff',
  minHeight: { xs: 64, sm: 80 }, // Más compacto en móvil
  borderBottom: theme.palette.mode === 'dark' 
    ? `1px solid ${theme.palette.divider}`
    : `1px solid ${alpha('#fff', 0.15)}`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark'
      ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.4)} 100%)`
      : `linear-gradient(135deg, ${alpha('#fff', 0.1)} 0%, ${alpha('#fff', 0.05)} 100%)`,
    backdropFilter: 'blur(10px)',
    zIndex: -1,
  },
  // Responsive spacing
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5, 2),
    minHeight: 64,
  },
  ...theme.mixins.toolbar,
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, active, level = 0 }) => ({
  margin: theme.spacing(0.5, 1.5), // Menos margen en móvil
  marginLeft: theme.spacing(1.5 + level * 1.5), // Indentación más compacta
  borderRadius: 12, // Más pequeño en móvil
  minHeight: 44, // Más compacto
  color: alpha('#fff', 0.85),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  
  // Responsive adjustments
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(0.25, 1),
    marginLeft: theme.spacing(1 + level * 1),
    borderRadius: 8,
    minHeight: 40,
    '&:hover': {
      transform: 'translateX(4px)', // Menos desplazamiento en móvil
    },
  },
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${alpha('#fff', 0.08)} 0%, ${alpha('#fff', 0.04)} 100%)`,
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: 0,
  },
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#ffffff',
    transform: 'translateX(8px)',
    boxShadow: `0 4px 20px ${alpha('#000', 0.15)}`,
    '&::before': {
      opacity: 1,
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.secondary.main,
      transform: 'scale(1.1)',
    },
  },
  ...(active && {
    backgroundColor: alpha('#fff', 0.15),
    color: '#ffffff',
    fontWeight: 600,
    boxShadow: `0 4px 16px ${alpha('#000', 0.2)}`,
    '&::before': {
      opacity: 1,
      background: `linear-gradient(135deg, ${alpha('#fff', 0.12)} 0%, ${alpha('#fff', 0.08)} 100%)`,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 3, // Más delgado en móvil
      height: '50%',
      backgroundColor: theme.palette.secondary.main,
      borderRadius: '0 3px 3px 0',
      boxShadow: `0 0 8px ${theme.palette.secondary.main}`,
      [theme.breakpoints.down('sm')]: {
        width: 2,
        height: '40%',
      },
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.secondary.main,
    },
    '& .MuiListItemText-primary': {
      fontWeight: 600,
    },
  }),
  '& .MuiListItemIcon-root': {
    minWidth: 36, // Más compacto
    color: 'inherit',
    transition: 'all 0.3s ease',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      minWidth: 32,
    },
  },
  '& .MuiListItemText-root': {
    zIndex: 1,
    '& .MuiListItemText-primary': {
      fontSize: '0.875rem',
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
      },
    },
  },
}));

const MenuSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 0),
  '&:not(:last-child)': {
    borderBottom: `1px solid ${alpha('#fff', 0.1)}`,
    marginBottom: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
}));

const MenuSectionTitle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1, 3),
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  color: alpha('#fff', 0.6),
  marginBottom: theme.spacing(1),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -4,
    left: 24,
    width: 24,
    height: 2,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 1,
  },
}));

const UserSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2), // Menos padding en móvil
  marginTop: 'auto',
  borderTop: `1px solid ${alpha('#fff', 0.15)}`,
  background: `linear-gradient(135deg, ${alpha('#fff', 0.08)} 0%, ${alpha('#fff', 0.04)} 100%)`,
  backdropFilter: 'blur(10px)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5, 1.5),
  },
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5), // Menos gap en móvil
  padding: theme.spacing(1.5, 2), // Menos padding
  borderRadius: 12, // Más pequeño
  backgroundColor: alpha('#fff', 0.1),
  border: `1px solid ${alpha('#fff', 0.15)}`,
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1),
    padding: theme.spacing(1, 1.5),
    borderRadius: 8,
  },
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${alpha('#fff', 0.12)} 0%, ${alpha('#fff', 0.06)} 100%)`,
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: 0,
  },
  '&:hover': {
    backgroundColor: alpha('#fff', 0.15),
    border: `1px solid ${alpha('#fff', 0.25)}`,
    transform: 'translateY(-1px)', // Menos movimiento en móvil
    boxShadow: `0 4px 16px ${alpha('#000', 0.1)}`, // Sombra más sutil
    '&::before': {
      opacity: 1,
    },
    [theme.breakpoints.down('sm')]: {
      transform: 'none', // Sin transform en móvil
    },
  },
  '& > *': {
    zIndex: 1,
  },
}));

const NavbarThemeToggle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1, 2),
  borderRadius: 24,
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    transform: 'translateY(-1px)',
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

const NavbarThemeSwitch = styled(Switch)(({ theme }) => ({
  width: 44,
  height: 24,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(20px)',
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
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  '& .MuiSwitch-track': {
    borderRadius: 24 / 2,
    backgroundColor: alpha(theme.palette.primary.main, 0.3),
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 300,
    }),
  },
}));

function DashboardLayout() {
  const theme = useTheme();
  const { darkMode, toggleDarkMode } = useCustomTheme();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenus, setOpenMenus] = useState({});
  
  const { user, application, menu, logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    // En móvil (< sm breakpoint), solo controla el drawer temporal
    if (window.innerWidth < 900) { // Usar valor fijo para evitar problemas con theme
      setMobileOpen(!mobileOpen);
    } else {
      // En desktop, controla el drawer permanente
      setOpen(!open);
    }
  };

  const handleMobileDrawerClose = () => {
    setMobileOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSettings = () => {
    navigate('/settings');
    handleProfileMenuClose();
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/login');
  };

  const handleMenuToggle = (menuId) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleMenuClick = (menuItem) => {
    if (menuItem.path) {
      navigate(menuItem.path);
      // Cerrar el drawer móvil después de navegar
      if (mobileOpen) {
        handleMobileDrawerClose();
      }
    }
  };

  const handleThemeToggle = () => {
    toggleDarkMode();
  };

  // Función recursiva para renderizar el menú jerárquico
  const renderMenuItem = (menuItem, level = 0) => {
    const hasChildren = menuItem.children && menuItem.children.length > 0;
    const isOpen = openMenus[menuItem._id];
    const IconComponent = getIconComponent(menuItem.icon);

    return (
      <React.Fragment key={menuItem._id}>
        <ListItem disablePadding>
          <StyledListItemButton
            level={level}
            active={window.location.pathname === menuItem.path}
            onClick={() => {
              if (hasChildren) {
                handleMenuToggle(menuItem._id);
              } else {
                handleMenuClick(menuItem);
              }
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 36,
              color: 'inherit',
              transition: 'color 0.2s ease',
            }}>
              {IconComponent && <IconComponent sx={{ fontSize: 20 }} />}
            </ListItemIcon>
            <ListItemText 
              primary={menuItem.label}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            />
            {hasChildren && (
              <Box sx={{ 
                ml: 1,
                transition: 'transform 0.2s ease',
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}>
                <ExpandMore sx={{ fontSize: 20 }} />
              </Box>
            )}
          </StyledListItemButton>
        </ListItem>
        
        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {menuItem.children.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <DrawerHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 42,
              height: 42,
              backgroundColor: alpha('#fff', 0.2),
              color: 'white',
              fontWeight: 700,
              fontSize: '1.1rem',
              border: '2px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            CP
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: 'white',
              fontSize: '1.1rem',
              lineHeight: 1.2,
            }}>
              Control Panel
            </Typography>
            <Typography variant="caption" sx={{ 
              color: alpha('#fff', 0.8),
              fontSize: '0.75rem',
            }}>
              v2.0 Dashboard
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ 
            color: 'white',
            width: 36,
            height: 36,
            '&:hover': {
              backgroundColor: alpha('#fff', 0.1),
            }
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      
      <Box sx={{ flex: 1, overflowY: 'auto', py: 2 }}>
        <MenuSection>
          <MenuSectionTitle>
            Navegación Principal
          </MenuSectionTitle>
          <List sx={{ py: 0 }}>
            {menu && menu.length > 0 ? (
              menu.map(menuItem => renderMenuItem(menuItem))
            ) : (
              <ListItem>
                <ListItemText 
                  primary="No hay menús disponibles"
                  primaryTypographyProps={{
                    textAlign: 'center',
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                  }}
                />
              </ListItem>
            )}
          </List>
        </MenuSection>
      </Box>

      <UserSection>
        <UserInfo>
          <Avatar
            sx={{
              width: { xs: 36, sm: 42 }, // Más pequeño en móvil
              height: { xs: 36, sm: 42 },
              backgroundColor: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.primary.main, 0.3)
                : alpha('#fff', 0.25),
              color: theme.palette.mode === 'dark' 
                ? theme.palette.primary.main
                : 'white',
              fontSize: { xs: '0.8rem', sm: '0.95rem' },
              fontWeight: 700,
              border: theme.palette.mode === 'dark'
                ? `2px solid ${alpha(theme.palette.primary.main, 0.5)}`
                : `2px solid ${alpha('#fff', 0.3)}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)', // Sombra más sutil en móvil
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ 
              fontWeight: 700,
              color: theme.palette.mode === 'dark' 
                ? theme.palette.text.primary
                : '#ffffff',
              fontSize: { xs: '0.85rem', sm: '0.95rem' },
              lineHeight: 1.2,
            }}>
              {user?.name || 'Usuario'}
            </Typography>
            <Typography variant="caption" sx={{ 
              color: theme.palette.mode === 'dark'
                ? theme.palette.text.secondary
                : alpha('#fff', 0.75),
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
            }}>
              {user?.role || 'Administrador'}
            </Typography>
          </Box>
        </UserInfo>
        
        <Box sx={{ mt: { xs: 1, sm: 2 }, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ 
            color: theme.palette.mode === 'dark'
              ? alpha(theme.palette.text.secondary, 0.7)
              : alpha('#fff', 0.5),
            fontSize: { xs: '0.65rem', sm: '0.7rem' },
            fontWeight: 500,
          }}>
            © 2025 Control Panel
          </Typography>
        </Box>
      </UserSection>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledAppBar position="fixed" open={open}>
        <Toolbar sx={{ 
          minHeight: { xs: 56, sm: 64 }, // Más compacto en móvil
          px: { xs: 1, sm: 3 }, // Menos padding en móvil
        }}>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ 
              marginRight: { xs: 2, sm: 5 },
              color: theme.palette.text.primary,
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              borderRadius: 2,
              width: { xs: 40, sm: 48 }, // Más pequeño en móvil
              height: { xs: 40, sm: 48 },
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
                transform: 'scale(1.05)',
              }
            }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          
            <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 700,
              color: theme.palette.text.primary,
              fontSize: { xs: '1rem', sm: '1.25rem' }, // Responsive
            }}
          >
            {application?.name || 'Panel de Control'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 2 } }}>
            <Chip
              label={application?.alias || 'Sistema'}
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 600,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                fontSize: { xs: '0.7rem', sm: '0.75rem' }, // Más pequeño en móvil
                height: { xs: 24, sm: 'auto' },
              }}
            />

            {/* Theme Toggle - oculto en móvil muy pequeño */}
            <Tooltip title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
              <NavbarThemeToggle sx={{ display: { xs: 'none', sm: 'flex' } }}>
                {darkMode ? (
                  <DarkMode sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                ) : (
                  <LightMode sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                )}
                <NavbarThemeSwitch
                  checked={darkMode}
                  onChange={handleThemeToggle}
                  size="small"
                />
              </NavbarThemeToggle>
            </Tooltip>

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="user-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              sx={{
                color: theme.palette.text.primary,
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                borderRadius: 2,
                width: { xs: 40, sm: 48 }, // Más pequeño en móvil
                height: { xs: 40, sm: 48 },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  transform: 'scale(1.05)',
                }
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 28, sm: 36 }, // Más pequeño en móvil
                  height: { xs: 28, sm: 36 },
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  fontWeight: 600,
                  boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              }
            }}
          >
            <MenuItem onClick={handleProfileMenuClose} disabled>
              <AccountCircle sx={{ mr: 2 }} />
              {user?.name || 'Usuario'}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleSettings}>
              <Settings sx={{ mr: 2 }} />
              Configuración
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 2 }} />
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </StyledAppBar>

      <StyledDrawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box',
            width: open ? drawerWidth : 0,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
        open={open}
      >
        {drawer}
      </StyledDrawer>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleMobileDrawerClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: { xs: '260px', sm: drawerWidth }, // Más estrecho en móvil
            maxWidth: { xs: '75vw', sm: '80vw' }, // Limitar ancho en móvil
            marginTop: { xs: '56px', sm: '64px' }, // Espacio para el AppBar
            height: { xs: 'calc(100% - 56px)', sm: 'calc(100% - 64px)' },
            background: (theme) => theme.palette.mode === 'dark' 
              ? `linear-gradient(135deg, ${alpha('#000', 0.8)} 0%, ${alpha('#000', 0.6)} 100%)`
              : `linear-gradient(135deg, ${alpha('#fff', 0.1)} 0%, ${alpha('#fff', 0.05)} 100%)`,
            backdropFilter: 'blur(10px)',
            border: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 }, // Menos padding en móvil
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
          marginLeft: { sm: open ? 0 : `-${drawerWidth}px` },
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} /> {/* Matching toolbar height */}
        <Outlet />
      </Box>
    </Box>
  );
}

export default DashboardLayout;
