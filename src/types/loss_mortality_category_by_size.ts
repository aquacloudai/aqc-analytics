export interface LossMortalityCategoryBySize {
    category_code_level_1: string;
    category_name: string;
    rate: number;
    mortality_rate: number;
    culling_rate: number | null;
    weight_group: number;
    farmer_rate: number;
    farmer_mortality_rate: number;
    farmer_culling_rate: number | null;
}

export interface PaginationMeta {
  offset: number;
  limit: number;
  has_more: boolean;
}

export interface Meta {}

export interface LossMortalityCategoryBySizePaginatedResponse {
  data: LossMortalityCategoryBySize[];
  pagination: PaginationMeta;
  metadata: Meta;
}

export type LossMortalityCategoryBySizeParams = {
  include_self?: boolean;
  from_month?: string;
  to_month?: string;
  area?: string;
  generation?: string;
  weight_bucket?: number;
};
