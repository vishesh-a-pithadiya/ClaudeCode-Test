/**
 * Authenticated API Helper
 *
 * Use this to make authenticated requests to TI APIs or your own backend.
 * Automatically attaches the access token and handles token refresh.
 *
 * Usage:
 *   import { useAuthFetch } from './auth/api';
 *
 *   function MyComponent() {
 *     const authFetch = useAuthFetch();
 *
 *     const loadData = async () => {
 *       const response = await authFetch('https://api.ti.com/some-endpoint');
 *       const data = await response.json();
 *     };
 *   }
 */

import { useAuth } from './AuthContext';
import { useCallback } from 'react';

export function useAuthFetch() {
  const { getAccessToken, logout } = useAuth();

  const authFetch = useCallback(async (url, options = {}) => {
    const token = await getAccessToken();

    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    // If we get a 401, the token is invalid — log out
    if (response.status === 401) {
      logout();
      throw new Error('Session expired. Please log in again.');
    }

    return response;
  }, [getAccessToken, logout]);

  return authFetch;
}
