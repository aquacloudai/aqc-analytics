import { useEffect, useState } from 'react';
import { isKeycloakReady } from '../config/keycloak';

export function useKeycloakReady(pollInterval = 250) {
  const [ready, setReady] = useState(isKeycloakReady());

  useEffect(() => {
  console.log('[useKeycloakReady] isKeycloakReady:', isKeycloakReady());


  useEffect(() => {
    if (isKeycloakReady()) {
      setReady(true);
      return;
    }

    const interval = setInterval(() => {
      if (isKeycloakReady()) {
        setReady(true);
        clearInterval(interval);
      }
    }, pollInterval);

    return () => clearInterval(interval);
  }, [pollInterval]);

  }, []);

  return ready;
}
