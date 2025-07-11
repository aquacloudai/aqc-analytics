import { useEffect, useState } from 'react';
import api from '../../api/auth/apiClient';
import { isKeycloakReady } from '../../config/keycloak';
import type { Site } from '../../types/site';

export function useSite(siteId: string | number) {
  const [data, setData] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isKeycloakReady || !siteId) return;

    const fetchSiteById = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<{ data: Site }>(`/v3/common/site/${siteId}`);
        setData(response.data?.data || null);
      } catch (err) {
        console.error('[useSite] Failed to fetch site:', err);
        setError('Kunne ikke laste lokalitet. Vennligst prøv igjen.');
      } finally {
        setLoading(false);
      }
    };

    fetchSiteById();
  }, [isKeycloakReady, siteId]);

  return { data, loading, error };
}
