import api from '../auth/apiClient';
import type { Farmer } from '../../types/farmer';

export const fetchFarmers = async (): Promise<Farmer[]> => {
  const res = await api.get<{ data: Farmer[] }>('/v3/common/farmers-in-aquacloud');
  return res.data?.data ?? [];
};