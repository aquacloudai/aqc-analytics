export interface MortalityCategoryByAreaAndWeekRecord {
    loss_rate_week: string;
    month: string;
    aquacloud_area_name: string;
    production_area_ids: number[];
    site_count: number;
    mortality_rate: number;
    culling_rate: number;
    loss_rate: number;
    farmer_site_count: number;
    farmer_mortality_rate: number;
    farmer_culling_rate: number;
    farmer_loss_rate: number;
}
