import { useEffect, useState, useCallback } from 'react';
import { fetchLossByGeneration } from '../../api/lossMortality/fetchLossByGeneration';
import type { LossMortalityGenerationRate } from '../../types/loss_mortality_generation_rate';
import { isKeycloakReady } from '../../config/keycloak';
import type { ApiDetail } from '../../types/api_detail';

type UseLossByGenerationParams = {
  include_self?: boolean;
  area?: string;
  generation?: string;
  weight_range_start?: number;
  weight_range_end?: number;
  offset?: number;
  limit?: number;
  from_month?: string;
  to_month?: string;
};

export function useLossByGeneration(params: UseLossByGenerationParams = {}) {
  const [data, setData] = useState<LossMortalityGenerationRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiDetails: ApiDetail = {
    title: 'Generasjon',
    url: '/v3/loss-mortality/loss-mortality-rate-by-generation',
    params,
  };

  const fetchData = useCallback(async () => {
    if (!isKeycloakReady()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchLossByGeneration(params);
      setData(result);
    } catch (err) {
      setError('Kunne ikke hente tapsdata per generasjon');
      console.error('[useLossByGeneration] Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  }, [
    // Extract individual params instead of using the params object
    params.include_self,
    params.area,
    params.generation,
    params.weight_range_start,
    params.weight_range_end,
    params.offset,
    params.limit,
    params.from_month,
    params.to_month,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, apiDetails };
}