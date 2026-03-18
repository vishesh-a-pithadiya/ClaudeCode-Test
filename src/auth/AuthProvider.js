import React, { useState, useEffect, useCallback } from 'react';
import AuthContext from './AuthContext';
import AUTH_CONFIG, { isOAuthConfigured } from './config';

/**
 * AuthProvider
 *
 * Wraps your app and provides authentication state + actions.
 *
 * Two modes:
 *   1. Mock mode (default) — simulates login locally for development
 *   2. OAuth mode — real TI OAuth flow when credentials are configured
 *
 * To switch to real OAuth: update config.js with your client_id and redirect_uri
 */
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_CONFIG.storageKeys.user);
    const storedToken = localStorage.getItem(AUTH_CONFIG.storageKeys.accessToken);

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        clearStorage();
      }
    }
    setIsLoading(false);
  }, []);

  // Handle OAuth callback (check URL for auth code on mount)
  useEffect(() => {
    if (!isOAuthConfigured()) return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const storedState = sessionStorage.getItem(AUTH_CONFIG.storageKeys.state);

    if (code && state && state === storedState) {
      exchangeCodeForToken(code);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  // eslint-disable-next-line
  }, []);

  /**
   * Generate a random state string for CSRF protection
   */
  function generateState() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Clear all stored auth data
   */
  function clearStorage() {
    Object.values(AUTH_CONFIG.storageKeys).forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }

  /**
   * Initiate login
   * - If OAuth is configured: redirects to TI login
   * - If not configured: uses mock login for development
   */
  const login = useCallback((mockEmail) => {
    if (isOAuthConfigured()) {
      // Real OAuth flow
      const state = generateState();
      sessionStorage.setItem(AUTH_CONFIG.storageKeys.state, state);

      const params = new URLSearchParams({
        response_type: AUTH_CONFIG.responseType,
        scope: AUTH_CONFIG.scopes,
        client_id: AUTH_CONFIG.clientId,
        redirect_uri: AUTH_CONFIG.redirectUri,
        state: state,
        response_mode: AUTH_CONFIG.responseMode,
      });

      window.location.href = `${AUTH_CONFIG.authorizationUrl}?${params.toString()}`;
    } else {
      // Mock login for development
      const mockUser = {
        email: mockEmail || 'user@example.com',
        name: mockEmail ? mockEmail.split('@')[0] : 'TI User',
        sub: 'mock-user-id',
      };
      localStorage.setItem(AUTH_CONFIG.storageKeys.user, JSON.stringify(mockUser));
      localStorage.setItem(AUTH_CONFIG.storageKeys.accessToken, 'mock-token-for-development');
      localStorage.setItem(AUTH_CONFIG.storageKeys.tokenExpiry,
        String(Date.now() + 3600 * 1000) // 1 hour
      );
      setUser(mockUser);
    }
  }, []);

  /**
   * Exchange authorization code for access token
   *
   * TODO: In production, this should be done server-side to protect client_secret.
   *       Set up a backend endpoint (e.g., /api/auth/token) that:
   *       1. Receives the auth code from the frontend
   *       2. Exchanges it with TI's token endpoint using client_secret
   *       3. Returns the access token to the frontend
   */
  async function exchangeCodeForToken(code) {
    try {
      // Replace this with your backend token exchange endpoint
      const response = await fetch('/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, redirect_uri: AUTH_CONFIG.redirectUri }),
      });

      if (!response.ok) throw new Error('Token exchange failed');

      const data = await response.json();

      // Store tokens
      localStorage.setItem(AUTH_CONFIG.storageKeys.accessToken, data.access_token);
      if (data.refresh_token) {
        localStorage.setItem(AUTH_CONFIG.storageKeys.refreshToken, data.refresh_token);
      }
      localStorage.setItem(AUTH_CONFIG.storageKeys.tokenExpiry,
        String(Date.now() + (data.expires_in || 3600) * 1000)
      );

      // Fetch user info
      await fetchUserInfo(data.access_token);
    } catch (error) {
      console.error('Auth error:', error);
      clearStorage();
    }
  }

  /**
   * Fetch user profile from TI's userinfo endpoint
   */
  async function fetchUserInfo(accessToken) {
    try {
      const response = await fetch(AUTH_CONFIG.userInfoUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) throw new Error('Failed to fetch user info');

      const userData = await response.json();
      localStorage.setItem(AUTH_CONFIG.storageKeys.user, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('User info error:', error);
    }
  }

  /**
   * Get a valid access token (refreshes if expired)
   */
  const getAccessToken = useCallback(async () => {
    const token = localStorage.getItem(AUTH_CONFIG.storageKeys.accessToken);
    const expiry = Number(localStorage.getItem(AUTH_CONFIG.storageKeys.tokenExpiry));

    if (!token) return null;

    // Check if token needs refresh
    if (expiry && Date.now() > expiry - AUTH_CONFIG.tokenRefreshBuffer) {
      const refreshToken = localStorage.getItem(AUTH_CONFIG.storageKeys.refreshToken);
      if (refreshToken) {
        try {
          // Replace with your backend refresh endpoint
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem(AUTH_CONFIG.storageKeys.accessToken, data.access_token);
            localStorage.setItem(AUTH_CONFIG.storageKeys.tokenExpiry,
              String(Date.now() + (data.expires_in || 3600) * 1000)
            );
            return data.access_token;
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      }
      // If refresh fails, log out
      logout();
      return null;
    }

    return token;
  // eslint-disable-next-line
  }, []);

  /**
   * Log out — clear all auth state
   */
  const logout = useCallback(() => {
    clearStorage();
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    getAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
