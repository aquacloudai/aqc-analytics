import api from '../auth/apiClient';
import type { LossMortalityGenerationRate } from '../../types/loss_mortality_generation_rate';

export const fetchLossByGeneration = async (): Promise<LossMortalityGenerationRate[]> => {
  const response = await api.get<{ data: LossMortalityGenerationRate[] }>(
    '/v3/loss-mortality/loss-mortality-rate-by-generation'
  );
  return response.data?.data ?? [];
};
