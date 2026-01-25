/**
 * API Client
 *
 * Axios instance configured for the tatame0 API with automatic
 * token refresh and error handling.
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys for tokens
export const AUTH_TOKENS_KEY = 'bjj-auth-tokens';

// API base URL - can be configured per environment
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000'  // Local development
  : 'https://api.tatame0.com';  // Production

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'x-app-type': 'mobile',
  },
});

// Track if we're currently refreshing to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const tokensJson = await AsyncStorage.getItem(AUTH_TOKENS_KEY);
      if (tokensJson) {
        const tokens: AuthTokens = JSON.parse(tokensJson);
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      }
    } catch (error) {
      console.error('Error reading auth tokens:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for the refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const tokensJson = await AsyncStorage.getItem(AUTH_TOKENS_KEY);
        if (!tokensJson) {
          throw new Error('No refresh token available');
        }

        const tokens: AuthTokens = JSON.parse(tokensJson);

        // Call refresh endpoint
        const response = await axios.post(
          `${API_BASE_URL}/api/auth/mobile/refresh`,
          { refreshToken: tokens.refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const newTokens: AuthTokens = {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        };

        await AsyncStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(newTokens));

        processQueue(null, newTokens.accessToken);

        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        // Clear tokens on refresh failure
        await AsyncStorage.removeItem(AUTH_TOKENS_KEY);
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Save auth tokens to storage
 */
export async function saveAuthTokens(tokens: AuthTokens): Promise<void> {
  await AsyncStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(tokens));
}

/**
 * Clear auth tokens from storage
 */
export async function clearAuthTokens(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_TOKENS_KEY);
}

/**
 * Check if user has stored tokens
 */
export async function hasStoredTokens(): Promise<boolean> {
  const tokens = await AsyncStorage.getItem(AUTH_TOKENS_KEY);
  return tokens !== null;
}

export default apiClient;
