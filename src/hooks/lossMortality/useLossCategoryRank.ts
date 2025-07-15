import { useState, useEffect } from 'react';
import { isKeycloakReady } from '../../config/keycloak';
import { useFilterStore } from '../../store/filterStore';
import { fetchLossMortalityCategoryRank } from '../../api/lossMortality/fetchLossCategoryRank';
import type { LossMortalityCategoryRank } from '../../types/loss_mortality_category_rank';
import type { ApiDetail } from '../../types/api_detail';

export function useLossMortalityCategoryRank() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LossMortalityCategoryRank[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [metadata, setMetadata] = useState<any>(null);

  // Zustand filters
  const applyFilters = useFilterStore((s) => s.applyFilters);
  const fromMonthRaw = useFilterStore((s) => s.from_month);
  const toMonthRaw = useFilterStore((s) => s.to_month);
  const area = useFilterStore((s) => s.selectedArea);
  const generation = useFilterStore((s) => s.selectedGeneration);
  const weightRangeStart = useFilterStore((s) => s.weightRangeStart);
  const weightRangeEnd = useFilterStore((s) => s.weightRangeEnd);
  const includeSelf = useFilterStore((s) => s.include_self);

  const fromMonth = fromMonthRaw?.format('YYYY-MM');
  const toMonth = toMonthRaw?.format('YYYY-MM');

  // Params for the API call
  const params = {
    include_self: includeSelf,
    ...(fromMonth && { from_month: `${fromMonth}-01` }),
    ...(toMonth && { to_month: `${toMonth}-01` }),
    area: area || '%',
    generation: Array.isArray(generation)
      ? (generation.length > 0 ? generation.join(',') : undefined)
      : generation || undefined,
    weight_range_start: weightRangeStart,
    weight_range_end: weightRangeEnd,
    offset: 0,
    limit: 10000,
  };

  const apiDetails: ApiDetail[] = [
    {
      title: 'Kategori-rank (område/periode)',
      url: '/v3/loss-mortality/loss-mortality-category-rank',
      params,
    }
  ];

  const fetchData = async () => {
    if (!isKeycloakReady()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetchLossMortalityCategoryRank(params);
      setData(response.data ?? []);
      setPagination(response.pagination);
      setMetadata(response.metadata);
    } catch (err) {
      setError('Kunne ikke laste tap/dødelighets-rankinger. Vennligst prøv igjen.');
      console.error('[useLossMortalityCategoryRank] Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    applyFilters,
    fromMonth,
    toMonth,
    area,
    generation,
    weightRangeStart,
    weightRangeEnd,
    includeSelf,
  ]);

  return { data, pagination, metadata, loading, error, refetch: fetchData, apiDetails };
}
