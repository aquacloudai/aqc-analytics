import { useEffect, useState } from 'react';
import api from '../../api/auth/apiClient';
import { isKeycloakReady } from '../../config/keycloak'; // If this is a hook, call it as a hook!
import type { AquacloudArea } from '../../types/aquacloud_area';

export function useAquacloudAreas() {
  const [data, setData] = useState<AquacloudArea[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isKeycloakReady) return; // Consider if this is correct for your code

    const fetchAquacloudAreas = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<{ data: AquacloudArea[] }>(`/v3/common/aquacloud-areas`);
        setData(response.data?.data ?? null);
      } catch (err) {
        console.error('[useAquacloudAreas] Failed to fetch Aquacloud areas:', err);
        setError('Kunne ikke laste produksjonsområder. Vennligst prøv igjen.');
      } finally {
        setLoading(false);
      }
    };

    fetchAquacloudAreas();
  }, [isKeycloakReady]);

  return { data, loading, error };
}
