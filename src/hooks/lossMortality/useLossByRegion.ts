import { useEffect, useState } from 'react';
import { fetchLossByRegion } from '../../api/lossMortality/fetchLossByRegion';
import type { LossByRegionRecord } from '../../types/loss_by_region';
import { isKeycloakReady } from '../../config/keycloak';

export function useLossByRegion(): {
  data: LossByRegionRecord[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [data, setData] = useState<LossByRegionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!isKeycloakReady()) return;
    setLoading(true);
    setError(null);

    try {
      const result = await fetchLossByRegion();
      setData(result);
    } catch (err) {
      console.error('[useLossByRegion] Failed to fetch:', err);
      setError('Kunne ikke hente tapsdata per region');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}
