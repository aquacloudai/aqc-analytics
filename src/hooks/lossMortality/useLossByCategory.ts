import { useState, useEffect } from 'react';
import { isKeycloakReady } from '../../config/keycloak';
import api from '../../api/auth/apiClient';
import type { MortalityCategoryRate } from '../../types/loss_mortality_category_rate';
import { useFilterStore } from '../../store/filterStore';
import type { ApiDetail } from '../../types/api_detail';


export function useMortalityCategoryRates(periodGrouping: string = 'month') {
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

  // Build params *once*, use for both API call and apiDetails
  const params = {
    include_self: includeSelf,
    ...(fromMonth && { from_month: `${fromMonth}-01` }),
    ...(toMonth && { to_month: `${toMonth}-01` }),
    area: area || '%',
    generation: generation || undefined,
    weight_range_start: weightRangeStart,
    weight_range_end: weightRangeEnd,
    period_grouping: periodGrouping,
    offset: 0,
    limit: 10000,
  };

  // This is what you'll return for modal etc:
  const apiDetails: ApiDetail[] = [
    {
      title: "Kategori (per periode)",
      url: "/v3/loss-mortality/loss-mortality-category-rate",
      params,
    }
  ];

  const fetchData = async () => {
    if (!isKeycloakReady()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<{ data: MortalityCategoryRate[] }>(
        '/v3/loss-mortality/loss-mortality-category-rate',
        { params }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyFilters, periodGrouping, fromMonth, toMonth, area, generation, weightRangeStart, weightRangeEnd, includeSelf]);

  // Now the component gets all of these, including apiDetails
  return { data, loading, error, refetch: fetchData, apiDetails };
}
