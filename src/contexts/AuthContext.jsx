import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  application: null,
  roles: [],
  menu: [],
  token: null,
  isLoading: true, // Cambiar a true para mostrar loading mientras verificamos
  error: null
};

function authReducer(state, action) {
  switch (action.type) {
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload.user,
        application: action.payload.application,
        roles: action.payload.roles,
        menu: action.payload.menu,
        token: action.payload.token,
        isLoading: false,
        error: null
      };
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        application: action.payload.application,
        roles: action.payload.roles,
        menu: action.payload.menu,
        token: action.payload.token,
        error: null
      };
    case 'LOGIN_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'LOGOUT':
      return { ...initialState, token: null, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'INIT_COMPLETE':
      return { ...state, isLoading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          
          // Establecer el header de autorización
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Restaurar el estado de autenticación
          dispatch({
            type: 'RESTORE_SESSION',
            payload: {
              user: parsedUserData.user,
              application: parsedUserData.application,
              roles: parsedUserData.roles,
              menu: parsedUserData.menu,
              token: token
            }
          });
        } catch (error) {
          console.error('Error al restaurar sesión:', error);
          // Si hay error al parsear, limpiar localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          dispatch({ type: 'INIT_COMPLETE' });
        }
      } else {
        dispatch({ type: 'INIT_COMPLETE' });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      // Intentar con el backend real primero
      let response;
      try {
        response = await api.post('/auth/login', credentials);
        
        // Extraer datos de la respuesta real del backend
        const { data } = response.data;
        const { user, application, roles, menu, token } = data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify({ user, application, roles, menu }));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, application, roles, menu, token }
        });
        
        return { success: true };
      } catch (backendError) {
        // Si el backend no está disponible, usar mock
        console.log('Backend no disponible, usando datos mock...', backendError.message);
        const { mockLogin } = await import('../services/mockService');
        const mockResponse = await mockLogin(credentials);
        
        localStorage.setItem('token', mockResponse.token);
        localStorage.setItem('userData', JSON.stringify({
          user: mockResponse.user,
          application: mockResponse.application,
          roles: mockResponse.roles,
          menu: mockResponse.menu
        }));
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: mockResponse.user,
            application: mockResponse.application,
            roles: mockResponse.roles,
            menu: mockResponse.menu,
            token: mockResponse.token
          }
        });
        
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.message || 'Error de autenticación';
      dispatch({ type: 'LOGIN_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    delete api.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
  };

  const value = {
    ...state,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}
