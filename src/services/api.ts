import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import keycloak from '../config/keycloak';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'https://apee.aquacloud.ai';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ensure token is valid before request
async function ensureToken(): Promise<void> {
  const { isAuthenticated, isLoading } = useAuthStore.getState();

  console.log('[ensureToken] isAuthenticated:', isAuthenticated);
  console.log('[ensureToken] isLoading:', isLoading);
  console.log('[ensureToken] token:', keycloak.token);

  if (isLoading) {
    throw new Error('Auth is still initializing. Wait before making API requests.');
  }

  if (!isAuthenticated || !keycloak.token) {
    throw new Error('User not authenticated or token not available.');
  }

  try {
    const refreshed = await keycloak.updateToken(30);
    if (refreshed) {
      console.log('[ensureToken] Token refreshed');
    }
  } catch (err) {
    console.error('[ensureToken] Token refresh failed:', err);
    keycloak.login();
    throw err;
  }
}

// Attach token to request
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    await ensureToken();

    if (keycloak.token && config.headers) {
      config.headers.Authorization = `Bearer ${keycloak.token}`;
      console.log('[interceptor] Attached token to request');
    }

    return config;
  },
  (error) => {
    console.error('[interceptor] Request error:', error);
    return Promise.reject(error);
  }
);

// Retry once on 401
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await keycloak.updateToken(0); // force refresh
        if (keycloak.token && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;
        }
        return api(originalRequest);
      } catch (err) {
        console.error('[interceptor] Retry failed. Redirecting to login.');
        keycloak.login();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
