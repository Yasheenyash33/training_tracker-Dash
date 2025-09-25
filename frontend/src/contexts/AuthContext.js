import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      const userInfo = localStorage.getItem('user_info');

      if (token && userInfo) {
        try {
          // Validate token and get fresh user info
          const response = await authAPI.getCurrentUser();
          setUser(response.data);
        } catch (error) {
          // Token invalid, clear storage
          authAPI.logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { access, refresh, user } = response.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_info', JSON.stringify(user));

      setUser(user);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
    hasRole: (role) => user?.role === role,
    isAdmin: user?.role === 'admin',
    isTrainer: user?.role === 'trainer' || user?.role === 'admin',
    isTrainee: user?.role === 'trainee'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
