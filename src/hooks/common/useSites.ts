import { useEffect, useState } from 'react';
import api from '../../api/auth/apiClient';
import { isKeycloakReady } from '../../config/keycloak';
import type { Site } from '../../types/site';

export function useSites() {
    const [data, setData] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isKeycloakReady) return;

        const fetchAllSites = async () => {
            setLoading(true);
            setError(null);
            const allSites: Site[] = [];
            const limit = 500;

            try {
                let offset = 0;
                let hasMore = true;

                while (hasMore) {
                    const response = await api.get<{ data: Site[] }>('/v3/common/site', {
                        params: { limit, offset },
                    });
                    const currentData = response.data?.data || [];
                    allSites.push(...currentData);
                    offset += limit;
                    hasMore = currentData.length === limit;
                }

                setData(allSites);
            } catch (err) {
                console.error('[useSites] Failed to fetch sites:', err);
                setError('Kunne ikke laste lokaliteter. Vennligst prøv igjen.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllSites();
    }, [isKeycloakReady]);


    return { data, loading, error };
}