import { create } from 'zustand';
import keycloak from '../config/keycloak';
import { isAuthEnabled } from '../config/auth';

interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  farmerId?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  keycloakReady: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setKeycloakReady: (ready: boolean) => void;
  logout: () => Promise<void>;
}


export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  keycloakReady: false,
  setKeycloakReady: (ready) => set({ keycloakReady: ready }),
  setUser: (user) => set({ user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsLoading: (isLoading) => set({ isLoading }),
  logout: async () => {
      set({
        user: null,
        isAuthenticated: false,
        keycloakReady: false,
      });

      try {
        await keycloak.logout({
          redirectUri: window.location.origin,
        });
      } catch (err) {
        console.error('Logout failed:', err);
      }
    },
  }));