import api from '../auth/apiClient';
import type { LossByRegionRecord } from '../../types/loss_by_region';

export const fetchLossByRegion = async (): Promise<LossByRegionRecord[]> => {
  const response = await api.get<{ data: LossByRegionRecord[] }>(
    '/v3/loss-mortality/loss-by-region'
  );
  return response.data?.data ?? [];
};
