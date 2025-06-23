import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

let initialized = false;
let initPromise: Promise<boolean> | null = null;

export async function initKeycloak(): Promise<boolean> {
  if (initialized) return true;
  if (initPromise) return initPromise;

  initPromise = keycloak
    .init({
      onLoad: 'login-required',
      pkceMethod: 'S256',
      checkLoginIframe: false,
    })
    .then(async (authenticated) => {
      initialized = true;

      // Try updating token if missing
      if (!keycloak.token) {
        console.warn('[KeycloakService] No token, calling updateToken...');
        await keycloak.updateToken(5);
      }

      console.log('[KeycloakService] Authenticated. Token:', keycloak.token);
      return authenticated;
    });

  return initPromise;
}


export default keycloak;
