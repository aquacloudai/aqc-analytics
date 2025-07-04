import { useEffect, useState } from 'react';
import { fetchFarmer } from '../api/auth/fetchFarmer';
import type { Farmer } from '../types/farmer';

export function useFarmer() {
  const [data, setData] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFarmer();
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
