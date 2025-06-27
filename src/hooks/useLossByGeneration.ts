import { useEffect, useState } from 'react';
import { fetchLossByGeneration } from '../api/lossMortality/fetchLossByGeneration';
import type { LossMortalityGenerationRate } from '../types/loss_mortality_generation_rate';
import { isKeycloakReady } from '../config/keycloak';

export function useLossByGeneration(): {
  data: LossMortalityGenerationRate[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [data, setData] = useState<LossMortalityGenerationRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!isKeycloakReady()) return;
    setLoading(true);
    setError(null);

    try {
      const result = await fetchLossByGeneration();
      setData(result);
    } catch (err) {
      console.error('[useLossByGeneration] Failed to fetch:', err);
      setError('Kunne ikke hente tapsdata per generasjon');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}
