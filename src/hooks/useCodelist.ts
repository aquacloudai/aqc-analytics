import { useEffect, useState } from 'react';
import api from '../api/auth/apiClient';

import type { Codelist } from '../types/codelist';
import { useKeycloakReady } from './useKeycloakReady';


export function useCodelist() {
  const [data, setData] = useState<Codelist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ready = useKeycloakReady();

  useEffect(() => {
    if (!ready) return;

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
  }, [ready]);

  return { data, loading, error };
}
