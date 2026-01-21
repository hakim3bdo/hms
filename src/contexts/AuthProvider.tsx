'use client';

import { authAPI } from '@/services/api';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext, AuthContextType, User } from './AuthContext';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider Component
 * 
 * Wraps the application and provides authentication state globally
 * Uses localStorage for token persistence
 * 
 * Authentication is based on token existence in localStorage
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        // Check if token exists - this is our source of truth for authentication
        const token = authAPI.getToken();
        const storedUser = authAPI.getCurrentUser();
        
        if (token) {
          setIsAuthenticated(true);
          setUser(storedUser || { username: 'user' }); // Default user if none stored
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, []);

  const refresh = useCallback(async (): Promise<User | null> => {
    try {
      // Check token first - this is our source of truth
      const token = authAPI.getToken();
      const storedUser = authAPI.getCurrentUser();
      
      if (token) {
        const userData = storedUser || { username: 'user' };
        setUser(userData);
        setIsAuthenticated(true);
        return userData;
      } else {
        setUser(null);
        setIsAuthenticated(false);
        return null;
      }
    } catch (err) {
      setError(err as Error);
      setIsAuthenticated(false);
      setUser(null);
      return null;
    }
  }, []);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
      user,
      userRole: user?.role || null,
      loading,
      error,
      logout,
      refresh,
    }),
    [isAuthenticated, user, loading, error, logout, refresh]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
