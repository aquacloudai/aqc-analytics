import { useQuery } from '@tanstack/react-query';
import api from '../api/auth/apiClient';

export function useTemperatureByWeekAndRegion() {
  return useQuery({
    queryKey: ['temperature-by-week-and-region'],
    queryFn: async () => {
      const res = await api.get('/v3/environment/temperature-by-week-and-region');
      return res.data?.data || [];
    },
  });
}
