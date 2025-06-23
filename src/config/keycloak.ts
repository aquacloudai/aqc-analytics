import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'aqc-realm',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'aqc-analytics',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;