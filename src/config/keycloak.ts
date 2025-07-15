import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

let keycloakReady = false;
let initPromise: Promise<boolean> | null = null;

export const initKeycloak = async (): Promise<boolean> => {
  if (keycloakReady) return true; 
  if (initPromise) return initPromise;

  initPromise = keycloak.init({
    onLoad: 'login-required',
    checkLoginIframe: false,
    pkceMethod: 'S256',
  }).then(authenticated => {
    if (authenticated && keycloak.token) {
      keycloakReady = true;
    }
    return authenticated;
  });

  return initPromise;
};

export const isKeycloakReady = (): boolean => keycloakReady;

export default keycloak;
