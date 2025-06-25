// Authentication configuration
export const authConfig = {
  // Set to 'mock' to disable Keycloak authentication for development
  // Set to 'keycloak' to use Keycloak authentication
  mode: (import.meta.env.VITE_AUTH_MODE || 'keycloak') as 'keycloak' | 'mock',
  
  // Mock user data for development
  mockUser: {
    id: 'dev-user-123',
    username: 'developer',
    email: 'dev@example.com',
    roles: ['user', 'admin'],
    farmerId: 'farm-123',
  },
} as const;

export const isAuthEnabled = authConfig.mode === 'keycloak';
export const isMockAuth = authConfig.mode === 'mock';

// Auth-agnostic ready check - works for both Keycloak and mock auth
export const isAuthReady = (): boolean => {
  if (isMockAuth) {
    return true; // Mock auth is always ready
  }
  
  // For Keycloak, check keycloak ready state
  const { isKeycloakReady } = require('./keycloak');
  return isKeycloakReady();
};