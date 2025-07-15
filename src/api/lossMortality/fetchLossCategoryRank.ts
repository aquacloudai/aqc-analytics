import api from '../auth/apiClient';
import type { LossMortalityCategoryRankListResponse, LossMortalityCategoryRankParams } from '../../types/loss_mortality_category_rank';



export async function fetchLossMortalityCategoryRank(params: LossMortalityCategoryRankParams) {
  const response = await api.get<LossMortalityCategoryRankListResponse>(
    '/v3/loss-mortality/loss-mortality-category-rank',
    { params }
  );
  return response.data;
}
