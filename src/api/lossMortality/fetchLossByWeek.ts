import api from '../auth/apiClient';
import type { MortalityCategoryByWeekRecord } from '../../types/loss_mortality_by_week';
import type { ApiDetail } from '../../types/api_detail';

export const fetchLossByWeek = async ({
  weekCount,
  includeSelf,
  area,
  generation,
  weightRangeStart,
  weightRangeEnd,
  fromMonth,
  toMonth,
}: {
  weekCount: number;
  includeSelf?: boolean;
  area?: string;
  generation?: string;
  weightRangeStart?: number;
  weightRangeEnd?: number;
  fromMonth?: string;
  toMonth?: string;
}): Promise<{ data: MortalityCategoryByWeekRecord[]; apiDetails: ApiDetail }> => {
  const params = {
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

  const response = await api.get<{ data: MortalityCategoryByWeekRecord[] }>(
    '/v3/loss-mortality/loss-mortality-trends-by-week',
    { params }
  );

  const apiDetails: ApiDetail = {
    title: "Kategori (per uke)",
    url: "/v3/loss-mortality/loss-mortality-trends-by-week",
    params,
  };

  return {
    data: response.data?.data ?? [],
    apiDetails,
  };
};
