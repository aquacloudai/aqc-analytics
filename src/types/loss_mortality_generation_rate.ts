export interface LossMortalityGenerationRate {
    loss_rate_month: string;  // ISO date string
    generation_month_number: number;
    farmer_generation_month_number?: number;  // optional
    aquacloud_area_name: string;
    production_area_ids: number[];
    generation: string;

    loss_rate: number;
    mortality_rate: number;
    culling_rate: number;

    cumulative_loss_rate?: number;  // optional
    cumulative_mortality_rate?: number;  // optional
    cumulative_culling_rate?: number;  // optional

    farmer_loss_rate?: number;  // optional
    farmer_mortality_rate?: number;  // optional
    farmer_culling_rate?: number;  // optional
    farmer_cumulative_loss_rate?: number;  // optional
    farmer_cumulative_mortality_rate?: number;  // optional
    farmer_cumulative_culling_rate?: number;  // optional
}
