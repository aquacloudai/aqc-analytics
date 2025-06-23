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
    roles: ['user', 'admin'] as string[],
    farmerId: 'farm-123',
  },
};

export const isAuthEnabled = authConfig.mode === 'keycloak';
export const isMockAuth = authConfig.mode === 'mock';