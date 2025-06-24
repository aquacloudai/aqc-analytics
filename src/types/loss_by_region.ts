export interface LossByRegionRecord {
  production_region_name: string;
  site_placement: string;
  loss_rate_month: string; // ISO date string

  weighted_loss_rate: number;
  cumulative_weighted_loss_rate_12_months: number;
  cumulative_weighted_loss_rate_6_months: number;
  cumulative_weighted_loss_rate_3_months: number;

  avg_site_loss_rate: number;
  cumulative_avg_site_loss_rate_12_months: number;
  cumulative_avg_site_loss_rate_6_months: number;
  cumulative_avg_site_loss_rate_3_months: number;

  weighted_mortality_rate: number;
  cumulative_weighted_mortality_rate_12_months: number;
  cumulative_weighted_mortality_rate_6_months: number;
  cumulative_weighted_mortality_rate_3_months: number;

  avg_site_mortality_rate: number;
  cumulative_avg_site_mortality_rate_12_months: number;
  cumulative_avg_site_mortality_rate_6_months: number;
  cumulative_avg_site_mortality_rate_3_months: number;

  weighted_culling_rate: number;
  cumulative_weighted_culling_rate_12_months: number;
  cumulative_weighted_culling_rate_6_months: number;
  cumulative_weighted_culling_rate_3_months: number;

  avg_site_culling_rate: number;
  cumulative_avg_site_culling_rate_12_months: number;
  cumulative_avg_site_culling_rate_6_months: number;
  cumulative_avg_site_culling_rate_3_months: number;

  site_count: number;
  relative_trend_12_months: number;
  is_last_month: boolean;
}
