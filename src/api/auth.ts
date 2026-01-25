/**
 * Auth API
 *
 * Functions for authenticating with the tatame0 backend.
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import apiClient, { saveAuthTokens, clearAuthTokens } from './client';
import { getFirebaseAuth, isFirebaseInitialized } from '../config/firebase';

export interface User {
  id: string;
  email: string | null;
  name: string | null;
  role: string;
  phone_number: string | null;
  created_at: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthResponse> {
  const auth = getFirebaseAuth();
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await userCredential.user.getIdToken();

  return authenticateWithBackend(idToken);
}

/**
 * Create a new account with email and password
 */
export async function signUpWithEmail(email: string, password: string): Promise<AuthResponse> {
  const auth = getFirebaseAuth();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const idToken = await userCredential.user.getIdToken();

  return authenticateWithBackend(idToken);
}

/**
 * Send Firebase ID token to backend and get JWT tokens
 */
async function authenticateWithBackend(firebaseIdToken: string): Promise<AuthResponse> {
  const response = await apiClient.post('/api/auth/mobile/login', {
    idToken: firebaseIdToken,
  });

  const { accessToken, refreshToken, user } = response.data;

  await saveAuthTokens({ accessToken, refreshToken });

  return { accessToken, refreshToken, user };
}

/**
 * Sign out and clear all auth state
 */
export async function signOut(): Promise<void> {
  try {
    // Sign out from Firebase
    if (isFirebaseInitialized()) {
      const auth = getFirebaseAuth();
      await firebaseSignOut(auth);
    }

    // Call backend logout to invalidate tokens
    try {
      await apiClient.post('/api/auth/mobile/logout');
    } catch (error) {
      // Ignore logout errors - we're clearing local state anyway
    }
  } finally {
    // Always clear local tokens
    await clearAuthTokens();
  }
}

/**
 * Get the current user from the backend
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await apiClient.get('/api/auth/me');
    return response.data.user;
  } catch (error) {
    return null;
  }
}

/**
 * Refresh the current user data
 */
export async function refreshUser(): Promise<User> {
  const response = await apiClient.get('/api/auth/me');
  return response.data.user;
}
