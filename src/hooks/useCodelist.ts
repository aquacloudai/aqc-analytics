import { useEffect, useState } from 'react';
import api from '../api/auth/apiClient';

import type { Codelist } from '../types/codelist';
import { isKeycloakReady } from '../config/keycloak';


export function useCodelist() {
  const [data, setData] = useState<Codelist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    if (!isKeycloakReady) return;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<{ data: Codelist[] }>('/v2/mortality/categories/codelist');
        setData(response.data?.data || []);
      } catch (err) {
        console.error('[useCodelist] Failed to fetch codelist:', err);
        setError('Kunne ikke laste kodelist. Vennligst prøv igjen.');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [isKeycloakReady]);

  return { data, loading, error };
}
