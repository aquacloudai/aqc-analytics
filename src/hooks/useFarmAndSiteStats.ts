import { useEffect, useState } from 'react';
import { fetchFarmAndSiteStats } from '../api/common/fetchFarmAndSiteStats';
import type { FarmAndSiteStats } from '../types/farm_and_site_stats';
import { isKeycloakReady } from '../config/keycloak';

export function useFarmAndSiteStats(): {
  data: FarmAndSiteStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [data, setData] = useState<FarmAndSiteStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!isKeycloakReady()) return;
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFarmAndSiteStats();
      setData(result);
    } catch (err) {
      console.error('[useFarmAndSiteStats] Failed to fetch:', err);
      setError('Kunne ikke hente gårds- og lokalitetsdata');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}
