import { createContext, useContext } from 'react';

/**
 * Auth Context
 *
 * Provides auth state and actions to all components:
 * - user: current user object (null if not logged in)
 * - isAuthenticated: boolean
 * - isLoading: true while checking stored tokens on app load
 * - login(): initiate OAuth login flow
 * - logout(): clear tokens and user state
 * - getAccessToken(): get current valid access token (auto-refreshes if needed)
 */
const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  getAccessToken: () => null,
});

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
