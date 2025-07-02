export interface MortalityCategoryRate {
  period: string;
  loss_category_code: string;
  loss_count: number;
  mortality_count: number;
  culling_count: number;
  loss_avg_weight_gram: number;
  mortality_avg_weight_gram: number;
  culling_avg_weight_gram: number | null;
  farmer_loss_count: number;
  farmer_mortality_count: number;
  farmer_culling_count: number;
  farmer_loss_avg_weight_gram: number | null;
  farmer_mortality_avg_weight_gram: number | null;
  farmer_culling_avg_weight_gram: number | null;
  loss_rate: number;
  mortality_rate: number;
  culling_rate: number;
  farmer_loss_rate: number | null;
  farmer_mortality_rate: number | null;
  farmer_culling_rate: number | null;
  category_name: string;
  category_short_name: string;
  category_level_1_name: string;
  category_label?: string;
}
