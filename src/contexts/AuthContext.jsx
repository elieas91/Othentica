import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import { AuthContext } from './AuthContextInstance';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (apiService.isAuthenticated()) {
        try {
          const userData = await apiService.getProfile();
          setUser(userData);
        } catch (err) {
          console.error('Auth check failed:', err);
          apiService.removeAccessToken();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const { response, data } = await apiService.login(username, password);
      if (response.ok) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { response, data } = await apiService.register(name, email, password);
      if (response.ok) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
