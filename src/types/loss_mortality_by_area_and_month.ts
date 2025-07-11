export interface LossMortalityByAreaAndMonthRecord {
    month: string;
    aquacloud_area_name: string;
    production_area_ids: number[];
    site_count: number;
    mortality_rate: number;
    site_avg_mortality_rate: number;
    cumulative_mortality_rate_12_months: number;
    cumulative_mortality_rate_6_months: number;
    cumulative_mortality_rate_3_months: number;
    cumulative_site_avg_mortality_rate_12_months: number;
    cumulative_site_avg_mortality_rate_6_months: number;
    cumulative_site_avg_mortality_rate_3_months: number;
    culling_rate: number;
    site_avg_culling_rate: number;
    cumulative_culling_rate_12_months: number;
    cumulative_culling_rate_6_months: number;
    cumulative_culling_rate_3_months: number;
    cumulative_site_avg_culling_rate_12_months: number;
    cumulative_site_avg_culling_rate_6_months: number;
    cumulative_site_avg_culling_rate_3_months: number;
    loss_rate: number;
    site_avg_loss_rate: number;
    cumulative_loss_rate_12_months: number;
    cumulative_loss_rate_6_months: number;
    cumulative_loss_rate_3_months: number;
    cumulative_site_avg_loss_rate_12_months: number;
    cumulative_site_avg_loss_rate_6_months: number;
    cumulative_site_avg_loss_rate_3_months: number;
    farmer_site_count: number;
    farmer_mortality_rate: number;
    farmer_site_avg_mortality_rate: number;
    farmer_cumulative_mortality_rate_12_months: number;
    farmer_cumulative_mortality_rate_6_months: number;
    farmer_cumulative_mortality_rate_3_months: number;
    farmer_cumulative_site_avg_mortality_rate_12_months: number;
    farmer_cumulative_site_avg_mortality_rate_6_months: number;
    farmer_cumulative_site_avg_mortality_rate_3_months: number;
    farmer_culling_rate: number;
    farmer_site_avg_culling_rate: number;
    farmer_cumulative_culling_rate_12_months: number;
    farmer_cumulative_culling_rate_6_months: number;
    farmer_cumulative_culling_rate_3_months: number;
    farmer_cumulative_site_avg_culling_rate_12_months: number;
    farmer_cumulative_site_avg_culling_rate_6_months: number;
    farmer_cumulative_site_avg_culling_rate_3_months: number;
    farmer_loss_rate: number;
    farmer_site_avg_loss_rate: number;
    farmer_cumulative_loss_rate_12_months: number;
    farmer_cumulative_loss_rate_6_months: number;
    farmer_cumulative_loss_rate_3_months: number;
    farmer_cumulative_site_avg_loss_rate_12_months: number;
    farmer_cumulative_site_avg_loss_rate_6_months: number;
    farmer_cumulative_site_avg_loss_rate_3_months: number;
    fdir_month: string;
    fdir_loss_rate: number;
    fdir_cumulative_loss_rate_12_months: number;
    fdir_cumulative_loss_rate_6_months: number;
    fdir_cumulative_loss_rate_3_months: number; 
    fdir_mortality_rate: number;
    fdir_cumulative_mortality_rate_12_months: number;
    fdir_cumulative_mortality_rate_6_months: number;
    fdir_cumulative_mortality_rate_3_months: number;
    fdir_culling_rate: number;
    fdir_cumulative_culling_rate_12_months: number;
    fdir_cumulative_culling_rate_6_months: number;
    fdir_cumulative_culling_rate_3_months: number;
}
export interface PaginationMeta {
  offset: number;
  limit: number;
  has_more: boolean;
}

export interface Meta {} // adjust if backend returns any metadata

export interface LossMortalityByAreaAndMonthFdirPaginatedResponse {
  data: LossMortalityByAreaAndMonthRecord[];
  pagination: PaginationMeta;
  metadata: Meta;
}

export type LossMortalityByAreaAndMonthParams = {
  include_self?: boolean;
  from_month?: string;
  to_month?: string;
  area?: string;
  generation?: string;
  weight_range_start?: number;
  weight_range_end?: number;
  offset?: number;
  limit?: number;
};
