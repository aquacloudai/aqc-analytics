import api from '../auth/apiClient';
import type { LossMortalityByAreaAndMonthParams, LossMortalityByAreaAndMonthFdirPaginatedResponse } from '../../types/loss_mortality_by_area_and_month';

export const fetchLossByAreaAndMonth = async (
  params: LossMortalityByAreaAndMonthParams = {}
): Promise<LossMortalityByAreaAndMonthFdirPaginatedResponse> => {
  const response = await api.get<LossMortalityByAreaAndMonthFdirPaginatedResponse>(
    '/v3/loss-mortality/loss-mortality-by-area-and-month',
    { params }
  );
  return response.data;
};
