export interface MortalityCategoryByWeekRecord {
    rank: number;
    loss_week: string;
    loss_category_code: string;
    loss_category_name: string;
    loss_rate: number;
    loss_rate_change: number;
    trending_loss_last_n_weeks: number;
    mortality_rate: number;
    trending_mortality_last_n_weeks: number;
    mortality_rate_change: number;
}
