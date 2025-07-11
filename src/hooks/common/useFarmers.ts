import api from '../../api/auth/apiClient';
import { useEffect, useState } from 'react';
import type { Farmer } from '../../types/farmer';

export function useFarmers(): {
  data: Farmer[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [data, setData] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/v3/common/farmers-in-aquacloud');
      const raw = res.data.data;
      let farmersArr = [];
      if (Array.isArray(raw)) farmersArr = raw;
      else if (raw && Array.isArray(raw.items)) farmersArr = raw.items;
      else farmersArr = [];
      setData(farmersArr);
    } catch (err) {
      setError('Kunne ikke laste oppdrettere');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return { data, loading, error, refetch: fetchData };
}
