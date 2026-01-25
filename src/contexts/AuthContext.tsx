/**
 * Auth Context
 *
 * Provides authentication state and methods to the app.
 * Handles login, signup, logout, and session restoration.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { hasStoredTokens } from '../api/client';
import {
  signInWithEmail,
  signUpWithEmail,
  signOut as authSignOut,
  getCurrentUser,
  User,
} from '../api/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      setIsLoading(true);

      // Check if we have stored tokens
      const hasTokens = await hasStoredTokens();
      if (!hasTokens) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Try to get current user to validate tokens
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      console.error('Error checking existing session:', err);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await signInWithEmail(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      const message = getAuthErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await signUpWithEmail(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      const message = getAuthErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      await authSignOut();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    error,
    signIn,
    signUp,
    signOut,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Convert Firebase/API errors to user-friendly messages
 */
function getAuthErrorMessage(error: any): string {
  const code = error?.code || error?.response?.data?.error || '';

  switch (code) {
    case 'auth/invalid-email':
      return 'Email inválido';
    case 'auth/user-disabled':
      return 'Esta conta foi desativada';
    case 'auth/user-not-found':
      return 'Usuário não encontrado';
    case 'auth/wrong-password':
      return 'Senha incorreta';
    case 'auth/email-already-in-use':
      return 'Este email já está em uso';
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres';
    case 'auth/network-request-failed':
      return 'Erro de conexão. Verifique sua internet';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde';
    default:
      return error?.message || 'Ocorreu um erro. Tente novamente';
  }
}
