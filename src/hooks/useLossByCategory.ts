import { useState, useEffect } from 'react';
import { isKeycloakReady } from '../config/keycloak';
import api from '../api/auth/apiClient';
import type { MortalityCategoryRate } from '../types/loss_mortality_category_rate';
import { useFilterStore } from '../store/filterStore';

export function useMortalityCategoryRates() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MortalityCategoryRate[]>([]);

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

  const fetchData = async () => {
    if (!isKeycloakReady()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<{ data: MortalityCategoryRate[] }>(
        '/v3/loss-mortality/loss-mortality-category-rate',
        {
          params: {
            include_self: includeSelf,
            ...(fromMonth && { from_month: `${fromMonth}-01` }),
            ...(toMonth && { to_month: `${toMonth}-01` }),
            area: area || '%',
            generation: generation || undefined,
            weight_range_start: weightRangeStart,
            weight_range_end: weightRangeEnd,
            period_grouping: 'month',
            offset: 0,
            limit: 10000,
          },
        }
      );

      const rawData = response.data?.data || [];

      const enrichedData = rawData.map((item) => ({
        ...item,
        category_label: `${item.loss_category_code.charAt(0)} - ${item.category_level_1_name}`
      }));

      setData(enrichedData);
    } catch (err) {
      console.error('[useMortalityCategoryRates] Failed to fetch:', err);
      setError('Kunne ikke laste dødelighetskategorier. Vennligst prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [applyFilters]);

  return { data, loading, error, refetch: fetchData };
}
