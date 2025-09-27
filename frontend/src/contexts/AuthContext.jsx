import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { api, setAuthToken, clearAuthToken, isAuthenticated } from '../lib/api';

// Auth Context
const AuthContext = createContext();

// Auth Actions
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_USER: 'SET_USER',
  UPDATE_USER: 'UPDATE_USER',
  SET_LOADING: 'SET_LOADING',
};

// Initial State
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Auth Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
      };
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload.user },
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };
    default:
      return state;
  }
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('AuthContext: Initializing auth...');
      console.log('AuthContext: isAuthenticated():', isAuthenticated());
      
      if (isAuthenticated()) {
        console.log('AuthContext: Token found, fetching user profile...');
        try {
          const response = await api.users.getProfile();
          console.log('AuthContext: Profile fetch successful:', response);
          dispatch({
            type: AUTH_ACTIONS.SET_USER,
            payload: { user: response.data },
          });
        } catch (error) {
          console.error('AuthContext: Failed to fetch user profile:', error);
          console.log('AuthContext: Clearing token and logging out...');
          clearAuthToken();
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        console.log('AuthContext: No token found, setting loading to false');
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: { isLoading: false } });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const response = await api.auth.login(credentials);
      const { token, user } = response.data;
      
      setAuthToken(token);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user },
      });
      
      return { success: true, user };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: error.message },
      });
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const response = await api.auth.register(userData);
      const { token, user } = response.data;
      
      setAuthToken(token);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user },
      });
      
      return { success: true, user };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: error.message },
      });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthToken();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await api.users.updateProfile(userData);
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: { user: response.data },
      });
      return { success: true, user: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      const response = await api.auth.forgotPassword(email);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Reset password
  const resetPassword = async (data) => {
    try {
      const response = await api.auth.resetPassword(data);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Verify OTP
  const verifyOTP = async (data) => {
    try {
      const response = await api.auth.verifyOTP(data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    verifyOTP,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protected routes
export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      window.location.href = '/login';
      return null;
    }
    
    return <Component {...props} />;
  };
};