import api from '../auth/apiClient';
import type { LossMortalityGenerationRate } from '../../types/loss_mortality_generation_rate';

type FetchLossByGenerationParams = {
  include_self?: boolean;
  area?: string;
  generation?: string;
  weight_range_start?: number;
  weight_range_end?: number;
  offset?: number;
  limit?: number;
};

export const fetchLossByGeneration = async (
  params: FetchLossByGenerationParams = {}
): Promise<LossMortalityGenerationRate[]> => {
  const response = await api.get<{ data: LossMortalityGenerationRate[] }>(
    '/v3/loss-mortality/loss-mortality-rate-by-generation',
    { params }
  );
  return response.data?.data ?? [];
};
