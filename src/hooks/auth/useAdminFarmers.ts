import { useEffect, useState } from 'react';
import { fetchAuthFarmers } from '../../api/auth/fetchFarmer';
import type { AuthFarmer } from '../../types/auth_farmers';

export function useAdminFarmers() {
  const [data, setData] = useState<AuthFarmer[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAuthFarmers();
      setData(result);
    } catch (err) {
      setError('Kunne ikke hente oppdretter-info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}
