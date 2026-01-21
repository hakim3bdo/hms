'use client';

import React, { createContext } from 'react';

/**
 * User interface for authentication
 */
export interface User {
  id?: number;
  username?: string;
  fullName?: string;
  email?: string;
  role?: string;
  studentId?: string;
  nationalId?: string;
  phoneNumber?: string;
  name?: string;
  [key: string]: unknown;
}

/**
 * Auth Context Type
 * Centralizes authentication state and avoids prop drilling
 */
export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userRole: string | null;
  loading: boolean;
  error: Error | null;
  logout: () => Promise<void>;
  refresh: () => Promise<User | null>;
}

/**
 * Create Auth Context
 * Provides authentication state to all components without prop drilling
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
