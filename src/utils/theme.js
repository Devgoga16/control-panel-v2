import { createTheme } from '@mui/material/styles';

// Paleta de colores personalizada
const colors = {
  caramel: '#F1D198',
  spaceСadet: '#19314B',
  policeBlue: '#2D4B6F',
  davysGrey: '#595959',
  lightGray: '#D2D2D2',
  // Colores derivados para gradientes y sombras
  caramelLight: '#F5DEB3',
  caramelDark: '#E6C285',
  spaceСadetLight: '#1F3A52',
  policeBlueDark: '#24405C',
  // Colores para dark mode
  darkBackground: '#0a0e1a',
  darkPaper: '#1a1f2e',
  darkSurface: '#242938',
};

// Tema personalizado para el Panel de Control
export const customTheme = (darkMode = false) => createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: {
      main: colors.policeBlue,
      light: colors.spaceСadetLight,
      dark: colors.policeBlueDark,
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.caramel,
      light: colors.caramelLight,
      dark: colors.caramelDark,
      contrastText: darkMode ? '#ffffff' : colors.spaceСadet,
    },
    background: {
      default: darkMode ? colors.darkBackground : '#f8f9fa',
      paper: darkMode ? colors.darkPaper : '#ffffff',
      security: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill-opacity='0.04'%3E%3Cpath d='M60 15 L72 32 L95 32 L78 47 L84 70 L60 58 L36 70 L42 47 L25 32 L48 32 Z' fill='%23${colors.spaceСadet.slice(1)}'/%3E%3Ccircle cx='60' cy='60' r='42' stroke='%23${colors.policeBlue.slice(1)}' stroke-width='1.5' fill='none' opacity='0.3'/%3E%3Cpath d='M45 60 L55 70 L75 50' stroke='%23${colors.caramel.slice(1)}' stroke-width='2.5' fill='none'/%3E%3Cpath d='M30 30 L90 30 L90 90 L30 90 Z' stroke='%23${colors.davysGrey.slice(1)}' stroke-width='1' fill='none' opacity='0.2'/%3E%3Ccircle cx='35' cy='35' r='3' fill='%23${colors.policeBlue.slice(1)}' opacity='0.4'/%3E%3Ccircle cx='85' cy='35' r='3' fill='%23${colors.policeBlue.slice(1)}' opacity='0.4'/%3E%3Ccircle cx='35' cy='85' r='3' fill='%23${colors.policeBlue.slice(1)}' opacity='0.4'/%3E%3Ccircle cx='85' cy='85' r='3' fill='%23${colors.policeBlue.slice(1)}' opacity='0.4'/%3E%3C/g%3E%3C/svg%3E")`,
    },
    text: {
      primary: darkMode ? '#ffffff' : colors.spaceСadet,
      secondary: darkMode ? '#b0bec5' : colors.davysGrey,
    },
    grey: {
      100: darkMode ? colors.darkSurface : colors.lightGray,
      300: darkMode ? '#546e7a' : colors.davysGrey,
      500: darkMode ? '#78909c' : colors.davysGrey,
      700: darkMode ? '#b0bec5' : colors.spaceСadet,
    },
    divider: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    // Colores personalizados adicionales
    custom: {
      gradient: darkMode 
        ? `linear-gradient(135deg, ${colors.darkSurface} 0%, ${colors.darkPaper} 100%)`
        : `linear-gradient(135deg, ${colors.spaceСadet} 0%, ${colors.policeBlue} 100%)`,
      gradientLight: `linear-gradient(135deg, ${colors.caramelLight} 0%, ${colors.caramel} 100%)`,
      shadow: darkMode 
        ? `0 10px 40px rgba(0, 0, 0, 0.3)`
        : `0 10px 40px rgba(25, 49, 75, 0.15)`,
      shadowHover: darkMode 
        ? `0 15px 50px rgba(0, 0, 0, 0.4)`
        : `0 15px 50px rgba(25, 49, 75, 0.25)`,
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 32px',
          fontSize: '1rem',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: darkMode 
              ? '0 15px 50px rgba(0, 0, 0, 0.4)'
              : '0 15px 50px rgba(25, 49, 75, 0.25)',
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          background: darkMode 
            ? `linear-gradient(135deg, ${colors.policeBlue} 0%, ${colors.spaceСadet} 100%)`
            : `linear-gradient(135deg, ${colors.spaceСadet} 0%, ${colors.policeBlue} 100%)`,
          '&:hover': {
            background: darkMode
              ? `linear-gradient(135deg, ${colors.policeBlueDark} 0%, ${colors.darkSurface} 100%)`
              : `linear-gradient(135deg, ${colors.policeBlueDark} 0%, ${colors.spaceСadet} 100%)`,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: darkMode ? colors.darkSurface : '#fafafa',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: darkMode ? '#2a3441' : '#f5f5f5',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.caramel,
              },
            },
            '&.Mui-focused': {
              backgroundColor: darkMode ? colors.darkPaper : '#ffffff',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.policeBlue,
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: darkMode 
            ? '0 10px 40px rgba(0, 0, 0, 0.3)' 
            : '0 10px 40px rgba(25, 49, 75, 0.15)',
          borderRadius: 0,
          backgroundColor: darkMode ? colors.darkPaper : '#ffffff',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        outlined: {
          borderColor: colors.caramel,
          color: colors.spaceСadet,
          '&:hover': {
            backgroundColor: colors.caramelLight,
          },
        },
      },
    },
  },
});

export { colors };
