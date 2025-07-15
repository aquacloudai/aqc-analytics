import { useEffect, useState } from 'react';
import api from '../../api/auth/apiClient';
import { isKeycloakReady } from '../../config/keycloak'; // Make sure this is NOT a hook, or call it as a hook!
import type { Generation } from '../../types/generation';

export function useGenerations() {
  const [data, setData] = useState<Generation[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isKeycloakReady) return;

    let ignore = false; // Prevents state updates if unmounted

    const fetchGenerations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<{ data: Generation[] }>(`/v3/common/generations`);
        if (!ignore) setData(response.data?.data ?? []);
      } catch (err) {
        console.error('[useGenerations] Failed to fetch generations:', err);
        if (!ignore) setError('Kunne ikke laste generasjoner. Vennligst prøv igjen.');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchGenerations();

    return () => { ignore = true; };
  }, [isKeycloakReady]);

  return { data, loading, error };
}
