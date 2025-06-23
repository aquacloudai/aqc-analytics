import { useEffect, type ReactNode } from 'react';
import keycloak from '../config/keycloak';
import { useAuthStore } from '../store/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setIsAuthenticated, setIsLoading } = useAuthStore();

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const authenticated = await keycloak.init({
          onLoad: 'login-required',
          checkLoginIframe: false,
        });

        if (authenticated) {
          setIsAuthenticated(true);
          
          // Load user profile
          const profile = await keycloak.loadUserProfile();
          const tokenParsed = keycloak.tokenParsed as any;
          
          setUser({
            id: profile.id || tokenParsed.sub,
            username: profile.username || '',
            email: profile.email || '',
            roles: tokenParsed.realm_access?.roles || [],
            farmerId: tokenParsed.farmer_id,
          });
        }
      } catch (error) {
        console.error('Keycloak initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initKeycloak();

    // Token refresh
    const tokenRefreshInterval = setInterval(() => {
      keycloak.updateToken(70).catch(() => {
        console.error('Failed to refresh token');
        keycloak.login();
      });
    }, 60000); // Check every minute

    return () => clearInterval(tokenRefreshInterval);
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