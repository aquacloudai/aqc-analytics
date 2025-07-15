import { useState, useEffect } from 'react';
import api from '../../api/auth/apiClient';
import { isKeycloakReady } from '../../config/keycloak';
import { useFilterStore } from '../../store/filterStore';
// Import your correct type here:
import type { LossMortalityCategoryBySize } from '../../types/loss_mortality_category_by_size';
import type { ApiDetail } from '../../types/api_detail';

export function useMortalityCategoryBySize(weightBucket: number = 100) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LossMortalityCategoryBySize[]>([]);

  // Zustand filters
  const applyFilters = useFilterStore((s) => s.applyFilters);
  const fromMonthRaw = useFilterStore((s) => s.from_month);
  const toMonthRaw = useFilterStore((s) => s.to_month);
  const area = useFilterStore((s) => s.selectedArea);
  const generation = useFilterStore((s) => s.selectedGeneration);
  const includeSelf = useFilterStore((s) => s.include_self);

  const fromMonth = fromMonthRaw?.format('YYYY-MM');
  const toMonth = toMonthRaw?.format('YYYY-MM');

  // Params for the API call
  const params = {
    include_self: includeSelf,
    ...(fromMonth && { from_month: `${fromMonth}-01` }),
    ...(toMonth && { to_month: `${toMonth}-01` }),
    area: area || '%',
    generation: generation || undefined,
    weight_bucket: weightBucket,
  };

  const apiDetails: ApiDetail[] = [
    {
      title: 'Kategori etter størrelse',
      url: '/v3/loss-mortality/loss-mortality-category-by-size',
      params,
    },
  ];

  const fetchData = async () => {
    if (!isKeycloakReady()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<{ data: LossMortalityCategoryBySize[] }>(
        '/v3/loss-mortality/loss-mortality-category-by-size',
        { params }
      );
      setData(response.data?.data || []);
    } catch (err) {
      console.error('[useMortalityCategoryBySize] Failed to fetch:', err);
      setError('Kunne ikke laste dødelighetskategorier etter størrelse. Vennligst prøv igjen.');
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
    includeSelf,
    weightBucket,
  ]);

  return { data, loading, error, refetch: fetchData, apiDetails };
}
