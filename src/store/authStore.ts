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
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsLoading: (isLoading) => set({ isLoading }),
  logout: async () => {
    if (isAuthEnabled) {
      await keycloak.logout();
    } else {
      // For mock auth, just clear the state
      console.log('Mock logout - clearing auth state');
    }
    set({ user: null, isAuthenticated: false });
  },
}));