import { useEffect, useState } from 'react';
import { fetchFarmers } from '../api/common/fetchFarmers';
import type { Farmer } from '../types/farmer';
import { isKeycloakReady } from '../config/keycloak';

export function useFarmers(): {
  data: Farmer[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [data, setData] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!isKeycloakReady()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFarmers();
      setData(res);
    } catch (err) {
      console.error('[Farmers] Failed to fetch:', err);
      setError('Kunne ikke laste bønder');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}
