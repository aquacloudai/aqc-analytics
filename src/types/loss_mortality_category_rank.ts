export interface LossMortalityCategoryRank {
    loss_category_code: string;
    period_start: string;
    period_end: string;
    mortality_count: number;
    mortality_avg_weight_gram: number;
    mortality_biomass_kg: number;
    culling_count: number;
    culling_avg_weight_gram: number;
    culling_biomass_kg: number;
    loss_count: number;
    loss_avg_weight_gram: number;
    loss_biomass_kg: number;
    mortality_count_rate_of_total_in_period: number;
    mortality_biomass_rate_of_total_in_period: number;
    culling_count_rate_of_total_in_period: number;
    culling_biomass_rate_of_total_in_period: number;
    loss_count_rate_of_total_in_period: number;
    loss_biomass_rate_of_total_in_period: number;
    farmer_mortality_count: number;
    farmer_mortality_avg_weight_gram: number;
    farmer_mortality_biomass_kg: number;
    farmer_culling_count: number;
    farmer_culling_avg_weight_gram: number;
    farmer_culling_biomass_kg: number;
    farmer_loss_count: number;
    farmer_loss_avg_weight_gram: number;
    farmer_loss_biomass_kg: number;
    farmer_loss_count_rate_of_total_in_period: number;
    farmer_loss_biomass_rate_of_total_in_period: number;
    loss_category_name: string;
}

export type LossMortalityCategoryRankParams = {
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

export type LossMortalityCategoryRankListResponse = {
  data: LossMortalityCategoryRank[];
  pagination: PaginationMeta;
  metadata: Meta;
};

export interface PaginationMeta {
  offset: number;
  limit: number;
  has_more: boolean;
}

export interface Meta {}
