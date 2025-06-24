import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import keycloak, { isKeycloakReady } from '../config/keycloak';

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'https://apee.aquacloud.ai';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function ensureToken(): Promise<void> {
  if (!isKeycloakReady() || !keycloak.token) {
    throw new Error('Keycloak not ready or token missing.');
  }

  try {
    const refreshed = await keycloak.updateToken(30);
    if (refreshed) {
      console.log('[ensureToken] Token was refreshed');
    } else {
      console.log('[ensureToken] Token is still valid');
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

    if (keycloak.token) {
      config.headers = config.headers || {};
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
