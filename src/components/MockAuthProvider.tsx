import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import { authConfig } from '../config/auth';

interface MockAuthProviderProps {
  children: ReactNode;
}

export function MockAuthProvider({ children }: MockAuthProviderProps) {
  const { setUser, setIsAuthenticated, setIsLoading, setKeycloakReady } = useAuthStore();

  useEffect(() => {
    // Simulate quick mock auth initialization
    setTimeout(() => {
      setUser(authConfig.mockUser);
      setIsAuthenticated(true);
      setKeycloakReady(true);
      setIsLoading(false);
    }, 100); // Small delay to simulate auth check
  }, [setUser, setIsAuthenticated, setIsLoading, setKeycloakReady]);

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