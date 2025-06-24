import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import keycloak, { initKeycloak } from '../config/keycloak';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setIsAuthenticated, setIsLoading, setKeycloakReady } = useAuthStore();


  useEffect(() => {
    const start = async () => {
      try {
        const authenticated = await initKeycloak();

          if (authenticated) {
            setIsAuthenticated(true);

            const profile = await keycloak.loadUserProfile();
            const tokenParsed = keycloak.tokenParsed as any;

            setUser({
              id: profile.id || tokenParsed.sub,
              username: profile.username || '',
              email: profile.email || '',
              roles: tokenParsed.realm_access?.roles || [],
              farmerId: tokenParsed.farmer_id,
            });

            setKeycloakReady(true);
          }

      } catch (error) {
        console.error('Keycloak initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    start();

    const interval = setInterval(() => {
      keycloak.updateToken(70).catch(() => {
        console.error('Failed to refresh token');
        keycloak.login();
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [setUser, setIsAuthenticated, setIsLoading]);

  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
