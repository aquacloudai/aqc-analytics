import { useEffect, useState } from 'react';
import { getAqcFdirBiomassPerMonth } from '../api/biomass/aqcFdirBiomassComparison';
import { isKeycloakReady } from '../config/keycloak';
import type { AquacloudFdirBiomassPerMonth } from '../types/aquacloud_fdir_biomass_per_month';

export function useBiomassComparisonData(fromMonth?: string, toMonth?: string, dependencies: any[] = []) {
  const [data, setData] = useState<AquacloudFdirBiomassPerMonth[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!isKeycloakReady()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getAqcFdirBiomassPerMonth({ fromMonth, toMonth });
      setData(result);
    } catch (err) {
      console.error('[Hook] Failed to fetch biomass data:', err);
      setError('Kunne ikke laste biomassedata.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}
