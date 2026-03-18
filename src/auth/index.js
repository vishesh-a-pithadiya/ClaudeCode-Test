/**
 * Auth Module - Public API
 *
 * Import everything you need from 'auth':
 *
 *   import { useAuth } from './auth';
 *   import { AuthProvider } from './auth';
 *   import { ProtectedRoute } from './auth';
 *   import { useAuthFetch } from './auth';
 *   import { AUTH_CONFIG, isOAuthConfigured } from './auth';
 */

export { default as AuthProvider } from './AuthProvider';
export { default as AuthContext, useAuth } from './AuthContext';
export { default as ProtectedRoute } from './ProtectedRoute';
export { useAuthFetch } from './api';
export { default as AUTH_CONFIG, isOAuthConfigured } from './config';
