// hooks/useLossByAreaAndWeek.ts

import { useEffect, useState, useMemo } from 'react';
import { fetchLossByAreaAndWeek } from '../../api/lossMortality/fetchLossByAreaAndWeek';
import type { MortalityCategoryByAreaAndWeekRecord } from '../../types/loss_mortality_by_area_and_week';
import { isKeycloakReady } from '../../config/keycloak';
import type { ApiDetail } from '../../types/api_detail';

export function useLossByAreaAndWeek(
  weekCount: number,
  options: {
    includeSelf?: boolean;
    area?: string;
    generation?: string;
    weightRangeStart?: number;
    weightRangeEnd?: number;
    fromMonth?: string;
    toMonth?: string;
  } = {}
): {
  data: MortalityCategoryByAreaAndWeekRecord[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  apiDetails: ApiDetail;
} {
  const [data, setData] = useState<MortalityCategoryByAreaAndWeekRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Collect params as a stable object (to use in apiDetails)
  const params = useMemo(() => ({
    include_self: options.includeSelf,
    period: weekCount,
    area: options.area || '%',
    generation: options.generation || undefined,
    weight_range_start: options.weightRangeStart,
    weight_range_end: options.weightRangeEnd,
    from_month: options.fromMonth ? `${options.fromMonth}-01` : undefined,
    to_month: options.toMonth ? `${options.toMonth}-01` : undefined,
    offset: 0,
    limit: 10000,
  }), [
    options.includeSelf, weekCount, options.area, options.generation,
    options.weightRangeStart, options.weightRangeEnd, options.fromMonth, options.toMonth,
  ]);

  const apiDetails: ApiDetail = {
    title: "Område (per uke)",
    url: "/v3/loss-mortality/loss-mortality-by-area-and-week",
    params,
  };

  const fetchData = async () => {
    if (!isKeycloakReady()) return;
    setLoading(true);
    setError(null);

    try {
      const result = await fetchLossByAreaAndWeek({ weekCount, ...options });
      setData(Array.isArray(result) ? result : result.data);
    } catch (err) {
      console.error('[useLossByAreaAndWeek] Failed to fetch:', err);
      setError('Kunne ikke hente uke-tapsdata per region');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [JSON.stringify(params)]);

  return { data, loading, error, refetch: fetchData, apiDetails };
}
