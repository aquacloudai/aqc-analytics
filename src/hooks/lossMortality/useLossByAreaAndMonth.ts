import { useEffect, useState, useCallback } from 'react';
import { fetchLossByAreaAndMonth } from '../../api/lossMortality/fetchLossByAreaAndMonth';
import type { LossMortalityByAreaAndMonthRecord, LossMortalityByAreaAndMonthParams, PaginationMeta, Meta } from '../../types/loss_mortality_by_area_and_month';
import { isKeycloakReady } from '../../config/keycloak';

type UseLossByAreaAndMonthParams = LossMortalityByAreaAndMonthParams;

export function useLossByAreaAndMonth(params: UseLossByAreaAndMonthParams = {}) {
  const [data, setData] = useState<LossMortalityByAreaAndMonthRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [metadata, setMetadata] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!isKeycloakReady()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchLossByAreaAndMonth(params);
      setData(result.data);
      setPagination(result.pagination);
      setMetadata(result.metadata);
    } catch (err) {
      setError('Kunne ikke hente tapsdata per område og måned');
      console.error('[useLossByAreaAndMonth] Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  }, [
    params.include_self,
    params.from_month,
    params.to_month,
    params.area,
    params.generation,
    params.weight_range_start,
    params.weight_range_end,
    params.offset,
    params.limit,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, pagination, metadata, loading, error, refetch: fetchData };
}
