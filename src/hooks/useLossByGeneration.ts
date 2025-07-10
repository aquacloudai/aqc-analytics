import { useEffect, useState } from 'react';
import { fetchLossByGeneration } from '../api/lossMortality/fetchLossByGeneration';
import type { LossMortalityGenerationRate } from '../types/loss_mortality_generation_rate';
import { isKeycloakReady } from '../config/keycloak';
import type { ApiDetail } from '../types/api_detail';

export function useLossByGeneration(): {
  data: LossMortalityGenerationRate[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  apiDetails: ApiDetail; // <-- Add this type to the return value
} {
  const [data, setData] = useState<LossMortalityGenerationRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiDetails: ApiDetail = {
    title: "Generasjon",
    url: "/v3/loss-mortality/loss-mortality-rate-by-generation", // corrected to match fetch
    params: {
      offset: 0,
      limit: 10000,
    },
  };

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

  // RETURN apiDetails as well
  return { data, loading, error, refetch: fetchData, apiDetails };
}
