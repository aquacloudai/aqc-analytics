import { useEffect, useState, useCallback } from 'react';
import { fetchLossByWeek } from '../api/lossMortality/fetchLossByWeek';
import type { MortalityCategoryByWeekRecord } from '../types/loss_mortality_by_week';
import { isKeycloakReady } from '../config/keycloak';
import type { ApiDetail } from '../types/api_detail';

export function useLossByWeek(
  weekCount: number,
  // ...other filters as needed
): {
  data: MortalityCategoryByWeekRecord[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  apiDetails: ApiDetail | null;
} {
  const [data, setData] = useState<MortalityCategoryByWeekRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiDetails, setApiDetails] = useState<ApiDetail | null>(null);

  const fetchData = useCallback(async () => {
    if (!isKeycloakReady()) return;
    setLoading(true);
    setError(null);

    try {
      const result = await fetchLossByWeek({ weekCount /*, ...other filters */ });
      setData(result.data);
      setApiDetails(result.apiDetails);
    } catch (err) {
      console.error('[useLossByWeek] Failed to fetch:', err);
      setError('Kunne ikke hente tapsdata per uke');
      setApiDetails(null);
    } finally {
      setLoading(false);
    }
  }, [weekCount /*, ...other filters */]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, apiDetails };
}
