/**
 * TI OAuth 2.0 Configuration
 *
 * ============================================================
 * HOW TO UPDATE WITH REAL CREDENTIALS:
 * ============================================================
 *
 * 1. Register your app with TI's OAuth provider to get a client_id
 * 2. Set your app's redirect URI (e.g., http://localhost:3000/oauth/callback)
 * 3. Update the values below with your real credentials
 * 4. Set REACT_APP_TI_CLIENT_ID in your .env file for production
 *
 * Once configured, the entire auth flow will work automatically:
 *   Login button → TI OAuth login → Redirect back → Token stored → User logged in
 * ============================================================
 */

const AUTH_CONFIG = {
  // OAuth endpoints
  authorizationUrl: 'https://login.ti.com/as/authorization.oauth2',
  tokenUrl: 'https://login.ti.com/as/token.oauth2',
  userInfoUrl: 'https://login.ti.com/idp/userinfo.openid',

  // Client credentials — UPDATE THESE with your registered app credentials
  clientId: process.env.REACT_APP_TI_CLIENT_ID || 'YOUR_CLIENT_ID_HERE',

  // Where TI redirects after login — must match your registered redirect URI
  redirectUri: process.env.REACT_APP_TI_REDIRECT_URI || `${window.location.origin}/oauth/callback`,

  // OAuth scopes
  scopes: 'openid email profile',

  // Response type (authorization code flow is most secure)
  responseType: 'code',
  responseMode: 'form_post',

  // Storage keys
  storageKeys: {
    accessToken: 'ti_access_token',
    refreshToken: 'ti_refresh_token',
    user: 'ti_user',
    state: 'ti_oauth_state',
    tokenExpiry: 'ti_token_expiry',
  },

  // Token refresh buffer (refresh 5 min before expiry)
  tokenRefreshBuffer: 5 * 60 * 1000,
};

/**
 * Check if real OAuth credentials are configured
 */
export function isOAuthConfigured() {
  return AUTH_CONFIG.clientId !== 'YOUR_CLIENT_ID_HERE';
}

export default AUTH_CONFIG;
