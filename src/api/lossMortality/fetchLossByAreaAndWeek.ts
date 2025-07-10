import api from '../auth/apiClient';
import type { MortalityCategoryByAreaAndWeekRecord } from '../../types/loss_mortality_by_area_and_week';
import type { ApiDetail } from '../../types/api_detail';

// 1. Type for input params (for convenience)
export type FetchLossByAreaAndWeekParams = {
  weekCount: number;
  includeSelf?: boolean;
  area?: string;
  generation?: string;
  weightRangeStart?: number;
  weightRangeEnd?: number;
  fromMonth?: string;
  toMonth?: string;
};

// 2. Return both data and apiDetails
export const fetchLossByAreaAndWeek = async (
  params: FetchLossByAreaAndWeekParams
): Promise<{ data: MortalityCategoryByAreaAndWeekRecord[]; apiDetails: ApiDetail }> => {
  const {
    weekCount,
    includeSelf,
    area,
    generation,
    weightRangeStart,
    weightRangeEnd,
    fromMonth,
    toMonth,
  } = params;

  // Build the actual params object sent to the API
  const apiParams = {
    include_self: includeSelf,
    period: weekCount,
    area: area || '%',
    generation: generation || undefined,
    weight_range_start: weightRangeStart,
    weight_range_end: weightRangeEnd,
    from_month: fromMonth ? `${fromMonth}-01` : undefined,
    to_month: toMonth ? `${toMonth}-01` : undefined,
    offset: 0,
    limit: 10000,
  };

  const response = await api.get<{ data: MortalityCategoryByAreaAndWeekRecord[] }>(
    '/v3/loss-mortality/loss-mortality-by-area-and-week',
    { params: apiParams }
  );

  // Build apiDetails for logging, UI, or modal
  const apiDetails: ApiDetail = {
    title: "Mortalitet per område og uke",
    url: '/v3/loss-mortality/loss-mortality-by-area-and-week',
    params: apiParams,
  };

  return {
    data: response.data?.data ?? [],
    apiDetails,
  };
};
