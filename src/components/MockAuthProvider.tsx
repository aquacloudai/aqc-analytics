import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import { authConfig } from '../config/auth';

interface MockAuthProviderProps {
  children: ReactNode;
}

export function MockAuthProvider({ children }: MockAuthProviderProps) {
  const { setUser, setIsAuthenticated, setIsLoading } = useAuthStore();

  useEffect(() => {
    // Simulate authentication delay
    const timer = setTimeout(() => {
      setUser(authConfig.mockUser);
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
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